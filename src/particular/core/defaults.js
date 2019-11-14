import Vector from '../utils/vector';

export const defaultConfiguration = {
  maxCount: 300,
  rate: 8,
  life: 30,
  pixelRatio: 2,
  zIndex: 10000,
  autoStart: false,
  continuous: false,
  velocity: Vector.fromAngle(-90, 5),
  spread: Math.PI / 1.3,
  sizeMin: 5,
  sizeMax: 15,
  velocityMultiplier: 6,
};

export function configure(configuration) {
  return { ...defaultConfiguration, ...configuration };
}
