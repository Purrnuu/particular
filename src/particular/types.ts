import Vector from './utils/vector';

export type ParticleShape = 
  | 'circle'
  | 'rectangle'
  | 'square'
  | 'roundedRectangle'
  | 'triangle'
  | 'star'
  | 'ring'
  | 'sparkle';

export type BlendMode = 
  | 'normal'
  | 'additive'
  | 'multiply'
  | 'screen';

export interface ShapeConfig {
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

export interface ParticularConfig {
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
export interface ChildExplosionConfig {
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
export interface ExplodeOptions extends ChildExplosionConfig {
  /** Destroy parent particles after explosion. Default true. */
  destroyParents?: boolean;
}

/** Config for timed auto-detonation of particles. */
export interface DetonateConfig extends ChildExplosionConfig {
  /** Lifetime fraction (0–1) at which particles auto-explode. */
  at: number;
}

export interface ParticleConfig extends ShapeConfig {
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

export interface EmitterConfiguration extends ParticleConfig {
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
export interface HomePositionConfig {
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
export interface TextImageConfig {
  /** The text string to render. */
  text: string;
  /** Font size in pixels. Default 200. */
  fontSize?: number;
  /** CSS font family. Default 'system-ui, -apple-system, sans-serif'. */
  fontFamily?: string;
  /** Font weight. Default 'bold'. */
  fontWeight?: string;
  /** Fill color string, or gradient stops array. Default: rainbow gradient. */
  fill?: string | { offset: number; color: string }[];
}

export interface ParticleConstructorParams extends ShapeConfig {
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

export type IntroMode = 'scatter' | 'scaleIn' | 'ripple' | 'paint';

/** Configuration for intro animation when creating image/text particles. */
export interface IntroConfig {
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
export interface ImageParticlesConfig extends ShapeConfig {
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
  /** Keep particles horizontally centered when container/viewport resizes. Default true. */
  autoCenter?: boolean;
}

export interface ElementParticlesConfig extends Omit<ImageParticlesConfig, 'image'> {
  /** Hide the original element after capture. Default true. */
  hideElement?: boolean;
  /** Restore the original element when destroy() is called. Default true. */
  restoreElement?: boolean;
}

export interface BurstSettings {
  clientX: number;
  clientY: number;
  icons?: (string | HTMLImageElement)[];
  [key: string]: unknown;
}

export interface FullParticularConfig extends ParticularConfig, ParticleConfig {
  icons?: (string | HTMLImageElement)[];
  renderer?: RendererType;
}

export interface AttractorConfig {
  x: number;
  y: number;
  strength?: number;
  radius?: number;
  // Visual rendering
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

export interface ForceSource {
  getForce(particlePosition: Vector): Vector;
}

export interface MouseForceConfig {
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
export interface BoundaryConfig {
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

export type RendererType = 'canvas' | 'webgl';
