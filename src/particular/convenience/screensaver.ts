import Emitter from '../components/emitter';
import { configureParticle, defaultParticle, defaultMouseWind } from '../core/defaults';
import { getPreset } from '../presets';
import Vector from '../utils/vector';
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
  const sourceW = container ? container.clientWidth : window.innerWidth;
  const spawnWidth = sourceW / pixelRatio;

  const emitter = new Emitter({
    point: new Vector(sourceW / 2 / pixelRatio, 0),
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

  if (autoResize && !container) {
    const onResize = () => {
      const newSpawnWidth = window.innerWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = window.innerWidth / 2 / pixelRatio;
    };
    window.addEventListener('resize', onResize);
    cleanups.push(() => window.removeEventListener('resize', onResize));
  }

  if (autoResize && container) {
    const ro = new ResizeObserver(() => {
      const newSpawnWidth = container.clientWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = container.clientWidth / 2 / pixelRatio;
    });
    ro.observe(container);
    cleanups.push(() => ro.disconnect());
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
