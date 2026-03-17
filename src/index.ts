export { default as Particular } from './particular/core/particular';
export { default as ParticularWrapper } from './particular/ParticularWrapper';
export { withParticles } from './particular/ParticularWrapper';
export { default as Vector } from './particular/utils/vector';
export { default as Emitter } from './particular/components/emitter';
export { default as Particle } from './particular/components/particle';
export { default as Attractor } from './particular/components/attractor';
export { default as MouseForce } from './particular/components/mouseForce';
export { default as CanvasRenderer } from './particular/renderers/canvasRenderer';
export {
  default as WebGLRenderer,
  type WebGLRendererOptions,
} from './particular/renderers/webglRenderer';
export { presets } from './particular/presets';
export {
  particlesBackgroundLayerStyle,
  getParticlesBackgroundLayerStyle,
  particlesContainerLayerStyle,
  getParticlesContainerLayerStyle,
  particlesDefaultZIndex,
  applyCanvasStyles,
} from './particular/canvasStyles';
export { createParticles } from './particular/convenience';
export { startScreensaver } from './particular/convenience/screensaver';
export { configureParticle } from './particular/core/defaults';
export { createTextImage, createHeartImage, canvasToDataURL } from './particular/utils/imageSource';
export { useParticles, useScreensaver } from './particular/useParticles';
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
  AttractorConfig,
  MouseForceConfig,
  ForceSource,
  RendererType,
  ChildExplosionConfig,
  ExplodeOptions,
  DetonateConfig,
  ImageParticlesConfig,
  ElementParticlesConfig,
  HomePositionConfig,
  TextImageConfig,
  BoundaryConfig,
  ContainerGlowConfig,
  MouseTrailConfig,
  IntroConfig,
  IntroMode,
} from './particular/types';
export type { PresetName } from './particular/presets';
export type {
  BurstOptions,
  CreateParticlesOptions,
  ParticlesController,
  BoundaryHandle,
  ContainerGlowHandle,
  MouseTrailHandle,
  ScreensaverOptions,
  ScreensaverController,
} from './particular/convenience';
export type {
  UseParticlesOptions,
  UseParticlesResult,
  UseScreensaverOptions,
  UseScreensaverResult,
} from './particular/useParticles';
export type { FPSOverlayOptions, FPSOverlayController } from './particular/devFPSOverlay';
