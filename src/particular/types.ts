import Vector from './utils/vector';

export interface ParticularConfig {
  pixelRatio?: number;
  zIndex?: number;
  maxCount?: number;
  autoStart?: boolean;
  continuous?: boolean;
}

export interface ParticleConfig {
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

export interface ParticleConstructorParams {
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
