import Emitter from './components/emitter';
import Particle from './components/particle';
import Attractor from './components/attractor';
import MouseForce from './components/mouseForce';
import { processImages } from './components/icons';
import { configureParticular, configureParticle, defaultParticle, defaultMouseWind, defaultImageParticles } from './core/defaults';
import Particular from './core/particular';
import { getPreset, type PresetName } from './presets';
import CanvasRenderer from './renderers/canvasRenderer';
import WebGLRenderer from './renderers/webglRenderer';
import { createExplosionChild } from './utils/explosion';
import { generateHarmoniousPalette } from './utils/color';
import Vector from './utils/vector';
import { loadImage, sampleImagePixels } from './utils/pixelSampler';
import { createTextImage, canvasToDataURL } from './utils/imageSource';
import type { FullParticularConfig, RendererType, AttractorConfig, MouseForceConfig, ExplodeOptions, ImageParticlesConfig, TextImageConfig, BoundaryConfig } from './types';

export interface BurstOptions extends Partial<FullParticularConfig> {
  x: number;
  y: number;
}

export interface CreateParticlesOptions {
  canvas: HTMLCanvasElement;
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  renderer?: RendererType;
  autoResize?: boolean;
  autoClick?: boolean;
  clickTarget?: EventTarget;
  /** Container element for container-aware mode. Canvas sizes to this element
   *  and all coordinates become container-relative. Omit for full-viewport mode. */
  container?: HTMLElement;
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
  burst: (options: BurstOptions) => Emitter;
  explode: (options?: ExplodeOptions) => void;
  /** Scatter all particles with a random impulse. Particles with home positions spring back. */
  scatter: (options?: { velocity?: number }) => void;
  imageToParticles: (config: ImageParticlesConfig) => Promise<Emitter>;
  textToParticles: (
    text: string,
    config: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> },
  ) => Promise<Emitter>;
  addAttractor: (config: AttractorConfig) => Attractor;
  removeAttractor: (attractor: Attractor) => void;
  addRandomAttractors: (count: number, config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>) => Attractor[];
  removeAllAttractors: () => void;
  addMouseForce: (config?: MouseForceConfig) => MouseForce;
  removeMouseForce: (mouseForce: MouseForce) => void;
  /** Create a repulsion boundary around an HTML element. Particles are pushed away from its edges.
   *  The boundary auto-syncs when the element resizes. Returns a handle to update or remove it. */
  addBoundary: (config: BoundaryConfig) => BoundaryHandle;
  attachClickBurst: (
    target?: EventTarget,
    overrides?: Partial<FullParticularConfig>,
  ) => () => void;
  destroy: () => void;
}

/**
 * One-call setup for standalone sites.
 * Uses a premium default preset and returns a small controller API.
 */
