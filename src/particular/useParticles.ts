import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent, MutableRefObject } from 'react';

import {
  createParticles,
  type BurstOptions,
  type CreateParticlesOptions,
  type ParticlesController,
} from './convenience';
import { getParticlesBackgroundLayerStyle } from './canvasStyles';
import type { FullParticularConfig } from './types';
import type { PresetName } from './presets';

export interface UseParticlesOptions {
  preset?: PresetName;
  config?: Partial<FullParticularConfig>;
  autoResize?: boolean;
  autoClick?: boolean;
  clickTarget?: EventTarget;
  /** When true (default), result includes canvasStyle for a full-viewport click-through canvas. */
  backgroundLayer?: boolean;
}

export interface UseParticlesResult {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  /** Full-viewport click-through style when backgroundLayer is true; use as <canvas style={canvasStyle} /> */
  canvasStyle: CSSProperties | undefined;
  controller: ParticlesController | null;
  burst: (options: BurstOptions) => void;
  burstFromEvent: (
    event: MouseEvent | ReactMouseEvent<HTMLElement> | ReactMouseEvent<HTMLButtonElement>,
    overrides?: Partial<FullParticularConfig>,
  ) => void;
}

/**
 * Hooks-first API for React apps.
 *
 * Usage:
 * const { canvasRef, burstFromEvent } = useParticles({ preset: "magic" });
 * return (
 *   <>
 *     <canvas ref={canvasRef} className="particular" />
 *     <button onClick={burstFromEvent}>Burst</button>
 *   </>
 * );
 */
export function useParticles({
  preset = 'magic',
  config,
  autoResize = true,
  autoClick = false,
  clickTarget,
  backgroundLayer = true,
}: UseParticlesOptions = {}): UseParticlesResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  const canvasStyle = backgroundLayer
    ? getParticlesBackgroundLayerStyle(config?.zIndex)
    : undefined;

  const createOptions = useMemo<CreateParticlesOptions>(
    () => ({
      // canvas is injected in effect when ref is available
      canvas: null as unknown as HTMLCanvasElement,
      preset,
      config,
      autoResize,
      autoClick,
      clickTarget,
    }),
    [preset, config, autoResize, autoClick, clickTarget],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: createOptions.preset,
      config: createOptions.config,
      autoResize: createOptions.autoResize,
      autoClick: createOptions.autoClick,
      clickTarget: createOptions.clickTarget,
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [createOptions]);

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

  return {
    canvasRef,
    canvasStyle,
    controller: controllerRef.current,
    burst,
    burstFromEvent,
  };
}
