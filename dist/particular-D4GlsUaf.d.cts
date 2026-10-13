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
    /** Trail max age in 60 Hz ticks; sampled once per tick regardless of display FPS. Default 3. */
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
    /** Emission rate in particles per 60 Hz tick (rate * 60 per second). Default 8. */
    rate?: number;
    /** Emitter emission budget — total number of particles the emitter will create before stopping (burst mode only).
     *  Not to be confused with `particleLife` (individual particle lifetime). Default 30. */
    life?: number;
    /** Individual particle lifetime in 60 Hz ticks. Controls how long each particle lives before being removed.
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
    /** Size-dependent upward velocity bias: y -= (sizeMax - size) / 15 * velocityMultiplier.
     *  Applied once at spawn, not each frame. Default 6. */
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
    /** Expand the engine budget to fit this image. Default true; false preserves maxCount. */
    expandBudget?: boolean;
    /** Image source — URL string or HTMLImageElement. */
    image: string | HTMLImageElement;
    /** X center position in screen pixels. Default: center of container/viewport. */
    x?: number;
    /** Y center position in screen pixels. Default: center of container/viewport. */
    y?: number;
    /** Display width in local CSS pixels. Default: natural size capped to 50% of viewport/container dimensions. */
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
/** Frame data is reused by the engine; copy it if retaining a historical snapshot. */
interface FrameContext {
    timestamp: number;
    /** Simulation delta in 60 Hz ticks, clamped to [0, 3]. */
    dt: number;
    deltaSeconds: number;
    elapsedSeconds: number;
}
interface ForceSource {
    /** Velocity change per 60 Hz tick; particle integration applies dt once on all axes. */
    getForce(particlePosition: Vector, particle?: Particle): Vector;
    preCompute?(particles: Particle[], dt: number): void;
    update?(frame: FrameContext): void;
    setBounds?(width: number, height: number): void;
    /** Positional safety constraint after integration, before particle rendering. */
    constrain?(particle: Particle): void;
    destroy?(): void;
}
interface MouseForceConfig {
    /** Wind follows cursor velocity; repel pushes away from cursor position, even at rest. Default 'wind'. */
    mode?: 'wind' | 'repel';
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
    /** Weight for separation rule (avoid crowding). Default 1.2. */
    separationWeight?: number;
    /** Weight for alignment rule (match neighbor heading). Default 1.5. */
    alignmentWeight?: number;
    /** Weight for cohesion rule (steer toward neighbor center). Default 0.15. */
    cohesionWeight?: number;
    /** Maximum steering velocity change per 60 Hz tick. Default 0.08 for gentle flight arcs. */
    maxSteeringForce?: number;
    /** Steering budget for edge turns, separate from flock-neighbor steering. Default 0.12. */
    boundarySteeringForce?: number;
    /** Minimum cruising speed for moving birds, in engine units per 60 Hz tick.
     *  Set to 0 for passive swarms that may stop. Capped by maxSpeed. Default 1.5. */
    minSpeed?: number;
    /** Enforce logical flight bounds as a fallback after smooth edge steering. Default true. */
    containment?: boolean;
    /** Centered fraction of the logical viewport (0-1). With bounded depth,
     *  the xy footprint is square, based on the shorter viewport side. Default 1. */
    boundsScale?: number;
    /** Full flight-region depth in engine units; 0 leaves z unbounded. Default 0. */
    boundsDepth?: number;
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
    /** Trail max age in 60 Hz ticks. Default 6. */
    trailLength?: number;
    /** Trail fade multiplier. Default 0.4. */
    trailFade?: number;
    /** Trail shrink ratio. Default 0.5. */
    trailShrink?: number;
    /** Minimum mouse speed in engine units per 60 Hz tick to emit. Default 0.5. */
    minSpeed?: number;
}
/** Configuration for shattering an image into irregular polygon chunk particles. */
interface ImageShatterConfig {
    /** Expand the engine budget to fit all chunks. Default true; false preserves maxCount. */
    expandBudget?: boolean;
    /** Image source — URL string or HTMLImageElement. */
    image: string | HTMLImageElement;
    /** X center position in screen pixels. Default: center of container/viewport. */
    x?: number;
    /** Y center position in screen pixels. Default: center of container/viewport. */
    y?: number;
    /** Display width in local CSS pixels. Default: natural size capped to 50% of viewport/container dimensions. */
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
    private trailSampleRemainder;
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
    private destroyed;
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
    private applyConstraints;
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
    mode: 'wind' | 'repel';
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
    private pointerMotion;
    private hasTrackedPosition;
    constructor(config?: MouseForceConfig);
    get isTracking(): boolean;
    startTracking(target: EventTarget, pixelRatio: number, container?: HTMLElement | null): void;
    stopTracking(): void;
    destroy(): void;
    /** Programmatic movement in engine coordinates; dt is elapsed time in 60 Hz ticks. */
    updatePosition(x: number, y: number, dt?: number): void;
    decay(dt?: number): void;
    update(frame: FrameContext): void;
    getForce(particlePosition: Vector): Vector;
}

