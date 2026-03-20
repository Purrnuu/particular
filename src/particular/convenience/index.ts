/**
 * High-level convenience API for the particle engine.
 *
 * `createParticles()` initializes the engine and returns a controller
 * with methods organized by concern:
 *   - Emission: burst, attachClickBurst
 *   - Forces:   addAttractor, addMouseForce, addBoundary, …
 *   - Effects:  explode, scatter, startWobble, stopWobble
 *   - Image:    imageToParticles, textToParticles, elementToParticles
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
import WebGL3DRenderer from '../renderers/webgl3dRenderer';
import Vector from '../utils/vector';
import { applyCanvasStyles } from '../canvasStyles';
import type { FullParticularConfig } from '../types';
import { Camera, type CameraConfig } from '../renderers/camera';
import { createForces } from './forces';
import { createBoundaryHelper } from './boundary';
import { createContainerGlowHelper } from './containerGlow';
import { createMouseTrailHelper } from './mouseTrail';
import { createEffects } from './effects';
import { createImageParticles } from './imageParticles';
import { createImageShatterHelper } from './imageShatter';
import { getViewportSize } from './resize';
import type { BurstOptions, CreateParticlesOptions, ParticlesController } from './types';

// Re-export public types (screensaver exported separately to avoid circular dep)
export type {
  BurstOptions,
  CreateParticlesOptions,
  ParticlesController,
  BoundaryHandle,
  ContainerGlowHandle,
  MouseTrailHandle,
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
  // ── SSR guard ──
  if (typeof document === 'undefined') {
    throw new Error('Particular: createParticles() requires a browser environment (document is not defined). Wrap the call in a useEffect or check for window before calling.');
  }

  // ── Container position validation ──
  if (container) {
    const position = getComputedStyle(container).position;
    if (position === 'static') {
      console.warn(
        'Particular: container element has position: static. The canvas will be positioned with position: absolute inside it, which requires a positioned parent (relative, absolute, or fixed). Add "position: relative" to your container.',
      );
    }
  }

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
  let camera3d: Camera | null = null;
  let renderer3d: WebGL3DRenderer | null = null;
  if (renderer === 'webgl3d') {
    renderer3d = new WebGL3DRenderer(canvas, {
      maxInstances: mergedConfig.webglMaxInstances,
      camera: config?.camera as CameraConfig | undefined,
    });
    camera3d = renderer3d.camera;
    engine.addRenderer(renderer3d);
  } else if (renderer === 'webgl') {
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
    const handleResize = () => {
      engine.onResize();
      // Reposition autoStart emitter to new center
      if (autoStartEmitter) {
        const pr = mergedConfig.pixelRatio;
        if (renderer3d && renderer3d.referenceWorldScale > 0) {
          // 3D: position at reference center so it stays at world origin
          autoStartEmitter.configuration.point.x = renderer3d.referenceCenterX;
          autoStartEmitter.configuration.point.y = renderer3d.referenceCenterY;
        } else {
          // 2D: position at current viewport center
          const newSize = getViewportSize(container);
          autoStartEmitter.configuration.point.x = newSize.w / 2 / pr;
          autoStartEmitter.configuration.point.y = newSize.h / 2 / pr;
        }
      }
    };
    if (container) {
      const ro = new ResizeObserver(handleResize);
      ro.observe(container);
      cleanups.push(() => ro.disconnect());
    } else {
      window.addEventListener('resize', handleResize);
      cleanups.push(() => window.removeEventListener('resize', handleResize));
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
    const pr = mergedConfig.pixelRatio;
    let engineX = x / pr;
    let engineY = y / pr;

    // In 3D mode, adjust for the difference between the current viewport center
    // and the reference center captured on first frame. The shader maps engine coords
    // to world coords using the reference center, so click positions must be expressed
    // in that same coordinate frame to land at the correct visual position after resize.
    if (renderer3d && renderer3d.referenceWorldScale > 0) {
      const currentCenterX = (engine.width / pr) * 0.5;
      const currentCenterY = (engine.height / pr) * 0.5;
      engineX += renderer3d.referenceCenterX - currentCenterX;
      engineY += renderer3d.referenceCenterY - currentCenterY;
    }

    return { x: engineX, y: engineY };
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

  // ── Auto-start: create an initial emitter at center when preset requests it ──

  let autoStartEmitter: Emitter | null = null;
  if (mergedConfig.autoStart) {
    const size = getViewportSize(container);
    const centerX = size.w / 2 / mergedConfig.pixelRatio;
    const centerY = size.h / 2 / mergedConfig.pixelRatio;
    const particleConfig = configureParticle({}, mergedConfig);
    autoStartEmitter = new Emitter({
      point: new Vector(centerX, centerY),
      ...particleConfig,
      icons: [],
    });
    engine.addEmitter(autoStartEmitter);
    autoStartEmitter.isEmitting = true;
    autoStartEmitter.emit();
  }

  // ── Compose helpers ──

  const forces = createForces(engine, container, cleanups);
  const boundary = createBoundaryHelper(engine, container, cleanups);
  const containerGlow = createContainerGlowHelper(engine, container, cleanups);
  const mouseTrail = createMouseTrailHelper(engine, container, cleanups);
  const effects = createEffects(engine, mergedConfig);
  const imageApi = createImageParticles(engine, mergedConfig, container, cleanups);
  const imageShatter = createImageShatterHelper(engine, mergedConfig, container);

  // ── Mouse force shorthand ──

  if (mouseForce) {
    const mouseConfig = mouseForce === true ? { track: true as const } : { track: true as const, ...mouseForce };
    const mf = forces.addMouseForce(mouseConfig);

    // In 3D mode, project particle positions to screen space so the mouse affects
    // particles based on visual proximity, not engine-coord distance.
    if (camera3d && renderer3d) {
      mf.projectToScreen = (px: number, py: number, pz: number) => {
        const cam = camera3d!;
        const r3d = renderer3d!;
        const w = engine.width;
        const h = engine.height;
        const pr = engine.pixelRatio;
        const logicalW = w / pr;
        const logicalH = h / pr;
        if (logicalW <= 0 || logicalH <= 0) return null;

        // Read reference values from the 3D renderer (same transform as vertex shader)
        const refCX = r3d.referenceCenterX;
        const refCY = r3d.referenceCenterY;
        const ws = r3d.referenceWorldScale;
        if (ws === 0) return null; // not yet initialized

        // Engine coords → world coords (uses reference center, matches shader)
        const wx = (px - refCX) * ws;
        const wy = -(py - refCY) * ws;
        const wz = pz * ws;

        // Project through viewProjection matrix
        const vp = cam.viewProjection;
        const clipW = vp[3]! * wx + vp[7]! * wy + vp[11]! * wz + vp[15]!;
        if (clipW <= 0) return null; // behind camera

        const clipX = vp[0]! * wx + vp[4]! * wy + vp[8]! * wz + vp[12]!;
        const clipY = vp[1]! * wx + vp[5]! * wy + vp[9]! * wz + vp[13]!;

        // NDC → engine coords (uses CURRENT viewport, not reference — mouse coords are in current screen space)
        return {
          x: (clipX / clipW + 1) * 0.5 * logicalW,
          y: (1 - clipY / clipW) * 0.5 * logicalH,
        };
      };
    }
  }

  // ── Camera controls (3D only) ──

  const setCameraPosition = (x: number, y: number, z: number): void => {
    if (!camera3d) return;
    camera3d.position.x = x;
    camera3d.position.y = y;
    camera3d.position.z = z;
  };

  const orbitCamera = (azimuth: number, elevation: number, distance: number): void => {
    if (!camera3d) return;
    camera3d.orbit(azimuth, elevation, distance);
  };

  const enableOrbitControls = (): (() => void) | null => {
    if (!camera3d) return null;
    const cleanup = camera3d.enableOrbitControls(canvas);
    cleanups.push(cleanup);
    return cleanup;
  };

  const enableAutoOrbit = (speed = 0.3): (() => void) | null => {
    if (!camera3d) return null;
    let lastTime = performance.now();

    const onUpdate = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      // Read current state from camera each frame so orbit controls can override freely
      const cam = camera3d!;
      const azimuth = Math.atan2(
        cam.position.z - cam.target.z,
        cam.position.x - cam.target.x,
      );
      const elevation = Math.asin(
        Math.min(1, Math.max(-1,
          (cam.position.y - cam.target.y) / cam.getDistance(),
        )),
      );
      cam.orbit(azimuth + speed * dt, elevation, cam.getDistance());
    };

    engine.addEventListener('UPDATE', onUpdate);
    const cleanup = () => engine.removeEventListener('UPDATE', onUpdate);
    cleanups.push(cleanup);
    return cleanup;
  };

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
    camera: camera3d,
    burst,
    attachClickBurst,
    ...forces,
    ...boundary,
    ...containerGlow,
    ...mouseTrail,
    ...effects,
    ...imageApi,
    ...imageShatter,
    setCameraPosition,
    orbitCamera,
    enableOrbitControls,
    enableAutoOrbit,
    destroy,
  };
}
