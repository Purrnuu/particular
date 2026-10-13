import Emitter from '../components/emitter';
import { configureParticle, defaultWobble } from '../core/defaults';
import { createExplosionChild } from '../utils/explosion';
import { generateHarmoniousPalette } from '../utils/color';
import Vector from '../utils/vector';
import PointerMotion from '../utils/pointerMotion';
import type { ExplodeOptions, WobbleConfig, FrameContext } from '../types';
import type { FeatureContext } from './context';

/**
 * Create explode() and scatter() helpers bound to an engine instance.
 */
export function createEffects({ engine, config: mergedConfig, resources }: FeatureContext) {
  const explode = (options: ExplodeOptions = {}): void => {
    resources.assertActive();
    const destroyParents = options.destroyParents ?? true;
    const allParticles = engine.getAllParticles();
    if (allParticles.length === 0) return;

    // Snapshot all alive particles before any modifications
    const snapshots = allParticles.map((p) => ({
      x: p.position.x,
      y: p.position.y,
      z: p.position.z,
      color: p.color,
      shape: p.shape,
      blendMode: p.blendMode,
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
    resources.assertActive();
    const baseVelocity = options.velocity ?? 10;
    const rotationImpulse = options.rotation ?? 0;
    const allParticles = engine.getAllParticles();
    for (const particle of allParticles) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = baseVelocity * (0.3 + Math.random() * 1.4);
      particle.velocity.x += Math.cos(angle) * magnitude;
      particle.velocity.y += Math.sin(angle) * magnitude;
      // Add z impulse if particle is in 3D space
      if (particle.position.z !== 0 || (particle.homePosition && particle.homePosition.z !== 0)) {
        particle.velocity.z += (Math.random() - 0.5) * magnitude;
      }
      if (rotationImpulse > 0) {
        particle.rotationVelocity += (Math.random() - 0.5) * 2 * rotationImpulse;
      }
    }
  };

  // ── Wobble: directional outward push that spring fights back against ──

  let wobbleCleanup: (() => void) | null = null;

  const startWobble = (config?: WobbleConfig): void => {
    resources.assertActive();
    stopWobble();
    const { track, ...rest } = config ?? {};
    const resolved = { ...defaultWobble, ...rest };

    // Prevent settle-snap so nudges actually move particles
    for (const p of engine.getAllParticles()) {
      p.preventSettle = true;
    }

    // Compute image center from average of particle home positions (stable reference)
    const allParticles = engine.getAllParticles();
    let cx = 0,
      cy = 0,
      homeCount = 0;
    for (const p of allParticles) {
      if (p.homePosition) {
        cx += p.homePosition.x;
        cy += p.homePosition.y;
        homeCount++;
      }
    }
    if (homeCount > 0) {
      cx /= homeCount;
      cy /= homeCount;
    }
    const center = { x: cx, y: cy };

    // Mouse tracking state (engine coords)
    let mouseX = center.x;
    let mouseY = center.y;
    let mouseVelX = 0;
    let mouseVelY = 0;
    const pointerMotion = new PointerMotion();
    const eventCleanups: (() => void)[] = [];

    if (track) {
      const pr = mergedConfig.pixelRatio;
      const container = engine.container;

      // Cache container rect — invalidate on scroll/resize instead of reading per mousemove
      let cachedRect: { left: number; top: number } | null = null;
      let rectDirty = true;
      const invalidateRect = () => {
        rectDirty = true;
      };
      let wobbleRo: ResizeObserver | null = null;
      if (container) {
        wobbleRo = new ResizeObserver(invalidateRect);
        wobbleRo.observe(container);
        window.addEventListener('scroll', invalidateRect, { passive: true });
        container.addEventListener('scroll', invalidateRect, { passive: true });
      }

      const updateMouse = (clientX: number, clientY: number) => {
        let x = clientX;
        let y = clientY;
        if (container) {
          if (rectDirty || !cachedRect) {
            const rect = container.getBoundingClientRect();
            cachedRect = { left: rect.left, top: rect.top };
            rectDirty = false;
          }
          x -= cachedRect.left;
          y -= cachedRect.top;
        }
        const newX = x / pr;
        const newY = y / pr;
        pointerMotion.record(newX, newY);
        mouseX = newX;
        mouseY = newY;
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
        () => {
          if (wobbleRo) wobbleRo.disconnect();
        },
        () => {
          if (container) {
            window.removeEventListener('scroll', invalidateRect);
            container.removeEventListener('scroll', invalidateRect);
          }
        }
      );
    }

    const wobble = (frame?: FrameContext) => {
      const dt = frame?.dt ?? 1;
      if (dt <= 0) return;
      const motion = pointerMotion.consume(dt);
      if (motion) {
        mouseVelX = motion.x;
        mouseVelY = motion.y;
      }
      const noiseScale = Math.sqrt(dt);
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
          const pushStrength =
            resolved.velocity *
            (0.3 + proximity * resolved.mouseStrength) *
            (0.3 + Math.random() * 1.4);
          p.velocity.x += Math.cos(pushAngle) * pushStrength * dt;
          p.velocity.y += Math.sin(pushAngle) * pushStrength * dt;

          // Mouse velocity drags nearby particles along
          if (proximity > 0.1) {
            p.velocity.x += mouseVelX * proximity * 0.3 * dt;
            p.velocity.y += mouseVelY * proximity * 0.3 * dt;
          }

          // Rotation jitter scaled by proximity
          p.rotationVelocity +=
            (Math.random() - 0.5) * resolved.rotation * 2 * (0.3 + proximity * 2) * noiseScale;

          // Small organic noise on top
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 0.3 * noiseScale;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 0.3 * noiseScale;
        } else {
          // ── Fallback: random wobble (no mouse tracking) ──
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 2 * noiseScale;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 2 * noiseScale;
          p.rotationVelocity += (Math.random() - 0.5) * resolved.rotation * 2 * noiseScale;
        }
      }

      // Decay mouse velocity smoothly when mouse stops moving
      mouseVelX *= Math.pow(0.85, dt);
      mouseVelY *= Math.pow(0.85, dt);
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

  resources.add(stopWobble);
  return { explode, scatter, startWobble, stopWobble };
}
