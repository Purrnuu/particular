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
  trail?: boolean;
  trailLength?: number;
}

export interface ParticularConfig {
  pixelRatio?: number;
  zIndex?: number;
  maxCount?: number;
  autoStart?: boolean;
  continuous?: boolean;
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
}
