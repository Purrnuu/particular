import Vector from '../utils/vector';
import type {
  ParticularConfig,
  ParticleConfig,
  AttractorConfig,
  MouseForceConfig,
  FullParticularConfig,
  RendererType,
  ChildExplosionConfig,
  HomePositionConfig,
  ImageParticlesConfig,
  ElementParticlesConfig,
  ContainerGlowConfig,
} from '../types';

export const defaultParticular: Required<Omit<ParticularConfig, 'container'>> = {
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
  sizeMin: 1,
  sizeMax: 3,
  velocity: 3,
  velocitySpread: 0.4,
  friction: 0.01,
  scaleStep: 1.5,
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
  trail: true,
  trailLength: 3,
  trailFade: 0.6,
  trailShrink: 0.65,
};

export const defaultHomeConfig: Required<HomePositionConfig> = {
  springStrength: 0.05,
  springDamping: 0.9,
  homeThreshold: 2,
  velocityThreshold: 0.5,
  wiggleAmplitude: 0,
  wiggleSpeed: 0.05,
  breathingAmplitude: 0,
  breathingSpeed: 0.03,
  waveAmplitude: 0,
  waveSpeed: 0.03,
  waveFrequency: 0.15,
  returnNoise: 0.3,
  idlePulseStrength: 2,
  idlePulseIntervalMin: 300,
  idlePulseIntervalMax: 1800,
};

/** Default image-to-particles config — 1px-ish particles, no effects, permanent lifetime. */
export const defaultImageParticles: Partial<ImageParticlesConfig> = {
  alphaThreshold: 0.1,
  particleLife: 99999,
  gravity: 0,
  fadeTime: 40,
  shape: 'square',
  shadow: false,
  glow: false,
};

/** Default element-to-particles config — balanced resolution for text/UI fidelity without being too heavy. */
export const defaultElementParticles: Partial<ElementParticlesConfig> = {
  resolution: 300,
  shape: 'triangle',
  hideElement: true,
  restoreElement: true,
};

/** Default container glow config — soft blue/purple halo with gentle pulse. */
export const defaultContainerGlow: Required<Omit<ContainerGlowConfig, 'element'>> = {
  colors: ['#a5d8ff', '#74c0fc', '#4dabf7', '#d0bfff', '#b197fc', '#9775fa'],
  rate: 0.5,
  sizeMin: 0.5,
  sizeMax: 2,
  particleLife: 60,
  fadeTime: 30,
  velocity: 0.4,
  spread: 0.3,
  friction: 0.01,
  shape: 'sparkle',
  glow: true,
  glowColor: '#74c0fc',
  glowAlpha: 0.35,
  glowSize: 8,
  blendMode: 'additive',
  pulseSpeed: 0.02,
  pulseAmplitude: 0.4,
};

/** Screensaver mouse-wind defaults — softer, broader than base mouse force. */
export const defaultMouseWind: Omit<MouseForceConfig, 'track'> = {
  strength: 0.12,
  radius: 100,
  damping: 0.92,
  maxSpeed: 8,
  falloff: 0.3,
};

type ParticleDefaults = Required<Omit<ParticleConfig, 'detonate'>>;

/** Return type of configureParticular() — the fully-merged config used by helpers. */
export type MergedConfig = Required<Omit<ParticularConfig, 'container'>> & ParticleDefaults & { renderer?: RendererType; container?: HTMLElement };

export function configureParticular(
  configuration?: FullParticularConfig,
): MergedConfig {
  return { ...defaultParticular, ...defaultParticle, ...configuration };
}

export function configureParticle<T extends Partial<ParticleConfig>>(
  settings?: T,
  configuration?: ParticleConfig
): ParticleDefaults & T {
  return { ...defaultParticle, ...configuration, ...settings } as any;
}
