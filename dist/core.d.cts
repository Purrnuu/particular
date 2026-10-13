import { t as Particular, w as ResourceScope } from './particular-D4GlsUaf.cjs';
export { e as Emitter, f as EmitterConfiguration, i as ForceSource, j as FrameContext, k as FullParticularConfig, P as Particle, q as ParticleConfig, u as ParticularConfig, V as Vector, v as setParticlePoolSize } from './particular-D4GlsUaf.cjs';
import { M as MergedConfig } from './defaults-Df9Z7SYm.cjs';
export { c as configureParticle, a as configureParticular } from './defaults-Df9Z7SYm.cjs';

interface FeatureContext {
    engine: Particular;
    config: MergedConfig;
    container?: HTMLElement;
    resources: ResourceScope;
    coordinates: {
        /** CSS pixels relative to the viewport/container, without subtracting its offset. */
        localToEngine(x: number, y: number): {
            x: number;
            y: number;
        };
        /** Browser client coordinates; subtracts the container's current offset. */
        clientToEngine(x: number, y: number): {
            x: number;
            y: number;
        };
    };
}
declare function createFeatureContext(engine: Particular, config: MergedConfig): FeatureContext;

export { type FeatureContext, Particular, ResourceScope, createFeatureContext };
