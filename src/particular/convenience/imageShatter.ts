/**
 * Image shatter — cut an image into irregular polygon chunks and
 * explode them outward like shattered glass.
 *
 * Uses the jittered-grid chunker utility to produce polygon pieces,
 * then creates one particle per chunk with outward velocity, rotation,
 * and gravity for a dramatic glass-break effect.
 *
 * When `homeConfig` is provided, chunks get spring-return home positions
 * (interactive mode). Use scatter() to push them outward; the spring
 * system automatically pulls them back and dampens rotation.
 */

import Emitter from '../components/emitter';
import Particle from '../components/particle';
import type { FeatureContext } from './context';
import { configureParticle, defaultImageShatter } from '../core/defaults';
import Vector from '../utils/vector';
import { loadImage } from '../utils/pixelSampler';
import { createTextImage, canvasToDataURL } from '../utils/imageSource';
import { generateImageChunks } from '../utils/imageChunker';
import { getViewportSize } from './resize';
import type { ImageShatterConfig, TextImageConfig } from '../types';

export function createImageShatterHelper({
  engine,
  config: mergedConfig,
  container,
  resources,
  coordinates,
}: FeatureContext) {
  const shatterImage = async (config: ImageShatterConfig): Promise<Emitter> => {
    resources.assertActive();
    const resolved = { ...defaultImageShatter, ...config };
    const {
      image: imageSrc,
      chunkCount,
      jitter,
      velocity,
      velocitySpread,
      gravity,
      rotationSpeed,
      particleLife,
      fadeTime,
      friction,
      scaleStep,
      homeConfig,
    } = resolved;

    const interactive = !!homeConfig;

    // Load image
    let image: HTMLImageElement;
    try {
      image = await loadImage(imageSrc, resources.signal);
    } catch (err) {
      if (!resources.disposed)
        console.warn(
          'Particular: shatterImage failed to load image.',
          typeof imageSrc === 'string' ? imageSrc : '(HTMLImageElement)',
          err
        );
      throw err;
    }
    resources.assertActive();
    const aspect = image.naturalWidth / image.naturalHeight;

    // Smart defaults for position and size
    const viewport = getViewportSize(container);
    const x = config.x ?? viewport.w / 2;
    const y = config.y ?? viewport.h / 2;

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
      // Default: 1:1 with original image, capped at 50% of viewport for comfortable display
      displayW = Math.min(image.naturalWidth, viewport.w * 0.5);
      displayH = displayW / aspect;
      if (displayH > viewport.h * 0.5) {
        displayH = viewport.h * 0.5;
        displayW = displayH * aspect;
      }
    }

    // Convert to engine coordinates
    const pr = mergedConfig.pixelRatio;
    const engineW = displayW / pr;
    const engineH = displayH / pr;
    const { x: centerX, y: centerY } = coordinates.localToEngine(x, y);

    // Draw image to an offscreen canvas at display resolution for chunking
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = Math.round(displayW);
    sourceCanvas.height = Math.round(displayH);
    const sourceCtx = sourceCanvas.getContext('2d')!;
    sourceCtx.drawImage(image, 0, 0, sourceCanvas.width, sourceCanvas.height);

    // Generate irregular polygon chunks
    const chunks = await resources.waitFor(generateImageChunks(sourceCanvas, chunkCount, jitter));
    resources.assertActive();

    // Ensure maxCount can hold all chunks
    if (resolved.expandBudget && engine.maxCount < engine.getCount() + chunks.length) {
      engine.maxCount = engine.getCount() + chunks.length;
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
    engine.addEmitter(collector);

    const imageCenter = new Vector(centerX, centerY);

    for (const chunk of chunks) {
      resources.assertActive();
      if (engine.getCount() >= engine.maxCount) break;
      // Chunk position in engine coords
      const px = centerX - engineW / 2 + chunk.cx * engineW;
      const py = centerY - engineH / 2 + chunk.cy * engineH;

      // Engine-scale size for this chunk
      const chunkSize = ((chunk.size / sourceCanvas.width) * engineW) / 2;

      if (interactive) {
        // Interactive mode: chunks start assembled at home, no velocity
        const homePos = new Vector(px, py);

        const particle = Particle.create({
          point: new Vector(px, py),
          velocity: new Vector(0, 0),
          acceleration: new Vector(0, 0),
          friction: friction,
          size: chunkSize,
          particleLife: Infinity,
          gravity: 0,
          scaleStep: chunkSize, // instant full size
          fadeTime: 1,
          colors: [],
          color: '#ffffff',
          shape: 'square',
          homePosition: homePos,
          homeCenter: imageCenter,
          homeConfig,
        });

        particle.init(chunk.image, engine);
        if (resources.disposed) {
          particle.destroy();
          resources.assertActive();
        }
        collector.particles.push(particle);
      } else {
        // Destructive mode: chunks explode outward with rotation
        const dx = px - centerX;
        const dy = py - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const angle = Math.atan2(dy, dx);
        const spreadAngle = angle + (Math.random() - 0.5) * 0.6;
        const speedMul = 1 + (Math.random() - 0.5) * 2 * velocitySpread;
        const distFactor = 0.5 + (dist / Math.max(engineW, engineH)) * 1.5;
        const speed = velocity * speedMul * distFactor;

        const particle = Particle.create({
          point: new Vector(px, py),
          velocity: new Vector(Math.cos(spreadAngle) * speed, Math.sin(spreadAngle) * speed),
          acceleration: new Vector(0, 0),
          friction,
          size: chunkSize,
          particleLife,
          gravity,
          scaleStep,
          fadeTime,
          colors: [],
          color: '#ffffff',
          shape: 'square',
        });

        particle.rotationVelocity = (Math.random() - 0.5) * 2 * rotationSpeed;
        particle.init(chunk.image, engine);
        if (resources.disposed) {
          particle.destroy();
          resources.assertActive();
        }
        collector.particles.push(particle);
      }
    }

    engine.addEmitter(collector);
    return collector;
  };

  const shatterText = async (
    text: string,
    config?: Omit<ImageShatterConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> }
  ): Promise<Emitter> => {
    resources.assertActive();
    const { textConfig, ...shatterConfig } = config ?? {};
    const textCanvas = createTextImage({ text, ...textConfig });
    return shatterImage({
      ...shatterConfig,
      image: canvasToDataURL(textCanvas),
    });
  };

  return { shatterImage, shatterText };
}
