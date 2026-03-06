import Emitter from './components/emitter';
import Attractor from './components/attractor';
import MouseForce from './components/mouseForce';
import { processImages } from './components/icons';
import { configureParticular, configureParticle, defaultParticle } from './core/defaults';
import Particular from './core/particular';
import { getPreset, type PresetName } from './presets';
import CanvasRenderer from './renderers/canvasRenderer';
import WebGLRenderer from './renderers/webglRenderer';
import Vector from './utils/vector';
import type { FullParticularConfig, RendererType, AttractorConfig, MouseForceConfig } from './types';

export interface BurstOptions extends Partial<FullParticularConfig> {
  x: number;
  y: number;
}

export interface CreateParticlesOptions {
  canvas: HTMLCanvasElement;
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  renderer?: RendererType;
  autoResize?: boolean;
  autoClick?: boolean;
  clickTarget?: EventTarget;
}

export interface ParticlesController {
  engine: Particular;
  burst: (options: BurstOptions) => Emitter;
  addAttractor: (config: AttractorConfig) => Attractor;
  removeAttractor: (attractor: Attractor) => void;
  addRandomAttractors: (count: number, config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>) => Attractor[];
  removeAllAttractors: () => void;
  addMouseForce: (config?: MouseForceConfig) => MouseForce;
  removeMouseForce: (mouseForce: MouseForce) => void;
  attachClickBurst: (
    target?: EventTarget,
    overrides?: Partial<FullParticularConfig>,
  ) => () => void;
  destroy: () => void;
}

/**
 * One-call setup for standalone sites.
 * Uses a premium default preset and returns a small controller API.
 */
export function createParticles({
  canvas,
  preset = 'magic',
  config,
  renderer = 'canvas',
  autoResize = true,
  autoClick = false,
  clickTarget,
}: CreateParticlesOptions): ParticlesController {
  const engine = new Particular();
  const basePreset = getPreset(preset);
  const mergedConfig = configureParticular({ ...basePreset, ...config });

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

  if (autoResize) {
    const onResize = () => engine.onResize();
    window.addEventListener('resize', onResize);
    cleanups.push(() => window.removeEventListener('resize', onResize));
  }

  const burst = (options: BurstOptions): Emitter => {
    const { x, y, ...overrides } = options;
    const combinedSettings = configureParticle(overrides, mergedConfig);

    let icons: (string | HTMLImageElement)[] = [];
    if (combinedSettings.icons) {
      icons = processImages(combinedSettings.icons);
    }

    const emitter = new Emitter({
      point: new Vector(x / mergedConfig.pixelRatio, y / mergedConfig.pixelRatio),
      ...combinedSettings,
      icons,
    });

    engine.addEmitter(emitter);
    // Trigger immediate first burst for responsive click feedback.
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

  const addAttractor = (config: AttractorConfig): Attractor => {
    const attractor = new Attractor(config);
    engine.addAttractor(attractor);
    return attractor;
  };

  const removeAttractor = (attractor: Attractor): void => {
    engine.removeAttractor(attractor);
  };

  const addRandomAttractors = (
    count: number,
    config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>,
  ): Attractor[] => {
    const pixelRatio = engine.pixelRatio;
    const viewW = window.innerWidth / pixelRatio;
    const viewH = window.innerHeight / pixelRatio;
    const marginX = viewW * 0.1;
    const marginY = viewH * 0.1;
    const result: Attractor[] = [];

    for (let i = 0; i < count; i++) {
      const x = marginX + Math.random() * (viewW - marginX * 2);
      const y = marginY + Math.random() * (viewH - marginY * 2);
      const attractor = addAttractor({
        x,
        y,
        strength: 1,
        radius: 200,
        visible: true,
        ...config,
      });
      result.push(attractor);
    }
    return result;
  };

  const removeAllAttractors = (): void => {
    engine.attractors.splice(0);
  };

  const addMouseForce = (config: MouseForceConfig = {}): MouseForce => {
    const mouseForce = new MouseForce(
      config.x,
      config.y,
      config.strength,
      config.radius,
      config.damping,
      config.maxSpeed,
      config.falloff,
    );
    engine.addMouseForce(mouseForce);
    return mouseForce;
  };

  const removeMouseForce = (mouseForce: MouseForce): void => {
    engine.removeMouseForce(mouseForce);
  };

  const destroy = () => {
    for (const cleanup of cleanups) cleanup();
    engine.destroy();
  };

  return {
    engine,
    burst,
    addAttractor,
    removeAttractor,
    addRandomAttractors,
    removeAllAttractors,
    addMouseForce,
    removeMouseForce,
    attachClickBurst,
    destroy,
  };
}

/* ─── Screensaver ─── */

export interface ScreensaverOptions {
  canvas: HTMLCanvasElement;
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  renderer?: RendererType;
  autoResize?: boolean;
}

export interface ScreensaverController {
  engine: Particular;
  controller: ParticlesController;
  destroy: () => void;
}

/**
 * One-call screensaver setup: spawns particles across the full viewport width.
 * Defaults to the `snow` preset with continuous emission.
 */
export function startScreensaver({
  canvas,
  preset = 'snow',
  config,
  renderer = 'canvas',
  autoResize = true,
}: ScreensaverOptions): ScreensaverController {
  const basePreset = getPreset(preset);
  const mergedConfig: Partial<FullParticularConfig> = {
    ...basePreset,
    continuous: true,
    ...config,
  };

  const controller = createParticles({
    canvas,
    preset,
    config: mergedConfig,
    renderer,
    autoResize,
  });

  const pixelRatio = controller.engine.pixelRatio;
  const spawnWidth = window.innerWidth / pixelRatio;

  const emitter = new Emitter({
    point: new Vector(window.innerWidth / 2 / pixelRatio, 0),
    ...configureParticle(mergedConfig),
    spawnWidth,
    spawnHeight: defaultParticle.spawnHeight,
    icons: [],
  });

  controller.engine.addEmitter(emitter);
  emitter.isEmitting = true;
  emitter.emit();

  // Gentle mouse wind — snowflakes drift away from cursor movement.
  const mouseWind = controller.addMouseForce({
    strength: 0.12,
    radius: 250,
    damping: 0.92,
    maxSpeed: 8,
    falloff: 0.3,
  });

  const onMouseMove = (e: globalThis.MouseEvent) => {
    mouseWind.updatePosition(e.clientX / pixelRatio, e.clientY / pixelRatio);
  };
  window.addEventListener('mousemove', onMouseMove);

  const cleanups: Array<() => void> = [
    () => window.removeEventListener('mousemove', onMouseMove),
  ];

  if (autoResize) {
    const onResize = () => {
      const newSpawnWidth = window.innerWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = window.innerWidth / 2 / pixelRatio;
    };
    window.addEventListener('resize', onResize);
    cleanups.push(() => window.removeEventListener('resize', onResize));
  }

  const destroy = () => {
    for (const cleanup of cleanups) cleanup();
    controller.destroy();
  };

  return {
    engine: controller.engine,
    controller,
    destroy,
  };
}
