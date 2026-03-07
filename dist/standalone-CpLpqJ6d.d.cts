import { CSSProperties } from 'react';

type EventHandler<T = unknown> = (args?: T) => boolean | void;
interface IEventDispatcher {
    addEventListener<T = unknown>(type: string, listener: EventHandler<T>): EventHandler<T>;
    removeEventListener<T = unknown>(type: string, listener: EventHandler<T>): void;
    removeAllEventListeners(type?: string): void;
    dispatchEvent<T = unknown>(type: string, args?: T): boolean;
    hasEventListener(type: string): boolean;
}
declare class EventDispatcher implements IEventDispatcher {
    private listeners;
    static bind(TargetClass: any): void;
    addEventListener<T = unknown>(type: string, listener: EventHandler<T>): EventHandler<T>;
    removeEventListener<T = unknown>(type: string, listener: EventHandler<T>): void;
    removeAllEventListeners(type?: string): void;
    dispatchEvent<T = unknown>(type: string, args?: T): boolean;
    hasEventListener(type: string): boolean;
}

declare class Vector {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    getMagnitude(): number;
    add(vector: {
        x: number;
        y: number;
    }, scale?: number): void;
    addFriction(friction: number, dt?: number): void;
    addGravity(gravity: number, dt?: number): void;
    subtract(vector: {
        x: number;
        y: number;
    }): void;
    normalize(): void;
    scale(scalar: number): void;
    getAngle(): number;
    static fromAngle(angle: number, magnitude: number): Vector;
}

type ParticleShape = 'circle' | 'rectangle' | 'square' | 'roundedRectangle' | 'triangle' | 'star' | 'ring' | 'sparkle';
type BlendMode = 'normal' | 'additive' | 'multiply' | 'screen';
interface ShapeConfig {
    shape?: ParticleShape;
    blendMode?: BlendMode;
    glow?: boolean;
    glowSize?: number;
    /** Glow color as hex string. Default '#ffffff'. */
    glowColor?: string;
    /** Glow opacity (0–1). Default 0.35. */
    glowAlpha?: number;
    trail?: boolean;
    trailLength?: number;
    trailFade?: number;
    trailShrink?: number;
    /** When true, tint image particles with particle color (WebGL). Default false = render images as-is. */
    imageTint?: boolean;
    /** Enable drop shadow. */
    shadow?: boolean;
    /** Shadow blur radius in pixels. Default 8. */
    shadowBlur?: number;
    /** Shadow horizontal offset in pixels. Default 4. */
    shadowOffsetX?: number;
    /** Shadow vertical offset in pixels. Default 4. */
    shadowOffsetY?: number;
    /** Shadow color as hex string. Default '#000000'. */
    shadowColor?: string;
    /** Shadow opacity (0–1). Default 0.5. */
    shadowAlpha?: number;
}
interface ParticularConfig {
    pixelRatio?: number;
    zIndex?: number;
    maxCount?: number;
    autoStart?: boolean;
    continuous?: boolean;
    /** WebGL: max particles per draw call (default 4096). Increase for fewer draw calls with many particles. */
    webglMaxInstances?: number;
}
interface ParticleConfig extends ShapeConfig {
    rate?: number;
    /** Emitter emission budget — total number of particles the emitter will create before stopping (burst mode only). */
    life?: number;
    /** Individual particle lifetime in ticks (~frames). Controls how long each particle lives before being removed.
     *  Fading begins at `particleLife - fadeTime` ticks. Default 100. */
    particleLife?: number;
    velocity?: Vector;
    spread?: number;
    sizeMin?: number;
    sizeMax?: number;
    velocityMultiplier?: number;
    fadeTime?: number;
    gravity?: number;
    scaleStep?: number;
    /** Width of the rectangular spawn area centered on the emitter point. Default 0 (point spawn). */
    spawnWidth?: number;
    /** Height of the rectangular spawn area centered on the emitter point. Default 0 (point spawn). */
    spawnHeight?: number;
    /** Color palette for particles. When provided, particles pick a random color from this array
     *  instead of using randomcolor(). Empty array = use randomcolor() fallback. */
    colors?: string[];
    /** Acceleration scale — multiplier on size-derived downward acceleration. Default 1. Set < 1 for slower fall, 0 to disable. */
    acceleration?: number;
    /** Friction scale — multiplier on size-derived air resistance. Default 1. Set < 1 for less drag, 0 to disable. */
    friction?: number;
}
interface EmitterConfiguration extends ParticleConfig {
    point: Vector;
    velocity: Vector;
    icons: (string | HTMLImageElement)[];
    rate: number;
    life: number;
    particleLife: number;
    spread: number;
    sizeMin: number;
    sizeMax: number;
    velocityMultiplier: number;
    gravity: number;
    scaleStep: number;
    fadeTime: number;
    spawnWidth: number;
    spawnHeight: number;
    colors: string[];
    acceleration: number;
    friction: number;
}
interface ParticleConstructorParams extends ShapeConfig {
    point?: Vector;
    velocity?: Vector;
    acceleration?: Vector;
    friction?: number;
    size?: number;
    particleLife: number;
    gravity: number;
    scaleStep: number;
    fadeTime: number;
    colors?: string[];
}
interface BurstSettings {
    clientX: number;
    clientY: number;
    icons?: (string | HTMLImageElement)[];
    [key: string]: unknown;
}
interface FullParticularConfig extends ParticularConfig, ParticleConfig {
    icons?: (string | HTMLImageElement)[];
    renderer?: RendererType;
}
interface AttractorConfig {
    x: number;
    y: number;
    strength?: number;
    radius?: number;
    visible?: boolean;
    icon?: string | HTMLImageElement;
    size?: number;
    color?: string;
    shape?: ParticleShape;
    glow?: boolean;
    glowSize?: number;
    glowColor?: string;
    glowAlpha?: number;
}
interface ForceSource {
    getForce(particlePosition: Vector): Vector;
}
interface MouseForceConfig {
    x?: number;
    y?: number;
    strength?: number;
    radius?: number;
    damping?: number;
    maxSpeed?: number;
    /** Falloff exponent controlling force locality. Default 1 (linear).
     *  < 1 = broad/wind-like (force stays strong far from mouse).
     *  = 1 = linear falloff (default).
     *  > 1 = sharp/localized (force concentrated near mouse). */
    falloff?: number;
    /** EventTarget to track mouse on. `true` = window. Omitted/`false` = manual. */
    track?: EventTarget | boolean;
}
type RendererType = 'canvas' | 'webgl';