export function createParticles({
  canvas,
  preset = 'magic',
  config,
  renderer = 'canvas',
  autoResize = true,
  autoClick = false,
  clickTarget,
  container,
}: CreateParticlesOptions): ParticlesController {
  const engine = new Particular();
  const basePreset = getPreset(preset);
  const mergedConfig = configureParticular({ ...basePreset, ...config, container });

  engine.initialize(mergedConfig);
  if (renderer === 'webgl') {
    engine.addRenderer(
      new WebGLRenderer(canvas, {
        maxInstances: mergedConfig.webglMaxInstances,
      }),
    );
  } else {
    engine.addRenderer(new CanvasRenderer(canvas));
  }
  engine.onResize();

  const cleanups: Array<() => void> = [];

  if (autoResize) {
    if (container) {
      const ro = new ResizeObserver(() => engine.onResize());
      ro.observe(container);
      cleanups.push(() => ro.disconnect());
    } else {
      const onResize = () => engine.onResize();
      window.addEventListener('resize', onResize);
      cleanups.push(() => window.removeEventListener('resize', onResize));
    }
  }

  /** Convert screen/client coordinates to engine coordinates, accounting for container offset. */
  const toEngineCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    let x = clientX;
    let y = clientY;
    if (container) {
      const rect = container.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
    return { x: x / mergedConfig.pixelRatio, y: y / mergedConfig.pixelRatio };
  };

  const burst = (options: BurstOptions): Emitter => {
    const { x, y, ...overrides } = options;
    const combinedSettings = configureParticle(overrides, mergedConfig);

    let icons: (string | HTMLImageElement)[] = [];
    if (combinedSettings.icons) {
      icons = processImages(combinedSettings.icons);
    }

    const enginePos = toEngineCoords(x, y);
    const emitter = new Emitter({
      point: new Vector(enginePos.x, enginePos.y),
      ...combinedSettings,
      icons,
    });

    engine.addEmitter(emitter);
    // Trigger immediate first burst for responsive click feedback.
    emitter.isEmitting = true;
    emitter.emit();
    return emitter;
  };

  const explode = (options: ExplodeOptions = {}): void => {
    const destroyParents = options.destroyParents ?? true;
    const allParticles = engine.getAllParticles();
    if (allParticles.length === 0) return;

    // Snapshot all alive particles before any modifications
    const snapshots = allParticles.map((p) => ({
      x: p.position.x,
      y: p.position.y,
      color: p.color,
      shape: p.shape as string,
      blendMode: p.blendMode as string,
    }));

    if (destroyParents) {
      // Destroy all current particles
      for (const emitter of engine.emitters) {
        for (const p of emitter.particles) {
          p.destroy();
        }
        emitter.particles = [];
      }
    }

    // Create collector emitter for children, respecting maxCount
    const fallbackColors = generateHarmoniousPalette();
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: [],
    });
    collector.isEmitting = false;

    const childCount = options.childCount ?? 5;
    const currentCount = engine.getCount();
    const budget = Math.max(0, engine.maxCount - currentCount);
    let spawned = 0;

    for (const parent of snapshots) {
      for (let i = 0; i < childCount; i++) {
        if (spawned >= budget) break;
        const child = createExplosionChild(parent, options, engine, fallbackColors);
        collector.particles.push(child);
        spawned++;
      }
      if (spawned >= budget) break;
    }

    engine.addEmitter(collector);
  };

  const scatter = (options: { velocity?: number } = {}): void => {
    const baseVelocity = options.velocity ?? 10;
    const allParticles = engine.getAllParticles();
    for (const particle of allParticles) {
      const angle = Math.random() * Math.PI * 2;
      // Per-particle velocity variation (0.3x–1.7x) for bursty, non-uniform dispersal
      const magnitude = baseVelocity * (0.3 + Math.random() * 1.4);
      particle.velocity.x += Math.cos(angle) * magnitude;
      particle.velocity.y += Math.sin(angle) * magnitude;
    }
  };

  const imageToParticles = async (config: ImageParticlesConfig): Promise<Emitter> => {
    // Merge caller config over engine defaults
    const merged = { ...defaultImageParticles, ...config };
    const {
      image: imageSrc,
      x,
      y,
      resolution: resolutionOverride,
      alphaThreshold = 0.1,
      particleLife = 99999,
      gravity = 0,
      fadeTime = 40,
      particleSize: sizeOverride,
      scaleStep: scaleStepOverride,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      homeConfig,
    } = merged;

    // Squares pack tighter on a grid — use higher resolution. Circles/triangles need fewer.
    const resolution = resolutionOverride ?? (shape === 'square' ? 400 : 200);

    const image = await loadImage(imageSrc);
    const aspect = image.naturalWidth / image.naturalHeight;

    // Resolve display dimensions in screen pixels
    let displayW: number;
    let displayH: number;
    if (config.width != null && config.height != null) {
      displayW = config.width;
      displayH = config.height;
    } else if (config.width != null) {
      displayW = config.width;
      displayH = config.width / aspect;
    } else if (config.height != null) {
      displayH = config.height;
      displayW = config.height * aspect;
    } else {
      displayW = image.naturalWidth;
      displayH = image.naturalHeight;
    }

    // Convert to engine coordinates (x,y are already container-relative in container mode)
    const pr = mergedConfig.pixelRatio;
    const engineW = displayW / pr;
    const engineH = displayH / pr;
    const centerX = x / pr;
    const centerY = y / pr;
    const originX = centerX - engineW / 2;
    const originY = centerY - engineH / 2;

    const samples = sampleImagePixels(image, resolution, alphaThreshold);

    // Calculate particle size from grid spacing.
    // Circles/triangles need larger size to avoid gaps; squares tile perfectly.
    const gridCols = aspect >= 1 ? resolution : Math.max(1, Math.round(resolution * aspect));
    const spacing = engineW / gridCols;
    const sizeScale = shape === 'square' ? 0.55 : 0.7;
    const size = sizeOverride != null ? sizeOverride / pr : spacing * sizeScale;
    const scaleStep = scaleStepOverride ?? size; // instant full size

    // Ensure maxCount can hold all particles
    const needed = samples.length;
    if (engine.maxCount < engine.getCount() + needed) {
      engine.maxCount = engine.getCount() + needed;
    }

    // Create collector emitter (no auto-emission)
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: [],
    });
    collector.isEmitting = false;

    const imageCenter = new Vector(centerX, centerY);

    for (const sample of samples) {
      const px = originX + sample.nx * engineW;
      const py = originY + sample.ny * engineH;
      const homePos = new Vector(px, py);

      const particle = new Particle({
        color: sample.color,
        baseAlpha: sample.alpha,
        point: new Vector(px, py),
        velocity: new Vector(0, 0),
        acceleration: new Vector(0, 0),
        friction: 0,
        size,
        particleLife,
        gravity,
        scaleStep,
        fadeTime,
        shape,
        blendMode,
        glow,
        glowSize,
        glowColor,
        glowAlpha,
        shadow,
        shadowBlur,
        shadowOffsetX,
        shadowOffsetY,
        shadowColor,
        shadowAlpha,
        trail,
        trailLength,
        trailFade,
        trailShrink,
        imageTint,
        homePosition: homePos,
        homeCenter: imageCenter,
        homeConfig,
      });

      // Triangle tessellation: alternate up/down based on grid parity
      if (shape === 'triangle' && (sample.gridX + sample.gridY) % 2 === 1) {
        particle.rotation = 180;
      }

      particle.init(null, engine);
      collector.particles.push(particle);
    }

    engine.addEmitter(collector);
    return collector;
  };

  const textToParticles = async (
    text: string,
    config: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> },
  ): Promise<Emitter> => {
    const { textConfig, ...imageConfig } = config;
    const textCanvas = createTextImage({ text, ...textConfig });
    return imageToParticles({
      ...imageConfig,
      image: canvasToDataURL(textCanvas),
    });
  };

  const attachClickBurst = (
    target: EventTarget = clickTarget ?? document,
    overrides?: Partial<FullParticularConfig>,
  ): (() => void) => {
    const onClick = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      burst({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        ...(overrides ?? {}),
      });
    };
    target.addEventListener('click', onClick as EventListener);
    return () => target.removeEventListener('click', onClick as EventListener);
  };

  if (autoClick) {
    const cleanupClick = attachClickBurst(clickTarget ?? document);
    cleanups.push(cleanupClick);
  }

  const addAttractor = (config: AttractorConfig): Attractor => {
    const attractor = new Attractor(config);
    engine.addAttractor(attractor);
    return attractor;
  };

  const removeAttractor = (attractor: Attractor): void => {
    engine.removeAttractor(attractor);
  };

  const addRandomAttractors = (
    count: number,
    config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>,
  ): Attractor[] => {
    const pixelRatio = engine.pixelRatio;
    const sourceW = container ? container.clientWidth : window.innerWidth;
    const sourceH = container ? container.clientHeight : window.innerHeight;
    const viewW = sourceW / pixelRatio;
    const viewH = sourceH / pixelRatio;
    const marginX = viewW * 0.1;
    const marginY = viewH * 0.1;
    const result: Attractor[] = [];

    for (let i = 0; i < count; i++) {
      const x = marginX + Math.random() * (viewW - marginX * 2);
      const y = marginY + Math.random() * (viewH - marginY * 2);
      const attractor = addAttractor({
        x,
        y,
        strength: 1,
        radius: 200,
        visible: true,
        ...config,
      });
      result.push(attractor);
    }
    return result;
  };

  const removeAllAttractors = (): void => {
    engine.attractors.splice(0);
  };

  const addBoundary = (config: BoundaryConfig): BoundaryHandle => {
    const {
      element,
      strength = -1.5,
      radius = 10,
      inset: insetFraction = 0.4,
    } = config;
    const pr = engine.pixelRatio;
    let attractors: Attractor[] = [];
    // Store offsets relative to element top-left (engine coords) for fast scroll reposition
    let offsets: { dx: number; dy: number }[] = [];

    /** Full rebuild: recompute tiling and create/destroy attractors. Called on resize. */
    const rebuild = () => {
      for (const a of attractors) engine.removeAttractor(a);
      attractors = [];
      offsets = [];

      const refRect = container
        ? container.getBoundingClientRect()
        : { left: 0, top: 0 };

      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      const elW = elRect.width / pr;
      const elH = elRect.height / pr;

      // Inset so the repulsion boundary aligns with the visible edge
      const ins = radius * insetFraction;
      const localL = ins;
      const localR = elW - ins;
      const localT = ins;
      const localB = elH - ins;
      const w = localR - localL;
      const h = localB - localT;
      if (w <= 0 || h <= 0) return;

      const stepsX = Math.max(2, Math.ceil(w / radius) + 1);
      const stepsY = Math.max(2, Math.ceil(h / radius) + 1);

      const add = (dx: number, dy: number) => {
        const a = new Attractor({ x: elLeft + dx, y: elTop + dy, strength, radius });
        engine.addAttractor(a);
        attractors.push(a);
        offsets.push({ dx, dy });
      };

      // Top and bottom edges
      for (let i = 0; i < stepsX; i++) {
        const x = localL + (w * i) / (stepsX - 1);
        add(x, localT);
        add(x, localB);
      }
      // Left and right edges (skip corners — already placed)
      for (let i = 1; i < stepsY - 1; i++) {
        const y = localT + (h * i) / (stepsY - 1);
        add(localL, y);
        add(localR, y);
      }
    };

    /** Lightweight reposition: move existing attractors without alloc. Called on scroll. */
    const reposition = () => {
      if (attractors.length === 0) return;
      const refRect = container
        ? container.getBoundingClientRect()
        : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      for (let i = 0; i < attractors.length; i++) {
        const a = attractors[i]!;
        const o = offsets[i]!;
        a.position.x = elLeft + o.dx;
        a.position.y = elTop + o.dy;
      }
    };

    // Initial build
    rebuild();

    // Auto-rebuild on element/container resize (tiling count may change)
    const ro = new ResizeObserver(rebuild);
    ro.observe(element);
    if (container) ro.observe(container);

    // rAF-throttled scroll reposition (just moves existing attractors — cheap)
    let scrollRafId = 0;
    const onScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        reposition();
      });
    };
    const scrollTarget = container ?? window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    const handle: BoundaryHandle = {
      update: rebuild,
      destroy: () => {
        ro.disconnect();
        scrollTarget.removeEventListener('scroll', onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const a of attractors) engine.removeAttractor(a);
        attractors = [];
        offsets = [];
      },
    };

    cleanups.push(() => handle.destroy());
    return handle;
  };

  const addMouseForce = (config: MouseForceConfig = {}): MouseForce => {
    const { track, ...forceConfig } = config;
    const mouseForce = new MouseForce(forceConfig);
    engine.addMouseForce(mouseForce);

    if (track) {
      const target = track === true ? window : track;
      mouseForce.startTracking(target, engine.pixelRatio, container);
      cleanups.push(() => mouseForce.stopTracking());
    }

    return mouseForce;
  };

  const removeMouseForce = (mouseForce: MouseForce): void => {
    mouseForce.stopTracking();
    engine.removeMouseForce(mouseForce);
  };

  const destroy = () => {
    for (const cleanup of cleanups) cleanup();
    engine.destroy();
  };

  return {
    engine,
    burst,
    explode,
    scatter,
    imageToParticles,
    textToParticles,
    addAttractor,
    removeAttractor,
    addRandomAttractors,
    removeAllAttractors,
    addBoundary,
    addMouseForce,
    removeMouseForce,
    attachClickBurst,
    destroy,
  };
}

