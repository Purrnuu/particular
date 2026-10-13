import { t as Particular } from '../particular-D4GlsUaf.js';
import { C as Camera, a as CameraConfig } from '../camera-DkBD-jlm.js';
export { d as defaultCamera } from '../camera-DkBD-jlm.js';

/**
 * WebGL2 3D particle renderer with perspective projection.
 *
 * Particles are rendered as camera-facing billboarded quads using SDF shapes.
 * All existing 2D shapes (circle, star, sparkle, etc.) work without modification.
 * Non-additive batches are sorted back-to-front for correct transparency.
 */

interface WebGL3DRendererOptions {
    maxInstances?: number;
    camera?: CameraConfig;
}
declare class WebGL3DRenderer {
    target: HTMLCanvasElement;
    camera: Camera;
    gl: WebGL2RenderingContext | null;
    particular: Particular | null;
    pixelRatio: number;
    private program;
    private imageProgram;
    private quadBuffer;
    private circleQuadBuffer;
    private instanceBuffer;
    private instanceData;
    private maxInstances;
    private instanceStride;
    private vpUniform;
    private resUniform;
    private refCenterUniform;
    private worldScaleUniform;
    private softnessUniform;
    private glowUniform;
    private glowExpandUniform;
    private glowSizeUniform;
    private glowColorUniform;
    private isShadowUniform;
    private shadowColorUniform;
    private shadowBlurUniform;
    private cAttrPos;
    private cAttrPPos;
    private cAttrSize;
    private cAttrRot;
    private cAttrColor;
    private cAttrShape;
    private imgVpUniform;
    private imgResUniform;
    private imgRefCenterUniform;
    private imgWorldScaleUniform;
    private imgTintUniform;
    private imgIsShadowUniform;
    private imgShadowColorUniform;
    private imgShadowBlurUniform;
    private imgTexUniform;
    private iAttrPos;
    private iAttrPPos;
    private iAttrSize;
    private iAttrRot;
    private iAttrColor;
    private textureCache;
    private ghostPool;
    private ghostPoolIdx;
    private expandedArr;
    private batchPool;
    private batchPoolIdx;
    private _batchResult;
    private sortArr;
    private _refCenterX;
    private _refCenterY;
    private _refWorldScale;
    private _refInitialized;
    constructor(target: HTMLCanvasElement, options?: WebGL3DRendererOptions);
    init(particular: Particular, pixelRatio: number): void;
    resize: (args?: {
        width: number;
        height: number;
    }) => void;
    onUpdate: () => void;
    onUpdateAfter: () => void;
    private sortBackToFront;
    private expandParticlesWithTrails;
    private acquireGhost;
    private buildBatches;
    private acquireBatch;
    private fillInstanceData;
    private drawCircleInstances;
    private drawCircleBatch;
    private drawImageInstances;
    private drawImageBatch;
    private getOrCreateTexture;
    /** Reference center X (logical coords), captured on first frame. 0 before first render. */
    get referenceCenterX(): number;
    /** Reference center Y (logical coords), captured on first frame. 0 before first render. */
    get referenceCenterY(): number;
    /** Reference worldScale, captured on first frame. 0 before first render. */
    get referenceWorldScale(): number;
    destroy(): void;
    remove(): void;
}

export { Camera, CameraConfig, WebGL3DRenderer, type WebGL3DRendererOptions };
