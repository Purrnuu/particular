import { describe, expect, it } from 'vitest';
import { Camera, defaultCamera } from '../src/particular/renderers/camera';

describe('Camera', () => {
  describe('constructor', () => {
    it('uses default values when no config provided', () => {
      const cam = new Camera();
      expect(cam.fov).toBe(defaultCamera.fov);
      expect(cam.position).toEqual(defaultCamera.position);
      expect(cam.target).toEqual(defaultCamera.target);
    });

    it('merges user config over defaults', () => {
      const cam = new Camera({ fov: 90, position: { x: 10, y: 20, z: 30 } });
      expect(cam.fov).toBe(90);
      expect(cam.position).toEqual({ x: 10, y: 20, z: 30 });
      // target should still be default
      expect(cam.target).toEqual(defaultCamera.target);
    });
  });

  describe('update', () => {
    it('computes a viewProjection matrix', () => {
      const cam = new Camera();
      cam.update(16 / 9);
      // viewProjection should be a Float32Array with 16 elements
      expect(cam.viewProjection).toBeInstanceOf(Float32Array);
      expect(cam.viewProjection.length).toBe(16);
      // Should not be all zeros
      const sum = cam.viewProjection.reduce((a, b) => a + Math.abs(b), 0);
      expect(sum).toBeGreaterThan(0);
    });

    it('changes with different aspect ratios', () => {
      const cam = new Camera();
      cam.update(1);
      const vp1 = new Float32Array(cam.viewProjection);
      cam.update(2);
      let same = true;
      for (let i = 0; i < 16; i++) {
        if (Math.abs(vp1[i]! - cam.viewProjection[i]!) > 0.001) { same = false; break; }
      }
      expect(same).toBe(false);
    });
  });

  describe('orbit', () => {
    it('places camera at correct distance', () => {
      const cam = new Camera();
      cam.orbit(0, 0, 100);
      const dist = Math.sqrt(
        (cam.position.x - cam.target.x) ** 2 +
        (cam.position.y - cam.target.y) ** 2 +
        (cam.position.z - cam.target.z) ** 2,
      );
      expect(dist).toBeCloseTo(100, 5);
    });

    it('elevation PI/2 places camera above target', () => {
      const cam = new Camera();
      cam.orbit(0, Math.PI / 2 - 0.01, 200);
      expect(cam.position.y).toBeGreaterThan(cam.target.y + 190);
    });

    it('azimuth rotates around y-axis', () => {
      const cam = new Camera();
      cam.orbit(0, 0, 100);
      const pos0 = { ...cam.position };
      cam.orbit(Math.PI / 2, 0, 100);
      // Position should have rotated
      expect(cam.position.x).not.toBeCloseTo(pos0.x, 2);
    });
  });
});
