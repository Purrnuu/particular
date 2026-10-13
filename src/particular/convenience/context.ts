import type Particular from '../core/particular';
import type { MergedConfig } from '../core/defaults';
import type { ResourceScope } from '../core/resourceScope';

export interface FeatureContext {
  engine: Particular;
  config: MergedConfig;
  container?: HTMLElement;
  resources: ResourceScope;
  coordinates: {
    /** CSS pixels relative to the viewport/container, without subtracting its offset. */
    localToEngine(x: number, y: number): { x: number; y: number };
    /** Browser client coordinates; subtracts the container's current offset. */
    clientToEngine(x: number, y: number): { x: number; y: number };
  };
}

export function createFeatureContext(engine: Particular, config: MergedConfig): FeatureContext {
  const container = config.container;
  const localToEngine = (x: number, y: number) => ({
    x: x / engine.pixelRatio,
    y: y / engine.pixelRatio,
  });
  return {
    engine,
    config,
    container,
    resources: engine.resources,
    coordinates: {
      localToEngine,
      clientToEngine: (x, y) => {
        const rect = container?.getBoundingClientRect();
        return localToEngine(x - (rect?.left ?? 0), y - (rect?.top ?? 0));
      },
    },
  };
}
