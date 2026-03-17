import Emitter from '../components/emitter';
import type Particular from '../core/particular';
import { configureParticle, defaultWobble, type MergedConfig } from '../core/defaults';
import { createExplosionChild } from '../utils/explosion';
import { generateHarmoniousPalette } from '../utils/color';
import Vector from '../utils/vector';
import type { ExplodeOptions, WobbleConfig } from '../types';

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

  const scatter = (options: { velocity?: number; rotation?: number } = {}): void => {
    const baseVelocity = options.velocity ?? 10;
    const rotationImpulse = options.rotation ?? 0;
    const allParticles = engine.getAllParticles();
    for (const particle of allParticles) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = baseVelocity * (0.3 + Math.random() * 1.4);
      particle.velocity.x += Math.cos(angle) * magnitude;
      particle.velocity.y += Math.sin(angle) * magnitude;
      if (rotationImpulse > 0) {
        particle.rotationVelocity += (Math.random() - 0.5) * 2 * rotationImpulse;
      }
    }
  };

  // ── Wobble: directional outward push that spring fights back against ──

  let wobbleCleanup: (() => void) | null = null;

  const startWobble = (config?: WobbleConfig): void => {
    stopWobble();
    const { track, ...rest } = config ?? {};
    const resolved = { ...defaultWobble, ...rest };

    // Prevent settle-snap so nudges actually move particles
    for (const p of engine.getAllParticles()) {
      p.preventSettle = true;
    }

    // Compute image center from average of particle home positions (stable reference)
    const allParticles = engine.getAllParticles();
    let cx = 0, cy = 0, homeCount = 0;
    for (const p of allParticles) {
      if (p.homePosition) {
        cx += p.homePosition.x;
        cy += p.homePosition.y;
        homeCount++;
      }
    }
    if (homeCount > 0) { cx /= homeCount; cy /= homeCount; }
    const center = { x: cx, y: cy };

    // Mouse tracking state (engine coords)
    let mouseX = center.x;
    let mouseY = center.y;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let hasMouse = false;
    const eventCleanups: (() => void)[] = [];

    if (track) {
      const pr = mergedConfig.pixelRatio;
      const container = engine.container;

      const updateMouse = (clientX: number, clientY: number) => {
        let x = clientX;
        let y = clientY;
        if (container) {
          const rect = container.getBoundingClientRect();
          x -= rect.left;
          y -= rect.top;
        }
        const newX = x / pr;
        const newY = y / pr;
        if (hasMouse) {
          mouseVelX = newX - mouseX;
          mouseVelY = newY - mouseY;
        }
        mouseX = newX;
        mouseY = newY;
        hasMouse = true;
      };

      const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          updateMouse(e.touches[0]!.clientX, e.touches[0]!.clientY);
        }
      };

      track.addEventListener('mousemove', onMouseMove);
      track.addEventListener('touchmove', onTouchMove);
      eventCleanups.push(
        () => track.removeEventListener('mousemove', onMouseMove),
        () => track.removeEventListener('touchmove', onTouchMove),
      );
    }

    const wobble = () => {
      const particles = engine.getAllParticles();
      const pr = mergedConfig.pixelRatio;
      const engineRadius = resolved.mouseRadius / pr;

      for (const p of particles) {
        if (track && p.homePosition) {
          // ── Mouse-reactive directional wobble ──

          // Outward direction: from image center through this particle's home
          const outDx = p.homePosition.x - center.x;
          const outDy = p.homePosition.y - center.y;
          const outAngle = Math.atan2(outDy, outDx);

          // Mouse proximity (0–1, smooth falloff)
          const mDx = p.position.x - mouseX;
          const mDy = p.position.y - mouseY;
          const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
          const proximity = Math.max(0, 1 - mDist / engineRadius);

          // Push: outward with angular jitter, strength scaled by mouse proximity
          const angleJitter = (Math.random() - 0.5) * 0.8;
          const pushAngle = outAngle + angleJitter;
          const pushStrength = resolved.velocity * (0.3 + proximity * resolved.mouseStrength) * (0.3 + Math.random() * 1.4);
          p.velocity.x += Math.cos(pushAngle) * pushStrength;
          p.velocity.y += Math.sin(pushAngle) * pushStrength;

          // Mouse velocity drags nearby particles along
          if (proximity > 0.1) {
            p.velocity.x += mouseVelX * proximity * 0.3;
            p.velocity.y += mouseVelY * proximity * 0.3;
          }

          // Rotation jitter scaled by proximity
          p.rotationVelocity += (Math.random() - 0.5) * resolved.rotation * 2 * (0.3 + proximity * 2);

          // Small organic noise on top
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 0.3;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 0.3;
        } else {
          // ── Fallback: random wobble (no mouse tracking) ──
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 2;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 2;
          p.rotationVelocity += (Math.random() - 0.5) * resolved.rotation * 2;
        }
      }

      // Decay mouse velocity smoothly when mouse stops moving
      mouseVelX *= 0.85;
      mouseVelY *= 0.85;
    };

    engine.addEventListener('UPDATE', wobble);
    wobbleCleanup = () => {
      engine.removeEventListener('UPDATE', wobble);
      for (const cleanup of eventCleanups) cleanup();
      for (const p of engine.getAllParticles()) {
        p.preventSettle = false;
      }
    };
  };

  const stopWobble = (): void => {
    if (wobbleCleanup) {
      wobbleCleanup();
      wobbleCleanup = null;
    }
  };

  return { explode, scatter, startWobble, stopWobble };
}