interface TrailSegment {
    x: number;
    y: number;
    size: number;
    rotation: number;
    alpha: number;
    age: number;
}
declare class Particle {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    friction: number;
    rotation: number;
    rotationDirection: number;
    rotationVelocity: number;
    factoredSize: number;
    lifeTime: number;
    lifeTick: number;
    size: number;
    gravity: number;
    scaleStep: number;
    fadeTime: number;
    alpha: number;
    color: string;
    particular: Particular | null;
    image: string | HTMLImageElement | null;
    shape: ParticleShape;
    blendMode: BlendMode;
    glow: boolean;
    glowSize: number;
    glowColor: string;
    glowAlpha: number;
    trail: boolean;
    trailLength: number;
    trailFade: number;
    trailShrink: number;
    imageTint: boolean;
    shadow: boolean;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowColor: string;
    shadowAlpha: number;
    shadowLightOrigin: Vector;
    trailSegments: TrailSegment[];
    addEventListener: EventDispatcher['addEventListener'];
    removeEventListener: EventDispatcher['removeEventListener'];
    removeAllEventListeners: EventDispatcher['removeAllEventListeners'];
    dispatchEvent: EventDispatcher['dispatchEvent'];
    hasEventListener: EventDispatcher['hasEventListener'];
    constructor({ point, velocity, acceleration, friction, size, particleLife, gravity, scaleStep, fadeTime, shape, blendMode, glow, glowSize, glowColor, glowAlpha, trail, trailLength, trailFade, trailShrink, imageTint, shadow, shadowBlur, shadowOffsetX, shadowOffsetY, shadowColor, shadowAlpha, colors, }: ParticleConstructorParams);
    init(image: string | HTMLImageElement | null, particular: Particular): void;
    update(forces?: ForceSource[], dt?: number): void;
    advanceTrail(dt?: number): void;
    private updateTrail;
    resetImage(): void;
    getRoundedLocation(): [number, number];
    private dispatch;
    destroy(): void;
}

