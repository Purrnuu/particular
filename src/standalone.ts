export { default as Particular } from './particular/core/particular';
export { default as Vector } from './particular/utils/vector';
export { default as Emitter } from './particular/components/emitter';
export { default as Particle } from './particular/components/particle';
export { default as CanvasRenderer } from './particular/renderers/canvasRenderer';
export { default as WebGLRenderer } from './particular/renderers/webglRenderer';
export { presets } from './particular/presets';
export {
  particlesBackgroundLayerStyle,
  getParticlesBackgroundLayerStyle,
  particlesDefaultZIndex,
} from './particular/canvasStyles';
export { createParticles } from './particular/convenience';
export { showFPSOverlay } from './particular/devFPSOverlay';

export type {
  ParticularConfig,
  ParticleConfig,
  EmitterConfiguration,
  ParticleConstructorParams,
  FullParticularConfig,
  ParticleShape,
  BlendMode,
  ShapeConfig,
  RendererType,
} from './particular/types';
export type { PresetName } from './particular/presets';
export type {
  BurstOptions,
  CreateParticlesOptions,
  ParticlesController,
} from './particular/convenience';
