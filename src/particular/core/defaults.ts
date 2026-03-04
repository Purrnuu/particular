import Vector from '../utils/vector';
import type {
  ParticularConfig,
  ParticleConfig,
  FullParticularConfig,
  RendererType,
} from '../types';

export const defaultParticular: Required<ParticularConfig> = {
  pixelRatio: 2,
  zIndex: 10000,
  maxCount: 300,
  autoStart: false,
  continuous: false,
  webglMaxInstances: 4096,
};

export const defaultParticle: Required<ParticleConfig> = {
  rate: 8,
  life: 30,
  velocity: Vector.fromAngle(-90, 5),
  spread: Math.PI / 1.3,
  sizeMin: 5,
  sizeMax: 15,
  velocityMultiplier: 6,
  fadeTime: 30,
  gravity: 0.15,
  scaleStep: 1,
  shape: 'circle',
  blendMode: 'normal',
  glow: false,
  glowSize: 10,
  glowColor: '#ffffff',
  glowAlpha: 0.35,
  trail: false,
  trailLength: 3,
  imageTint: false,
  shadow: false,
  shadowBlur: 8,
  shadowOffsetX: 4,
  shadowOffsetY: 4,
  shadowColor: '#000000',
  shadowAlpha: 0.5,
};

export function configureParticular(
  configuration?: FullParticularConfig,
): Required<ParticularConfig> & Required<ParticleConfig> & { renderer?: RendererType } {
  return { ...defaultParticular, ...defaultParticle, ...configuration };
}

export function configureParticle<T extends Partial<ParticleConfig>>(
  settings?: T,
  configuration?: ParticleConfig
): Required<ParticleConfig> & T {
  return { ...defaultParticle, ...configuration, ...settings } as any;
}
