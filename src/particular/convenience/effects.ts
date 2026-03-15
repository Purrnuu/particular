import Emitter from '../components/emitter';
import type Particular from '../core/particular';
import { configureParticle, type MergedConfig } from '../core/defaults';
import { createExplosionChild } from '../utils/explosion';
import { generateHarmoniousPalette } from '../utils/color';
import Vector from '../utils/vector';
import type { ExplodeOptions } from '../types';

/**
 * Create explode() and scatter() helpers bound to an engine instance.
 */
export function createEffects(engine: Particular, mergedConfig: MergedConfig) {
  const explode = (options: ExplodeOptions = {}): void => {
    const destroyParents = options.destroyParents ?? true;
    const allParticles = engine.getAllParticles();
    if (allParticles.length === 0) return;

    // Snapshot all alive particles before any modifications
    const snapshots = allParticles.map((p) => ({
      x: p.position.x,
      y: p.position.y,
      color: p.color,
      shape: p.shape as string,
      blendMode: p.blendMode as string,
    }));

    if (destroyParents) {
      for (const emitter of engine.emitters) {
        for (const p of emitter.particles) {
          p.destroy();
        }
        emitter.particles = [];
      }
    }

    // Create collector emitter for children, respecting maxCount
    const fallbackColors = generateHarmoniousPalette();
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: [],
    });
    collector.isEmitting = false;

    const childCount = options.childCount ?? 5;
    const currentCount = engine.getCount();
    const budget = Math.max(0, engine.maxCount - currentCount);
    let spawned = 0;

    for (const parent of snapshots) {
      for (let i = 0; i < childCount; i++) {
        if (spawned >= budget) break;
        const child = createExplosionChild(parent, options, engine, fallbackColors);
        collector.particles.push(child);
        spawned++;
      }
      if (spawned >= budget) break;
    }

    engine.addEmitter(collector);
  };

  const scatter = (options: { velocity?: number } = {}): void => {
    const baseVelocity = options.velocity ?? 10;
    const allParticles = engine.getAllParticles();
    for (const particle of allParticles) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = baseVelocity * (0.3 + Math.random() * 1.4);
      particle.velocity.x += Math.cos(angle) * magnitude;
      particle.velocity.y += Math.sin(angle) * magnitude;
    }
  };

  return { explode, scatter };
}
