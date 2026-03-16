import Emitter from '../components/emitter';
import Particle from '../components/particle';
import type Particular from '../core/particular';
import { configureParticle, defaultImageParticles, type MergedConfig } from '../core/defaults';
import Vector from '../utils/vector';
import { loadImage, sampleImagePixels } from '../utils/pixelSampler';
import { createTextImage, canvasToDataURL } from '../utils/imageSource';
import type { ImageParticlesConfig, TextImageConfig, IntroMode } from '../types';
import type { PixelSample } from '../utils/pixelSampler';

/**
 * Create imageToParticles() and textToParticles() helpers bound to an engine instance.
 *
 * Samples an image (or rendered text) into a grid of colored particles with
 * spring-return home positions and idle animations.
 */
export function createImageParticles(engine: Particular, mergedConfig: MergedConfig, container?: HTMLElement, cleanups?: Array<() => void>) {
  /** Resolve viewport/container dimensions for smart defaults. */
  const getViewportSize = () => {
    if (container) {
      return { w: container.clientWidth, h: container.clientHeight };
    }
    return { w: window.innerWidth, h: window.innerHeight };
  };

  const imageToParticles = async (config: ImageParticlesConfig): Promise<Emitter> => {
    const merged = { ...defaultImageParticles, ...config };
    const {
      image: imageSrc,
      resolution: resolutionOverride,
      alphaThreshold = 0.1,
      particleLife = 99999,
      gravity = 0,
      fadeTime = 40,
      particleSize: sizeOverride,
      scaleStep: scaleStepOverride,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      homeConfig,
      intro,
    } = merged;

    // Squares pack tighter on a grid — use higher resolution. Circles/triangles need fewer.
    const resolution = resolutionOverride ?? (shape === 'square' ? 400 : 200);

    const image = await loadImage(imageSrc);
    const aspect = image.naturalWidth / image.naturalHeight;

    // Smart defaults for position and size
    const viewport = getViewportSize();

    // Default x/y to center of viewport/container
    const x = config.x ?? viewport.w / 2;
    const y = config.y ?? viewport.h / 2;

    // Resolve display dimensions in screen pixels
    let displayW: number;
    let displayH: number;
    if (config.width != null && config.height != null) {
      displayW = config.width;
      displayH = config.height;
    } else if (config.width != null) {
      displayW = config.width;
      displayH = config.width / aspect;
    } else if (config.height != null) {
      displayH = config.height;
      displayW = config.height * aspect;
    } else {
      // Smart default: 80% of viewport width, capped at 800px
      displayW = Math.min(viewport.w * 0.8, 800);
      displayH = displayW / aspect;
    }

    // Convert to engine coordinates
    const pr = mergedConfig.pixelRatio;
    const engineW = displayW / pr;
    const engineH = displayH / pr;
    const centerX = x / pr;
    const centerY = y / pr;
    const originX = centerX - engineW / 2;
    const originY = centerY - engineH / 2;

    /** Calculate particle size for a given resolution. */
    const sizeForRes = (res: number, particleShape: string): number => {
      const cols = aspect >= 1 ? res : Math.max(1, Math.round(res * aspect));
      const sp = engineW / cols;
      const scale = particleShape === 'square' ? 0.55 : particleShape === 'triangle' ? 0.95 : 0.7;
      return sp * scale;
    };

    const imageCenter = new Vector(centerX, centerY);

    const samples = sampleImagePixels(image, resolution, alphaThreshold);
    const size = sizeOverride != null ? sizeOverride / pr : sizeForRes(resolution, shape ?? 'square');
    const scaleStep = scaleStepOverride ?? size;

    // Ensure maxCount can hold all particles
    if (engine.maxCount < engine.getCount() + samples.length) {
      engine.maxCount = engine.getCount() + samples.length;
    }

    // Create collector emitter (no auto-emission)
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: [],
    });
    collector.isEmitting = false;

    /** Create a particle from a pixel sample and add it to the collector. */
    const makeParticle = (sample: PixelSample, introScaleStep?: number): Particle => {
      const px = originX + sample.nx * engineW;
      const py = originY + sample.ny * engineH;
      const homePos = new Vector(px, py);

      const particle = new Particle({
        color: sample.color,
        baseAlpha: sample.alpha,
        point: new Vector(px, py),
        velocity: new Vector(0, 0),
        acceleration: new Vector(0, 0),
        friction: 0,
        size,
        particleLife,
        gravity,
        scaleStep: introScaleStep ?? scaleStep,
        fadeTime,
        shape,
        blendMode,
        glow,
        glowSize,
        glowColor,
        glowAlpha,
        shadow,
        shadowBlur,
        shadowOffsetX,
        shadowOffsetY,
        shadowColor,
        shadowAlpha,
        trail,
        trailLength,
        trailFade,
        trailShrink,
        imageTint,
        homePosition: homePos,
        homeCenter: imageCenter,
        homeConfig,
      });

      if (shape === 'triangle' && (sample.gridX + sample.gridY) % 2 === 1) {
        particle.rotation = 180;
      }

      particle.init(null, engine);
      return particle;
    };

    if (intro) {
      const mode: IntroMode = intro.mode ?? 'scatter';
      const duration = intro.duration ?? 800;
      // Grow from 0 to full size over ~15 ticks (~250ms)
      const introScaleStep = size / 15;

      if (mode === 'scatter') {
        // All particles created at once at random positions — spring pulls them home
        const scatterRadius = Math.max(engineW, engineH) * 0.3;

        for (const sample of samples) {
          const particle = makeParticle(sample, introScaleStep);
          // Scatter: offset from home position
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * scatterRadius;
          particle.position.x += Math.cos(angle) * dist;
          particle.position.y += Math.sin(angle) * dist;
          // Small random initial velocity for organic motion
          particle.velocity.x = (Math.random() - 0.5) * 2;
          particle.velocity.y = (Math.random() - 0.5) * 2;
          // Start invisible — grows from 0 via scaleStep
          particle.factoredSize = 0;
          collector.particles.push(particle);
        }

        engine.addEmitter(collector);
      } else if (mode === 'scaleIn') {
        // Particles start at image center and fly outward to home via spring.
        // Sorted farthest-first so outer edges form first, filling inward to center.
        const sorted = [...samples];
        sorted.sort((a, b) => {
          const dA = Math.hypot(a.nx - 0.5, a.ny - 0.5);
          const dB = Math.hypot(b.nx - 0.5, b.ny - 0.5);
          return dB - dA; // farthest first
        });

        // Small spread around center so particles don't all originate from one pixel
        const spread = Math.max(engineW, engineH) * 0.03;
        const numBatches = 30;
        const batchMs = duration / numBatches;

        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);

          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const speedVariance = 0.5 + Math.random() * 1.0;
              const particle = makeParticle(sorted[i]!, introScaleStep * speedVariance);
              // Start at center with small random spread
              particle.position.x = centerX + (Math.random() - 0.5) * spread;
              particle.position.y = centerY + (Math.random() - 0.5) * spread;
              particle.factoredSize = 0;
              // Override spring for scaleIn: heavy damping for smooth settle
              particle.homeConfig!.springDamping = 0.75;
              particle.homeConfig!.springStrength = 0.08;
              particle.homeConfig!.returnNoise = 0;
              // Outward nudge toward home — spring + heavy damping handles deceleration
              const dx = particle.homePosition!.x - centerX;
              const dy = particle.homePosition!.y - centerY;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const nudge = dist * 0.03 * (0.8 + Math.random() * 0.4);
              particle.velocity.x = (dx / dist) * nudge;
              particle.velocity.y = (dy / dist) * nudge;
              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };

          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      } else if (mode === 'ripple') {
        // ripple: shockwave from center — particles get pushed outward, overshoot, spring back
        const sorted = [...samples];
        sorted.sort((a, b) => {
          const dA = Math.hypot(a.nx - 0.5, a.ny - 0.5);
          const dB = Math.hypot(b.nx - 0.5, b.ny - 0.5);
          return dA - dB;
        });

        const numBatches = 40;
        const batchMs = duration / numBatches;

        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);

          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const s = sorted[i]!;
              const speedVariance = 0.4 + Math.random() * 1.2;
              const particle = makeParticle(s, introScaleStep * speedVariance);
              particle.factoredSize = 0;

              // Shockwave push: outward from center with angular wobble
              const dx = s.nx - 0.5;
              const dy = s.ny - 0.5;
              const radialAngle = Math.atan2(dy, dx);
              const wobble = (Math.random() - 0.5) * 0.7; // ±20° tangential spread
              const pushAngle = radialAngle + wobble;
              const pushMag = 2.5 + Math.random() * 2.5; // 2.5–5.0 velocity
              particle.velocity.x = Math.cos(pushAngle) * pushMag;
              particle.velocity.y = Math.sin(pushAngle) * pushMag;

              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };

          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      } else {
        // paint: particles spray from bottom center, staggered left to right
        const sorted = [...samples];
        sorted.sort((a, b) => (a.nx + Math.random() * 0.05) - (b.nx + Math.random() * 0.05));

        const launchX = centerX;
        const launchY = originY + engineH; // bottom center of image
        const numBatches = 40;
        const batchMs = duration / numBatches;

        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);

          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const speedVariance = 0.5 + Math.random() * 1.0;
              const particle = makeParticle(sorted[i]!, introScaleStep * speedVariance);
              // All particles spray from the exact same point
              particle.position.x = launchX;
              particle.position.y = launchY;
              particle.factoredSize = 0;

              // Override spring for paint: heavy damping, strong correction, no wobble
              particle.homeConfig!.springDamping = 0.75;
              particle.homeConfig!.springStrength = 0.08;
              particle.homeConfig!.returnNoise = 0;

              // Aim toward home — low speed, spring + heavy damping handles deceleration
              const dx = particle.homePosition!.x - launchX;
              const dy = particle.homePosition!.y - launchY;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const aimAngle = Math.atan2(dy, dx);
              const wobble = (Math.random() - 0.5) * 0.3; // ±8° tight spray
              const speed = dist * 0.03 * (0.9 + Math.random() * 0.2);
              particle.velocity.x = Math.cos(aimAngle + wobble) * speed;
              particle.velocity.y = Math.sin(aimAngle + wobble) * speed;

              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };

          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      }
    } else {
      // No intro — create all particles immediately at full size
      for (const sample of samples) {
        const particle = makeParticle(sample);
        collector.particles.push(particle);
      }
      engine.addEmitter(collector);
    }

    // Auto-center: re-run the effect on resize, scaling position/size proportionally
    const autoCenter = config.autoCenter ?? true;
    if (autoCenter) {
      let debounceTimer: ReturnType<typeof setTimeout> | null = null;
      // Use visible viewport for scale ratios — positions are relative to the
      // visible screen, not the full scrollable container height.
      const initialW = window.innerWidth;
      const initialH = window.innerHeight;

      const onResize = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const scaleX = window.innerWidth / initialW;
          const scaleY = window.innerHeight / initialH;
          if (Math.abs(scaleX - 1) < 0.01 && Math.abs(scaleY - 1) < 0.01) return;

          // Remove old particles
          const idx = engine.emitters.indexOf(collector);
          if (idx !== -1) engine.emitters.splice(idx, 1);
          collector.particles.length = 0;

          // Re-run with scaled position/size, no intro, no recursive autoCenter
          const scaledConfig: ImageParticlesConfig = {
            ...config,
            intro: undefined,
            autoCenter: false,
          };
          // Scale x/y proportionally if they were provided
          if (config.x != null) scaledConfig.x = config.x * scaleX;
          if (config.y != null) scaledConfig.y = config.y * scaleY;
          // Drop width/height so smart defaults recalculate from new viewport
          delete scaledConfig.width;
          delete scaledConfig.height;

          imageToParticles(scaledConfig).then((newCollector) => {
            collector.particles.push(...newCollector.particles);
            const newIdx = engine.emitters.indexOf(newCollector);
            if (newIdx !== -1) engine.emitters.splice(newIdx, 1);
            engine.addEmitter(collector);
          });
        }, 200);
      };

      if (container) {
        const ro = new ResizeObserver(onResize);
        ro.observe(container);
        cleanups?.push(() => { ro.disconnect(); if (debounceTimer) clearTimeout(debounceTimer); });
      } else {
        window.addEventListener('resize', onResize);
        cleanups?.push(() => { window.removeEventListener('resize', onResize); if (debounceTimer) clearTimeout(debounceTimer); });
      }
    }

    return collector;
  };

  const textToParticles = async (
    text: string,
    config?: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> },
  ): Promise<Emitter> => {
    const { textConfig, ...imageConfig } = config ?? {};
    const textCanvas = createTextImage({ text, ...textConfig });
    return imageToParticles({
      ...imageConfig,
      image: canvasToDataURL(textCanvas),
    });
  };

  /** Toggle idle animations (breathing, wiggle, wave, pulse) on all particles with home positions. */
  const setIdleEffect = (enabled: boolean): void => {
    for (const particle of engine.getAllParticles()) {
      if (particle.homePosition) {
        particle.idleEnabled = enabled;
      }
    }
  };

  return { imageToParticles, textToParticles, setIdleEffect };
}
