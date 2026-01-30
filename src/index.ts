export { default as Particular } from './particular/core/particular';
export { default as ParticularWrapper } from './particular/ParticularWrapper';
export { default as Vector } from './particular/utils/vector';
export { default as Emitter } from './particular/components/emitter';
export { default as Particle } from './particular/components/particle';
export { default as CanvasRenderer } from './particular/renderers/canvasRenderer';

// Export types
export type {
  ParticularConfig,
  ParticleConfig,
  EmitterConfiguration,
  ParticleConstructorParams,
  BurstSettings,
  FullParticularConfig,
} from './particular/types';
