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
    /** Container element for container-aware mode. When set, the canvas sizes to the container
     *  and coordinates are relative to the container instead of the viewport.
     *  Omit for full-viewport overlay mode (default). */
    container?: HTMLElement;
}
/** Base options shared by both manual explode() and timed detonation. */
interface ChildExplosionConfig {
    /** Children per parent particle. Default 5. */
    childCount?: number;
    /** Child lifetime in ticks. Default 40. */
    childLife?: number;
    /** Minimum child size. Default 2. */
    sizeMin?: number;
    /** Maximum child size. Default 5. */
    sizeMax?: number;
    /** Outward velocity magnitude. Default 3. */
    velocity?: number;
    /** Velocity spread (0–1). Randomizes speed: velocity × (1 ± spread). Default 0.4. */
    velocitySpread?: number;
    /** Friction applied to child particles. Default 0.01. */
    friction?: number;
    /** Scale step — how quickly children grow to full size. Lower = slower grow-in. Default 1.5. */
    scaleStep?: number;
    /** Child gravity. Default 0.12. */
    gravity?: number;
    /** Child fade time in ticks. Default 15. */
    fadeTime?: number;
    /** Inherit parent color. Default true. */
    inheritColor?: boolean;
    /** Override child shape (default: inherit parent). */
    shape?: ParticleShape;
    /** Override child blend mode (default: inherit parent). */
    blendMode?: BlendMode;
    glow?: boolean;
    glowSize?: number;
    glowColor?: string;
    glowAlpha?: number;
    shadow?: boolean;
    trail?: boolean;
    trailLength?: number;
    trailFade?: number;
    trailShrink?: number;
}
/** Options for manual controller.explode(). */
interface ExplodeOptions extends ChildExplosionConfig {
    /** Destroy parent particles after explosion. Default true. */
    destroyParents?: boolean;
}
/** Config for timed auto-detonation of particles. */
interface DetonateConfig extends ChildExplosionConfig {
    /** Lifetime fraction (0–1) at which particles auto-explode. */
    at: number;
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
    /** Color palette for particles. When provided, particles pick a random color from this array.
     *  Empty array = emitter generates a harmonious HSL palette automatically. */
    colors?: string[];
    /** Direct downward acceleration coefficient (size-independent). Default 0. */
    acceleration?: number;
    /** Size-coupled downward acceleration coefficient — multiplied by particle size. Default 0.01. */
    accelerationSize?: number;
    /** Direct friction/air-resistance coefficient (size-independent). Default 0. */
    friction?: number;
    /** Size-coupled friction coefficient — multiplied by particle size. Default 0.0005. */
    frictionSize?: number;
    /** Timed detonation config — particles auto-explode into sub-bursts at a lifetime fraction. */
    detonate?: DetonateConfig;
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
    accelerationSize: number;
    friction: number;
    frictionSize: number;
}
/** Configuration for home-position spring return and idle animation. */
interface HomePositionConfig {
    /** Spring stiffness — how strongly particles are pulled back to home. Default 0.02. */
    springStrength?: number;
    /** Spring damping — velocity decay when spring is active (0–1). Applied as Math.pow(damping, dt). Default 0.92. */
    springDamping?: number;
    /** Distance threshold (engine units) below which idle animation engages. Default 2. */
    homeThreshold?: number;
    /** Velocity threshold — idle animation only engages when speed is also below this. Default 0.5.
     *  Prevents idle snap from eating external forces (scatter, mouse). */
    velocityThreshold?: number;
    /** Per-particle random scale pulsing amplitude (fractional, 0–1). 0 = off. Default 0.
     *  e.g. 0.2 = particles randomly pulse ±20% of their size. */
    wiggleAmplitude?: number;
    /** Wiggle angular speed (radians per tick). Default 0.05. */
    wiggleSpeed?: number;
    /** Breathing size oscillation amplitude (fractional, 0–1). 0 = off. Default 0.
     *  Additive with wave/wiggle. e.g. 0.1 = ±10% size oscillation. */
    breathingAmplitude?: number;
    /** Breathing angular speed. Default 0.03. */
    breathingSpeed?: number;
    /** Coordinated scale wave amplitude (fractional, 0–1). 0 = off. Default 0.
     *  When > 0, a size oscillation sweeps across the image based on particle position. */
    waveAmplitude?: number;
    /** Wave temporal speed (radians per tick). Default 0.03. */
    waveSpeed?: number;
    /** Wave spatial frequency — how many wave cycles fit across the image. Default 0.15. */
    waveFrequency?: number;
    /** Random velocity perturbation during spring return (engine units per tick). Adds organic wobble
     *  so particles don't travel in straight lines back to home. Default 0.15. 0 = straight-line return. */
    returnNoise?: number;
    /** Idle pulse: velocity magnitude of random twitches when settled. 0 = off. Default 2.
     *  Particles periodically receive a small impulse and spring back, keeping the image alive. */
    idlePulseStrength?: number;
    /** Minimum ticks between idle pulse waves. Default 300 (~5 sec at 60fps). */
    idlePulseIntervalMin?: number;
    /** Maximum ticks between idle pulse waves. Default 1800 (~30 sec at 60fps). */
    idlePulseIntervalMax?: number;
}
/** Configuration for generating an image from text. */
interface TextImageConfig {
    /** The text string to render. */
    text: string;
    /** Font size in pixels. Default 200. */
    fontSize?: number;
    /** CSS font family. Default 'system-ui, -apple-system, sans-serif'. */
    fontFamily?: string;
    /** Font weight. Default 'bold'. */
    fontWeight?: string;
    /** Fill color string, or gradient stops array. Default: rainbow gradient. */
    fill?: string | {
        offset: number;
        color: string;
    }[];
}
interface ParticleConstructorParams extends ShapeConfig {
    /** Explicit color for this particle. Overrides random selection from `colors` array. */
    color?: string;
    /** Base alpha multiplier (0–1). Applied on top of lifetime fade. Used for anti-aliased edges from source images. Default 1. */
    baseAlpha?: number;
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
    /** Home position — when set, particle experiences spring return force and idle animation. */
    homePosition?: Vector;
    /** Center of the image (engine coords). Used to compute ripple delay for idle wave pulses. */
    homeCenter?: Vector;
    /** Home position spring + idle animation config. */
    homeConfig?: HomePositionConfig;
}
type IntroMode = 'scatter' | 'scaleIn' | 'ripple' | 'paint';
/** Configuration for intro animation when creating image/text particles. */
interface IntroConfig {
    /** Animation mode. Default 'scatter'.
     *  - 'scatter': particles start at random positions and spring to home while scaling in.
     *  - 'scaleIn': particles fly outward from image center — outer edges form first, filling inward.
     *  - 'ripple': shockwave from center — particles appear and get pushed outward, overshoot, spring back.
     *  - 'paint': particles spray from bottom center, staggered left-to-right, painting the image. */
    mode?: IntroMode;
    /** Total intro duration in ms (controls stagger for scaleIn/ripple, grow speed for scatter). Default 800. */
    duration?: number;
}
/** Configuration for mapping an image into a grid of colored particles. */
interface ImageParticlesConfig extends ShapeConfig {
    /** Image source — URL string or HTMLImageElement. */
    image: string | HTMLImageElement;
    /** X center position in screen pixels. Default: center of container/viewport. */
    x?: number;
    /** Y center position in screen pixels. Default: center of container/viewport. */
    y?: number;
    /** Display width in screen pixels. Calculated from height + aspect ratio if omitted. Default: 80% of container/viewport width (max 800px). */
    width?: number;
    /** Display height in screen pixels. Calculated from width + aspect ratio if omitted. Defaults to image natural height. */
    height?: number;
    /** Number of particles along the longest image axis. Default depends on shape: 400 for squares, 200 for circles/triangles. */
    resolution?: number;
    /** Skip pixels with alpha below this threshold (0–1). Default 0.1. */
    alphaThreshold?: number;
    /** Override particle size. Auto-calculated from grid spacing if omitted (≈1px for high-fidelity). */
    particleSize?: number;
    /** Individual particle lifetime in ticks. Default 99999 (effectively permanent). */
    particleLife?: number;
    /** Gravity applied to particles. Default 0 (static). */
    gravity?: number;
    /** Fade time in ticks. Default 40. */
    fadeTime?: number;
    /** Scale step — how quickly particles grow to full size. Default: instant (equal to size). */
    scaleStep?: number;
    /** Home position spring + idle animation config. Applied to all generated particles. */
    homeConfig?: HomePositionConfig;
    /** Intro animation — particles animate in rather than appearing instantly. See IntroConfig. */
    intro?: IntroConfig;
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
/** Configuration for an element-based repulsion boundary. */
interface BoundaryConfig {
    /** The HTML element to create a repulsion boundary around. */
    element: HTMLElement;
    /** Repulsion strength (negative = repel). Default -1.5. */
    strength?: number;
    /** Repulsion radius in engine units — how far from the edge particles are pushed. Default 10. */
    radius?: number;
    /** Inset fraction (0–1) — moves repulsors inside the element edge so the
     *  repulsion boundary aligns with the visible edge. Default 0.4. */
    inset?: number;
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
    isDetonationChild: boolean;
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
    homePosition: Vector | null;
    homeConfig: Required<HomePositionConfig> | null;
    /** When false, idle animations (breathing, wiggle, wave, pulse) are suppressed. Spring return still works. */
    idleEnabled: boolean;
    private breathingPhase;
    /** Per-particle spring multiplier (0.6–1.4) — breaks sync so particles return at different rates. */
    private springMultiplier;
    /** Monotonic tick counter for coordinated idle wave (never resets). */
    private idleTicks;
    /** How many pulse cycles this particle has completed. */
    private pulseCycleCount;
    /** Tick at which the next pulse wave starts (computed deterministically so all particles agree). */
    private nextPulseAt;
    /** Distance from image center (set once in constructor, used for ripple delay). */
    private homeDistFromCenter;
    /** Angle from image center to this particle's home (radians). Used for outward ripple direction. */
    private homeAngleFromCenter;
    addEventListener: EventDispatcher['addEventListener'];
    removeEventListener: EventDispatcher['removeEventListener'];
    removeAllEventListeners: EventDispatcher['removeAllEventListeners'];
    dispatchEvent: EventDispatcher['dispatchEvent'];
    hasEventListener: EventDispatcher['hasEventListener'];
    /** Permanent alpha multiplier from source image (anti-aliased edges). */
    baseAlpha: number;
    constructor({ color, baseAlpha, point, velocity, acceleration, friction, size, particleLife, gravity, scaleStep, fadeTime, shape, blendMode, glow, glowSize, glowColor, glowAlpha, trail, trailLength, trailFade, trailShrink, imageTint, shadow, shadowBlur, shadowOffsetX, shadowOffsetY, shadowColor, shadowAlpha, colors, homePosition, homeCenter, homeConfig, }: ParticleConstructorParams);
    init(image: string | HTMLImageElement | null, particular: Particular): void;
    update(forces?: ForceSource[], dt?: number): void;
    advanceTrail(dt?: number): void;
    private updateTrail;
    resetImage(): void;
    getRoundedLocation(): [number, number];
    /** Deterministic pseudo-random interval from cycle number — same output for all particles in the same cycle. */
    private static deterministicInterval;
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
    private _container;
    constructor(config?: MouseForceConfig);
    get isTracking(): boolean;
    startTracking(target: EventTarget, pixelRatio: number, container?: HTMLElement | null): void;
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
    container: HTMLElement | null;
    private animateRequest;
    private lastTimestamp;
    addEventListener: EventDispatcher['addEventListener'];
    removeEventListener: EventDispatcher['removeEventListener'];
    removeAllEventListeners: EventDispatcher['removeAllEventListeners'];
    dispatchEvent: EventDispatcher['dispatchEvent'];
    hasEventListener: EventDispatcher['hasEventListener'];
    initialize({ maxCount, continuous, pixelRatio, container, }: ParticularConfig): void;
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
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworksDetonation: {
        shape: "circle";
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
        particleLife: number;
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
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
    readonly imageText: {
        shape: "square";
        blendMode: "normal";
        shadow: false;
        glow: false;
        maxCount: number;
    };
    readonly imageShape: {
        shape: "circle";
        blendMode: "normal";
        shadow: false;
        glow: true;
        glowSize: number;
        glowAlpha: number;
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
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly meteors: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        shadow: false;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
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
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
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
        /** Cinematic fireworks: energetic circles with bright bloom */
        readonly fireworks: {
            shape: "circle";
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
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            colors: string[];
        };
        /** Fireworks with timed detonation: narrow upward launch that auto-explodes into colorful sub-bursts */
        readonly fireworksDetonation: {
            shape: "circle";
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
            particleLife: number;
            detonate: {
                at: number;
                childCount: number;
                velocity: number;
                velocitySpread: number;
                friction: number;
                scaleStep: number;
                childLife: number;
                sizeMin: number;
                sizeMax: number;
                fadeTime: number;
                inheritColor: true;
                trail: true;
                trailLength: number;
                trailFade: number;
                trailShrink: number;
            };
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
    readonly ImageParticles: {
        /** High-fidelity text rendered as tiny particles with spring return. */
        readonly text: {
            shape: "square";
            blendMode: "normal";
            shadow: false;
            glow: false;
            maxCount: number;
        };
        /** Shape/icon rendered as particles with soft glow. */
        readonly shape: {
            shape: "circle";
            blendMode: "normal";
            shadow: false;
            glow: true;
            glowSize: number;
            glowAlpha: number;
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
            acceleration: number;
            accelerationSize: number;
            friction: number;
            frictionSize: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
        /** Meteors: bright diagonal streaks with glowing trails, accelerating as they fall */
        readonly meteors: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            shadow: false;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
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
            acceleration: number;
            accelerationSize: number;
            friction: number;
            frictionSize: number;
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
        /** White-hot to deep red meteor palette */
        readonly meteor: {
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
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworksDetonation: {
        shape: "circle";
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
        particleLife: number;
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
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
    readonly imageText: {
        shape: "square";
        blendMode: "normal";
        shadow: false;
        glow: false;
        maxCount: number;
    };
    readonly imageShape: {
        shape: "circle";
        blendMode: "normal";
        shadow: false;
        glow: true;
        glowSize: number;
        glowAlpha: number;
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
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly meteors: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        shadow: false;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
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
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
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
/**
 * Style for a container-aware particle canvas.
 * The canvas fills its parent container using absolute positioning.
 * The parent element must have `position: relative` (or absolute/fixed).
 */
declare const particlesContainerLayerStyle: CSSProperties;
declare function getParticlesContainerLayerStyle(zIndex?: number): CSSProperties;

/**
 * Imperatively apply positioning styles to a canvas element.
 * Used by createParticles() / startScreensaver() for auto-created canvases
 * so users don't need to set any styles manually.
 */
declare function applyCanvasStyles(canvas: HTMLCanvasElement, container?: HTMLElement, zIndex?: number): void;

interface BurstOptions extends Partial<FullParticularConfig> {
    x: number;
    y: number;
}
interface CreateParticlesOptions {
    /** Canvas element. If omitted, one is auto-created and appended to `container` or `document.body`. */
    canvas?: HTMLCanvasElement;
    preset?: PresetName;
    config?: Partial<FullParticularConfig>;
    /** Rendering backend. Default `'webgl'`. */
    renderer?: RendererType;
    autoResize?: boolean;
    autoClick?: boolean;
    clickTarget?: EventTarget;
    /** Container element for container-aware mode. Canvas sizes to this element
     *  and all coordinates become container-relative. Omit for full-viewport mode. */
    container?: HTMLElement;
    /** Add a mouse-tracking force. `true` uses sensible defaults, or pass a config object. */
    mouseForce?: boolean | MouseForceConfig;
}
/** Handle returned by addBoundary(). */
interface BoundaryHandle {
    /** Re-sync repulsors to the element's current position/size. Called automatically on resize. */
    update: () => void;
    /** Remove this boundary and its repulsors. */
    destroy: () => void;
}
interface ParticlesController {
    engine: Particular;
    /** The canvas element used by this controller (may have been auto-created). */
    canvas: HTMLCanvasElement;
    burst: (options: BurstOptions) => Emitter;
    attachClickBurst: (target?: EventTarget, overrides?: Partial<FullParticularConfig>) => () => void;
    addAttractor: (config: AttractorConfig) => Attractor;
    removeAttractor: (attractor: Attractor) => void;
    addRandomAttractors: (count: number, config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>) => Attractor[];
    removeAllAttractors: () => void;
    addMouseForce: (config?: MouseForceConfig) => MouseForce;
    removeMouseForce: (mouseForce: MouseForce) => void;
    /** Create a repulsion boundary around an HTML element. Particles are pushed away from its edges.
     *  The boundary auto-syncs when the element resizes or scrolls. Returns a handle to update or remove it. */
    addBoundary: (config: BoundaryConfig) => BoundaryHandle;
    explode: (options?: ExplodeOptions) => void;
    /** Scatter all particles with a random impulse. Particles with home positions spring back. */
    scatter: (options?: {
        velocity?: number;
    }) => void;
    imageToParticles: (config: ImageParticlesConfig) => Promise<Emitter>;
    textToParticles: (text: string, config?: Omit<ImageParticlesConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => Promise<Emitter>;
    /** Toggle idle animations (breathing, wiggle, wave, pulse) on all particles with home positions.
     *  Spring return still works when idle is disabled — particles return home but stay still once there. */
    setIdleEffect: (enabled: boolean) => void;
    destroy: () => void;
}
interface ScreensaverOptions {
    /** Canvas element. If omitted, one is auto-created and appended to `container` or `document.body`. */
    canvas?: HTMLCanvasElement;
    preset?: PresetName;
    config?: Partial<FullParticularConfig>;
    /** Rendering backend. Default `'webgl'`. */
    renderer?: RendererType;
    autoResize?: boolean;
    /** Mouse wind configuration. Pass `false` to disable entirely. */
    mouseWind?: MouseForceConfig | false;
    /** Container element for container-aware mode. Omit for full-viewport mode. */
    container?: HTMLElement;
}
interface ScreensaverController {
    engine: Particular;
    controller: ParticlesController;
    destroy: () => void;
}

/**
 * High-level convenience API for the particle engine.
 *
 * `createParticles()` initializes the engine and returns a controller
 * with methods organized by concern:
 *   - Emission: burst, attachClickBurst
 *   - Forces:   addAttractor, addMouseForce, addBoundary, …
 *   - Effects:  explode, scatter
 *   - Image:    imageToParticles, textToParticles
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
declare function startScreensaver({ canvas, preset, config, renderer, autoResize, mouseWind: mouseWindOption, container, }: ScreensaverOptions): ScreensaverController;

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

export { Attractor as A, type BurstSettings as B, CanvasRenderer as C, type DetonateConfig as D, type ExplodeOptions as E, type FullParticularConfig as F, canvasToDataURL as G, type HomePositionConfig as H, type ImageParticlesConfig as I, createHeartImage as J, createParticles as K, createTextImage as L, type MouseForceConfig as M, getParticlesBackgroundLayerStyle as N, getParticlesContainerLayerStyle as O, type ParticularConfig as P, particlesBackgroundLayerStyle as Q, type RendererType as R, type ScreensaverController as S, type TextImageConfig as T, particlesContainerLayerStyle as U, Vector as V, WebGLRenderer as W, DEFAULT_Z_INDEX as X, presets as Y, showFPSOverlay as Z, startScreensaver as _, type ParticleConfig as a, Particular as b, type PresetName as c, type ParticlesController as d, type BurstOptions as e, type AttractorConfig as f, type BlendMode as g, type BoundaryConfig as h, type BoundaryHandle as i, type ChildExplosionConfig as j, type CreateParticlesOptions as k, Emitter as l, type EmitterConfiguration as m, type FPSOverlayController as n, type FPSOverlayOptions as o, type ForceSource as p, type IntroConfig as q, type IntroMode as r, MouseForce as s, Particle as t, type ParticleConstructorParams as u, type ParticleShape as v, type ScreensaverOptions as w, type ShapeConfig as x, type WebGLRendererOptions as y, applyCanvasStyles as z };
