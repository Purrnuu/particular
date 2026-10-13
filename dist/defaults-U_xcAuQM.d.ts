import { u as ParticularConfig, q as ParticleConfig, R as RendererType, k as FullParticularConfig } from './particular-D4GlsUaf.js';

type ParticleDefaults = Required<Omit<ParticleConfig, 'detonate'>>;
/** Return type of configureParticular() — the fully-merged config used by helpers. */
type MergedConfig = Required<Omit<ParticularConfig, 'container'>> & ParticleDefaults & {
    renderer?: RendererType;
    container?: HTMLElement;
};
declare function configureParticular(configuration?: FullParticularConfig): MergedConfig;
declare function configureParticle<T extends Partial<ParticleConfig>>(overrides?: T, base?: ParticleConfig): ParticleDefaults & T;

export { type MergedConfig as M, configureParticular as a, configureParticle as c };
