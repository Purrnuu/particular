import Emitter from '../components/emitter';
import Particular from '../core/particular';
import { configureParticle, defaultContainerGlow } from '../core/defaults';
import Vector from '../utils/vector';
import type { ContainerGlowConfig } from '../types';
import type { ContainerGlowHandle } from './types';

/** Edge direction angles (radians): outward from each edge. */
const EDGE_ANGLES = {
  top: -Math.PI / 2,
  bottom: Math.PI / 2,
  left: Math.PI,
  right: 0,
} as const;

/**
 * Create the addContainerGlow() helper bound to an engine instance.
 *
 * Places 4 continuous emitters along an HTML element's edges, emitting soft
 * glowing particles outward. Emission rate pulses sinusoidally for a breathing
 * effect. Auto-syncs on resize and scroll.
 */
export function createContainerGlowHelper(
  engine: Particular,
  container: HTMLElement | undefined,
  cleanups: Array<() => void>,
) {
  const addContainerGlow = (config: ContainerGlowConfig): ContainerGlowHandle => {
    const { element, ...userConfig } = config;
    const resolved = { ...defaultContainerGlow, ...userConfig };
    const pr = engine.pixelRatio;

    let emitters: Emitter[] = [];
    // Store per-emitter edge info for repositioning without rebuild
    let edgeData: { edge: keyof typeof EDGE_ANGLES; offsetX: number; offsetY: number }[] = [];
    let pulseTick = 0;
    let paused = false;
    const baseRate = resolved.rate;

    /** Build particle config shared by all 4 edge emitters. */
    const buildParticleConfig = (angle: number) =>
      configureParticle({
        rate: resolved.rate,
        life: 999999,
        particleLife: resolved.particleLife,
        velocity: Vector.fromAngle(angle, resolved.velocity),
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
        trail: false,
      });

    /** Full rebuild: remove old emitters, create new ones at current element position. */
    const rebuild = () => {
      for (const em of emitters) {
        engine.emitters.splice(engine.emitters.indexOf(em), 1);
        em.destroy();
      }
      emitters = [];
      edgeData = [];

      const refRect = container
        ? container.getBoundingClientRect()
        : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      const elW = elRect.width / pr;
      const elH = elRect.height / pr;

      // Center of each edge (relative to element top-left) + spawn dimensions
      const edges: {
        edge: keyof typeof EDGE_ANGLES;
        offsetX: number;
        offsetY: number;
        spawnW: number;
        spawnH: number;
      }[] = [
        { edge: 'top', offsetX: elW / 2, offsetY: 0, spawnW: elW, spawnH: 0 },
        { edge: 'bottom', offsetX: elW / 2, offsetY: elH, spawnW: elW, spawnH: 0 },
        { edge: 'left', offsetX: 0, offsetY: elH / 2, spawnW: 0, spawnH: elH },
        { edge: 'right', offsetX: elW, offsetY: elH / 2, spawnW: 0, spawnH: elH },
      ];

      for (const { edge, offsetX, offsetY, spawnW, spawnH } of edges) {
        const particleConfig = buildParticleConfig(EDGE_ANGLES[edge]);
        const emitter = new Emitter({
          point: new Vector(elLeft + offsetX, elTop + offsetY),
          ...particleConfig,
          spawnWidth: spawnW,
          spawnHeight: spawnH,
          icons: [],
        });

        engine.addEmitter(emitter);
        emitter.isEmitting = true;
        emitter.emit();

        emitters.push(emitter);
        edgeData.push({ edge, offsetX, offsetY });
      }
    };

    /** Lightweight reposition: move existing emitters without recreating. */
    const reposition = () => {
      if (emitters.length === 0) return;

      const refRect = container
        ? container.getBoundingClientRect()
        : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;

      for (let i = 0; i < emitters.length; i++) {
        const em = emitters[i]!;
        const data = edgeData[i]!;
        em.configuration.point.x = elLeft + data.offsetX;
        em.configuration.point.y = elTop + data.offsetY;
      }
    };

    /** Per-frame handler: enforce paused state + pulse modulation.
     *  Runs on UPDATE (before emit) so it overrides the engine's isEmitting reset. */
    const onUpdate = () => {
      if (paused) {
        for (const em of emitters) em.isEmitting = false;
        return;
      }
      if (resolved.pulseAmplitude > 0 && resolved.pulseSpeed > 0) {
        pulseTick++;
        const pulse = 1 + resolved.pulseAmplitude * Math.sin(pulseTick * resolved.pulseSpeed);
        for (const em of emitters) {
          em.configuration.rate = baseRate * pulse;
        }
      }
    };

    // Initial build
    rebuild();

    // Pulse modulation via engine update event
    engine.addEventListener(Particular.UPDATE, onUpdate);

    // Auto-rebuild on element/container resize (debounced with rAF)
    let rebuildRafId = 0;
    const ro = new ResizeObserver(() => {
      if (rebuildRafId) return;
      rebuildRafId = requestAnimationFrame(() => {
        rebuildRafId = 0;
        rebuild();
      });
    });
    ro.observe(element);
    if (container) ro.observe(container);

    // rAF-throttled scroll reposition
    let scrollRafId = 0;
    const onScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        reposition();
      });
    };
    const scrollTarget = container ?? window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    const stop = () => {
      paused = true;
      for (const em of emitters) em.isEmitting = false;
    };

    const start = () => {
      paused = false;
      for (const em of emitters) em.isEmitting = true;
    };

    const handle: ContainerGlowHandle = {
      update: rebuild,
      stop,
      start,
      destroy: () => {
        engine.removeEventListener(Particular.UPDATE, onUpdate);
        ro.disconnect();
        if (rebuildRafId) cancelAnimationFrame(rebuildRafId);
        scrollTarget.removeEventListener('scroll', onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const em of emitters) {
          const idx = engine.emitters.indexOf(em);
          if (idx !== -1) engine.emitters.splice(idx, 1);
          em.destroy();
        }
        emitters = [];
        edgeData = [];
      },
    };

    cleanups.push(() => handle.destroy());
    return handle;
  };

  return { addContainerGlow };
}
