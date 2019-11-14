import Vector from '../utils/vector';

export const defaultParticular = {
  pixelRatio: 2,
  zIndex: 10000,
  maxCount: 300,
  autoStart: false,
  continuous: false,
};

export const defaultParticle = {
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
};

export function configureParticular(configuration) {
  return { ...defaultParticular, ...defaultParticle, ...configuration };
}

export function configureParticle(settings, configuration) {
  return { ...defaultParticle, ...configuration, ...settings };
}
