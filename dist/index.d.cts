import { P as Particular, c as configureParticular, F as FullParticularConfig, a as ParticleConfig, B as BurstSettings, b as PresetName, R as RendererType, M as MouseForceConfig, d as ParticlesController, e as BurstOptions, E as ExplodeOptions, I as ImageParticlesConfig, T as TextImageConfig, f as ElementParticlesConfig } from './standalone-BR9yrqjw.cjs';
export { A as Attractor, g as AttractorConfig, h as BlendMode, i as BoundaryConfig, j as BoundaryHandle, C as CanvasRenderer, k as ChildExplosionConfig, l as CreateParticlesOptions, D as DetonateConfig, m as Emitter, n as EmitterConfiguration, o as FPSOverlayController, p as FPSOverlayOptions, q as ForceSource, H as HomePositionConfig, r as IntroConfig, s as IntroMode, t as MouseForce, u as Particle, v as ParticleConstructorParams, w as ParticleShape, x as ParticularConfig, S as ScreensaverController, y as ScreensaverOptions, z as ShapeConfig, V as Vector, W as WebGLRenderer, G as WebGLRendererOptions, J as applyCanvasStyles, K as canvasToDataURL, L as configureParticle, N as createHeartImage, O as createParticles, Q as createTextImage, U as getParticlesBackgroundLayerStyle, X as getParticlesContainerLayerStyle, Y as particlesBackgroundLayerStyle, Z as particlesContainerLayerStyle, _ as particlesDefaultZIndex, $ as presets, a0 as showFPSOverlay, a1 as startScreensaver } from './standalone-BR9yrqjw.cjs';
import React, { ComponentType, MutableRefObject, CSSProperties, MouseEvent as MouseEvent$1 } from 'react';

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
interface UseParticlesResult {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    /** Full-viewport click-through style when backgroundLayer is true; use as <canvas style={canvasStyle} /> */
    canvasStyle: CSSProperties | undefined;
    /** The full particles controller. Available after mount. */
    controller: ParticlesController | null;
    burst: (options: BurstOptions) => void;
    burstFromEvent: (event: MouseEvent | MouseEvent$1<HTMLElement> | MouseEvent$1<HTMLButtonElement>, overrides?: Partial<FullParticularConfig>) => void;
    explode: (options?: ExplodeOptions) => void;
    scatter: (options?: {
        velocity?: number;
    }) => void;
    imageToParticles: (config: ImageParticlesConfig) => void;
    textToParticles: (text: string, config?: Omit<ImageParticlesConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => void;
    elementToParticles: (element: HTMLElement, config?: ElementParticlesConfig) => void;
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
declare function useParticles({ preset, config, renderer, autoResize, autoClick, clickTarget, backgroundLayer, container, mouseForce, }?: UseParticlesOptions): UseParticlesResult;
interface UseScreensaverOptions {
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
declare function useScreensaver({ preset, config, renderer, autoResize, backgroundLayer, mouseWind, container, }?: UseScreensaverOptions): UseScreensaverResult;

export { BurstOptions, BurstSettings, ElementParticlesConfig, ExplodeOptions, FullParticularConfig, ImageParticlesConfig, MouseForceConfig, ParticleConfig, ParticlesController, Particular, particularWrapper as ParticularWrapper, PresetName, RendererType, TextImageConfig, type UseParticlesOptions, type UseParticlesResult, type UseScreensaverOptions, type UseScreensaverResult, useParticles, useScreensaver, withParticles };
