import Vector from './utils/vector';

export type ParticleShape = 
  | 'circle'
  | 'square'
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
  life?: number;
  velocity?: Vector;
  spread?: number;
  sizeMin?: number;
  sizeMax?: number;
  velocityMultiplier?: number;
  fadeTime?: number;
  gravity?: number;
  scaleStep?: number;
}

export interface EmitterConfiguration extends ParticleConfig {
  point: Vector;
  velocity: Vector;
  icons: (string | HTMLImageElement)[];
  rate: number;
  life: number;
  spread: number;
  sizeMin: number;
  sizeMax: number;
  velocityMultiplier: number;
  gravity: number;
  scaleStep: number;
  fadeTime: number;
}

export interface ParticleConstructorParams extends ShapeConfig {
  point?: Vector;
  velocity?: Vector;
  acceleration?: Vector;
  friction?: number;
  size?: number;
  gravity: number;
  scaleStep: number;
  fadeTime: number;
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

export type RendererType = 'canvas' | 'webgl';
