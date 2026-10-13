import { t as Particular } from '../particular-D4GlsUaf.js';

interface WebGLRendererOptions {
    /** Max particles per draw call (default 16384). Increase for fewer draw calls with many particles. */
    maxInstances?: number;
}
declare class WebGLRenderer {
    target: HTMLCanvasElement;
    gl: WebGL2RenderingContext | null;
    program: WebGLProgram | null;
    imageProgram: WebGLProgram | null;
    quadBuffer: WebGLBuffer | null;
    circleQuadBuffer: WebGLBuffer | null;
    instanceBuffer: WebGLBuffer | null;
    particular: Particular | null;
    pixelRatio: number;
    private instanceData;
    private maxInstances;
    private instanceStride;
    private resolutionUniform;
    private softnessUniform;
    private glowUniform;
    private glowExpandUniform;
    private glowSizeUniform;
    private glowColorUniform;
    private isShadowUniform;
    private shadowColorUniform;
    private shadowBlurUniform;
    private imageResolutionUniform;
    private imageTintUniform;
    private imageIsShadowUniform;
    private imageShadowColorUniform;
    private imageShadowBlurUniform;
    private textureCache;
    private circleAttrPos;
    private circleAttrParticlePos;
    private circleAttrSize;
    private circleAttrRotation;
    private circleAttrColor;
    private circleAttrShape;
    private imageAttrPos;
    private imageAttrParticlePos;
    private imageAttrSize;
    private imageAttrRotation;
    private imageAttrColor;
    private imageTexUniform;
    private ghostPool;
    private ghostPoolIdx;
    private expandedArr;
    private batchPool;
    private batchPoolIdx;
    constructor(target: HTMLCanvasElement, options?: WebGLRendererOptions);
    init(particular: Particular, pixelRatio: number): void;
    private getOrCreateTexture;
    private compileShader;
    resize: (args?: {
        width: number;
        height: number;
    }) => void;
    onUpdate: () => void;
    private expandParticlesWithTrails;
    private acquireGhost;
    private buildBatches;
    private _batchResult;
    private acquireBatch;
    private fillInstanceData;
    private drawCircleInstances;
    private drawCircleBatch;
    private drawImageInstances;
    private drawImageBatch;
    onUpdateAfter: () => void;
    destroy(): void;
    remove(): void;
}

export { WebGLRenderer, type WebGLRendererOptions };
