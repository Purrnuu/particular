import { T as TextImageConfig } from './particular-D4GlsUaf.cjs';
import './renderers/canvas.cjs';
import './renderers/webgl.cjs';
import './renderers/webgl3d.cjs';
import './camera-DkBD-jlm.cjs';
import { c as CreateParticlesOptions, P as ParticlesController, e as ScreensaverOptions, S as ScreensaverController } from './types-CJBUr96G.cjs';
import './defaults-Df9Z7SYm.cjs';

/**
 * High-level convenience API for the particle engine.
 *
 * `createParticles()` initializes the engine and returns a controller
 * with methods organized by concern:
 *   - Emission: burst, attachClickBurst
 *   - Forces:   addAttractor, addMouseForce, addBoundary, …
 *   - Effects:  explode, scatter, startWobble, stopWobble
 *   - Image:    imageToParticles, textToParticles, elementToParticles
 *
 * Each group is implemented in its own module (forces.ts, boundary.ts,
 * effects.ts, imageParticles.ts) for readability and maintainability.
 */

/**
 * One-call setup for standalone sites.
 * Returns a controller with burst, forces, effects, and image-to-particles APIs.
 */
declare function createParticles({ canvas: userCanvas, preset, config, renderer, autoResize, autoClick, clickTarget, container, mouseForce, }?: CreateParticlesOptions): ParticlesController;

/**
 * One-call screensaver setup: spawns particles across the full viewport width.
 * Defaults to the `snow` preset with continuous emission.
 */
declare function startScreensaver({ canvas, preset, config, renderer, autoResize, mouseWind: mouseWindOption, container, }?: ScreensaverOptions): ScreensaverController;

/**
 * Render a text string to an offscreen canvas.
 * Returns a canvas that can be converted to a data URL for imageToParticles().
 */
declare function createTextImage(config: TextImageConfig): HTMLCanvasElement;
/**
 * Render a plush heart shape to an offscreen canvas.
 * Uses parametric curve for guaranteed fat, symmetrical lobes.
 * Layered radial gradients for depth, rim light, and specular highlights.
 */
declare function createHeartImage(size?: number): HTMLCanvasElement;
/**
 * Convert a canvas element to a data URL for use as an image source.
 */
declare function canvasToDataURL(canvas: HTMLCanvasElement): string;

/**
 * Development aid: shows a small on-screen FPS (and optional particle count)
 * to help debug effect density and rendering performance.
 *
 * Usage:
 *   const { destroy } = showFPSOverlay({
 *     getParticleCount: () => controller.engine.getCount(),
 *   });
 *   // later: destroy();
 */
interface FPSOverlayOptions {
    /** Parent element; defaults to document.body */
    container?: HTMLElement;
    /** Called each frame to show particle count (e.g. () => engine.getCount()) */
    getParticleCount?: () => number;
    /** Number of frame-time samples for smoothing (default 20) */
    smoothing?: number;
}
interface FPSOverlayController {
    destroy: () => void;
}
declare function showFPSOverlay(options?: FPSOverlayOptions): FPSOverlayController;

export { type FPSOverlayController as F, type FPSOverlayOptions as a, createHeartImage as b, canvasToDataURL as c, createParticles as d, createTextImage as e, startScreensaver as f, showFPSOverlay as s };
