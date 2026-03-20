/**
 * Camera for 3D particle scenes. Computes a viewProjection matrix
 * from position/target/fov. Provides orbit controls for interactive demos.
 */

import { perspective, lookAt, multiply, type Mat4 } from '../utils/mat4';

export interface CameraConfig {
  /** Vertical field of view in degrees. Default 60. */
  fov?: number;
  /** Camera position. Default { x: 0, y: 0, z: 500 }. */
  position?: { x: number; y: number; z: number };
  /** Look-at target. Default { x: 0, y: 0, z: 0 }. */
  target?: { x: number; y: number; z: number };
  /** Up direction. Default { x: 0, y: 1, z: 0 }. */
  up?: { x: number; y: number; z: number };
  /** Near clip plane. Default 1. */
  near?: number;
  /** Far clip plane. Default 5000. */
  far?: number;
}

export const defaultCamera: Required<CameraConfig> = {
  fov: 60,
  position: { x: 0, y: 0, z: 500 },
  target: { x: 0, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  near: 1,
  far: 5000,
};

export class Camera {
  fov: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  up: { x: number; y: number; z: number };
  near: number;
  far: number;
  viewProjection: Mat4;

  constructor(config?: CameraConfig) {
    const c = { ...defaultCamera, ...config };
    this.fov = c.fov;
    this.position = { ...c.position };
    this.target = { ...c.target };
    this.up = { ...c.up };
    this.near = c.near;
    this.far = c.far;
    this.viewProjection = new Float32Array(16);
  }

  /** Recompute viewProjection matrix. Call after changing position/target/fov. */
  update(aspect: number): void {
    const fovRad = (this.fov * Math.PI) / 180;
    const proj = perspective(fovRad, aspect, this.near, this.far);
    const view = lookAt(this.position, this.target, this.up);
    this.viewProjection = multiply(proj, view);
  }

  /** Set camera position from spherical coordinates around the target. */
  orbit(azimuth: number, elevation: number, distance: number): void {
    const cosElev = Math.cos(elevation);
    this.position.x = this.target.x + distance * cosElev * Math.cos(azimuth);
    this.position.y = this.target.y + distance * Math.sin(elevation);
    this.position.z = this.target.z + distance * cosElev * Math.sin(azimuth);
  }

  /** Attach mouse-drag orbit + scroll-zoom controls to a canvas. Returns cleanup function. */
  enableOrbitControls(canvas: HTMLCanvasElement): () => void {
    let azimuth = Math.atan2(
      this.position.z - this.target.z,
      this.position.x - this.target.x,
    );
    let elevation = Math.asin(
      Math.min(1, Math.max(-1,
        (this.position.y - this.target.y) / this.getDistance(),
      )),
    );
    let distance = this.getDistance();
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // Canvas may have pointer-events: none from default styles — enable for orbit controls
    const prevPointerEvents = canvas.style.pointerEvents;
    canvas.style.pointerEvents = 'auto';

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      azimuth -= dx * 0.005;
      elevation = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, elevation + dy * 0.005));
      this.orbit(azimuth, elevation, distance);
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      distance = Math.max(this.near + 10, distance * (1 + e.deltaY * 0.001));
      this.orbit(azimuth, elevation, distance);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.style.pointerEvents = prevPointerEvents;
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }

  getDistance(): number {
    const dx = this.position.x - this.target.x;
    const dy = this.position.y - this.target.y;
    const dz = this.position.z - this.target.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
