import Emitter from '../components/emitter';
import Particle from '../components/particle';
import type Particular from '../core/particular';
import { configureParticle, defaultImageParticles, type MergedConfig } from '../core/defaults';
import Vector from '../utils/vector';
import { loadImage, sampleImagePixels } from '../utils/pixelSampler';
import { createTextImage, canvasToDataURL } from '../utils/imageSource';
import type { ImageParticlesConfig, TextImageConfig } from '../types';

/**
 * Create imageToParticles() and textToParticles() helpers bound to an engine instance.
 *
 * Samples an image (or rendered text) into a grid of colored particles with
 * spring-return home positions and idle animations.
 */
export function createImageParticles(engine: Particular, mergedConfig: MergedConfig, container?: HTMLElement) {
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

    const samples = sampleImagePixels(image, resolution, alphaThreshold);

    // Calculate particle size from grid spacing.
    // Circles/triangles need larger size to avoid gaps; squares tile perfectly.
    const gridCols = aspect >= 1 ? resolution : Math.max(1, Math.round(resolution * aspect));
    const spacing = engineW / gridCols;
    const sizeScale = shape === 'square' ? 0.55 : 0.7;
    const size = sizeOverride != null ? sizeOverride / pr : spacing * sizeScale;
    const scaleStep = scaleStepOverride ?? size; // instant full size

    // Ensure maxCount can hold all particles
    const needed = samples.length;
    if (engine.maxCount < engine.getCount() + needed) {
      engine.maxCount = engine.getCount() + needed;
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

    const imageCenter = new Vector(centerX, centerY);

    for (const sample of samples) {
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
        scaleStep,
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

      // Triangle tessellation: alternate up/down based on grid parity
      if (shape === 'triangle' && (sample.gridX + sample.gridY) % 2 === 1) {
        particle.rotation = 180;
      }

      particle.init(null, engine);
      collector.particles.push(particle);
    }

    engine.addEmitter(collector);
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

  return { imageToParticles, textToParticles };
}
