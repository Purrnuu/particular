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
  maxCount: 500,
  autoStart: false,
  continuous: false,
  webglMaxInstances: 4096,
};

export const defaultParticle: Required<ParticleConfig> = {
  rate: 8,
  life: 30,
  particleLife: 100,
  velocity: Vector.fromAngle(-90, 5),
  spread: Math.PI / 1.3,
  sizeMin: 5,
  sizeMax: 15,
  velocityMultiplier: 6,
  fadeTime: 30,
  gravity: 0.15,
  scaleStep: 1,
  spawnWidth: 0,
  spawnHeight: 0,
  colors: [],
  shape: 'circle',
  blendMode: 'normal',
  glow: false,
  glowSize: 10,
  glowColor: '#ffffff',
  glowAlpha: 0.25,
  trail: false,
  trailLength: 3,
  imageTint: false,
  shadow: true,
  shadowBlur: 9,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowColor: '#333333',
  shadowAlpha: 0.15,
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
