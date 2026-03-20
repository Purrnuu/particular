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
    z: number;
    constructor(x?: number, y?: number, z?: number);
    getMagnitude(): number;
    add(vector: {
        x: number;
        y: number;
        z?: number;
    }, scale?: number): void;
    addFriction(friction: number, dt?: number): void;
    addGravity(gravity: number, dt?: number): void;
    subtract(vector: {
        x: number;
        y: number;
        z?: number;
    }): void;
    normalize(): void;
    scale(scalar: number): void;
    getAngle(): number;
    /** Elevation angle from the XY plane (radians). 0 = in-plane, +PI/2 = up z-axis. */
    getElevation(): number;
    static fromAngle(angle: number, magnitude: number): Vector;
    /** Create a Vector from spherical coordinates (azimuth in XY plane, elevation from XY, magnitude). */
    static fromSpherical(azimuth: number, elevation: number, magnitude: number): Vector;
}

/** Particle rendering shape. Each shape is supported in both Canvas 2D and WebGL renderers. */
type ParticleShape = 'circle' | 'rectangle' | 'square' | 'roundedRectangle' | 'triangle' | 'star' | 'ring' | 'sparkle';
/** Blend mode for particle rendering. 'additive' creates glowing/fire effects, 'multiply' darkens. */
type BlendMode = 'normal' | 'additive' | 'multiply' | 'screen';
/** Visual effect configuration shared by all particle types. */
interface ShapeConfig {
    /** Rendering shape. Default 'circle'. */
    shape?: ParticleShape;
    /** Blend mode. Default 'normal'. Use 'additive' for glowing/fire effects. */
    blendMode?: BlendMode;
    /** Enable glow halo around particles. Default false. Uses extra GPU resources. */
    glow?: boolean;
    /** Glow radius in pixels. Scales with particle size. Default 10. */
    glowSize?: number;
    /** Glow color as hex string. Default '#ffffff'. */
    glowColor?: string;
    /** Glow opacity (0–1). Default 0.25. */
    glowAlpha?: number;
    /** Enable particle trails (motion streaks). Default false. */
    trail?: boolean;
    /** Trail max age in ticks — how many frames trail segments persist. Default 3. */
    trailLength?: number;
    /** Trail alpha multiplier (0–1). Lower = more transparent trails. Default 0.75. */
    trailFade?: number;
    /** Trail minimum size ratio (0–1). Trail segments shrink from full size to this ratio. Default 0.55. */
    trailShrink?: number;
    /** When true, tint image particles with particle color (WebGL). Default false = render images as-is. */
    imageTint?: boolean;
    /** Enable drop shadow. Default false. Adds visual depth but uses extra GPU resources. */
    shadow?: boolean;
    /** Shadow blur radius in pixels. Default 9. */
    shadowBlur?: number;
    /** Shadow horizontal offset in pixels. Default 3. */
    shadowOffsetX?: number;
    /** Shadow vertical offset in pixels. Default 3. */
    shadowOffsetY?: number;
    /** Shadow color as hex string. Default '#333333'. */
    shadowColor?: string;
    /** Shadow opacity (0–1). Default 0.15. */
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
    /** Max dead particles kept in the reuse pool (default 2000). Higher values reduce GC pressure
     *  in scenes with heavy particle turnover; lower values reduce idle memory usage. */
    particlePoolSize?: number;
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
    /** When > 0, children emit in a spherical burst instead of 2D ring. Full sphere = PI. Default 0. */
    spread3d?: number;
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
/** Per-particle behavioral configuration — physics, lifetime, and emission parameters. */
interface ParticleConfig extends ShapeConfig {
    /** Emission rate (particles per tick in continuous mode). Default 8. */
    rate?: number;
    /** Emitter emission budget — total number of particles the emitter will create before stopping (burst mode only).
     *  Not to be confused with `particleLife` (individual particle lifetime). Default 30. */
    life?: number;
    /** Individual particle lifetime in ticks (~frames). Controls how long each particle lives before being removed.
     *  Fading begins at `particleLife - fadeTime` ticks. Default 100. */
    particleLife?: number;
    /** Initial velocity vector (direction + magnitude). Default { x: 0, y: -3 } (upward). */
    velocity?: Vector;
    /** Emission cone width in radians. Particles spawn with random direction within ±spread of velocity angle. Default 4. */
    spread?: number;
    /** Minimum particle size. Default 3. */
    sizeMin?: number;
    /** Maximum particle size. Default 8. */
    sizeMax?: number;
    /** Multiplier for randomized velocity magnitude. Each particle's speed is `velocity × random(0, velocityMultiplier)`.
     *  Higher values = more speed variation between particles. Default 6. */
    velocityMultiplier?: number;
    /** Fade-out duration in ticks before particle is removed. Default 30. */
    fadeTime?: number;
    /** Downward gravitational pull per tick. Default 0.15. */
    gravity?: number;
    /** Per-particle gravity randomness (0–1). Each particle's gravity is multiplied by a random factor
     *  in the range `1 ± gravityJitter`, giving heavier and lighter particles even at the same size. Default 0. */
    gravityJitter?: number;
    /** How quickly particles grow to full size per tick. Lower = slower grow-in animation. Default 1. */
    scaleStep?: number;
    /** Width of the rectangular spawn area centered on the emitter point. Default 0 (point spawn). */
    spawnWidth?: number;
    /** Height of the rectangular spawn area centered on the emitter point. Default 0 (point spawn). */
    spawnHeight?: number;
    /** Depth of the spawn volume along the z-axis. Particles spawn at random z within ±spawnDepth/2. Default 0 (flat). */
    spawnDepth?: number;
    /** 3D emission spread (radians). When > 0, particles emit in a spherical cone using
     *  `Vector.fromSpherical()` instead of 2D angle+spread. Full sphere = PI. Default 0 (2D emission). */
    spread3d?: number;
    /** 3D emission direction. When spread3d > 0, this is the central axis of the emission cone.
     *  Default { x: 0, y: -1, z: 0 } (upward). */
    emitDirection?: {
        x: number;
        y: number;
        z: number;
    };
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
    /** When true, particle rotation tracks velocity direction instead of spinning freely.
     *  Useful for triangle/arrow shapes that should point where they're moving (e.g. boids). Default false. */
    rotateToVelocity?: boolean;
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
    spawnDepth: number;
    spread3d: number;
    emitDirection: {
        x: number;
        y: number;
        z: number;
    };
    colors: string[];
    acceleration: number;
    accelerationSize: number;
    friction: number;
    frictionSize: number;
}
/** Configuration for home-position spring return and idle animation. */
interface HomePositionConfig {
    /** Spring stiffness — how strongly particles are pulled back to home. Default 0.05. */
    springStrength?: number;
    /** Spring damping — velocity decay when spring is active (0–1). Applied as Math.pow(damping, dt). Default 0.9. */
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
     *  so particles don't travel in straight lines back to home. Default 0.3. 0 = straight-line return. */
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
    /** When true, particle rotation tracks velocity direction instead of spinning. */
    rotateToVelocity?: boolean;
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
    /** Individual particle lifetime in ticks. Default Infinity (permanent). */
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
    /** Keep particles horizontally centered when container/viewport resizes. Default true. */
    autoCenter?: boolean;
}
interface ElementParticlesConfig extends Omit<ImageParticlesConfig, 'image'> {
    /** Hide the original element after capture. Default true. */
    hideElement?: boolean;
    /** Restore the original element when destroy() is called. Default true. */
    restoreElement?: boolean;
}
interface BurstSettings {
    clientX: number;
    clientY: number;
    icons?: (string | HTMLImageElement)[];
    [key: string]: unknown;
}
/** Complete configuration combining engine settings and particle defaults.
 *  User config is merged over preset defaults — user values always win. */
interface FullParticularConfig extends ParticularConfig, ParticleConfig {
    /** Image icons for image particles (URL strings or HTMLImageElement). */
    icons?: (string | HTMLImageElement)[];
    /** Rendering backend. Default 'webgl'. */
    renderer?: RendererType;
}
interface AttractorConfig {
    x: number;
    y: number;
    /** Z-position for 3D scenes. Default 0. */
    z?: number;
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
    getForce(particlePosition: Vector, particle?: Particle): Vector;
    preCompute?(particles: Particle[], dt: number): void;
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
/** Configuration for boids flocking behavior. Particles self-organize into swarm patterns
 *  via three steering rules: separation (avoid crowding), alignment (match neighbor heading),
 *  cohesion (steer toward neighbor center). Composes with existing forces. */
interface FlockingForceConfig {
    /** Radius within which other particles are considered neighbors. Default 100. */
    neighborRadius?: number;
    /** Weight for separation rule (avoid crowding). Default 1.5. */
    separationWeight?: number;
    /** Weight for alignment rule (match neighbor heading). Default 1.0. */
    alignmentWeight?: number;
    /** Weight for cohesion rule (steer toward neighbor center). Default 1.0. */
    cohesionWeight?: number;
    /** Maximum steering force magnitude per frame. Default 0.5. */
    maxSteeringForce?: number;
    /** Maximum particle speed (velocity clamped to this). Default 4. */
    maxSpeed?: number;
    /** Minimum distance before separation kicks in. Default 25. */
    separationDistance?: number;
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
/** Configuration for a glowing particle halo around an HTML element. */
interface ContainerGlowConfig {
    /** The HTML element to create a glow effect around. */
    element: HTMLElement;
    /** Glow particle colors. Default: soft blue-to-purple palette. */
    colors?: string[];
    /** Emission rate per edge (particles/tick). Default 0.5. */
    rate?: number;
    /** Minimum particle size. Default 1. */
    sizeMin?: number;
    /** Maximum particle size. Default 3. */
    sizeMax?: number;
    /** Individual particle lifetime in ticks. Default 100. */
    particleLife?: number;
    /** Fade time in ticks. Default 50. */
    fadeTime?: number;
    /** Outward velocity magnitude. Default 0.8. */
    velocity?: number;
    /** Spread angle (radians) from perpendicular. Default 0.4. */
    spread?: number;
    /** Friction applied to glow particles. Default 0.01. */
    friction?: number;
    /** Particle shape. Default 'circle'. */
    shape?: ParticleShape;
    /** Enable glow rendering on particles. Default true. */
    glow?: boolean;
    /** Glow color. Default '#74c0fc'. */
    glowColor?: string;
    /** Glow opacity (0–1). Default 0.35. */
    glowAlpha?: number;
    /** Glow size in pixels. Default 12. */
    glowSize?: number;
    /** Blend mode for glow particles. Default 'additive'. */
    blendMode?: BlendMode;
    /** Sinusoidal pulse speed (radians/tick). 0 = no pulse. Default 0.02. */
    pulseSpeed?: number;
    /** Pulse amplitude (0–1) — how much the emission rate varies. Default 0.4. */
    pulseAmplitude?: number;
}
/** Configuration for a mouse-following particle trail. */
interface MouseTrailConfig {
    /** Element to track mouse on. Default: window. */
    target?: EventTarget;
    /** Trail particle colors. Default: soft blue-to-purple palette. */
    colors?: string[];
    /** Emission rate (particles/tick while moving). Default 1.5. */
    rate?: number;
    /** Min particle size. Default 1. */
    sizeMin?: number;
    /** Max particle size. Default 3. */
    sizeMax?: number;
    /** Particle lifetime in ticks. Default 40. */
    particleLife?: number;
    /** Fade time in ticks. Default 20. */
    fadeTime?: number;
    /** Base velocity magnitude added to cursor direction. Default 1.5. */
    velocity?: number;
    /** Spread angle (radians) from cursor direction. Default 0.8. */
    spread?: number;
    /** Friction applied to trail particles. Default 0.02. */
    friction?: number;
    /** Particle shape. Default 'sparkle'. */
    shape?: ParticleShape;
    /** Enable glow. Default true. */
    glow?: boolean;
    /** Glow color. Default '#74c0fc'. */
    glowColor?: string;
    /** Glow opacity (0–1). Default 0.4. */
    glowAlpha?: number;
    /** Glow size in pixels. Default 10. */
    glowSize?: number;
    /** Blend mode. Default 'additive'. */
    blendMode?: BlendMode;
    /** Enable particle trails (streak). Default true. */
    trail?: boolean;
    /** Trail length (segments). Default 6. */
    trailLength?: number;
    /** Trail fade multiplier. Default 0.4. */
    trailFade?: number;
    /** Trail shrink ratio. Default 0.5. */
    trailShrink?: number;
    /** Minimum mouse speed (engine units/frame) to emit. Default 0.5. */
    minSpeed?: number;
}
/** Configuration for shattering an image into irregular polygon chunk particles. */
interface ImageShatterConfig {
    /** Image source — URL string or HTMLImageElement. */
    image: string | HTMLImageElement;
    /** X center position in screen pixels. Default: center of container/viewport. */
    x?: number;
    /** Y center position in screen pixels. Default: center of container/viewport. */
    y?: number;
    /** Display width in screen pixels. Default: 80% of container/viewport width (max 800px). */
    width?: number;
    /** Display height in screen pixels. Calculated from width + aspect ratio if omitted. */
    height?: number;
    /** Approximate number of chunks (actual = cols × rows). Default 36. */
    chunkCount?: number;
    /** Grid jitter amount (0–1). Higher = more irregular shapes. Default 0.4. */
    jitter?: number;
    /** Outward explosion velocity. Default 3. */
    velocity?: number;
    /** Velocity randomness (0–1). Each chunk gets velocity × (1 ± spread). Default 0.4. */
    velocitySpread?: number;
    /** Downward gravity on chunks. Default 0.08. */
    gravity?: number;
    /** Rotation speed (degrees/tick). Default 3. */
    rotationSpeed?: number;
    /** Individual chunk lifetime in ticks. Default 120. */
    particleLife?: number;
    /** Fade time in ticks. Default 40. */
    fadeTime?: number;
    /** Friction applied to chunks. Default 0.005. */
    friction?: number;
    /** Scale step — how quickly chunks grow to full size. Default: instant. */
    scaleStep?: number;
    /** When provided, chunks get spring-return home positions and effectively permanent lifetime.
     *  This enables interactive mode: use scatter() to push chunks outward and they spring back.
     *  Gravity and fadeTime are ignored in interactive mode. */
    homeConfig?: HomePositionConfig;
}
/** Configuration for continuous per-frame wobble on spring-return particles.
 *  When `track` is provided, wobble becomes mouse-reactive: particles push outward
 *  from the image center, weighted by mouse proximity, and react to mouse velocity. */
interface WobbleConfig {
    /** Base outward velocity nudge per frame. Default 0.8. */
    velocity?: number;
    /** Rotational jitter per frame (degrees). Default 0.4. */
    rotation?: number;
    /** Element to track mouse/touch on for reactive wobble. When set, particles
     *  near the cursor are pushed outward from the image center with extra force,
     *  and mouse movement creates directional impulses on nearby particles. */
    track?: HTMLElement;
    /** Radius of mouse influence in screen pixels. Default 200. */
    mouseRadius?: number;
    /** Strength multiplier for mouse-proximity push. Default 3. */
    mouseStrength?: number;
}
/** Rendering backend. 'webgl' (default) uses WebGL2 instanced drawing for best performance.
 *  'canvas' uses Canvas 2D — broader compatibility but slower with many particles.
 *  'webgl3d' uses WebGL2 with perspective projection for 3D particle scenes. */
type RendererType = 'canvas' | 'webgl' | 'webgl3d';

interface TrailSegment {
    x: number;
    y: number;
    z: number;
    size: number;
    rotation: number;
    alpha: number;
    age: number;
}
/** Set the maximum number of dead particles kept in the reuse pool. */
declare function setParticlePoolSize(size: number): void;
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
    /** Cached normalized RGB (0–1) parsed from color hex, for renderer hot paths. */
    colorR: number;
    colorG: number;
    colorB: number;
    particular: Particular | null;
    image: string | HTMLImageElement | null;
    isDetonationChild: boolean;
    rotateToVelocity: boolean;
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
    /** When true, suppress the settle-snap behavior. Spring still runs but particles never hard-snap to home.
     *  Useful for interactive effects where external forces (wobble, drag) should keep particles in motion. */
    preventSettle: boolean;
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
    private homeThresholdSq;
    private velocityThresholdSq;
    addEventListener: EventDispatcher['addEventListener'];
    removeEventListener: EventDispatcher['removeEventListener'];
    removeAllEventListeners: EventDispatcher['removeAllEventListeners'];
    dispatchEvent: EventDispatcher['dispatchEvent'];
    hasEventListener: EventDispatcher['hasEventListener'];
    /** Permanent alpha multiplier from source image (anti-aliased edges). */
    baseAlpha: number;
    /** Acquire a particle from the pool or create a new one. */
    static create(params: ParticleConstructorParams): Particle;
    constructor(params: ParticleConstructorParams);
    /** Reinitialize all fields from params. Reuses existing Vector objects for pool efficiency. */
    private _reinit;
    init(image: string | HTMLImageElement | null, particular: Particular): void;
    update(forces?: ForceSource[], dt?: number): void;
    advanceTrail(dt?: number): void;
    private updateTrail;
    resetImage(): void;
    getRoundedLocation(): [number, number];
    /** Deterministic pseudo-random interval from cycle number — same output for all particles in the same cycle. */
    private static deterministicInterval;
    /** Fast-path dispatch: skip entirely when no listeners are registered (the common case). */
    private dispatch;
    /** Dispatch PARTICLE_DEAD event and return this particle to the pool for reuse. */
    destroy(): void;
}

declare class Emitter {
    configuration: EmitterConfiguration;
    particles: Particle[];
    isEmitting: boolean;
    particular: Particular | null;
    lifeCycle: number;
    private emitAccumulator;
    private _newChildren;
    constructor(configuration: EmitterConfiguration);
    emit(dt?: number): void;
    assignParticular(particular: Particular): void;
    update(boundsX: number, boundsY: number, marginX: number, marginY: number, forces?: ForceSource[], dt?: number): void;
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

/** Projects a 3D particle position to 2D engine coords (screen space). */
type ScreenProjection = (px: number, py: number, pz: number) => {
    x: number;
    y: number;
} | null;
declare class MouseForce implements ForceSource {
    position: Vector;
    velocity: Vector;
    strength: number;
    radius: number;
    damping: number;
    maxSpeed: number;
    falloff: number;
    /** When set, particle positions are projected to screen space before computing distance.
     *  Used by the 3D renderer so the mouse affects particles based on visual proximity. */
    projectToScreen: ScreenProjection | null;
    private _trackListener;
    private _touchListener;
    private _trackTarget;
    private _pixelRatio;
    private _container;
    private _cachedRect;
    private _rectDirty;
    private _rectInvalidator;
    private _resizeObserver;
    constructor(config?: MouseForceConfig);
    get isTracking(): boolean;
    startTracking(target: EventTarget, pixelRatio: number, container?: HTMLElement | null): void;
    stopTracking(): void;
    destroy(): void;
    updatePosition(x: number, y: number): void;
    decay(dt?: number): void;
    getForce(particlePosition: Vector): Vector;
}

declare class FlockingForce implements ForceSource {
    neighborRadius: number;
    separationWeight: number;
    alignmentWeight: number;
    cohesionWeight: number;
    maxSteeringForce: number;
    maxSpeed: number;
    separationDistance: number;
    /** Engine bounds — set automatically by the engine before preCompute. Used for edge avoidance. */
    boundsWidth: number;
    boundsHeight: number;
    private grid;
    private forceMap;
    constructor(config?: FlockingForceConfig);
    preCompute(particles: Particle[], _dt: number): void;
    getForce(particlePosition: Vector, particle?: Particle): Vector;
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
    flockingForces: FlockingForce[];
    renderers: Renderer[];
    maxCount: number;
    width: number;
    height: number;
    pixelRatio: number;
    /** Multiplier for kill-zone bounds. 3D renderers set this higher so perspective-visible particles aren't culled prematurely. */
    boundsPadding: number;
    continuous: boolean;
    container: HTMLElement | null;
    private animateRequest;
    private lastTimestamp;
    private _combinedForces;
    private _allParticlesCache;
    addEventListener: EventDispatcher['addEventListener'];
    removeEventListener: EventDispatcher['removeEventListener'];
    removeAllEventListeners: EventDispatcher['removeAllEventListeners'];
    dispatchEvent: EventDispatcher['dispatchEvent'];
    hasEventListener: EventDispatcher['hasEventListener'];
    initialize({ maxCount, continuous, pixelRatio, particlePoolSize, container, }: ParticularConfig): void;
    start(): void;
    stop(): void;
    onResize(): void;
    addRenderer(renderer: Renderer): void;
    addEmitter(emitter: Emitter): void;
    addAttractor(attractor: Attractor): void;
    removeAttractor(attractor: Attractor): void;
    addMouseForce(mouseForce: MouseForce): void;
    removeMouseForce(mouseForce: MouseForce): void;
    addFlockingForce(flockingForce: FlockingForce): void;
    removeFlockingForce(flockingForce: FlockingForce): void;
    update: (timestamp?: DOMHighResTimeStamp) => void;
    updateEmitters(dt?: number): void;
    getCount(): number;
    getAllParticles(): Particle[];
    destroy(): void;
}

type ParticleDefaults = Required<Omit<ParticleConfig, 'detonate'>>;
/** Return type of configureParticular() — the fully-merged config used by helpers. */
type MergedConfig = Required<Omit<ParticularConfig, 'container'>> & ParticleDefaults & {
    renderer?: RendererType;
    container?: HTMLElement;
};
declare function configureParticular(configuration?: FullParticularConfig): MergedConfig;
declare function configureParticle<T extends Partial<ParticleConfig>>(overrides?: T, base?: ParticleConfig): ParticleDefaults & T;

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
    private ghostPool;
    private ghostPoolIdx;
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
    /** Max particles per draw call (default 16384). Increase for fewer draw calls with many particles. */
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
    private glowExpandUniform;
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
    private circleAttrPos;
    private circleAttrParticlePos;
    private circleAttrSize;
    private circleAttrRotation;
    private circleAttrColor;
    private circleAttrShape;
    private imageAttrPos;
    private imageAttrParticlePos;
    private imageAttrSize;
    private imageAttrRotation;
    private imageAttrColor;
    private imageTexUniform;
    private ghostPool;
    private ghostPoolIdx;
    private expandedArr;
    private batchPool;
    private batchPoolIdx;
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
    private acquireGhost;
    private buildBatches;
    private _batchResult;
    private acquireBatch;
    private fillInstanceData;
    private drawCircleInstances;
    private drawCircleBatch;
    private drawImageInstances;
    private drawImageBatch;
    onUpdateAfter: () => void;
    destroy(): void;
    remove(): void;
}

/**
 * Minimal 4×4 matrix math for 3D projection. Column-major Float32Array layout
 * matching WebGL's uniform convention. Zero dependencies.
 */
type Mat4 = Float32Array;

/**
 * Camera for 3D particle scenes. Computes a viewProjection matrix
 * from position/target/fov. Provides orbit controls for interactive demos.
 */

interface CameraConfig {
    /** Vertical field of view in degrees. Default 60. */
    fov?: number;
    /** Camera position. Default { x: 0, y: 0, z: 500 }. */
    position?: {
        x: number;
        y: number;
        z: number;
    };
    /** Look-at target. Default { x: 0, y: 0, z: 0 }. */
    target?: {
        x: number;
        y: number;
        z: number;
    };
    /** Up direction. Default { x: 0, y: 1, z: 0 }. */
    up?: {
        x: number;
        y: number;
        z: number;
    };
    /** Near clip plane. Default 1. */
    near?: number;
    /** Far clip plane. Default 5000. */
    far?: number;
}
declare const defaultCamera: Required<CameraConfig>;
declare class Camera {
    fov: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    target: {
        x: number;
        y: number;
        z: number;
    };
    up: {
        x: number;
        y: number;
        z: number;
    };
    near: number;
    far: number;
    viewProjection: Mat4;
    constructor(config?: CameraConfig);
    /** Recompute viewProjection matrix. Call after changing position/target/fov. */
    update(aspect: number): void;
    /** Set camera position from spherical coordinates around the target. */
    orbit(azimuth: number, elevation: number, distance: number): void;
    /** Attach mouse-drag orbit + scroll-zoom controls to a canvas. Returns cleanup function. */
    enableOrbitControls(canvas: HTMLCanvasElement): () => void;
    getDistance(): number;
}

/**
 * WebGL2 3D particle renderer with perspective projection.
 *
 * Particles are rendered as camera-facing billboarded quads using SDF shapes.
 * All existing 2D shapes (circle, star, sparkle, etc.) work without modification.
 * Non-additive batches are sorted back-to-front for correct transparency.
 */

interface WebGL3DRendererOptions {
    maxInstances?: number;
    camera?: CameraConfig;
}
declare class WebGL3DRenderer {
    target: HTMLCanvasElement;
    camera: Camera;
    gl: WebGL2RenderingContext | null;
    particular: Particular | null;
    pixelRatio: number;
    private program;
    private imageProgram;
    private quadBuffer;
    private circleQuadBuffer;
    private instanceBuffer;
    private instanceData;
    private maxInstances;
    private instanceStride;
    private vpUniform;
    private resUniform;
    private refCenterUniform;
    private worldScaleUniform;
    private softnessUniform;
    private glowUniform;
    private glowExpandUniform;
    private glowSizeUniform;
    private glowColorUniform;
    private isShadowUniform;
    private shadowColorUniform;
    private shadowBlurUniform;
    private cAttrPos;
    private cAttrPPos;
    private cAttrSize;
    private cAttrRot;
    private cAttrColor;
    private cAttrShape;
    private imgVpUniform;
    private imgResUniform;
    private imgRefCenterUniform;
    private imgWorldScaleUniform;
    private imgTintUniform;
    private imgIsShadowUniform;
    private imgShadowColorUniform;
    private imgShadowBlurUniform;
    private imgTexUniform;
    private iAttrPos;
    private iAttrPPos;
    private iAttrSize;
    private iAttrRot;
    private iAttrColor;
    private textureCache;
    private ghostPool;
    private ghostPoolIdx;
    private expandedArr;
    private batchPool;
    private batchPoolIdx;
    private _batchResult;
    private sortArr;
    private _refCenterX;
    private _refCenterY;
    private _refWorldScale;
    private _refInitialized;
    constructor(target: HTMLCanvasElement, options?: WebGL3DRendererOptions);
    init(particular: Particular, pixelRatio: number): void;
    resize: (args?: {
        width: number;
        height: number;
    }) => void;
    onUpdate: () => void;
    onUpdateAfter: () => void;
    private sortBackToFront;
    private expandParticlesWithTrails;
    private acquireGhost;
    private buildBatches;
    private acquireBatch;
    private fillInstanceData;
    private drawCircleInstances;
    private drawCircleBatch;
    private drawImageInstances;
    private drawImageBatch;
    private getOrCreateTexture;
    /** Reference center X (logical coords), captured on first frame. 0 before first render. */
    get referenceCenterX(): number;
    /** Reference center Y (logical coords), captured on first frame. 0 before first render. */
    get referenceCenterY(): number;
    /** Reference worldScale, captured on first frame. 0 before first render. */
    get referenceWorldScale(): number;
    destroy(): void;
    remove(): void;
}

declare const presetRegistry: {
    readonly confetti: {
        shape: "rectangle";
        blendMode: "normal";
        shadow: true;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        colors: string[];
    };
    readonly magic: {
        shape: "sparkle";
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
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworks: {
        shape: "triangle";
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
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworksDetonation: {
        shape: "triangle";
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
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        particleLife: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
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
            shape: "triangle";
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
        glow: false;
        maxCount: number;
    };
    readonly imageShape: {
        shape: "circle";
        blendMode: "normal";
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
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        gravityJitter: number;
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
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
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
        gravityJitter: number;
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
    readonly flock: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        colors: string[];
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        rotateToVelocity: true;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
    };
    readonly river: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
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
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly fireworksShow: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
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
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
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
            shape: "triangle";
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
    };
    readonly galaxySpin: {
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        gravityJitter: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly depthField: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly supernova: {
        shape: "star";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly fireworks3d: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
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
            shape: "sparkle";
            spread3d: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
        };
    };
};
declare const presets: {
    readonly Burst: {
        /** Celebratory confetti burst: colorful rectangles fluttering outward and drifting down */
        readonly confetti: {
            shape: "rectangle";
            blendMode: "normal";
            shadow: true;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            gravityJitter: number;
            scaleStep: number;
            friction: number;
            maxCount: number;
            colors: string[];
        };
        /** Signature magical burst: glowing sparkles with soft trails */
        readonly magic: {
            shape: "sparkle";
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
            gravityJitter: number;
            scaleStep: number;
            friction: number;
            maxCount: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            colors: string[];
        };
        /** Cinematic fireworks: glowing triangles with bright trailing bloom */
        readonly fireworks: {
            shape: "triangle";
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
            gravityJitter: number;
            scaleStep: number;
            friction: number;
            maxCount: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            colors: string[];
        };
        /** Fireworks with timed detonation: narrow upward launch that auto-explodes into colorful sub-bursts */
        readonly fireworksDetonation: {
            shape: "triangle";
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
            gravityJitter: number;
            scaleStep: number;
            maxCount: number;
            particleLife: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
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
                shape: "triangle";
                trail: true;
                trailLength: number;
                trailFade: number;
                trailShrink: number;
            };
        };
    };
    readonly Burst3D: {
        /** Spinning galaxy: spherical emission with slow orbit drift */
        readonly galaxySpin: {
            shape: "ring";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spread3d: number;
            spawnDepth: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            gravityJitter: number;
            fadeTime: number;
            gravity: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
        /** Depth field: particles spread along z-axis for parallax effect */
        readonly depthField: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spawnDepth: number;
            spawnWidth: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
        /** Supernova: explosive 3D burst with spherical emission */
        readonly supernova: {
            shape: "star";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spread3d: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            colors: string[];
        };
        /** 3D fireworks show: rockets launch upward and detonate into spherical sub-bursts */
        readonly fireworks3d: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spread3d: number;
            spawnDepth: number;
            spawnWidth: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
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
                shape: "sparkle";
                spread3d: number;
                trail: true;
                trailLength: number;
                trailFade: number;
                trailShrink: number;
                glow: true;
                glowSize: number;
                glowColor: string;
                glowAlpha: number;
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
            glow: false;
            maxCount: number;
        };
        /** Shape/icon rendered as particles with soft glow. */
        readonly shape: {
            shape: "circle";
            blendMode: "normal";
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
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            gravityJitter: number;
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
        /** Meteors: fast diagonal streaks with long glowing trails, additive blending */
        readonly meteors: {
            shape: "ring";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
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
            gravityJitter: number;
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
        /** Fireworks show: gentle rockets launch from the bottom and auto-explode into colorful bursts */
        readonly fireworksShow: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
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
            gravityJitter: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
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
                shape: "triangle";
                trail: true;
                trailLength: number;
                trailFade: number;
                trailShrink: number;
            };
        };
        /** Boids flock: self-organizing swarm of bird-like triangles. Use with addFlockingForce() for full effect. */
        readonly flock: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            colors: string[];
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            frictionSize: number;
            rotateToVelocity: true;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
        };
        /** River flow: horizontal stream of water particles, designed for use with attractors */
        readonly river: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
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
            friction: number;
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
        /** Cyan-to-white water palette */
        readonly water: {
            readonly colors: string[];
        };
        /** Blue-purple sparkle (magic preset signature) */
        readonly magic: {
            readonly colors: string[];
        };
        /** Extended blue-purple-pink (galaxy/nebula effects) */
        readonly nebula: {
            readonly colors: string[];
        };
        /** Hot reds, oranges, whites (explosions/supernova) */
        readonly solar: {
            readonly colors: string[];
        };
        /** Earth tones: deep reds, burnt orange, sienna */
        readonly autumn: {
            readonly colors: string[];
        };
        /** Dark greys for subtle/muted backgrounds */
        readonly ash: {
            readonly colors: string[];
        };
        /** Dark blue-grey tones */
        readonly slate: {
            readonly colors: string[];
        };
        /** Pastel blue, purple, teal, mint mix */
        readonly fairy: {
            readonly colors: string[];
        };
        /** Warm glowing orange-gold */
        readonly amber: {
            readonly colors: string[];
        };
        /** Soft pink gradient from hot to pastel */
        readonly rose: {
            readonly colors: string[];
        };
        /** Warm yellow-orange gradient */
        readonly gold: {
            readonly colors: string[];
        };
        /** Deep violet-purple range */
        readonly violet: {
            readonly colors: string[];
        };
        /** Bright green to pastel mint */
        readonly emerald: {
            readonly colors: string[];
        };
        /** Natural bird flock: charcoals, browns, warm grays */
        readonly birds: {
            readonly colors: string[];
        };
        /** Sunset murmuration: deep oranges, magentas, dusky purples */
        readonly sunset: {
            readonly colors: string[];
        };
        /** Multicolor vivid fireworks */
        readonly fireworks: {
            readonly colors: string[];
        };
    };
    readonly confetti: {
        shape: "rectangle";
        blendMode: "normal";
        shadow: true;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        colors: string[];
    };
    readonly magic: {
        shape: "sparkle";
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
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworks: {
        shape: "triangle";
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
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworksDetonation: {
        shape: "triangle";
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
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        particleLife: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
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
            shape: "triangle";
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
        glow: false;
        maxCount: number;
    };
    readonly imageShape: {
        shape: "circle";
        blendMode: "normal";
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
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        gravityJitter: number;
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
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
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
        gravityJitter: number;
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
    readonly flock: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        colors: string[];
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        rotateToVelocity: true;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
    };
    readonly river: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
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
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly fireworksShow: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
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
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
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
            shape: "triangle";
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
    };
    readonly galaxySpin: {
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        gravityJitter: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly depthField: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly supernova: {
        shape: "star";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly fireworks3d: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
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
            shape: "sparkle";
            spread3d: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
        };
    };
};
type PresetName = keyof typeof presetRegistry;
/** Mutable lookup of all named color palettes, for Storybook controls. */
declare const colorPalettes: Record<string, string[]>;

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
    config?: Partial<FullParticularConfig> & {
        camera?: CameraConfig;
    };
    /** Rendering backend. Default `'webgl'`. Use `'webgl3d'` for perspective projection with 3D particles. */
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
/** Handle returned by addContainerGlow(). */
interface ContainerGlowHandle {
    /** Re-sync glow emitters to the element's current position/size. Called automatically on resize. */
    update: () => void;
    /** Stop emitting new particles. Existing particles fade out naturally. Call start() to resume. */
    stop: () => void;
    /** Resume emitting after stop(). */
    start: () => void;
    /** Remove this glow effect and its emitters immediately. */
    destroy: () => void;
}
/** Handle returned by addMouseTrail(). */
interface MouseTrailHandle {
    /** Stop emitting trail particles. Existing particles fade out naturally. */
    stop: () => void;
    /** Resume emitting after stop(). */
    start: () => void;
    /** Remove the trail and all its listeners. */
    destroy: () => void;
}
interface ParticlesController {
    engine: Particular;
    /** The canvas element used by this controller (may have been auto-created). */
    canvas: HTMLCanvasElement;
    /** Camera instance (only available when renderer is 'webgl3d'). */
    camera: Camera | null;
    burst: (options: BurstOptions) => Emitter;
    attachClickBurst: (target?: EventTarget, overrides?: Partial<FullParticularConfig>) => () => void;
    addAttractor: (config: AttractorConfig) => Attractor;
    removeAttractor: (attractor: Attractor) => void;
    addRandomAttractors: (count: number, config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>) => Attractor[];
    removeAllAttractors: () => void;
    addMouseForce: (config?: MouseForceConfig) => MouseForce;
    removeMouseForce: (mouseForce: MouseForce) => void;
    /** Add a boids flocking force. Particles self-organize into swarm patterns via
     *  separation, alignment, and cohesion steering rules. Composes with attractors and mouse force. */
    addFlockingForce: (config?: FlockingForceConfig) => FlockingForce;
    removeFlockingForce: (flockingForce: FlockingForce) => void;
    /** Create a repulsion boundary around an HTML element. Particles are pushed away from its edges.
     *  The boundary auto-syncs when the element resizes or scrolls. Returns a handle to update or remove it. */
    addBoundary: (config: BoundaryConfig) => BoundaryHandle;
    /** Create a glowing particle halo around an HTML element. Particles emit outward from all edges
     *  with a gentle pulse. Works with any element including text. Returns a handle to update or remove it. */
    addContainerGlow: (config: ContainerGlowConfig) => ContainerGlowHandle;
    /** Create a particle trail that follows the mouse cursor. Particles inherit cursor velocity
     *  direction and leave glowing wisp streaks. Returns a handle to stop or remove it. */
    addMouseTrail: (config?: MouseTrailConfig) => MouseTrailHandle;
    explode: (options?: ExplodeOptions) => void;
    /** Scatter all particles with a random impulse. Particles with home positions spring back.
     *  Pass `rotation` to also add a random rotational impulse (degrees/tick). */
    scatter: (options?: {
        velocity?: number;
        rotation?: number;
    }) => void;
    /** Start continuous per-frame wobble on all spring-return particles.
     *  Small random velocity and rotation nudges each frame — the spring fights back,
     *  creating an organic jitter effect. Call stopWobble() to let particles settle. */
    startWobble: (config?: WobbleConfig) => void;
    /** Stop wobble and let spring-return particles settle back to home positions. */
    stopWobble: () => void;
    imageToParticles: (config: ImageParticlesConfig) => Promise<Emitter>;
    textToParticles: (text: string, config?: Omit<ImageParticlesConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => Promise<Emitter>;
    /** Capture any HTML element and replace it with particles at the same position.
     *  Uses manual Canvas 2D rendering (reads computed styles) — no external libraries needed.
     *  The original element is hidden by default and restored on destroy(). */
    elementToParticles: (element: HTMLElement, config?: ElementParticlesConfig) => Promise<Emitter>;
    /** Shatter an image into irregular polygon chunks that explode outward like broken glass.
     *  Each chunk is a particle with its own piece of the source image as texture.
     *  Pass `homeConfig` for interactive mode — chunks spring back after scatter(). */
    shatterImage: (config: ImageShatterConfig) => Promise<Emitter>;
    /** Render text to a canvas and shatter it into polygon chunks.
     *  Supports all ImageShatterConfig options plus text styling via textConfig. */
    shatterText: (text: string, config?: Omit<ImageShatterConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => Promise<Emitter>;
    /** Toggle idle animations (breathing, wiggle, wave, pulse) on all particles with home positions.
     *  Spring return still works when idle is disabled — particles return home but stay still once there. */
    setIdleEffect: (enabled: boolean) => void;
    /** Set the camera position (only works when renderer is 'webgl3d'). */
    setCameraPosition: (x: number, y: number, z: number) => void;
    /** Set camera position from spherical coordinates around the target (only works when renderer is 'webgl3d'). */
    orbitCamera: (azimuth: number, elevation: number, distance: number) => void;
    /** Enable mouse-drag orbit + scroll-zoom controls (only works when renderer is 'webgl3d'). Returns cleanup function. */
    enableOrbitControls: () => (() => void) | null;
    /** Start automatic camera orbit around the target (only works when renderer is 'webgl3d').
     *  Speed is radians per second (default 0.3). Returns cleanup function. */
    enableAutoOrbit: (speed?: number) => (() => void) | null;
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

export { type WebGLRendererOptions as $, Attractor as A, type BurstSettings as B, Camera as C, type DetonateConfig as D, type ExplodeOptions as E, type FullParticularConfig as F, MouseForce as G, type HomePositionConfig as H, type ImageParticlesConfig as I, type MouseTrailConfig as J, type MouseTrailHandle as K, Particle as L, type MouseForceConfig as M, type ParticleConstructorParams as N, type ParticleShape as O, Particular as P, type ParticularConfig as Q, type RendererType as R, type ScreensaverController as S, type TextImageConfig as T, type ScreensaverOptions as U, type ShapeConfig as V, type WobbleConfig as W, Vector as X, WebGL3DRenderer as Y, type WebGL3DRendererOptions as Z, WebGLRenderer as _, type ParticleConfig as a, applyCanvasStyles as a0, canvasToDataURL as a1, colorPalettes as a2, configureParticle as a3, createHeartImage as a4, createParticles as a5, createTextImage as a6, defaultCamera as a7, getParticlesBackgroundLayerStyle as a8, getParticlesContainerLayerStyle as a9, particlesBackgroundLayerStyle as aa, particlesContainerLayerStyle as ab, DEFAULT_Z_INDEX as ac, presets as ad, setParticlePoolSize as ae, showFPSOverlay as af, startScreensaver as ag, type PresetName as b, configureParticular as c, type ParticlesController as d, type BurstOptions as e, type ElementParticlesConfig as f, type ImageShatterConfig as g, type AttractorConfig as h, type BlendMode as i, type BoundaryConfig as j, type BoundaryHandle as k, type CameraConfig as l, CanvasRenderer as m, type ChildExplosionConfig as n, type ContainerGlowConfig as o, type ContainerGlowHandle as p, type CreateParticlesOptions as q, Emitter as r, type EmitterConfiguration as s, type FPSOverlayController as t, type FPSOverlayOptions as u, FlockingForce as v, type FlockingForceConfig as w, type ForceSource as x, type IntroConfig as y, type IntroMode as z };
