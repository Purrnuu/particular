import Attractor from '../components/attractor';
import MouseForce from '../components/mouseForce';
import FlockingForce from '../components/flockingForce';
import type Particular from '../core/particular';
import { getViewportSize } from './resize';
import type { AttractorConfig, MouseForceConfig, FlockingForceConfig } from '../types';

/**
 * Create attractor and mouse force helpers bound to an engine instance.
 */
export function createForces(
  engine: Particular,
  container: HTMLElement | undefined,
  cleanups: Array<() => void>,
) {
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
    const vp = getViewportSize(container);
    const viewW = vp.w / pixelRatio;
    const viewH = vp.h / pixelRatio;
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
    const { track, ...forceConfig } = config;
    const mouseForce = new MouseForce(forceConfig);
    engine.addMouseForce(mouseForce);

    if (track) {
      const target = track === true ? window : track;
      mouseForce.startTracking(target, engine.pixelRatio, container);
      cleanups.push(() => mouseForce.stopTracking());
    }

    return mouseForce;
  };

  const removeMouseForce = (mouseForce: MouseForce): void => {
    mouseForce.stopTracking();
    engine.removeMouseForce(mouseForce);
  };

  const addFlockingForce = (config?: FlockingForceConfig): FlockingForce => {
    const flockingForce = new FlockingForce(config);
    engine.addFlockingForce(flockingForce);
    return flockingForce;
  };

  const removeFlockingForce = (flockingForce: FlockingForce): void => {
    engine.removeFlockingForce(flockingForce);
  };

  return { addAttractor, removeAttractor, addRandomAttractors, removeAllAttractors, addMouseForce, removeMouseForce, addFlockingForce, removeFlockingForce };
}
