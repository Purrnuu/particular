import { I as ImageParticlesConfig, e as Emitter, T as TextImageConfig, E as ElementParticlesConfig, l as ImageShatterConfig } from '../particular-D4GlsUaf.cjs';
import { FeatureContext } from '../core.cjs';
import '../defaults-Df9Z7SYm.cjs';

/**
 * Create imageToParticles() and textToParticles() helpers bound to an engine instance.
 *
 * Samples an image (or rendered text) into a grid of colored particles with
 * spring-return home positions and idle animations.
 */
declare function createImageParticles({ engine, config: mergedConfig, container, resources, coordinates, }: FeatureContext): {
    imageToParticles: (config: ImageParticlesConfig) => Promise<Emitter>;
    textToParticles: (text: string, config?: Omit<ImageParticlesConfig, "image"> & {
        textConfig?: Omit<TextImageConfig, "text">;
    }) => Promise<Emitter>;
    elementToParticles: (element: HTMLElement, config?: ElementParticlesConfig) => Promise<Emitter>;
    setIdleEffect: (enabled: boolean) => void;
};

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

declare function createImageShatterHelper({ engine, config: mergedConfig, container, resources, coordinates, }: FeatureContext): {
    shatterImage: (config: ImageShatterConfig) => Promise<Emitter>;
    shatterText: (text: string, config?: Omit<ImageShatterConfig, "image"> & {
        textConfig?: Omit<TextImageConfig, "text">;
    }) => Promise<Emitter>;
};

export { ElementParticlesConfig, ImageParticlesConfig, ImageShatterConfig, TextImageConfig, createImageParticles, createImageShatterHelper };
