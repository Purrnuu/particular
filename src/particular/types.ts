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
  /** Color palette for particles. When provided, particles pick a random color from this array
   *  instead of using randomcolor(). Empty array = use randomcolor() fallback. */
  colors?: string[];
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
}

export interface ParticleConstructorParams extends ShapeConfig {
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
}

export type RendererType = 'canvas' | 'webgl';
