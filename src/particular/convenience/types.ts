import type Particular from '../core/particular';
import type Emitter from '../components/emitter';
import type Attractor from '../components/attractor';
import type MouseForce from '../components/mouseForce';
import type {
  FullParticularConfig,
  RendererType,
  AttractorConfig,
  MouseForceConfig,
  ExplodeOptions,
  ImageParticlesConfig,
  TextImageConfig,
  ElementParticlesConfig,
  BoundaryConfig,
} from '../types';
import type { PresetName } from '../presets';

export interface BurstOptions extends Partial<FullParticularConfig> {
  x: number;
  y: number;
}

export interface CreateParticlesOptions {
  /** Canvas element. If omitted, one is auto-created and appended to `container` or `document.body`. */
  canvas?: HTMLCanvasElement;
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  /** Rendering backend. Default `'webgl'`. */
  renderer?: RendererType;
  autoResize?: boolean;
  autoClick?: boolean;
  clickTarget?: EventTarget;
  /** Container element for container-aware mode. Canvas sizes to this element
   *  and all coordinates become container-relative. Omit for full-viewport mode. */
  container?: HTMLElement;
  /** Add a mouse-tracking force. `true` uses sensible defaults, or pass a config object. */
  mouseForce?: boolean | MouseForceConfig;
}

/** Handle returned by addBoundary(). */
export interface BoundaryHandle {
  /** Re-sync repulsors to the element's current position/size. Called automatically on resize. */
  update: () => void;
  /** Remove this boundary and its repulsors. */
  destroy: () => void;
}

export interface ParticlesController {
  engine: Particular;
  /** The canvas element used by this controller (may have been auto-created). */
  canvas: HTMLCanvasElement;

  // ── Emission ──
  burst: (options: BurstOptions) => Emitter;
  attachClickBurst: (
    target?: EventTarget,
    overrides?: Partial<FullParticularConfig>,
  ) => () => void;

  // ── Forces ──
  addAttractor: (config: AttractorConfig) => Attractor;
  removeAttractor: (attractor: Attractor) => void;
  addRandomAttractors: (count: number, config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>) => Attractor[];
  removeAllAttractors: () => void;
  addMouseForce: (config?: MouseForceConfig) => MouseForce;
  removeMouseForce: (mouseForce: MouseForce) => void;
  /** Create a repulsion boundary around an HTML element. Particles are pushed away from its edges.
   *  The boundary auto-syncs when the element resizes or scrolls. Returns a handle to update or remove it. */
  addBoundary: (config: BoundaryConfig) => BoundaryHandle;

  // ── Effects ──
  explode: (options?: ExplodeOptions) => void;
  /** Scatter all particles with a random impulse. Particles with home positions spring back. */
  scatter: (options?: { velocity?: number }) => void;

  // ── Image ──
  imageToParticles: (config: ImageParticlesConfig) => Promise<Emitter>;
  textToParticles: (
    text: string,
    config?: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> },
  ) => Promise<Emitter>;
  /** Capture any HTML element and replace it with particles at the same position.
   *  Uses SVG foreignObject to screenshot the element — no external libraries needed.
   *  The original element is hidden by default and restored on destroy(). */
  elementToParticles: (element: HTMLElement, config?: ElementParticlesConfig) => Promise<Emitter>;
  /** Toggle idle animations (breathing, wiggle, wave, pulse) on all particles with home positions.
   *  Spring return still works when idle is disabled — particles return home but stay still once there. */
  setIdleEffect: (enabled: boolean) => void;

  // ── Lifecycle ──
  destroy: () => void;
}

export interface ScreensaverOptions {
  /** Canvas element. If omitted, one is auto-created and appended to `container` or `document.body`. */
  canvas?: HTMLCanvasElement;
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  /** Rendering backend. Default `'webgl'`. */
  renderer?: RendererType;
  autoResize?: boolean;
  /** Mouse wind configuration. Pass `false` to disable entirely. */
  mouseWind?: MouseForceConfig | false;
  /** Container element for container-aware mode. Omit for full-viewport mode. */
  container?: HTMLElement;
}

export interface ScreensaverController {
  engine: Particular;
  controller: ParticlesController;
  destroy: () => void;
}