declare class Emitter {
    configuration: EmitterConfiguration;
    particles: Particle[];
    isEmitting: boolean;
    particular: Particular | null;
    lifeCycle: number;
    private emitAccumulator;
    constructor(configuration: EmitterConfiguration);
    emit(dt?: number): void;
    assignParticular(particular: Particular): void;
    update(boundsX: number, boundsY: number, forces?: ForceSource[], dt?: number): void;
    isAlive(): boolean;
    createParticle(): Particle;
    destroy(): void;
}

declare class Attractor {
    position: Vector;
    strength: number;
    radius: number;
    visible: boolean;
    icon: string | HTMLImageElement | null;
    size: number;
    color: string;
    shape: ParticleShape;
    glow: boolean;
    glowSize: number;
    glowColor: string;
    glowAlpha: number;
    private _resolvedImage;
    constructor(config: AttractorConfig);
    getForce(particlePosition: Vector): Vector;
    /** Returns a lightweight Particle-compatible object for use by renderers. */
    toDrawable(): Particle;
}

declare class MouseForce implements ForceSource {
    position: Vector;
    velocity: Vector;
    strength: number;
    radius: number;
    damping: number;
    maxSpeed: number;
    falloff: number;
    private _trackListener;
    private _trackTarget;
    private _pixelRatio;
    constructor(config?: MouseForceConfig);
    get isTracking(): boolean;
    startTracking(target: EventTarget, pixelRatio: number): void;
    stopTracking(): void;
    destroy(): void;
    updatePosition(x: number, y: number): void;
    decay(dt?: number): void;
    getForce(particlePosition: Vector): Vector;
}

interface Renderer {
    init(particular: Particular, pixelRatio: number): void;
    destroy(): void;
}
declare class Particular implements IEventDispatcher {
    static UPDATE: string;
    static UPDATE_AFTER: string;
    static RESIZE: string;
    isOn: boolean;
    emitters: Emitter[];
    attractors: Attractor[];
    mouseForces: MouseForce[];
    renderers: Renderer[];
    maxCount: number;
    width: number;
    height: number;
    pixelRatio: number;
    continuous: boolean;
    private animateRequest;
    private lastTimestamp;
    addEventListener: EventDispatcher['addEventListener'];
    removeEventListener: EventDispatcher['removeEventListener'];
    removeAllEventListeners: EventDispatcher['removeAllEventListeners'];
    dispatchEvent: EventDispatcher['dispatchEvent'];
    hasEventListener: EventDispatcher['hasEventListener'];
    initialize({ maxCount, continuous, pixelRatio, }: ParticularConfig): void;
    start(): void;
    stop(): void;
    onResize(): void;
    addRenderer(renderer: Renderer): void;
    addEmitter(emitter: Emitter): void;
    addAttractor(attractor: Attractor): void;
    removeAttractor(attractor: Attractor): void;
    addMouseForce(mouseForce: MouseForce): void;
    removeMouseForce(mouseForce: MouseForce): void;
    update: (timestamp?: DOMHighResTimeStamp) => void;
    updateEmitters(dt?: number): void;
    getCount(): number;
    getAllParticles(): Particle[];
    destroy(): void;
}

interface StrokeConfig {
    color: string;
    thickness: number;
}
declare class CanvasRenderer {
    target: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    name: string;
    particular: Particular | null;
    pixelRatio: number;
    stroke?: StrokeConfig;
    constructor(target: HTMLCanvasElement);
    init(particular: Particular, pixelRatio: number): void;
    resize: (args?: {
        width: number;
        height: number;
    }) => void;
    onUpdate: () => void;
    onUpdateAfter: () => void;
    onParticleCreated: () => void;
    onParticleUpdated: (particle?: Particle) => void;
    onParticleDead: (particle?: Particle) => void;
    drawImage(particle: Particle): void;
    drawBasicElement(particle: Particle): void;
    private drawTrails;
    private makeTrailGhost;
    private applyShadow;
    private setBlendMode;
    private drawCircle;
    private drawSquare;
    private drawRoundedRectangle;
    private drawTriangle;
    private drawStar;
    private drawRing;
    private drawSparkle;
    destroy(): void;
    remove(): void;
}

