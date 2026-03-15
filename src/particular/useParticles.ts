import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent, MutableRefObject } from 'react';

import {
  createParticles,
  type BurstOptions,
  type ParticlesController,
} from './convenience';
import { startScreensaver } from './convenience/screensaver';
import type { ScreensaverController } from './convenience/types';
import { getParticlesBackgroundLayerStyle, getParticlesContainerLayerStyle } from './canvasStyles';
import type { FullParticularConfig, MouseForceConfig, RendererType, ExplodeOptions, ImageParticlesConfig, TextImageConfig } from './types';
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
  /** Full-viewport click-through style when backgroundLayer is true; use as <canvas style={canvasStyle} /> */
  canvasStyle: CSSProperties | undefined;
  /** The full particles controller. Available after mount. */
  controller: ParticlesController | null;
  burst: (options: BurstOptions) => void;
  burstFromEvent: (
    event: MouseEvent | ReactMouseEvent<HTMLElement> | ReactMouseEvent<HTMLButtonElement>,
    overrides?: Partial<FullParticularConfig>,
  ) => void;
  explode: (options?: ExplodeOptions) => void;
  scatter: (options?: { velocity?: number }) => void;
  imageToParticles: (config: ImageParticlesConfig) => void;
  textToParticles: (
    text: string,
    config?: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> },
  ) => void;
}

/**
 * Hooks-first API for React apps.
 *
 * Usage:
 * const { canvasRef, canvasStyle, burstFromEvent } = useParticles({ preset: "magic" });
 * return (
 *   <>
 *     <canvas ref={canvasRef} style={canvasStyle} />
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
      config,
      renderer,
      autoResize,
      autoClick,
      clickTarget,
      container,
      mouseForce,
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [preset, config, renderer, autoResize, autoClick, clickTarget, container, mouseForce]);

  const burst = useCallback((options: BurstOptions) => {
    controllerRef.current?.burst(options);
  }, []);

  const burstFromEvent = useCallback(
    (
      event: MouseEvent | ReactMouseEvent<HTMLElement> | ReactMouseEvent<HTMLButtonElement>,
      overrides?: Partial<FullParticularConfig>,
    ) => {
      const { clientX, clientY } = event;
      controllerRef.current?.burst({
        x: clientX,
        y: clientY,
        ...(overrides ?? {}),
      });
    },
    [],
  );

  const explode = useCallback((options?: ExplodeOptions) => {
    controllerRef.current?.explode(options);
  }, []);

  const scatter = useCallback((options?: { velocity?: number }) => {
    controllerRef.current?.scatter(options);
  }, []);

  const imageToParticles = useCallback((config: ImageParticlesConfig) => {
    controllerRef.current?.imageToParticles(config);
  }, []);

  const textToParticles = useCallback(
    (
      text: string,
      config?: Omit<ImageParticlesConfig, 'image'> & { textConfig?: Omit<TextImageConfig, 'text'> },
    ) => {
      controllerRef.current?.textToParticles(text, config);
    },
    [],
  );

  return {
    canvasRef,
    canvasStyle,
    controller: controllerRef.current,
    burst,
    burstFromEvent,
    explode,
    scatter,
    imageToParticles,
    textToParticles,
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
      config,
      renderer,
      autoResize,
      mouseWind,
      container,
    });

    screensaverRef.current = screensaver;

    return () => {
      screensaver.destroy();
      screensaverRef.current = null;
    };
  }, [preset, config, renderer, autoResize, mouseWind, container]);

  const destroy = useCallback(() => {
    screensaverRef.current?.destroy();
    screensaverRef.current = null;
  }, []);

  return {
    canvasRef,
    canvasStyle,
    destroy,
  };
}
