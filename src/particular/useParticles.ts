import { useCallback, useEffect, useRef, useState } from 'react';
import { useStableConfig } from './useStableConfig';
import type { CSSProperties, MouseEvent as ReactMouseEvent, MutableRefObject } from 'react';

import { createParticles, type BurstOptions, type ParticlesController } from './convenience';
import { startScreensaver } from './convenience/screensaver';
import type { ScreensaverController } from './convenience/types';
import { getParticlesBackgroundLayerStyle, getParticlesContainerLayerStyle } from './canvasStyles';
import type {
  FullParticularConfig,
  MouseForceConfig,
  RendererType,
  ExplodeOptions,
  ImageParticlesConfig,
  TextImageConfig,
  ElementParticlesConfig,
  ImageShatterConfig,
  WobbleConfig,
} from './types';
import type { PresetName } from './presets';

export interface UseParticlesOptions {
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  /** Rendering backend. Default `'webgl'`. */
  renderer?: RendererType;
  autoResize?: boolean;
  autoClick?: boolean;
  clickTarget?: EventTarget;
  /** When true (default), result includes canvasStyle for a full-viewport click-through canvas. */
  backgroundLayer?: boolean;
  /** Container element for container-aware mode. Canvas sizes to this element
   *  and coordinates become container-relative. Omit for full-viewport mode. */
  container?: HTMLElement;
  /** Add a mouse-tracking force. `true` uses sensible defaults, or pass a config object. */
  mouseForce?: boolean | MouseForceConfig;
}

export interface UseParticlesResult {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  /** Use as the canvas key so renderer changes create a fresh browser context. */
  canvasKey: RendererType;
  /** Full-viewport click-through style when backgroundLayer is true; use as <canvas style={canvasStyle} /> */
  canvasStyle: CSSProperties | undefined;
  /** The full particles controller. Available after mount. */
  controller: ParticlesController | null;
  burst: (options: BurstOptions) => void;
  burstFromEvent: (
    event: MouseEvent | ReactMouseEvent<HTMLElement> | ReactMouseEvent<HTMLButtonElement>,
    overrides?: Partial<FullParticularConfig>
  ) => void;
  explode: (options?: ExplodeOptions) => void;
  scatter: (options?: { velocity?: number; rotation?: number }) => void;
  startWobble: (config?: WobbleConfig) => void;
  stopWobble: () => void;
  imageToParticles: ParticlesController['imageToParticles'];
  textToParticles: (
    text: string,
    config?: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> }
  ) => ReturnType<ParticlesController['textToParticles']>;
  elementToParticles: ParticlesController['elementToParticles'];
  shatterImage: ParticlesController['shatterImage'];
  shatterText: (
    text: string,
    config?: Omit<ImageShatterConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> }
  ) => ReturnType<ParticlesController['shatterText']>;
  setIdleEffect: (enabled: boolean) => void;
}

/**
 * Hooks-first API for React apps.
 *
 * Usage:
 * const { canvasRef, canvasKey, canvasStyle, burstFromEvent } = useParticles({ preset: "magic" });
 * return (
 *   <>
 *     <canvas key={canvasKey} ref={canvasRef} style={canvasStyle} />
 *     <button onClick={burstFromEvent}>Burst</button>
 *   </>
 * );
 */