interface WebGLRendererOptions {
    /** Max particles per draw call (default 4096). Increase for fewer draw calls with many particles. */
    maxInstances?: number;
}
declare class WebGLRenderer {
    target: HTMLCanvasElement;
    gl: WebGL2RenderingContext | null;
    program: WebGLProgram | null;
    imageProgram: WebGLProgram | null;
    quadBuffer: WebGLBuffer | null;
    circleQuadBuffer: WebGLBuffer | null;
    instanceBuffer: WebGLBuffer | null;
    particular: Particular | null;
    pixelRatio: number;
    private instanceData;
    private maxInstances;
    private instanceStride;
    private resolutionUniform;
    private softnessUniform;
    private glowUniform;
    private glowSizeUniform;
    private glowColorUniform;
    private isShadowUniform;
    private shadowColorUniform;
    private shadowBlurUniform;
    private imageResolutionUniform;
    private imageTintUniform;
    private imageIsShadowUniform;
    private imageShadowColorUniform;
    private imageShadowBlurUniform;
    private textureCache;
    constructor(target: HTMLCanvasElement, options?: WebGLRendererOptions);
    init(particular: Particular, pixelRatio: number): void;
    private getOrCreateTexture;
    private compileShader;
    resize: (args?: {
        width: number;
        height: number;
    }) => void;
    onUpdate: () => void;
    private expandParticlesWithTrails;
    private buildBatches;
    private fillInstanceData;
    private drawCircleInstances;
    private drawCircleBatch;
    private drawImageInstances;
    private drawImageBatch;
    onUpdateAfter: () => void;
    destroy(): void;
    remove(): void;
}

