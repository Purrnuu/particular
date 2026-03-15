export { default as Particular } from './particular/core/particular';
export { default as Vector } from './particular/utils/vector';
export { default as Emitter } from './particular/components/emitter';
export { default as Particle } from './particular/components/particle';
export { default as Attractor } from './particular/components/attractor';
export { default as MouseForce } from './particular/components/mouseForce';
export { default as CanvasRenderer } from './particular/renderers/canvasRenderer';
export { default as WebGLRenderer } from './particular/renderers/webglRenderer';
export { presets } from './particular/presets';
export {
  particlesBackgroundLayerStyle,
  getParticlesBackgroundLayerStyle,
  particlesContainerLayerStyle,
  getParticlesContainerLayerStyle,
  particlesDefaultZIndex,
  applyCanvasStyles,
} from './particular/canvasStyles';
export { createParticles, startScreensaver } from './particular/convenience';
export { createTextImage, createHeartImage, canvasToDataURL } from './particular/utils/imageSource';
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
  AttractorConfig,
  MouseForceConfig,
  ForceSource,
  RendererType,
  ChildExplosionConfig,
  ExplodeOptions,
  DetonateConfig,
  ImageParticlesConfig,
  HomePositionConfig,
  TextImageConfig,
  BoundaryConfig,
} from './particular/types';
export type { PresetName } from './particular/presets';
export type {
  BurstOptions,
  CreateParticlesOptions,
  ParticlesController,
  BoundaryHandle,
  ScreensaverOptions,
  ScreensaverController,
} from './particular/convenience';
