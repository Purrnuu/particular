import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Particular from '../src/particular/core/particular';
import Particle from '../src/particular/components/particle';
import Emitter from '../src/particular/components/emitter';
import Vector from '../src/particular/utils/vector';
import MouseForce from '../src/particular/components/mouseForce';
import FlockingForce from '../src/particular/components/flockingForce';
import { presets } from '../src/particular/presets';
import { configureParticle } from '../src/particular/core/defaults';
import type { ForceSource, FrameContext } from '../src/particular/types';

let engine: Particular;
beforeEach(() => {
  vi.stubGlobal('window', {
    requestAnimationFrame: vi.fn(() => 1),
    cancelAnimationFrame: vi.fn(),
    innerWidth: 800,
    innerHeight: 600,
  });
  engine = new Particular();
  engine.initialize({});
  engine.onResize();
});
afterEach(() => {
  engine.destroy();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function emitter() {
  const result = new Emitter({
    ...configureParticle({ rate: 1 }),
    point: new Vector(100, 100),
    icons: [],
  });
  engine.addEmitter(result);
  result.isEmitting = true;
  return result;
}

describe('force and frame boundaries', () => {
  it.each([30, 60, 120, 144])('keeps the same flock inside logical canvas bounds for 12 seconds at %i Hz', (hz) => {
    let seed = 77;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    });
    engine.width = 640;
    engine.height = 360;
    const source = new Emitter({
      ...configureParticle({ ...presets.Ambient.flock, rate: 16, particleLife: Infinity }),
      point: new Vector(160, 90), icons: [],
    });
    engine.addEmitter(source);
    source.isEmitting = true;
    source.emit();
    source.configuration.rate = 0;
    source.configuration.life = 0;
    source.isEmitting = false;
    const original = [...source.particles];
    engine.addFlockingForce(new FlockingForce());
    for (let i = 0; i < hz * 12; i++) {
      engine.updateEmitters(60 / hz);
      expect(source.particles).toHaveLength(16);
      for (const p of source.particles) {
        expect(p.position.x).toBeGreaterThanOrEqual(p.size - 1e-8);
        expect(p.position.x).toBeLessThanOrEqual(320 - p.size + 1e-8);
        expect(p.position.y).toBeGreaterThanOrEqual(p.size - 1e-8);
        expect(p.position.y).toBeLessThanOrEqual(180 - p.size + 1e-8);
      }
    }
    expect(source.particles).toEqual(original);
    engine.width = 240;
    engine.height = 160;
    engine.updateEmitters(3);
    expect(source.particles).toHaveLength(16);
    for (const p of source.particles) {
      expect(p.position.x).toBeLessThanOrEqual(120 - p.size + 1e-8);
      expect(p.position.y).toBeLessThanOrEqual(80 - p.size + 1e-8);
    }
  });

  it('keeps a continuously spawning flock moving away from the emitter', () => {
    let seed = 123;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    });
    engine.width = 2000;
    engine.height = 1200;
    engine.maxCount = 150;
    engine.continuous = true;
    const source = new Emitter({
      ...configureParticle(presets.Ambient.flock),
      point: new Vector(400, 300), icons: [],
    });
    engine.addEmitter(source);
    source.isEmitting = true;
    engine.addFlockingForce(new FlockingForce());
    for (let i = 0; i < 240; i++) engine.updateEmitters(1);
    expect(source.particles).toHaveLength(150);
    expect(source.particles.filter((p) => p.position.x > 460).length).toBeGreaterThan(100);
  });

  it.each([30, 60, 120, 144])('flies away from the emitter over four seconds at %i Hz', (hz) => {
    let seed = 42;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    });
    engine.width = 2000;
    engine.height = 1200;
    const source = new Emitter({
      ...configureParticle({ ...presets.Ambient.flock, rate: 40, particleLife: Infinity }),
      point: new Vector(400, 300), icons: [],
    });
    engine.addEmitter(source);
    source.isEmitting = true;
    source.emit();
    source.configuration.rate = 0;
    source.configuration.life = 0;
    source.isEmitting = false;
    engine.addFlockingForce(new FlockingForce());
    let minimumSpeed = Infinity;
    for (let i = 0; i < hz * 4; i++) {
      engine.updateEmitters(60 / hz);
      expect(source.particles).toHaveLength(40);
      for (const p of source.particles) minimumSpeed = Math.min(minimumSpeed, p.velocity.getMagnitude());
    }
    const meanX = source.particles.reduce((sum, p) => sum + p.position.x, 0) / 40;
    expect(meanX - 400).toBeGreaterThan(120);
    expect(minimumSpeed).toBeGreaterThanOrEqual(1.5 - 1e-8);
  });

  it.each([30, 60, 120, 144, 240])('integrates a force once per elapsed tick at %i Hz', (hz) => {
    const source = emitter();
    source.configuration.rate = 0;
    source.configuration.life = Infinity;
    const p = Particle.create({
      point: new Vector(100, 100), particleLife: Infinity,
      gravity: 0, scaleStep: 0, fadeTime: 30,
    });
    source.particles.push(p);
    const force: ForceSource = { getForce: () => new Vector(0.01, 0.02, 0.03) };
    engine.addForce(force);
    engine.addForce(force);
    for (let i = 0; i < hz; i++) engine.updateEmitters(60 / hz);
    expect(p.velocity.x).toBeCloseTo(0.6, 10);
    expect(p.velocity.y).toBeCloseTo(1.2, 10);
    expect(p.velocity.z).toBeCloseTo(1.8, 10);
  });

  it('does not double-register or double-decay a legacy mouse force', () => {
    const force = new MouseForce({ damping: 0.5 });
    force.updatePosition(8, 0);
    const update = vi.spyOn(force, 'update');
    engine.addForce(force);
    engine.addMouseForce(force);
    engine.addMouseForce(force);
    engine.addForce(force);
    engine.updateEmitters(0.5);
    expect(update).toHaveBeenCalledOnce();
    expect(force.velocity.x).toBeCloseTo(8 * Math.sqrt(0.5), 10);
  });

  it.each([30, 60, 120, 144, 240])('emits the same count over two seconds at %i Hz', (hz) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    engine.continuous = true;
    engine.maxCount = 1000;
    const source = emitter();
    Object.assign(source.configuration, {
      rate: 0, particleLife: Infinity, velocity: new Vector(0, 0),
      acceleration: 0, accelerationSize: 0, gravity: 0, velocityMultiplier: 0,
    });
    engine.update(0);
    source.configuration.rate = 0.4;
    for (let i = 1; i <= hz * 2; i++) engine.update(i * 1000 / hz);
    expect(source.lifeCycle).toBe(48);
    expect(engine.getCount()).toBe(48);
    expect(engine.frame.elapsedSeconds - 1 / 60).toBeCloseTo(2, 10);
  });

  it.each([60, 120, 144])('preserves movement, aging, and damping over one second at %i Hz', (hz) => {
    const source = emitter();
    source.configuration.life = Infinity;
    source.configuration.rate = 0;
    engine.update(0);
    const moving = Particle.create({
      point: new Vector(100, 100), velocity: new Vector(2, 1, 0.5),
      particleLife: Infinity, gravity: 0, scaleStep: 0, fadeTime: 30,
    });
    const damped = Particle.create({
      point: new Vector(100, 100), velocity: new Vector(2, 0), friction: 0.02,
      particleLife: Infinity, gravity: 0, scaleStep: 0, fadeTime: 30,
    });
    source.particles.push(moving, damped);
    for (let i = 1; i <= hz; i++) engine.update(i * 1000 / hz);
    expect(moving.position.x).toBeCloseTo(220, 10);
    expect(moving.position.y).toBeCloseTo(160, 10);
    expect(moving.position.z).toBeCloseTo(30, 10);
    expect(moving.lifeTick).toBeCloseTo(60, 10);
    expect(damped.velocity.x).toBeCloseTo(2 * Math.pow(0.98, 60), 10);
  });

  it('runs generic force hooks before particle integration and removes forces', () => {
    const source = emitter();
    const order: string[] = [];
    const force: ForceSource = {
      update: () => {
        order.push('update');
      },
      preCompute: () => {
        order.push('preCompute');
      },
      setBounds: vi.fn(),
      getForce: () => {
        order.push('force');
        return new Vector(1, 0);
      },
      destroy: vi.fn(),
    };
    engine.addForce(force);
    engine.addForce(force);
    engine.updateEmitters();
    expect(order).toEqual(['update', 'preCompute', 'force']);
    expect(force.setBounds).toHaveBeenCalledWith(400, 300);
    expect(source.particles).toHaveLength(1);
    engine.removeForce(force);
    order.length = 0;
    engine.updateEmitters();
    expect(order).toEqual([]);
    engine.addForce(force);
    engine.destroy();
    expect(force.destroy).toHaveBeenCalledOnce();
  });

  it('publishes normalized frame timing on both update phases', () => {
    const source = emitter();
    source.configuration.particleLife = Infinity;
    const before: FrameContext[] = [];
    const after: FrameContext[] = [];
    engine.addEventListener<FrameContext>(Particular.UPDATE, (frame) => {
      before.push({ ...frame! });
    });
    engine.addEventListener<FrameContext>(Particular.UPDATE_AFTER, (frame) => {
      after.push({ ...frame! });
    });
    engine.update(100);
    engine.update(100 + 1000 / 120);
    expect(before[1]!.dt).toBeCloseTo(0.5);
    expect(before[1]!.deltaSeconds).toBeCloseTo(1 / 120);
    expect(after[1]).toEqual(before[1]);
    engine.update(5000);
    expect(before[2]!.dt).toBe(3);
  });

  it('does not restart RAF or mutate a destroyed engine', () => {
    engine.destroy();
    const requests = vi.mocked(window.requestAnimationFrame).mock.calls.length;
    engine.update(100);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(requests);
    expect(() => engine.start()).toThrow();
    expect(() => engine.addForce({ getForce: () => new Vector(0, 0) })).toThrow();
  });

  it('continues teardown when a custom force fails to destroy', () => {
    const cleanup = vi.fn();
    engine.addForce({
      getForce: () => new Vector(0, 0),
      destroy: () => {
        throw new Error('force cleanup');
      },
    });
    engine.addForce({ getForce: () => new Vector(0, 0), destroy: cleanup });
    expect(() => engine.destroy()).toThrow('force cleanup');
    expect(cleanup).toHaveBeenCalledOnce();
    expect(engine.forces).toHaveLength(0);
    expect(engine.isDestroyed).toBe(true);
  });

  it('replaces detonation parents without exceeding a full budget', () => {
    engine.maxCount = 2;
    const source = emitter();
    source.configuration.rate = 2;
    source.configuration.detonate = { at: 0, childCount: 5 };
    source.emit();
    engine.updateEmitters();
    expect(engine.getCount()).toBeLessThanOrEqual(2);
    expect(source.particles.every((p) => p.isDetonationChild)).toBe(true);
  });

  it('returns each dead particle to the pool only once', () => {
    const params = { particleLife: 100, gravity: 0, scaleStep: 1, fadeTime: 30 };
    const particle = Particle.create(params);
    particle.destroy();
    particle.destroy();
    const first = Particle.create(params);
    const second = Particle.create(params);
    expect(second).not.toBe(first);
    first.destroy();
    expect(Particle.create(params)).toBe(first);
  });
});
