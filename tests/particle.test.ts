import { beforeEach, describe, expect, it, vi } from 'vitest';
import Particle, { setParticlePoolSize } from '../src/particular/components/particle';
import Vector from '../src/particular/utils/vector';
import type { ForceSource } from '../src/particular/types';

// Minimal params to create a valid particle
function minParams(overrides: Record<string, unknown> = {}) {
  return {
    particleLife: 100,
    gravity: 0,
    scaleStep: 100, // instant grow
    fadeTime: 30,
    ...overrides,
  };
}

describe('Particle', () => {
  beforeEach(() => {
    setParticlePoolSize(0); // drain pool between tests
    vi.restoreAllMocks();
  });

  describe('create / pool lifecycle', () => {
    it('creates a new particle when pool is empty', () => {
      const p = Particle.create(minParams());
      expect(p).toBeInstanceOf(Particle);
    });

    it('reuses pooled particle after destroy', () => {
      setParticlePoolSize(10);
      const p1 = Particle.create(minParams());
      p1.destroy();

      const p2 = Particle.create(minParams({ gravity: 0.5 }));
      // Same object reused from pool
      expect(p2).toBe(p1);
      // Fields reinitialized
      expect(p2.gravity).toBe(0.5);
    });

    it('reinitializes all fields on reuse', () => {
      setParticlePoolSize(10);
      const p = Particle.create(minParams({ color: '#ff0000', gravity: 1 }));
      p.lifeTick = 50;
      p.alpha = 0.3;
      p.destroy();

      const p2 = Particle.create(minParams({ color: '#00ff00', gravity: 0 }));
      expect(p2.color).toBe('#00ff00');
      expect(p2.gravity).toBe(0);
      expect(p2.lifeTick).toBe(0);
      expect(p2.alpha).toBe(1);
    });
  });

  describe('velocity integration', () => {
    it('acceleration changes velocity', () => {
      const p = Particle.create(minParams({
        velocity: new Vector(0, 0),
        acceleration: new Vector(1, 0),
      }));
      p.update(undefined, 1);
      expect(p.velocity.x).toBeCloseTo(1, 10);
    });

    it('velocity changes position', () => {
      const p = Particle.create(minParams({
        point: new Vector(0, 0),
        velocity: new Vector(5, 3),
      }));
      p.update(undefined, 1);
      expect(p.position.x).toBeCloseTo(5, 5);
      expect(p.position.y).toBeCloseTo(3, 5);
    });

    it('dt scales integration', () => {
      const p = Particle.create(minParams({
        point: new Vector(0, 0),
        velocity: new Vector(10, 0),
      }));
      p.update(undefined, 2);
      // position += velocity * dt = 10 * 2 = 20
      expect(p.position.x).toBeCloseTo(20, 5);
    });
  });

  describe('friction', () => {
    it('applies pow(1-f, dt) not f*dt', () => {
      const p = Particle.create(minParams({
        velocity: new Vector(100, 0),
        friction: 0.1,
      }));
      p.update(undefined, 2);
      // factor = (1-0.1)^2 = 0.81
      // velocity after = 100 * 0.81 = 81 (before position integration)
      // position = 81 * 2 = 162 (approx — vel changes before pos)
      // But more precisely: vel = 100 * 0.81 = 81, pos = 81 * 2 = 162
      expect(p.velocity.x).toBeCloseTo(81, 0);
    });

    it('zero friction is a no-op', () => {
      const p = Particle.create(minParams({
        velocity: new Vector(100, 0),
        friction: 0,
      }));
      p.update(undefined, 1);
      // velocity unchanged by friction
      expect(p.velocity.x).toBeCloseTo(100, 5);
    });
  });

  describe('gravity', () => {
    it('adds gravity to velocity.y scaled by dt', () => {
      const p = Particle.create(minParams({
        velocity: new Vector(0, 0),
        gravity: 0.15,
      }));
      p.update(undefined, 1);
      expect(p.velocity.y).toBeCloseTo(0.15, 10);
    });

    it('zero gravity is a no-op', () => {
      const p = Particle.create(minParams({
        velocity: new Vector(0, 5),
        gravity: 0,
      }));
      p.update(undefined, 1);
      expect(p.velocity.y).toBeCloseTo(5, 10);
    });

    it('gravity scales with dt', () => {
      const p = Particle.create(minParams({
        velocity: new Vector(0, 0),
        gravity: 0.15,
      }));
      p.update(undefined, 2);
      expect(p.velocity.y).toBeCloseTo(0.3, 10);
    });
  });

  describe('external forces', () => {
    it('applies force from ForceSource', () => {
      const mockForce: ForceSource = {
        getForce: () => new Vector(1, 2),
      };
      const p = Particle.create(minParams({
        velocity: new Vector(0, 0),
      }));
      p.update([mockForce], 1);
      expect(p.velocity.x).toBeCloseTo(1, 5);
      expect(p.velocity.y).toBeCloseTo(2, 5);
    });

    it('applies multiple forces', () => {
      const f1: ForceSource = { getForce: () => new Vector(1, 0) };
      const f2: ForceSource = { getForce: () => new Vector(0, 3) };
      const p = Particle.create(minParams({
        velocity: new Vector(0, 0),
      }));
      p.update([f1, f2], 1);
      expect(p.velocity.x).toBeCloseTo(1, 5);
      expect(p.velocity.y).toBeCloseTo(3, 5);
    });

    it('force is scaled by dt', () => {
      const mockForce: ForceSource = {
        getForce: () => new Vector(1, 0),
      };
      const p = Particle.create(minParams({
        velocity: new Vector(0, 0),
      }));
      p.update([mockForce], 2);
      expect(p.velocity.x).toBeCloseTo(2, 5);
    });
  });

  describe('alpha fade', () => {
    it('computes alpha from remaining life / fadeTime', () => {
      const p = Particle.create(minParams({
        particleLife: 100,
        fadeTime: 20,
      }));
      // Mock getRandomInt to return exact life
      vi.spyOn(Math, 'random').mockReturnValue(0.999);
      const p2 = Particle.create(minParams({
        particleLife: 100,
        fadeTime: 20,
      }));

      // At tick 0, remaining = 100, alpha = min(1, 100/20) = 1
      p2.update(undefined, 1);
      expect(p2.alpha).toBeCloseTo(1, 2);
    });

    it('alpha reaches 0 at end of life', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999);
      const p = Particle.create(minParams({
        particleLife: 50,
        fadeTime: 10,
      }));
      // Advance to near end of life
      for (let i = 0; i < 55; i++) {
        p.update(undefined, 1);
      }
      expect(p.alpha).toBe(0);
    });

    it('baseAlpha multiplies the fade', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999);
      const p = Particle.create(minParams({
        particleLife: 100,
        fadeTime: 20,
        baseAlpha: 0.5,
      }));
      p.update(undefined, 1);
      // Alpha = min(1, (100-1)/20) * 0.5 = 1 * 0.5 = 0.5
      expect(p.alpha).toBeCloseTo(0.5, 2);
    });

    it('alpha is clamped to [0, 1]', () => {
      const p = Particle.create(minParams({
        particleLife: 1000,
        fadeTime: 1,
      }));
      p.update(undefined, 1);
      expect(p.alpha).toBeLessThanOrEqual(1);
      expect(p.alpha).toBeGreaterThanOrEqual(0);
    });
  });

  describe('home position spring', () => {
    it('settles at home position', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const p = Particle.create(minParams({
        point: new Vector(100, 100),
        homePosition: new Vector(100, 100),
        homeConfig: { idlePulseStrength: 0 },
        velocity: new Vector(0, 0),
        particleLife: Infinity,
      }));

      // Already at home with zero velocity — should snap
      p.update(undefined, 1);
      expect(p.position.x).toBe(100);
      expect(p.position.y).toBe(100);
      expect(p.velocity.x).toBe(0);
      expect(p.velocity.y).toBe(0);
    });

    it('spring pulls displaced particle toward home', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const p = Particle.create(minParams({
        point: new Vector(50, 50),
        homePosition: new Vector(100, 100),
        homeConfig: {
          springStrength: 0.1,
          springDamping: 0.9,
          homeThreshold: 2,
          velocityThreshold: 0.5,
          returnNoise: 0,
          idlePulseStrength: 0,
        },
        velocity: new Vector(0, 0),
        particleLife: Infinity,
      }));

      p.update(undefined, 1);
      // Spring should push velocity toward home (positive x, positive y)
      expect(p.velocity.x).toBeGreaterThan(0);
      expect(p.velocity.y).toBeGreaterThan(0);
      // Position should move toward home
      expect(p.position.x).toBeGreaterThan(50);
      expect(p.position.y).toBeGreaterThan(50);
    });

    it('permanent lifetime — no fade', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const p = Particle.create(minParams({
        point: new Vector(50, 50),
        homePosition: new Vector(100, 100),
        homeConfig: { idlePulseStrength: 0 },
        particleLife: Infinity,
      }));

      // Run many updates
      for (let i = 0; i < 200; i++) {
        p.update(undefined, 1);
      }
      // Alpha should still be baseAlpha (1.0), not faded
      expect(p.alpha).toBe(1);
    });
  });

  describe('size growth', () => {
    it('grows factoredSize toward target size', () => {
      const p = Particle.create(minParams({
        size: 10,
        scaleStep: 2,
      }));
      expect(p.factoredSize).toBe(1);
      p.update(undefined, 1);
      // factoredSize = min(1 + 2*1, 10) = 3
      expect(p.factoredSize).toBeCloseTo(3, 5);
    });

    it('caps at target size', () => {
      const p = Particle.create(minParams({
        size: 5,
        scaleStep: 100,
      }));
      p.update(undefined, 1);
      expect(p.factoredSize).toBe(5);
    });

    it('growth scales with dt', () => {
      const p = Particle.create(minParams({
        size: 10,
        scaleStep: 2,
      }));
      p.update(undefined, 3);
      // factoredSize = min(1 + 2*3, 10) = 7
      expect(p.factoredSize).toBeCloseTo(7, 5);
    });
  });

  describe('trail', () => {
    it('creates trail segments when trail is enabled', () => {
      const p = Particle.create(minParams({
        trail: true,
        trailLength: 5,
        point: new Vector(10, 20),
      }));
      p.update(undefined, 1);
      expect(p.trailSegments.length).toBe(1);
      expect(p.trailSegments[0]!.x).toBeCloseTo(10, 0);
    });

    it('does not create trail segments when disabled', () => {
      const p = Particle.create(minParams({
        trail: false,
      }));
      p.update(undefined, 1);
      expect(p.trailSegments.length).toBe(0);
    });

    it('ages and prunes trail segments', () => {
      const p = Particle.create(minParams({
        trail: true,
        trailLength: 2,
        point: new Vector(0, 0),
        velocity: new Vector(1, 0),
      }));
      // Create several trail segments
      p.update(undefined, 1); // seg 0 at age 0
      p.update(undefined, 1); // seg 0 now age 1, seg 1 at age 0
      p.update(undefined, 1); // seg 0 now age 2 (pruned), seg 1 age 1, seg 2 age 0
      // After 3 updates with trailLength=2, oldest segment should be pruned
      expect(p.trailSegments.length).toBe(2);
    });

    it('clears trail segments on destroy', () => {
      setParticlePoolSize(10);
      const p = Particle.create(minParams({
        trail: true,
        trailLength: 5,
      }));
      p.update(undefined, 1);
      expect(p.trailSegments.length).toBe(1);
      p.destroy();
      expect(p.trailSegments.length).toBe(0);
    });
  });

  describe('color', () => {
    it('picks from colors array', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0); // picks index 0
      const p = Particle.create(minParams({
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      }));
      expect(p.color).toBe('#ff0000');
    });

    it('uses explicit color over colors array', () => {
      const p = Particle.create(minParams({
        color: '#abcdef',
        colors: ['#ff0000', '#00ff00'],
      }));
      expect(p.color).toBe('#abcdef');
    });

    it('defaults to gray when no color or colors', () => {
      const p = Particle.create(minParams());
      expect(p.color).toBe('#888888');
    });

    it('parses hex color into normalized RGB', () => {
      const p = Particle.create(minParams({ color: '#ff8000' }));
      expect(p.colorR).toBeCloseTo(1, 2);
      expect(p.colorG).toBeCloseTo(0.502, 2);
      expect(p.colorB).toBeCloseTo(0, 2);
    });
  });

  describe('rotation', () => {
    it('rotation changes each frame', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.7);
      const p = Particle.create(minParams({
        velocity: new Vector(0, -5),
      }));
      const initialRotation = p.rotation;
      p.update(undefined, 1);
      expect(p.rotation).not.toBe(initialRotation);
    });
  });
});
