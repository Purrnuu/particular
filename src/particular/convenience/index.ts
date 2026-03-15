/**
 * High-level convenience API for the particle engine.
 *
 * `createParticles()` initializes the engine and returns a controller
 * with methods organized by concern:
 *   - Emission: burst, attachClickBurst
 *   - Forces:   addAttractor, addMouseForce, addBoundary, …
 *   - Effects:  explode, scatter
 *   - Image:    imageToParticles, textToParticles
 *
 * Each group is implemented in its own module (forces.ts, boundary.ts,
 * effects.ts, imageParticles.ts) for readability and maintainability.
 */

import Emitter from '../components/emitter';
import { processImages } from '../components/icons';
import { configureParticular, configureParticle } from '../core/defaults';
import Particular from '../core/particular';
import { getPreset } from '../presets';
import CanvasRenderer from '../renderers/canvasRenderer';
import WebGLRenderer from '../renderers/webglRenderer';
import Vector from '../utils/vector';
import { applyCanvasStyles } from '../canvasStyles';
import type { FullParticularConfig } from '../types';
import { createForces } from './forces';
import { createBoundaryHelper } from './boundary';
import { createEffects } from './effects';
import { createImageParticles } from './imageParticles';
import type { BurstOptions, CreateParticlesOptions, ParticlesController } from './types';

// Re-export public types (screensaver exported separately to avoid circular dep)
export type {
  BurstOptions,
  CreateParticlesOptions,
  ParticlesController,
  BoundaryHandle,
  ScreensaverOptions,
  ScreensaverController,
} from './types';

/**
 * One-call setup for standalone sites.
 * Returns a controller with burst, forces, effects, and image-to-particles APIs.
 */
export function createParticles({
  canvas: userCanvas,
  preset = 'magic',
  config,
  renderer = 'webgl',
  autoResize = true,
  autoClick = false,
  clickTarget,
  container,
  mouseForce,
}: CreateParticlesOptions = {}): ParticlesController {
  // ── Auto-create canvas if not provided ──

  let canvas: HTMLCanvasElement;
  let canvasAutoCreated = false;

  if (userCanvas) {
    canvas = userCanvas;
  } else {
    canvas = document.createElement('canvas');
    canvasAutoCreated = true;
    const parent = container ?? document.body;
    parent.appendChild(canvas);
  }

  // ── Apply positioning styles ──

  applyCanvasStyles(canvas, container, config?.zIndex);

  // ── Engine setup ──

  const engine = new Particular();
  const basePreset = getPreset(preset);
  const mergedConfig = configureParticular({ ...basePreset, ...config, container });

  engine.initialize(mergedConfig);
  if (renderer === 'webgl') {
    engine.addRenderer(
      new WebGLRenderer(canvas, {
        maxInstances: mergedConfig.webglMaxInstances,
      }),
    );
  } else {
    engine.addRenderer(new CanvasRenderer(canvas));
  }
  engine.onResize();

  const cleanups: Array<() => void> = [];

  // ── Auto-resize ──

  if (autoResize) {
    if (container) {
      const ro = new ResizeObserver(() => engine.onResize());
      ro.observe(container);
      cleanups.push(() => ro.disconnect());
    } else {
      const onResize = () => engine.onResize();
      window.addEventListener('resize', onResize);
      cleanups.push(() => window.removeEventListener('resize', onResize));
    }
  }

  // ── Coordinate conversion ──

  const toEngineCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    let x = clientX;
    let y = clientY;
    if (container) {
      const rect = container.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
    return { x: x / mergedConfig.pixelRatio, y: y / mergedConfig.pixelRatio };
  };

  // ── Burst (stays here — depends on toEngineCoords) ──

  const burst = (options: BurstOptions): Emitter => {
    const { x, y, ...overrides } = options;
    const combinedSettings = configureParticle(overrides, mergedConfig);

    let icons: (string | HTMLImageElement)[] = [];
    if (combinedSettings.icons) {
      icons = processImages(combinedSettings.icons);
    }

    const enginePos = toEngineCoords(x, y);
    const emitter = new Emitter({
      point: new Vector(enginePos.x, enginePos.y),
      ...combinedSettings,
      icons,
    });

    engine.addEmitter(emitter);
    emitter.isEmitting = true;
    emitter.emit();
    return emitter;
  };

  const attachClickBurst = (
    target: EventTarget = clickTarget ?? document,
    overrides?: Partial<FullParticularConfig>,
  ): (() => void) => {
    const onClick = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      burst({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        ...(overrides ?? {}),
      });
    };
    target.addEventListener('click', onClick as EventListener);
    return () => target.removeEventListener('click', onClick as EventListener);
  };

  if (autoClick) {
    const cleanupClick = attachClickBurst(clickTarget ?? document);
    cleanups.push(cleanupClick);
  }

  // ── Compose helpers ──

  const forces = createForces(engine, container, cleanups);
  const boundary = createBoundaryHelper(engine, container, cleanups);
  const effects = createEffects(engine, mergedConfig);
  const imageApi = createImageParticles(engine, mergedConfig, container);

  // ── Mouse force shorthand ──

  if (mouseForce) {
    const mouseConfig = mouseForce === true ? { track: true as const } : { track: true as const, ...mouseForce };
    forces.addMouseForce(mouseConfig);
  }

  // ── Lifecycle ──

  const destroy = () => {
    for (const cleanup of cleanups) cleanup();
    engine.destroy();
    if (canvasAutoCreated && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
  };

  return {
    engine,
    canvas,
    burst,
    attachClickBurst,
    ...forces,
    ...boundary,
    ...effects,
    ...imageApi,
    destroy,
  };
}
