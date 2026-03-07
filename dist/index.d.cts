import { F as FullParticularConfig, P as ParticularConfig, a as ParticleConfig, R as RendererType, b as Particular, B as BurstSettings, c as PresetName, d as ParticlesController, e as BurstOptions } from './standalone-BrlQr_5y.cjs';
export { A as Attractor, f as AttractorConfig, g as BlendMode, C as CanvasRenderer, h as CreateParticlesOptions, E as Emitter, i as EmitterConfiguration, j as FPSOverlayController, k as FPSOverlayOptions, l as ForceSource, M as MouseForce, m as MouseForceConfig, n as Particle, o as ParticleConstructorParams, p as ParticleShape, S as ScreensaverController, q as ScreensaverOptions, r as ShapeConfig, V as Vector, W as WebGLRenderer, s as WebGLRendererOptions, t as createParticles, u as getParticlesBackgroundLayerStyle, v as particlesBackgroundLayerStyle, D as particlesDefaultZIndex, w as presets, x as showFPSOverlay, y as startScreensaver } from './standalone-BrlQr_5y.cjs';
import React, { ComponentType, MutableRefObject, CSSProperties, MouseEvent as MouseEvent$1 } from 'react';

declare function configureParticular(configuration?: FullParticularConfig): Required<ParticularConfig> & Required<ParticleConfig> & {
    renderer?: RendererType;
};

interface CanvasWrapperState {
    width: number;
    height: number;
}
interface CreateSettings extends Partial<ParticleConfig> {
    x?: number;
    y?: number;
    icons?: (string | HTMLImageElement)[];
    [key: string]: unknown;
}
declare class CanvasWrapper extends React.Component<unknown, CanvasWrapperState> {
    canvas: HTMLCanvasElement | null;
    particular: Particular;
    configuration?: ReturnType<typeof configureParticular>;
    constructor(props: unknown);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onWindowResize: () => void;
    configure: (configuration?: FullParticularConfig) => void;
    create: (settings?: CreateSettings) => void;
    render(): React.ReactNode;
}

declare const particularWrapper: (configuration?: FullParticularConfig) => <P extends object = object>(WrappedComponent: ComponentType<P>) => {
    new (props: P): {
        particles: CanvasWrapper | null;
        portalContainer: HTMLDivElement;
        componentDidMount(): void;
        componentWillUnmount(): void;
        burst: (settings: BurstSettings) => void;
        render(): React.ReactNode;
        context: unknown;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<P>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType?: React.Context<any> | undefined;
};

declare const withParticles: (configuration?: FullParticularConfig) => <P extends object = object>(WrappedComponent: ComponentType<P>) => {
    new (props: P): {
        particles: CanvasWrapper | null;
        portalContainer: HTMLDivElement;
        componentDidMount(): void;
        componentWillUnmount(): void;
        burst: (settings: BurstSettings) => void;
        render(): React.ReactNode;
        context: unknown;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<P>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType?: React.Context<any> | undefined;
};

interface UseParticlesOptions {
    preset?: PresetName;
    config?: Partial<FullParticularConfig>;
    renderer?: 'canvas' | 'webgl';
    autoResize?: boolean;
    autoClick?: boolean;
    clickTarget?: EventTarget;
    /** When true (default), result includes canvasStyle for a full-viewport click-through canvas. */
    backgroundLayer?: boolean;
}
interface UseParticlesResult {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    /** Full-viewport click-through style when backgroundLayer is true; use as <canvas style={canvasStyle} /> */
    canvasStyle: CSSProperties | undefined;
    controller: ParticlesController | null;
    burst: (options: BurstOptions) => void;
    burstFromEvent: (event: MouseEvent | MouseEvent$1<HTMLElement> | MouseEvent$1<HTMLButtonElement>, overrides?: Partial<FullParticularConfig>) => void;
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
declare function useParticles({ preset, config, renderer, autoResize, autoClick, clickTarget, backgroundLayer, }?: UseParticlesOptions): UseParticlesResult;
interface UseScreensaverOptions {
    preset?: PresetName;
    config?: Partial<FullParticularConfig>;
    renderer?: RendererType;
    autoResize?: boolean;
    /** When true (default), result includes canvasStyle for a full-viewport click-through canvas. */
    backgroundLayer?: boolean;
}
interface UseScreensaverResult {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    /** Full-viewport click-through style when backgroundLayer is true; use as <canvas style={canvasStyle} /> */
    canvasStyle: CSSProperties | undefined;
    destroy: () => void;
}
/**
 * React hook for a one-call screensaver setup.
 * Wraps `startScreensaver()` in a `useEffect`.
 */
declare function useScreensaver({ preset, config, renderer, autoResize, backgroundLayer, }?: UseScreensaverOptions): UseScreensaverResult;

export { BurstOptions, BurstSettings, FullParticularConfig, ParticleConfig, ParticlesController, Particular, ParticularConfig, particularWrapper as ParticularWrapper, PresetName, RendererType, type UseParticlesOptions, type UseParticlesResult, type UseScreensaverOptions, type UseScreensaverResult, useParticles, useScreensaver, withParticles };
