import { t as Particular, w as ResourceScope } from './particular-D4GlsUaf.js';
export { e as Emitter, f as EmitterConfiguration, i as ForceSource, j as FrameContext, k as FullParticularConfig, P as Particle, q as ParticleConfig, u as ParticularConfig, V as Vector, v as setParticlePoolSize } from './particular-D4GlsUaf.js';
import { M as MergedConfig } from './defaults-U_xcAuQM.js';
export { c as configureParticle, a as configureParticular } from './defaults-U_xcAuQM.js';

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
