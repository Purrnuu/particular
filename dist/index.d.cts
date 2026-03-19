import { P as Particular, c as configureParticular, F as FullParticularConfig, a as ParticleConfig, B as BurstSettings, b as PresetName, R as RendererType, M as MouseForceConfig, d as ParticlesController, e as BurstOptions, E as ExplodeOptions, W as WobbleConfig, I as ImageParticlesConfig, T as TextImageConfig, f as ElementParticlesConfig, g as ImageShatterConfig } from './standalone-D4E-hxbO.cjs';
export { A as Attractor, h as AttractorConfig, i as BlendMode, j as BoundaryConfig, k as BoundaryHandle, C as Camera, l as CameraConfig, m as CanvasRenderer, n as ChildExplosionConfig, o as ContainerGlowConfig, p as ContainerGlowHandle, q as CreateParticlesOptions, D as DetonateConfig, r as Emitter, s as EmitterConfiguration, t as FPSOverlayController, u as FPSOverlayOptions, v as FlockingForce, w as FlockingForceConfig, x as ForceSource, H as HomePositionConfig, y as IntroConfig, z as IntroMode, G as MouseForce, J as MouseTrailConfig, K as MouseTrailHandle, L as Particle, N as ParticleConstructorParams, O as ParticleShape, Q as ParticularConfig, S as ScreensaverController, U as ScreensaverOptions, V as ShapeConfig, X as Vector, Y as WebGL3DRenderer, Z as WebGL3DRendererOptions, _ as WebGLRenderer, $ as WebGLRendererOptions, a0 as applyCanvasStyles, a1 as canvasToDataURL, a2 as colorPalettes, a3 as configureParticle, a4 as createHeartImage, a5 as createParticles, a6 as createTextImage, a7 as defaultCamera, a8 as getParticlesBackgroundLayerStyle, a9 as getParticlesContainerLayerStyle, aa as particlesBackgroundLayerStyle, ab as particlesContainerLayerStyle, ac as particlesDefaultZIndex, ad as presets, ae as setParticlePoolSize, af as showFPSOverlay, ag as startScreensaver } from './standalone-D4E-hxbO.cjs';
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
        rotation?: number;
    }) => void;
    startWobble: (config?: WobbleConfig) => void;
    stopWobble: () => void;
    imageToParticles: (config: ImageParticlesConfig) => void;
    textToParticles: (text: string, config?: Omit<ImageParticlesConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => void;
    elementToParticles: (element: HTMLElement, config?: ElementParticlesConfig) => void;
    shatterImage: (config: ImageShatterConfig) => void;
    shatterText: (text: string, config?: Omit<ImageShatterConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => void;
    setIdleEffect: (enabled: boolean) => void;
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

export { BurstOptions, BurstSettings, ElementParticlesConfig, ExplodeOptions, FullParticularConfig, ImageParticlesConfig, ImageShatterConfig, MouseForceConfig, ParticleConfig, ParticlesController, Particular, particularWrapper as ParticularWrapper, PresetName, RendererType, TextImageConfig, type UseParticlesOptions, type UseParticlesResult, type UseScreensaverOptions, type UseScreensaverResult, WobbleConfig, useParticles, useScreensaver, withParticles };
