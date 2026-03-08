import Vector from '../utils/vector';
import type {
  ParticularConfig,
  ParticleConfig,
  AttractorConfig,
  MouseForceConfig,
  FullParticularConfig,
  RendererType,
  ChildExplosionConfig,
} from '../types';

export const defaultParticular: Required<ParticularConfig> = {
  pixelRatio: 2,
  zIndex: 10000,
  maxCount: 500,
  autoStart: false,
  continuous: false,
  webglMaxInstances: 4096,
};

export const defaultParticle: Required<Omit<ParticleConfig, 'detonate'>> = {
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
  acceleration: 0,
  accelerationSize: 0.01,
  friction: 0,
  frictionSize: 0.0005,
  shape: 'circle',
  blendMode: 'normal',
  glow: false,
  glowSize: 10,
  glowColor: '#ffffff',
  glowAlpha: 0.25,
  trail: false,
  trailLength: 3,
  trailFade: 0.75,
  trailShrink: 0.55,
  imageTint: false,
  shadow: true,
  shadowBlur: 9,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowColor: '#333333',
  shadowAlpha: 0.15,
};

export const defaultAttractor: Required<Omit<AttractorConfig, 'x' | 'y' | 'icon'>> = {
  strength: 1,
  radius: 150,
  visible: false,
  size: 12,
  color: '#adb5bd',
  shape: 'circle',
  glow: false,
  glowSize: 10,
  glowColor: '#adb5bd',
  glowAlpha: 0.35,
};

export const defaultMouseForce: Required<Omit<MouseForceConfig, 'track'>> = {
  x: 0,
  y: 0,
  strength: 1,
  radius: 50,
  damping: 0.85,
  maxSpeed: 10,
  falloff: 1,
};

export const defaultExplosionChild: Required<ChildExplosionConfig> = {
  childCount: 5,
  childLife: 40,
  sizeMin: 2,
  sizeMax: 5,
  velocity: 3,
  gravity: 0.12,
  fadeTime: 15,
  inheritColor: true,
  shape: 'circle',
  blendMode: 'normal',
  glow: false,
  glowSize: 10,
  glowColor: '#ffffff',
  glowAlpha: 0.25,
  shadow: false,
  trail: false,
  trailLength: 3,
  trailFade: 0.75,
  trailShrink: 0.55,
};

/** Screensaver mouse-wind defaults — softer, broader than base mouse force. */
export const defaultMouseWind: Omit<MouseForceConfig, 'track'> = {
  strength: 0.12,
  radius: 50,
  damping: 0.92,
  maxSpeed: 8,
  falloff: 0.3,
};

type ParticleDefaults = Required<Omit<ParticleConfig, 'detonate'>>;

export function configureParticular(
  configuration?: FullParticularConfig,
): Required<ParticularConfig> & ParticleDefaults & { renderer?: RendererType } {
  return { ...defaultParticular, ...defaultParticle, ...configuration };
}

export function configureParticle<T extends Partial<ParticleConfig>>(
  settings?: T,
  configuration?: ParticleConfig
): ParticleDefaults & T {
  return { ...defaultParticle, ...configuration, ...settings } as any;
}
