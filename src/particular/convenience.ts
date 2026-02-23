import Emitter from './components/emitter';
import { processImages } from './components/icons';
import { configureParticular, configureParticle } from './core/defaults';
import Particular from './core/particular';
import { presets, type PresetName } from './presets';
import CanvasRenderer from './renderers/canvasRenderer';
import Vector from './utils/vector';
import type { FullParticularConfig } from './types';

export interface BurstOptions extends Partial<FullParticularConfig> {
  x: number;
  y: number;
}

export interface CreateParticlesOptions {
  canvas: HTMLCanvasElement;
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  autoResize?: boolean;
  autoClick?: boolean;
  clickTarget?: EventTarget;
}

export interface ParticlesController {
  engine: Particular;
  burst: (options: BurstOptions) => Emitter;
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
  autoResize = true,
  autoClick = false,
  clickTarget,
}: CreateParticlesOptions): ParticlesController {
  const engine = new Particular();
  const basePreset = presets[preset];
  const mergedConfig = configureParticular({ ...basePreset, ...config });

  engine.initialize(mergedConfig);
  engine.addRenderer(new CanvasRenderer(canvas));
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

  const destroy = () => {
    for (const cleanup of cleanups) cleanup();
    engine.destroy();
  };

  return {
    engine,
    burst,
    attachClickBurst,
    destroy,
  };
}