declare class FlockingForce implements ForceSource {
    neighborRadius: number;
    separationWeight: number;
    alignmentWeight: number;
    cohesionWeight: number;
    maxSteeringForce: number;
    boundarySteeringForce: number;
    minSpeed: number;
    containment: boolean;
    boundsScale: number;
    boundsDepth: number;
    maxSpeed: number;
    separationDistance: number;
    /** Engine bounds — set automatically by the engine before preCompute. Used for edge avoidance. */
    boundsWidth: number;
    boundsHeight: number;
    private grid;
    private forceMap;
    private dt;
    private left;
    private right;
    private top;
    private bottom;
    constructor(config?: FlockingForceConfig);
    setBounds(width: number, height: number): void;
    constrain(particle: Particle): void;
    preCompute(particles: Particle[], dt: number): void;
    getForce(_particlePosition: Vector, particle?: Particle): Vector;
    private steerFromBounds;
}

/** Owns resources for one engine. Returned disposers also unregister themselves. */
declare class ResourceScope {
    private cleanups;
    private controller;
    get signal(): AbortSignal;
    get disposed(): boolean;
    assertActive(): void;
    add(cleanup: () => void): () => void;
    timeout(callback: () => void, delay: number): () => void;
    waitFor<T>(promise: Promise<T>): Promise<T>;
    dispose(): void;
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
    /** Custom forces; typed force arrays remain available for compatibility. */
    forces: ForceSource[];
    readonly resources: ResourceScope;
    readonly frame: FrameContext;
    private destroyed;
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
    get isDestroyed(): boolean;
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
    addForce(force: ForceSource): void;
    removeForce(force: ForceSource): void;
    private getForces;
    update: (timestamp?: DOMHighResTimeStamp) => void;
    updateEmitters(dt?: number): void;
    getCount(): number;
    getAllParticles(): Particle[];
    destroy(): void;
}

export { Attractor as A, type BlendMode as B, type ChildExplosionConfig as C, type DetonateConfig as D, type ElementParticlesConfig as E, FlockingForce as F, type HomePositionConfig as H, type ImageParticlesConfig as I, MouseForce as M, Particle as P, type RendererType as R, type ShapeConfig as S, type TextImageConfig as T, Vector as V, type WobbleConfig as W, type AttractorConfig as a, type BoundaryConfig as b, type BurstSettings as c, type ContainerGlowConfig as d, Emitter as e, type EmitterConfiguration as f, type ExplodeOptions as g, type FlockingForceConfig as h, type ForceSource as i, type FrameContext as j, type FullParticularConfig as k, type ImageShatterConfig as l, type IntroConfig as m, type IntroMode as n, type MouseForceConfig as o, type MouseTrailConfig as p, type ParticleConfig as q, type ParticleConstructorParams as r, type ParticleShape as s, Particular as t, type ParticularConfig as u, setParticlePoolSize as v, ResourceScope as w };
