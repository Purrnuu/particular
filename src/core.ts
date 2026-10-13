export { default as Particular } from './particular/core/particular';
export { default as Particle, setParticlePoolSize } from './particular/components/particle';
export { default as Emitter } from './particular/components/emitter';
export { default as Vector } from './particular/utils/vector';
export { ResourceScope } from './particular/core/resourceScope';
export { configureParticular, configureParticle } from './particular/core/defaults';
export { createFeatureContext } from './particular/convenience/context';
export type { FeatureContext } from './particular/convenience/context';
export type {
  ForceSource,
  FrameContext,
  ParticularConfig,
  ParticleConfig,
  FullParticularConfig,
  EmitterConfiguration,
} from './particular/types';