declare const presetRegistry: {
    readonly confetti: {
        shape: "square";
        blendMode: "normal";
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly magic: {
        shape: "circle";
        blendMode: "normal";
        glow: false;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        colors: string[];
    };
    readonly fireworks: {
        shape: "circle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly images: {
        shape: "roundedRectangle";
        blendMode: "normal";
        imageTint: false;
        glow: false;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
    };
    readonly snow: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        shadow: false;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
};
declare const presets: {
    readonly Burst: {
        /** Polished confetti burst: playful, readable, and balanced */
        readonly confetti: {
            shape: "square";
            blendMode: "normal";
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            scaleStep: number;
            maxCount: number;
            colors: string[];
        };
        /** Signature magical burst: soft white glow + star silhouettes */
        readonly magic: {
            shape: "circle";
            blendMode: "normal";
            glow: false;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            scaleStep: number;
            maxCount: number;
            trail: true;
            trailLength: number;
            colors: string[];
        };
        /** Cinematic fireworks: energetic additive circles with bright bloom */
        readonly fireworks: {
            shape: "circle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            scaleStep: number;
            maxCount: number;
            colors: string[];
        };
    };
    readonly Images: {
        /** Tuned for icon/image particles (no tint by default). */
        readonly showcase: {
            shape: "roundedRectangle";
            blendMode: "normal";
            imageTint: false;
            glow: false;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            scaleStep: number;
            maxCount: number;
        };
    };
    readonly Ambient: {
        /** Gentle snowfall: soft white particles drifting downward across the viewport */
        readonly snow: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            shadow: false;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
    };
    readonly Colors: {
        /** White to offwhite range */
        readonly snow: {
            readonly colors: string[];
        };
        /** Full black-to-white range */
        readonly grayscale: {
            readonly colors: string[];
        };
        /** Single-hue cool blue range */
        readonly coolBlue: {
            readonly colors: string[];
        };
        /** Desaturated warm/cool mix */
        readonly muted: {
            readonly colors: string[];
        };
        /** Bold saturated blue */
        readonly blue: {
            readonly colors: string[];
        };
        /** Bold saturated orange */
        readonly orange: {
            readonly colors: string[];
        };
        /** Bold saturated green */
        readonly green: {
            readonly colors: string[];
        };
        /** Finnish flag blue and white */
        readonly finland: {
            readonly colors: string[];
        };
        /** American flag red, white, blue */
        readonly usa: {
            readonly colors: string[];
        };
    };
    readonly confetti: {
        shape: "square";
        blendMode: "normal";
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly magic: {
        shape: "circle";
        blendMode: "normal";
        glow: false;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        colors: string[];
    };
    readonly fireworks: {
        shape: "circle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly images: {
        shape: "roundedRectangle";
        blendMode: "normal";
        imageTint: false;
        glow: false;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
    };
    readonly snow: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        shadow: false;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
};
type PresetName = keyof typeof presetRegistry;

declare const DEFAULT_Z_INDEX = 10000;
/**
 * Recommended inline style for a full-viewport, click-through particle canvas
 * so particles render on top of the page without blocking clicks or other interaction.
 * Use with useParticles (spread as canvasStyle) or with a vanilla canvas element.
 */
declare const particlesBackgroundLayerStyle: CSSProperties;
declare function getParticlesBackgroundLayerStyle(zIndex?: number): CSSProperties;

interface BurstOptions extends Partial<FullParticularConfig> {
    x: number;
    y: number;
}
interface CreateParticlesOptions {
    canvas: HTMLCanvasElement;
    preset?: PresetName;
    config?: Partial<FullParticularConfig>;
    renderer?: RendererType;
    autoResize?: boolean;
    autoClick?: boolean;
    clickTarget?: EventTarget;
}
interface ParticlesController {
    engine: Particular;
    burst: (options: BurstOptions) => Emitter;
    addAttractor: (config: AttractorConfig) => Attractor;
    removeAttractor: (attractor: Attractor) => void;
    addRandomAttractors: (count: number, config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>) => Attractor[];
    removeAllAttractors: () => void;
    addMouseForce: (config?: MouseForceConfig) => MouseForce;
    removeMouseForce: (mouseForce: MouseForce) => void;
    attachClickBurst: (target?: EventTarget, overrides?: Partial<FullParticularConfig>) => () => void;
    destroy: () => void;
}
/**
 * One-call setup for standalone sites.
 * Uses a premium default preset and returns a small controller API.
 */
declare function createParticles({ canvas, preset, config, renderer, autoResize, autoClick, clickTarget, }: CreateParticlesOptions): ParticlesController;
interface ScreensaverOptions {
    canvas: HTMLCanvasElement;
    preset?: PresetName;
    config?: Partial<FullParticularConfig>;
    renderer?: RendererType;
    autoResize?: boolean;
    /** Mouse wind configuration. Pass `false` to disable entirely. */
    mouseWind?: MouseForceConfig | false;
}
interface ScreensaverController {
    engine: Particular;
    controller: ParticlesController;
    destroy: () => void;
}
/**
 * One-call screensaver setup: spawns particles across the full viewport width.
 * Defaults to the `snow` preset with continuous emission.
 */
declare function startScreensaver({ canvas, preset, config, renderer, autoResize, mouseWind: mouseWindOption, }: ScreensaverOptions): ScreensaverController;

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

export { Attractor as A, type BurstSettings as B, CanvasRenderer as C, DEFAULT_Z_INDEX as D, Emitter as E, type FullParticularConfig as F, type MouseForceConfig as M, type ParticularConfig as P, type RendererType as R, type ScreensaverController as S, Vector as V, WebGLRenderer as W, type ParticleConfig as a, Particular as b, type PresetName as c, type ParticlesController as d, type BurstOptions as e, type AttractorConfig as f, type BlendMode as g, type CreateParticlesOptions as h, type EmitterConfiguration as i, type FPSOverlayController as j, type FPSOverlayOptions as k, type ForceSource as l, MouseForce as m, Particle as n, type ParticleConstructorParams as o, type ParticleShape as p, type ScreensaverOptions as q, type ShapeConfig as r, type WebGLRendererOptions as s, createParticles as t, getParticlesBackgroundLayerStyle as u, particlesBackgroundLayerStyle as v, presets as w, showFPSOverlay as x, startScreensaver as y };
