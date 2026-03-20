import { describe, expect, it } from 'vitest';
import { identity, perspective, lookAt, multiply } from '../src/particular/utils/mat4';

describe('mat4', () => {
  describe('identity', () => {
    it('returns a 16-element Float32Array', () => {
      const m = identity();
      expect(m).toBeInstanceOf(Float32Array);
      expect(m.length).toBe(16);
    });

    it('has 1s on the diagonal and 0s elsewhere', () => {
      const m = identity();
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
          expect(m[col * 4 + row]).toBe(row === col ? 1 : 0);
        }
      }
    });
  });

  describe('perspective', () => {
    it('produces a non-zero matrix', () => {
      const m = perspective(Math.PI / 4, 16 / 9, 0.1, 1000);
      const sum = m.reduce((a, b) => a + Math.abs(b), 0);
      expect(sum).toBeGreaterThan(0);
    });

    it('has -1 at m[11] (perspective divide flag)', () => {
      const m = perspective(Math.PI / 4, 1, 0.1, 100);
      expect(m[11]).toBe(-1);
    });

    it('aspect ratio scales x', () => {
      const m1 = perspective(Math.PI / 4, 1, 0.1, 100);
      const m2 = perspective(Math.PI / 4, 2, 0.1, 100);
      // Wider aspect → smaller m[0] (x scale)
      expect(m2[0]).toBeLessThan(m1[0]!);
      // y scale stays the same
      expect(m1[5]).toBeCloseTo(m2[5]!, 10);
    });
  });

  describe('lookAt', () => {
    it('looking down -Z produces an identity-like rotation', () => {
      const m = lookAt(
        { x: 0, y: 0, z: 5 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
      );
      // The rotation part should be close to identity
      expect(m[0]).toBeCloseTo(1, 5);
      expect(m[5]).toBeCloseTo(1, 5);
      expect(m[10]).toBeCloseTo(1, 5);
      // Translation along z
      expect(m[14]).toBeCloseTo(-5, 5);
    });

    it('produces orthogonal axes', () => {
      const m = lookAt(
        { x: 3, y: 4, z: 5 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
      );
      // Side vector (row 0): m[0], m[4], m[8]
      // Up vector (row 1): m[1], m[5], m[9]
      // Dot product should be ~0 (orthogonal)
      const dot = m[0]! * m[1]! + m[4]! * m[5]! + m[8]! * m[9]!;
      expect(dot).toBeCloseTo(0, 5);
    });
  });

  describe('multiply', () => {
    it('multiplying by identity returns original', () => {
      const p = perspective(Math.PI / 4, 1, 0.1, 100);
      const result = multiply(p, identity());
      for (let i = 0; i < 16; i++) {
        expect(result[i]).toBeCloseTo(p[i]!, 5);
      }
    });

    it('multiplying identity by identity returns identity', () => {
      const result = multiply(identity(), identity());
      const id = identity();
      for (let i = 0; i < 16; i++) {
        expect(result[i]).toBeCloseTo(id[i]!, 10);
      }
    });

    it('is not commutative (A*B !== B*A in general)', () => {
      const p = perspective(Math.PI / 4, 1, 0.1, 100);
      const v = lookAt(
        { x: 0, y: 0, z: 5 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
      );
      const pv = multiply(p, v);
      const vp = multiply(v, p);
      let same = true;
      for (let i = 0; i < 16; i++) {
        if (Math.abs(pv[i]! - vp[i]!) > 0.001) { same = false; break; }
      }
      expect(same).toBe(false);
    });
  });
});
