/**
 * Minimal 4×4 matrix math for 3D projection. Column-major Float32Array layout
 * matching WebGL's uniform convention. Zero dependencies.
 */
type Mat4 = Float32Array;

/**
 * Camera for 3D particle scenes. Computes a viewProjection matrix
 * from position/target/fov. Provides orbit controls for interactive demos.
 */

interface CameraConfig {
    /** Vertical field of view in degrees. Default 60. */
    fov?: number;
    /** Camera position. Default { x: 0, y: 0, z: 500 }. */
    position?: {
        x: number;
        y: number;
        z: number;
    };
    /** Look-at target. Default { x: 0, y: 0, z: 0 }. */
    target?: {
        x: number;
        y: number;
        z: number;
    };
    /** Up direction. Default { x: 0, y: 1, z: 0 }. */
    up?: {
        x: number;
        y: number;
        z: number;
    };
    /** Near clip plane. Default 1. */
    near?: number;
    /** Far clip plane. Default 5000. */
    far?: number;
}
declare const defaultCamera: Required<CameraConfig>;
declare class Camera {
    fov: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    target: {
        x: number;
        y: number;
        z: number;
    };
    up: {
        x: number;
        y: number;
        z: number;
    };
    near: number;
    far: number;
    viewProjection: Mat4;
    constructor(config?: CameraConfig);
    /** Recompute viewProjection matrix. Call after changing position/target/fov. */
    update(aspect: number): void;
    /** Set camera position from spherical coordinates around the target. */
    orbit(azimuth: number, elevation: number, distance: number): void;
    /** Attach mouse-drag orbit + scroll-zoom controls to a canvas. Returns cleanup function. */
    enableOrbitControls(canvas: HTMLCanvasElement): () => void;
    getDistance(): number;
}

export { Camera as C, type CameraConfig as a, defaultCamera as d };
