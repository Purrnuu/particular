import { t as Particular, P as Particle } from '../particular-D4GlsUaf.cjs';

interface StrokeConfig {
    color: string;
    thickness: number;
}
declare class CanvasRenderer {
    target: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    name: string;
    particular: Particular | null;
    pixelRatio: number;
    stroke?: StrokeConfig;
    private ghostPool;
    private ghostPoolIdx;
    constructor(target: HTMLCanvasElement);
    init(particular: Particular, pixelRatio: number): void;
    resize: (args?: {
        width: number;
        height: number;
    }) => void;
    onUpdate: () => void;
    onUpdateAfter: () => void;
    onParticleCreated: () => void;
    onParticleUpdated: (particle?: Particle) => void;
    onParticleDead: (particle?: Particle) => void;
    drawImage(particle: Particle): void;
    drawBasicElement(particle: Particle): void;
    private drawTrails;
    private makeTrailGhost;
    private applyShadow;
    private setBlendMode;
    private drawCircle;
    private drawSquare;
    private drawRoundedRectangle;
    private drawTriangle;
    private drawStar;
    private drawRing;
    private drawSparkle;
    destroy(): void;
    remove(): void;
}

export { CanvasRenderer };
