import { describe, expect, it } from 'vitest';
import Attractor from '../src/particular/components/attractor';
import Vector from '../src/particular/utils/vector';

describe('Attractor', () => {
  describe('constructor', () => {
    it('merges config with defaults', () => {
      const a = new Attractor({ x: 100, y: 200, strength: 2 });
      expect(a.position.x).toBe(100);
      expect(a.position.y).toBe(200);
      expect(a.strength).toBe(2);
      expect(a.radius).toBe(150); // default
    });
  });

  describe('getForce', () => {
    it('returns zero force when particle is at attractor position', () => {
      const a = new Attractor({ x: 100, y: 100 });
      const f = a.getForce(new Vector(100, 100));
      expect(f.x).toBe(0);
      expect(f.y).toBe(0);
    });

    it('returns zero force when particle is beyond radius', () => {
      const a = new Attractor({ x: 0, y: 0, radius: 100 });
      const f = a.getForce(new Vector(200, 0));
      expect(f.x).toBe(0);
      expect(f.y).toBe(0);
    });

    it('returns zero force when particle is exactly at radius edge', () => {
      const a = new Attractor({ x: 0, y: 0, radius: 100 });
      const f = a.getForce(new Vector(100, 0));
      // At boundary: falloff = 1 - 100/100 = 0, so scale = 0, force = dx * 0 = -0
      expect(f.x).toBeCloseTo(0, 10);
      expect(f.y).toBeCloseTo(0, 10);
    });

    it('applies linear falloff within radius', () => {
      const a = new Attractor({ x: 0, y: 0, strength: 1, radius: 100 });
      // Particle at (50, 0): dist=50, falloff = 1 - 50/100 = 0.5
      // scale = strength * falloff / dist = 1 * 0.5 / 50 = 0.01
      // force = dx * scale = (0-50) * 0.01 = -0.5 (toward attractor from right)
      const f = a.getForce(new Vector(50, 0));
      expect(f.x).toBeCloseTo(-0.5, 10);
      expect(f.y).toBeCloseTo(0, 10);
    });

    it('force is stronger closer to attractor', () => {
      const a = new Attractor({ x: 0, y: 0, strength: 1, radius: 100 });
      // _tempForce is reused — capture values before next call
      const fNear = a.getForce(new Vector(10, 0));
      const nearX = fNear.x;
      const fFar = a.getForce(new Vector(80, 0));
      const farX = fFar.x;
      // Both point toward attractor (negative x)
      expect(nearX).toBeLessThan(0);
      expect(farX).toBeLessThan(0);
      // Near is stronger
      expect(Math.abs(nearX)).toBeGreaterThan(Math.abs(farX));
    });

    it('negative strength repels', () => {
      const a = new Attractor({ x: 0, y: 0, strength: -1, radius: 100 });
      // Particle to the right at (50, 0)
      const f = a.getForce(new Vector(50, 0));
      // Repulsion: force points away from attractor (positive x)
      expect(f.x).toBeGreaterThan(0);
    });

    it('handles diagonal positions correctly', () => {
      const a = new Attractor({ x: 0, y: 0, strength: 1, radius: 200 });
      const f = a.getForce(new Vector(30, 40));
      // dist = 50, dx = -30, dy = -40
      // falloff = 1 - 50/200 = 0.75
      // scale = 1 * 0.75 / 50 = 0.015
      // fx = -30 * 0.015 = -0.45, fy = -40 * 0.015 = -0.6
      expect(f.x).toBeCloseTo(-0.45, 10);
      expect(f.y).toBeCloseTo(-0.6, 10);
    });

    it('force direction points toward attractor', () => {
      const a = new Attractor({ x: 100, y: 100, strength: 1, radius: 200 });
      // Particle at origin, attractor at (100,100)
      const f = a.getForce(new Vector(0, 0));
      // Force should point toward (100, 100) — both positive
      expect(f.x).toBeGreaterThan(0);
      expect(f.y).toBeGreaterThan(0);
    });

    it('reuses _tempForce object (returns same reference)', () => {
      const a = new Attractor({ x: 0, y: 0, radius: 100 });
      const f1 = a.getForce(new Vector(50, 0));
      const f2 = a.getForce(new Vector(0, 50));
      // Same reference — caller must consume before next call
      expect(f1).toBe(f2);
    });
  });
});
