import { describe, expect, it } from 'vitest';
import Vector from '../src/particular/utils/vector';

describe('Vector', () => {
  describe('constructor', () => {
    it('defaults to (0, 0)', () => {
      const v = new Vector();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('accepts x and y', () => {
      const v = new Vector(3, 4);
      expect(v.x).toBe(3);
      expect(v.y).toBe(4);
    });

    it('defaults y to 0 when only x provided', () => {
      const v = new Vector(5);
      expect(v.x).toBe(5);
      expect(v.y).toBe(0);
    });
  });

  describe('getMagnitude', () => {
    it('returns 0 for zero vector', () => {
      expect(new Vector().getMagnitude()).toBe(0);
    });

    it('returns correct magnitude for 3-4-5 triangle', () => {
      expect(new Vector(3, 4).getMagnitude()).toBe(5);
    });

    it('returns correct magnitude for axis-aligned vector', () => {
      expect(new Vector(0, -7).getMagnitude()).toBe(7);
    });
  });

  describe('add', () => {
    it('adds another vector', () => {
      const v = new Vector(1, 2);
      v.add({ x: 3, y: 4 });
      expect(v.x).toBe(4);
      expect(v.y).toBe(6);
    });

    it('adds with scale factor', () => {
      const v = new Vector(1, 2);
      v.add({ x: 3, y: 4 }, 2);
      expect(v.x).toBe(7);
      expect(v.y).toBe(10);
    });

    it('adds with negative scale', () => {
      const v = new Vector(10, 10);
      v.add({ x: 3, y: 4 }, -1);
      expect(v.x).toBe(7);
      expect(v.y).toBe(6);
    });
  });

  describe('addFriction', () => {
    it('early returns when friction <= 0', () => {
      const v = new Vector(10, 10);
      v.addFriction(0);
      expect(v.x).toBe(10);
      expect(v.y).toBe(10);

      v.addFriction(-0.5);
      expect(v.x).toBe(10);
      expect(v.y).toBe(10);
    });

    it('applies friction factor using pow', () => {
      const v = new Vector(100, 0);
      v.addFriction(0.1, 1);
      // factor = (1 - 0.1)^1 = 0.9
      expect(v.x).toBeCloseTo(90, 10);
    });

    it('dt exponent is pow not multiply', () => {
      const v1 = new Vector(100, 0);
      v1.addFriction(0.1, 2);
      // factor = (1 - 0.1)^2 = 0.81
      expect(v1.x).toBeCloseTo(81, 10);

      // Verify it differs from simple multiply: factor = 1 - 0.1*2 = 0.8 would give 80
      expect(v1.x).not.toBeCloseTo(80, 5);
    });

    it('defaults dt to 1', () => {
      const v = new Vector(100, 0);
      v.addFriction(0.1);
      expect(v.x).toBeCloseTo(90, 10);
    });

    it('applies to both x and y', () => {
      const v = new Vector(100, 200);
      v.addFriction(0.1, 1);
      expect(v.x).toBeCloseTo(90, 10);
      expect(v.y).toBeCloseTo(180, 10);
    });
  });

  describe('addGravity', () => {
    it('adds gravity to y scaled by dt', () => {
      const v = new Vector(0, 0);
      v.addGravity(0.15, 1);
      expect(v.y).toBeCloseTo(0.15, 10);
      expect(v.x).toBe(0);
    });

    it('scales with dt', () => {
      const v = new Vector(0, 0);
      v.addGravity(0.15, 2);
      expect(v.y).toBeCloseTo(0.3, 10);
    });

    it('no-ops when gravity is 0', () => {
      const v = new Vector(5, 5);
      v.addGravity(0, 1);
      expect(v.y).toBe(5);
    });

    it('works with negative gravity', () => {
      const v = new Vector(0, 10);
      v.addGravity(-1, 1);
      expect(v.y).toBe(9);
    });
  });

  describe('subtract', () => {
    it('subtracts another vector', () => {
      const v = new Vector(10, 20);
      v.subtract({ x: 3, y: 7 });
      expect(v.x).toBe(7);
      expect(v.y).toBe(13);
    });
  });

  describe('normalize', () => {
    it('normalizes to unit length', () => {
      const v = new Vector(3, 4);
      v.normalize();
      expect(v.x).toBeCloseTo(0.6, 10);
      expect(v.y).toBeCloseTo(0.8, 10);
      expect(v.getMagnitude()).toBeCloseTo(1, 10);
    });

    it('no-ops for zero vector (safe division)', () => {
      const v = new Vector(0, 0);
      v.normalize();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('handles negative components', () => {
      const v = new Vector(-3, -4);
      v.normalize();
      expect(v.getMagnitude()).toBeCloseTo(1, 10);
      expect(v.x).toBeCloseTo(-0.6, 10);
      expect(v.y).toBeCloseTo(-0.8, 10);
    });
  });

  describe('scale', () => {
    it('scales both components', () => {
      const v = new Vector(3, 4);
      v.scale(2);
      expect(v.x).toBe(6);
      expect(v.y).toBe(8);
    });

    it('scales to zero', () => {
      const v = new Vector(3, 4);
      v.scale(0);
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('scales by negative', () => {
      const v = new Vector(3, 4);
      v.scale(-1);
      expect(v.x).toBe(-3);
      expect(v.y).toBe(-4);
    });
  });

  describe('getAngle', () => {
    it('returns 0 for rightward vector', () => {
      expect(new Vector(1, 0).getAngle()).toBe(0);
    });

    it('returns PI/2 for downward vector', () => {
      expect(new Vector(0, 1).getAngle()).toBeCloseTo(Math.PI / 2, 10);
    });

    it('returns -PI/2 for upward vector', () => {
      expect(new Vector(0, -1).getAngle()).toBeCloseTo(-Math.PI / 2, 10);
    });

    it('returns PI for leftward vector', () => {
      expect(new Vector(-1, 0).getAngle()).toBeCloseTo(Math.PI, 10);
    });
  });

  describe('fromAngle', () => {
    it('creates rightward vector at angle 0', () => {
      const v = Vector.fromAngle(0, 5);
      expect(v.x).toBeCloseTo(5, 10);
      expect(v.y).toBeCloseTo(0, 10);
    });

    it('creates downward vector at PI/2', () => {
      const v = Vector.fromAngle(Math.PI / 2, 5);
      expect(v.x).toBeCloseTo(0, 10);
      expect(v.y).toBeCloseTo(5, 10);
    });

    it('round-trips with getAngle', () => {
      const angle = 1.23;
      const mag = 7;
      const v = Vector.fromAngle(angle, mag);
      expect(v.getAngle()).toBeCloseTo(angle, 5);
      expect(v.getMagnitude()).toBeCloseTo(mag, 5);
    });

    it('round-trips for negative angles', () => {
      const angle = -0.75;
      const mag = 3;
      const v = Vector.fromAngle(angle, mag);
      expect(v.getAngle()).toBeCloseTo(angle, 5);
      expect(v.getMagnitude()).toBeCloseTo(mag, 5);
    });
  });
});
