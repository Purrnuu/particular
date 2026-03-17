import Emitter from '../components/emitter';
import Particular from '../core/particular';
import { configureParticle, defaultMouseTrail } from '../core/defaults';
import Vector from '../utils/vector';
import type { MouseTrailConfig } from '../types';
import type { MouseTrailHandle } from './types';

/**
 * Create the addMouseTrail() helper bound to an engine instance.
 *
 * Spawns a continuous emitter that follows the mouse cursor. Particles
 * inherit cursor velocity direction and leave glowing wisp streaks.
 * Emission pauses when the mouse stops moving.
 */
export function createMouseTrailHelper(
  engine: Particular,
  container: HTMLElement | undefined,
  cleanups: Array<() => void>,
) {
  const addMouseTrail = (config: MouseTrailConfig = {}): MouseTrailHandle => {
    const { target: userTarget, ...userConfig } = config;
    const resolved = { ...defaultMouseTrail, ...userConfig };
    const pr = engine.pixelRatio;
    const target = userTarget ?? window;

    let paused = false;
    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;
    let mouseSpeed = 0;
    let hasMoved = false;

    // Build particle config — velocity will be overridden per-frame
    const particleConfig = configureParticle({
      rate: resolved.rate,
      life: 999999,
      particleLife: resolved.particleLife,
      velocity: new Vector(0, 0),
      spread: resolved.spread,
      sizeMin: resolved.sizeMin,
      sizeMax: resolved.sizeMax,
      velocityMultiplier: 0,
      fadeTime: resolved.fadeTime,
      gravity: 0,
      scaleStep: 1,
      friction: resolved.friction,
      frictionSize: 0,
      acceleration: 0,
      accelerationSize: 0,
      colors: resolved.colors,
      shape: resolved.shape,
      blendMode: resolved.blendMode,
      glow: resolved.glow,
      glowSize: resolved.glowSize,
      glowColor: resolved.glowColor,
      glowAlpha: resolved.glowAlpha,
      shadow: false,
      trail: resolved.trail,
      trailLength: resolved.trailLength,
      trailFade: resolved.trailFade,
      trailShrink: resolved.trailShrink,
    });

    const emitter = new Emitter({
      point: new Vector(0, 0),
      ...particleConfig,
      spawnWidth: 0,
      spawnHeight: 0,
      icons: [],
    });

    engine.addEmitter(emitter);
    emitter.isEmitting = false; // start paused until mouse moves

    // Mouse tracking (reuses the same pattern as MouseForce)
    const handleCoords = (clientX: number, clientY: number) => {
      let x = clientX;
      let y = clientY;
      if (container) {
        const rect = container.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
      }
      mouseX = x / pr;
      mouseY = y / pr;
      hasMoved = true;
    };

    const onMouseMove = (e: Event) => {
      const me = e as MouseEvent;
      handleCoords(me.clientX, me.clientY);
    };

    const onTouchMove = (e: Event) => {
      const te = e as TouchEvent;
      const touch = te.touches[0];
      if (touch) handleCoords(touch.clientX, touch.clientY);
    };

    target.addEventListener('mousemove', onMouseMove);
    target.addEventListener('touchmove', onTouchMove, { passive: true });
    target.addEventListener('touchstart', onTouchMove, { passive: true });

    // Per-frame update: move emitter to mouse, set velocity from cursor direction
    const onUpdate = () => {
      if (paused) {
        emitter.isEmitting = false;
        return;
      }

      if (!hasMoved) {
        emitter.isEmitting = false;
        return;
      }

      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      prevX = mouseX;
      prevY = mouseY;

      // Move emitter to cursor
      emitter.configuration.point.x = mouseX;
      emitter.configuration.point.y = mouseY;

      if (mouseSpeed < resolved.minSpeed) {
        emitter.isEmitting = false;
        return;
      }

      // Set velocity in cursor direction
      const angle = Math.atan2(dy, dx);
      // Reverse direction so particles fly out behind the cursor
      emitter.configuration.velocity = Vector.fromAngle(angle + Math.PI, resolved.velocity);
      emitter.isEmitting = true;
    };

    engine.addEventListener(Particular.UPDATE, onUpdate);

    const handle: MouseTrailHandle = {
      stop: () => {
        paused = true;
        emitter.isEmitting = false;
      },
      start: () => {
        paused = false;
      },
      destroy: () => {
        engine.removeEventListener(Particular.UPDATE, onUpdate);
        target.removeEventListener('mousemove', onMouseMove);
        target.removeEventListener('touchmove', onTouchMove);
        target.removeEventListener('touchstart', onTouchMove);
        const idx = engine.emitters.indexOf(emitter);
        if (idx !== -1) engine.emitters.splice(idx, 1);
        emitter.destroy();
      },
    };

    cleanups.push(() => handle.destroy());
    return handle;
  };

  return { addMouseTrail };
}
