import Vector from '../utils/vector';
import { magicPalette } from '../presets';
import type {
  ParticularConfig,
  ParticleConfig,
  AttractorConfig,
  MouseForceConfig,
  FlockingForceConfig,
  FullParticularConfig,
  RendererType,
  ChildExplosionConfig,
  HomePositionConfig,
  ImageParticlesConfig,
  ElementParticlesConfig,
  ContainerGlowConfig,
  MouseTrailConfig,
  ImageShatterConfig,
  WobbleConfig,
} from '../types';

export const defaultParticular: Required<Omit<ParticularConfig, 'container'>> = {
  pixelRatio: 2,
  zIndex: 10000,
  maxCount: 500,
  autoStart: false,
  continuous: false,
  webglMaxInstances: 4096,
  particlePoolSize: 2000,
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
  gravityJitter: 0,
  scaleStep: 1,
  spawnWidth: 0,
  spawnHeight: 0,
  spawnDepth: 0,
  spread3d: 0,
  emitDirection: { x: 0, y: -1, z: 0 },
  colors: [],
  acceleration: 0,
  accelerationSize: 0.01,
  friction: 0,
  frictionSize: 0.0005,
  rotateToVelocity: false,
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
  shadow: false,
  shadowBlur: 9,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowColor: '#333333',
  shadowAlpha: 0.15,
};

export const defaultAttractor: Required<Omit<AttractorConfig, 'x' | 'y' | 'z' | 'icon'>> = {
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

export const defaultFlockingForce: Required<FlockingForceConfig> = {
  neighborRadius: 100,
  separationWeight: 1.5,
  alignmentWeight: 1.5,
  cohesionWeight: 0.3,
  maxSteeringForce: 0.5,
  maxSpeed: 4,
  separationDistance: 25,
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
  spread3d: 0,
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
  particleLife: Infinity,
  gravity: 0,
  fadeTime: 40,
  shape: 'square',
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
  colors: magicPalette,
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

/** Default mouse trail config — magical wisps streaming from cursor. */
export const defaultMouseTrail: Required<Omit<MouseTrailConfig, 'target'>> = {
  colors: magicPalette,
  rate: 1.5,
  sizeMin: 1,
  sizeMax: 3,
  particleLife: 40,
  fadeTime: 20,
  velocity: 1.5,
  spread: 0.8,
  friction: 0.02,
  shape: 'sparkle',
  glow: true,
  glowColor: '#74c0fc',
  glowAlpha: 0.4,
  glowSize: 10,
  blendMode: 'additive',
  trail: true,
  trailLength: 6,
  trailFade: 0.4,
  trailShrink: 0.5,
  minSpeed: 0.5,
};

/** Default image shatter config — dramatic glass-break explosion. */
export const defaultImageShatter: Required<Omit<ImageShatterConfig, 'image' | 'x' | 'y' | 'width' | 'height' | 'homeConfig'>> = {
  chunkCount: 36,
  jitter: 0.4,
  velocity: 5,
  velocitySpread: 0.5,
  gravity: 0.12,
  rotationSpeed: 5,
  particleLife: 120,
  fadeTime: 40,
  friction: 0.005,
  scaleStep: 100,
};

/** Default wobble config — directional outward push that spring fights back against. */
export const defaultWobble: Required<Omit<WobbleConfig, 'track'>> = {
  velocity: 0.8,
  rotation: 0.4,
  mouseRadius: 200,
  mouseStrength: 3,
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
  overrides?: T,
  base?: ParticleConfig
): ParticleDefaults & T {
  return { ...defaultParticle, ...base, ...overrides } as ParticleDefaults & T;
}
