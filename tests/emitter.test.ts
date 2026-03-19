import { beforeEach, describe, expect, it, vi } from 'vitest';
import Emitter from '../src/particular/components/emitter';
import { setParticlePoolSize } from '../src/particular/components/particle';
import Vector from '../src/particular/utils/vector';
import type { EmitterConfiguration } from '../src/particular/types';

// Minimal mock Particular engine — just enough for emitter to work
function mockParticular(overrides: Record<string, unknown> = {}) {
  return {
    maxCount: 500,
    continuous: false,
    getCount: () => 0,
    hasEventListener: () => false,
    dispatchEvent: vi.fn(),
    ...overrides,
  } as any;
}

function minConfig(overrides: Partial<EmitterConfiguration> = {}): EmitterConfiguration {
  return {
    point: new Vector(100, 100),
    velocity: Vector.fromAngle(-Math.PI / 2, 5),
    icons: [],
    rate: 8,
    life: 30,
    particleLife: 100,
    spread: Math.PI / 1.3,
    sizeMin: 5,
    sizeMax: 15,
    velocityMultiplier: 6,
    gravity: 0.15,
    gravityJitter: 0,
    scaleStep: 1,
    fadeTime: 30,
    spawnWidth: 0,
    spawnHeight: 0,
    spawnDepth: 0,
    spread3d: 0,
    emitDirection: { x: 0, y: -1, z: 0 },
    colors: ['#ff0000', '#00ff00'],
    acceleration: 0,
    accelerationSize: 0.01,
    friction: 0,
    frictionSize: 0.0005,
    ...overrides,
  };
}

describe('Emitter', () => {
  beforeEach(() => {
    setParticlePoolSize(0);
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('generates palette when colors is empty', () => {
      const e = new Emitter(minConfig({ colors: [] }));
      expect(e.configuration.colors.length).toBeGreaterThan(0);
    });

    it('keeps provided colors', () => {
      const colors = ['#ff0000', '#00ff00'];
      const e = new Emitter(minConfig({ colors }));
      expect(e.configuration.colors).toBe(colors);
    });
  });

  describe('emit', () => {
    it('does not emit when not emitting', () => {
      const e = new Emitter(minConfig());
      e.particular = mockParticular();
      e.emit(1);
      expect(e.particles.length).toBe(0);
    });

    it('emits particles at configured rate', () => {
      const e = new Emitter(minConfig({ rate: 5 }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1);
      expect(e.particles.length).toBe(5);
    });

    it('accumulates fractional rate across frames', () => {
      const e = new Emitter(minConfig({ rate: 0.5 }));
      e.particular = mockParticular();
      e.isEmitting = true;

      e.emit(1); // accumulator = 0.5, floor = 0
      expect(e.particles.length).toBe(0);

      e.emit(1); // accumulator = 1.0, floor = 1
      expect(e.particles.length).toBe(1);
    });

    it('handles high dt (144Hz catch-up scenario)', () => {
      const e = new Emitter(minConfig({ rate: 4 }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(2); // accumulator = 8, should emit 8
      expect(e.particles.length).toBe(8);
    });

    it('does not emit without assigned particular', () => {
      const e = new Emitter(minConfig());
      e.isEmitting = true;
      e.emit(1);
      expect(e.particles.length).toBe(0);
    });
  });

  describe('update', () => {
    it('increments lifeCycle per emitted particle', () => {
      const e = new Emitter(minConfig({ rate: 3 }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1);
      expect(e.lifeCycle).toBe(3);
    });

    it('stops emitting after life budget', () => {
      const e = new Emitter(minConfig({ rate: 10, life: 15 }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1); // 10 particles, lifeCycle = 10
      e.update(1000, 1000, 0, 0, undefined, 1);
      expect(e.isEmitting).toBe(true); // still under budget (10 < 15)

      e.emit(1); // 10 more, lifeCycle = 20
      e.update(1000, 1000, 0, 0, undefined, 1);
      expect(e.isEmitting).toBe(false); // exceeded budget (20 >= 15)
    });

    it('stays emitting in continuous mode', () => {
      const e = new Emitter(minConfig({ rate: 10, life: 5 }));
      e.particular = mockParticular({ continuous: true });
      e.isEmitting = true;
      e.emit(1);
      e.update(1000, 1000, 0, 0, undefined, 1);
      expect(e.isEmitting).toBe(true);
    });

    it('destroys particles that leave bounds', () => {
      const e = new Emitter(minConfig({ rate: 1 }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1);
      // Move particle far out of bounds
      e.particles[0]!.position.x = -100;
      e.update(500, 500, 0, 0, undefined, 1);
      expect(e.particles.length).toBe(0);
    });

    it('home particles survive bounds check', () => {
      const e = new Emitter(minConfig({ rate: 1, particleLife: Infinity }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1);
      const p = e.particles[0]!;
      // Give the particle a home position
      p.homePosition = new Vector(100, 100);
      p.homeConfig = {
        springStrength: 0.05,
        springDamping: 0.9,
        homeThreshold: 2,
        velocityThreshold: 0.5,
        wiggleAmplitude: 0,
        wiggleSpeed: 0.05,
        breathingAmplitude: 0,
        breathingSpeed: 0.03,
        waveAmplitude: 0,
        waveSpeed: 0.03,
        waveFrequency: 0.15,
        returnNoise: 0,
        idlePulseStrength: 0,
        idlePulseIntervalMin: 300,
        idlePulseIntervalMax: 1800,
      };
      // Move out of bounds
      p.position.x = -100;
      e.update(500, 500, 0, 0, undefined, 1);
      // Should survive — home particles are never killed by bounds
      expect(e.particles.length).toBe(1);
    });
  });

  describe('spherical emission', () => {
    it('produces particles with non-zero z when spread3d > 0', () => {
      const e = new Emitter(minConfig({
        rate: 20,
        spread3d: Math.PI,
        emitDirection: { x: 0, y: -1, z: 0 },
      }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1);
      // With full spherical spread, at least some particles should have non-zero z velocity
      const hasZ = e.particles.some(p => p.velocity.z !== 0);
      expect(hasZ).toBe(true);
    });

    it('spawnDepth produces particles with non-zero z position', () => {
      const e = new Emitter(minConfig({
        rate: 20,
        spawnDepth: 100,
      }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1);
      const hasZ = e.particles.some(p => p.position.z !== 0);
      expect(hasZ).toBe(true);
    });
  });

  describe('isAlive', () => {
    it('returns true when emitting', () => {
      const e = new Emitter(minConfig());
      e.isEmitting = true;
      expect(e.isAlive()).toBe(true);
    });

    it('returns true when particles exist', () => {
      const e = new Emitter(minConfig({ rate: 1 }));
      e.particular = mockParticular();
      e.isEmitting = true;
      e.emit(1);
      e.isEmitting = false;
      expect(e.isAlive()).toBe(true);
    });

    it('returns false when done and no particles', () => {
      const e = new Emitter(minConfig());
      e.isEmitting = false;
      expect(e.isAlive()).toBe(false);
    });
  });
});