/* ─── Screensaver ─── */

export interface ScreensaverOptions {
  canvas: HTMLCanvasElement;
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
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

/**
 * One-call screensaver setup: spawns particles across the full viewport width.
 * Defaults to the `snow` preset with continuous emission.
 */
export function startScreensaver({
  canvas,
  preset = 'snow',
  config,
  renderer = 'canvas',
  autoResize = true,
  mouseWind: mouseWindOption,
  container,
}: ScreensaverOptions): ScreensaverController {
  const basePreset = getPreset(preset);
  const mergedConfig: Partial<FullParticularConfig> = {
    ...basePreset,
    continuous: true,
    ...config,
  };

  const controller = createParticles({
    canvas,
    preset,
    config: mergedConfig,
    renderer,
    autoResize,
    container,
  });

  const pixelRatio = controller.engine.pixelRatio;
  const sourceW = container ? container.clientWidth : window.innerWidth;
  const spawnWidth = sourceW / pixelRatio;

  const emitter = new Emitter({
    point: new Vector(sourceW / 2 / pixelRatio, 0),
    ...configureParticle(mergedConfig),
    spawnWidth,
    spawnHeight: defaultParticle.spawnHeight,
    icons: [],
  });

  controller.engine.addEmitter(emitter);
  emitter.isEmitting = true;
  emitter.emit();

  const cleanups: Array<() => void> = [];

  // Gentle mouse wind — snowflakes drift away from cursor movement.
  if (mouseWindOption !== false) {
    controller.addMouseForce({
      ...defaultMouseWind,
      track: true,
      ...mouseWindOption,
    });
  }

  if (autoResize && !container) {
    // Viewport mode: listen to window resize for emitter spawn width.
    // Container mode: ResizeObserver is already set up in createParticles,
    // and the emitter spawn width is updated via the engine's onResize dispatch.
    const onResize = () => {
      const newSpawnWidth = window.innerWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = window.innerWidth / 2 / pixelRatio;
    };
    window.addEventListener('resize', onResize);
    cleanups.push(() => window.removeEventListener('resize', onResize));
  }

  if (autoResize && container) {
    // Container mode: update emitter spawn width when container resizes.
    const ro = new ResizeObserver(() => {
      const newSpawnWidth = container.clientWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = container.clientWidth / 2 / pixelRatio;
    });
    ro.observe(container);
    cleanups.push(() => ro.disconnect());
  }

  const destroy = () => {
    for (const cleanup of cleanups) cleanup();
    controller.destroy();
  };

  return {
    engine: controller.engine,
    controller,
    destroy,
  };
}
