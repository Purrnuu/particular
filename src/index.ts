export { default as Particular } from './particular/core/particular';
export { default as ParticularWrapper } from './particular/ParticularWrapper';
export { withParticles } from './particular/ParticularWrapper';
export { default as Vector } from './particular/utils/vector';
export { default as Emitter } from './particular/components/emitter';
export { default as Particle } from './particular/components/particle';
export { default as CanvasRenderer } from './particular/renderers/canvasRenderer';
export {
  default as WebGLRenderer,
  type WebGLRendererOptions,
} from './particular/renderers/webglRenderer';
export { presets } from './particular/presets';
export {
  particlesBackgroundLayerStyle,
  getParticlesBackgroundLayerStyle,
  particlesDefaultZIndex,
} from './particular/canvasStyles';
export { createParticles } from './particular/convenience';
export { useParticles } from './particular/useParticles';
export { showFPSOverlay } from './particular/devFPSOverlay';

// Export types
export type {
  ParticularConfig,
  ParticleConfig,
  EmitterConfiguration,
  ParticleConstructorParams,
  BurstSettings,
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
export type { UseParticlesOptions, UseParticlesResult } from './particular/useParticles';
export type { FPSOverlayOptions, FPSOverlayController } from './particular/devFPSOverlay';
