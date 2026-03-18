import Emitter from '../components/emitter';
import { configureParticle, defaultParticle, defaultMouseWind } from '../core/defaults';
import { getPreset } from '../presets';
import Vector from '../utils/vector';
import { getViewportSize, watchResize } from './resize';
import type { FullParticularConfig } from '../types';
import { createParticles } from './index';
import type { ScreensaverOptions, ScreensaverController } from './types';

/**
 * One-call screensaver setup: spawns particles across the full viewport width.
 * Defaults to the `snow` preset with continuous emission.
 */
export function startScreensaver({
  canvas,
  preset = 'snow',
  config,
  renderer = 'webgl',
  autoResize = true,
  mouseWind: mouseWindOption,
  container,
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
    container,
  });

  const pixelRatio = controller.engine.pixelRatio;
  const initialSize = getViewportSize(container);
  const spawnWidth = initialSize.w / pixelRatio;

  const emitter = new Emitter({
    point: new Vector(initialSize.w / 2 / pixelRatio, 0),
    ...configureParticle(mergedConfig),
    spawnWidth,
    spawnHeight: defaultParticle.spawnHeight,
    icons: [],
  });

  controller.engine.addEmitter(emitter);
  emitter.isEmitting = true;
  emitter.emit();

  const cleanups: Array<() => void> = [];

  // Gentle mouse wind — snowflakes drift away from cursor movement.
  if (mouseWindOption !== false) {
    controller.addMouseForce({
      ...defaultMouseWind,
      track: true,
      ...mouseWindOption,
    });
  }

  if (autoResize) {
    watchResize((_sx, _sy, current) => {
      emitter.configuration.spawnWidth = current.w / pixelRatio;
      emitter.configuration.point.x = current.w / 2 / pixelRatio;
    }, { container, debounceMs: 0, cleanups });
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