export function useParticles({
  preset = 'magic',
  config,
  renderer = 'webgl',
  autoResize = true,
  autoClick = false,
  clickTarget,
  backgroundLayer = true,
  container,
  mouseForce,
}: UseParticlesOptions = {}): UseParticlesResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<ParticlesController | null>(null);
  const [controller, setController] = useState<ParticlesController | null>(null);
  const stableConfig = useStableConfig(config);
  const stableMouseForce = useStableConfig(mouseForce);

  const canvasStyle = container
    ? getParticlesContainerLayerStyle(config?.zIndex)
    : backgroundLayer
      ? getParticlesBackgroundLayerStyle(config?.zIndex)
      : undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset,
      config: stableConfig,
      renderer,
      autoResize,
      autoClick,
      clickTarget,
      container,
      mouseForce: stableMouseForce,
    });

    controllerRef.current = controller;
    setController(controller);

    return () => {
      controller.destroy();
      controllerRef.current = null;
      setController(null);
    };
  }, [
    preset,
    stableConfig,
    renderer,
    autoResize,
    autoClick,
    clickTarget,
    container,
    stableMouseForce,
  ]);

  const requireController = useCallback(() => {
    const active = controllerRef.current;
    if (!active)
      throw new Error('Particular: the canvas must be mounted before creating particles.');
    return active;
  }, []);

  const burst = useCallback((options: BurstOptions) => {
    controllerRef.current?.burst(options);
  }, []);

  const burstFromEvent = useCallback(
    (
      event: MouseEvent | ReactMouseEvent<HTMLElement> | ReactMouseEvent<HTMLButtonElement>,
      overrides?: Partial<FullParticularConfig>
    ) => {
      const { clientX, clientY } = event;
      controllerRef.current?.burst({
        x: clientX,
        y: clientY,
        ...(overrides ?? {}),
      });
    },
    []
  );

  const explode = useCallback((options?: ExplodeOptions) => {
    controllerRef.current?.explode(options);
  }, []);

  const scatter = useCallback((options?: { velocity?: number; rotation?: number }) => {
    controllerRef.current?.scatter(options);
  }, []);

  const startWobble = useCallback((config?: WobbleConfig) => {
    controllerRef.current?.startWobble(config);
  }, []);

  const stopWobble = useCallback(() => {
    controllerRef.current?.stopWobble();
  }, []);

  const imageToParticles = useCallback(
    async (config: ImageParticlesConfig) => {
      return requireController().imageToParticles(config);
    },
    [requireController]
  );

  const textToParticles = useCallback(
    async (
      text: string,
      config?: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> }
    ) => {
      return requireController().textToParticles(text, config);
    },
    [requireController]
  );

  const elementToParticles = useCallback(
    async (element: HTMLElement, config?: ElementParticlesConfig) => {
      return requireController().elementToParticles(element, config);
    },
    [requireController]
  );

  const shatterImage = useCallback(
    async (config: ImageShatterConfig) => {
      return requireController().shatterImage(config);
    },
    [requireController]
  );

  const shatterText = useCallback(
    async (
      text: string,
      config?: Omit<ImageShatterConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> }
    ) => {
      return requireController().shatterText(text, config);
    },
    [requireController]
  );

  const setIdleEffect = useCallback((enabled: boolean) => {
    controllerRef.current?.setIdleEffect(enabled);
  }, []);

  return {
    canvasRef,
    canvasKey: renderer,
    canvasStyle,
    controller,
    burst,
    burstFromEvent,
    explode,
    scatter,
    startWobble,
    stopWobble,
    imageToParticles,
    textToParticles,
    elementToParticles,
    shatterImage,
    shatterText,
    setIdleEffect,
  };
}

/* ─── useScreensaver ─── */

export interface UseScreensaverOptions {
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  /** Rendering backend. Default `'webgl'`. */
  renderer?: RendererType;
  autoResize?: boolean;
  /** When true (default), result includes canvasStyle for a full-viewport click-through canvas. */
  backgroundLayer?: boolean;
  /** Mouse wind configuration. Pass `false` to disable entirely. */
  mouseWind?: MouseForceConfig | false;
  /** Container element for container-aware mode. Omit for full-viewport mode. */
  container?: HTMLElement;
}

export interface UseScreensaverResult {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  /** Use as the canvas key so renderer changes create a fresh browser context. */
  canvasKey: RendererType;
  /** Full-viewport click-through style when backgroundLayer is true; use as <canvas style={canvasStyle} /> */
  canvasStyle: CSSProperties | undefined;
  destroy: () => void;
}

/**
 * React hook for a one-call screensaver setup.
 * Wraps `startScreensaver()` in a `useEffect`.
 */
export function useScreensaver({
  preset = 'snow',
  config,
  renderer = 'webgl',
  autoResize = true,
  backgroundLayer = true,
  mouseWind,
  container,
}: UseScreensaverOptions = {}): UseScreensaverResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const screensaverRef = useRef<ScreensaverController | null>(null);
  const stableConfig = useStableConfig(config);
  const stableMouseWind = useStableConfig(mouseWind);

  const canvasStyle = container
    ? getParticlesContainerLayerStyle(config?.zIndex)
    : backgroundLayer
      ? getParticlesBackgroundLayerStyle(config?.zIndex)
      : undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const screensaver = startScreensaver({
      canvas,
      preset,
      config: stableConfig,
      renderer,
      autoResize,
      mouseWind: stableMouseWind,
      container,
    });

    screensaverRef.current = screensaver;

    return () => {
      screensaver.destroy();
      screensaverRef.current = null;
    };
  }, [preset, stableConfig, renderer, autoResize, stableMouseWind, container]);

  const destroy = useCallback(() => {
    screensaverRef.current?.destroy();
    screensaverRef.current = null;
  }, []);

  return {
    canvasRef,
    canvasKey: renderer,
    canvasStyle,
    destroy,
  };
}
