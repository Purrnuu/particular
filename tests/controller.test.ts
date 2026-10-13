import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createParticles } from '../src/particular/convenience';
import type { ParticlesController } from '../src/particular/convenience';
import { mockBrowser, mockImage } from './helpers/browser';
import { generateImageChunks, type ChunkResult } from '../src/particular/utils/imageChunker';
import Vector from '../src/particular/utils/vector';

vi.mock('../src/particular/utils/imageChunker', () => ({ generateImageChunks: vi.fn() }));

const controllers: ParticlesController[] = [];
function create(config = {}) {
  const controller = createParticles({ renderer: 'canvas', autoResize: false, config });
  controllers.push(controller);
  return controller;
}

beforeEach(() => {
  mockBrowser();
  vi.mocked(generateImageChunks).mockResolvedValue(
    Array.from({ length: 4 }, () => ({ image: mockImage(), cx: 0.5, cy: 0.5, size: 2 }))
  );
});
afterEach(() => {
  controllers.splice(0).forEach((controller) => controller.destroy());
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('controller lifecycle', () => {
  it.each([30, 60, 120, 144])('scatters birds away from a stationary predator at %i Hz', (hz) => {
    const controller = create({
      pixelRatio: 2, rate: 1, life: 0, velocity: new Vector(0, 0),
      velocityMultiplier: 0, gravity: 0, accelerationSize: 0, frictionSize: 0,
    });
    const target = document.createElement('div');
    const force = controller.addMouseForce({ mode: 'repel', strength: 1, radius: 80, track: target });
    controller.addFlockingForce({ separationWeight: 0, alignmentWeight: 0, cohesionWeight: 0 });
    expect(force.getForce(new Vector(10, 0)).x).toBe(0); // No phantom threat before first input.
    const birds = [[240, 200], [160, 200], [200, 240], [200, 160]].map(([x, y]) => {
      const source = controller.burst({ x: x!, y: y! });
      source.isEmitting = false;
      return source.particles[0]!;
    });
    target.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));
    expect(force.position.x).toBe(100);
    controller.engine.updateEmitters(60 / hz);
    for (const bird of birds) {
      const dx = bird.position.x - 100;
      const dy = bird.position.y - 100;
      expect(bird.velocity.x * dx + bird.velocity.y * dy).toBeGreaterThan(0);
    }
  });

  it.each([60, 120, 144])('normalizes tracked mouse wind and pointer batching at %i Hz', (hz) => {
    const controller = create({ pixelRatio: 1 });
    const target = document.createElement('div');
    const force = controller.addMouseForce({ track: target });
    const dt = 60 / hz;
    target.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    controller.engine.updateEmitters(dt);
    expect(force.velocity.x).toBe(0);
    for (let i = 1; i <= hz; i++) {
      for (let event = 1; event <= 4; event++) {
        target.dispatchEvent(new MouseEvent('mousemove', { clientX: 100 + (i - 1 + event / 4) * dt, clientY: 100 }));
      }
      controller.engine.updateEmitters(dt);
      expect(force.velocity.x).toBeCloseTo(1, 10);
      expect(force.getForce(new Vector(force.position.x + 25, 100)).x).toBeCloseTo(0.05, 10);
    }
    controller.engine.updateEmitters(dt);
    expect(force.velocity.x).toBeCloseTo(Math.pow(0.85, dt), 10);
  });

  it.each([60, 120, 144])('normalizes mouse-reactive wobble drag at %i Hz', (hz) => {
    const controller = create({ pixelRatio: 1, rate: 1 });
    const p = controller.burst({ x: 100, y: 100 }).particles[0]!;
    p.homePosition = new Vector(100, 100);
    p.velocity.x = 0;
    p.velocity.y = 0;
    const target = document.createElement('div');
    controller.startWobble({ track: target, velocity: 0, rotation: 0 });
    const dt = 60 / hz;
    target.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    controller.engine.dispatchEvent('UPDATE', { dt });
    for (let i = 1; i <= hz; i++) {
      for (let event = 1; event <= 4; event++) {
        target.dispatchEvent(new MouseEvent('mousemove', { clientX: 100 + (i - 1 + event / 4) * dt, clientY: 100 }));
      }
      p.position.x = 100 + i * dt;
      p.position.y = 100;
      controller.engine.dispatchEvent('UPDATE', { dt });
    }
    expect(p.velocity.x).toBeCloseTo(18, 10);
    expect(p.velocity.y).toBe(0);
  });

  it.each([60, 120, 144])('uses normalized cursor speed for mouse trails at %i Hz', (hz) => {
    const controller = create({ pixelRatio: 1 });
    const target = document.createElement('div');
    controller.addMouseTrail({ target, minSpeed: 0.5, rate: 1 });
    const source = controller.engine.emitters[0]!;
    const dt = 60 / hz;
    target.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    controller.engine.dispatchEvent('UPDATE', { dt });
    for (let i = 1; i <= hz; i++) {
      target.dispatchEvent(new MouseEvent('mousemove', { clientX: 100 + i * 0.6 * dt, clientY: 100 }));
      controller.engine.dispatchEvent('UPDATE', { dt });
      expect(source.isEmitting).toBe(true);
    }
    controller.engine.dispatchEvent('UPDATE', { dt });
    expect(source.isEmitting).toBe(false);
  });

  it('removes manual click and wobble listeners on destruction', () => {
    const controller = create();
    const target = document.createElement('div');
    const remove = vi.spyOn(target, 'removeEventListener');
    const detach = controller.attachClickBurst(target);
    controller.startWobble({ track: target });
    controller.destroy();
    controller.destroy();
    detach();
    expect(remove.mock.calls.map(([type]) => type).sort()).toEqual([
      'click',
      'mousemove',
      'touchmove',
    ]);
    target.dispatchEvent(new MouseEvent('click', { clientX: 20, clientY: 20 }));
    expect(controller.engine.getCount()).toBe(0);
    expect(() => controller.burst({ x: 20, y: 20 })).toThrow();
    expect(controller.engine.hasEventListener('UPDATE')).toBe(false);
  });

  it('engine destruction also disposes convenience resources', () => {
    const controller = create();
    controller.engine.destroy();
    expect(controller.canvas.isConnected).toBe(false);
    expect(() => controller.addMouseTrail()).toThrow();
  });

  it('rolls back canvas and RAF when WebGL initialization fails', () => {
    expect(() => createParticles({ renderer: 'webgl' })).toThrow('WebGL2 not supported');
    expect(document.querySelector('canvas')).toBeNull();
    expect(cancelAnimationFrame).toHaveBeenCalledOnce();
  });

  it('restores the styles of a user-owned canvas', () => {
    const canvas = document.createElement('canvas');
    canvas.style.opacity = '0.5';
    const initial = canvas.style.cssText;
    const controller = createParticles({ canvas, renderer: 'canvas', autoResize: false });
    controller.destroy();
    expect(canvas.style.cssText).toBe(initial);
  });

  it('rejects pending images on teardown and removes load listeners', async () => {
    const controller = create();
    const image = mockImage(false);
    const remove = vi.spyOn(image, 'removeEventListener');
    const pending = controller.imageToParticles({ image });
    const rejection = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    controller.destroy();
    image.dispatchEvent(new Event('load'));
    await rejection;
    expect(controller.engine.getCount()).toBe(0);
    expect(remove.mock.calls.map(([type]) => type)).toContain('load');
  });

  it('cancels a pending shatter result before its chunks attach', async () => {
    const controller = create();
    let complete!: (chunks: ChunkResult[]) => void;
    vi.mocked(generateImageChunks).mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      })
    );
    const pending = controller.shatterImage({ image: mockImage() });
    await Promise.resolve();
    const rejection = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    controller.destroy();
    complete([{ image: mockImage(), cx: 0.5, cy: 0.5, size: 2 }]);
    await rejection;
    expect(controller.engine.getCount()).toBe(0);
  });

  it('checks teardown after an already-resolved load', async () => {
    const controller = create();
    const pending = controller.imageToParticles({ image: mockImage(), resolution: 2 });
    controller.destroy();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    expect(controller.engine.getCount()).toBe(0);
  });

  it('does not append a particle when its creation callback destroys the engine', () => {
    const controller = create();
    controller.engine.addEventListener('PARTICLE_CREATED', () => controller.destroy());
    const emitter = controller.burst({ x: 20, y: 20 });
    expect(emitter.particles).toHaveLength(0);
    expect(controller.engine.getCount()).toBe(0);
  });

  it('aborts image construction when a particle-created listener tears down the engine', async () => {
    const controller = create();
    controller.engine.addEventListener('PARTICLE_CREATED', () => controller.destroy());
    await expect(
      controller.imageToParticles({ image: mockImage(), resolution: 4 })
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(controller.engine.getCount()).toBe(0);
  });

  it.each(['scaleIn', 'ripple', 'paint'] as const)('cancels %s intro timers', async (mode) => {
    vi.useFakeTimers();
    const controller = create();
    const collector = await controller.imageToParticles({
      image: mockImage(),
      resolution: 4,
      autoCenter: false,
      intro: { mode, duration: 100 },
    });
    controller.engine.updateEmitters();
    expect(controller.engine.emitters).toContain(collector);
    controller.destroy();
    vi.runAllTimers();
    expect(collector.particles).toHaveLength(0);
    expect(controller.engine.getCount()).toBe(0);
  });
});

describe('emission and coordinates', () => {
  it('enforces the budget across immediate bursts and subsequent frames', () => {
    const controller = create({ maxCount: 3, rate: 8 });
    controller.burst({ x: 20, y: 20 });
    controller.burst({ x: 20, y: 20 });
    expect(controller.engine.getCount()).toBe(3);
    controller.engine.updateEmitters();
    expect(controller.engine.getCount()).toBeLessThanOrEqual(3);
  });

  it('lets image users keep a hard maxCount without automatic expansion', async () => {
    const controller = create({ maxCount: 2 });
    const emitter = await controller.imageToParticles({
      image: mockImage(),
      resolution: 4,
      expandBudget: false,
      autoCenter: false,
    });
    expect(emitter.particles).toHaveLength(2);
    expect(controller.engine.maxCount).toBe(2);
  });

  it('preserves default image budget expansion', async () => {
    const controller = create({ maxCount: 2 });
    await controller.imageToParticles({ image: mockImage(), resolution: 4, autoCenter: false });
    expect(controller.engine.getCount()).toBe(16);
    expect(controller.engine.maxCount).toBe(16);
  });

  it.each([true, false])('respects shatter budget expansion: %s', async (expandBudget) => {
    const controller = create({ maxCount: 2 });
    const emitter = await controller.shatterImage({ image: mockImage(), expandBudget });
    expect(emitter.particles).toHaveLength(expandBudget ? 4 : 2);
    expect(controller.engine.maxCount).toBe(expandBudget ? 4 : 2);
  });

  it('keeps parent depth in a manual explosion', () => {
    const controller = create({ rate: 1 });
    const parent = controller.burst({ x: 20, y: 20 }).particles[0]!;
    parent.position.z = 37;
    controller.explode({ childCount: 2 });
    expect(controller.engine.getAllParticles().map((p) => p.position.z)).toEqual([37, 37]);
  });

  it('converts client coordinates relative to the current container offset', () => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({ left: 100, top: 50 } as DOMRect);
    const controller = createParticles({
      container,
      renderer: 'canvas',
      autoResize: false,
      config: { pixelRatio: 2 },
    });
    controllers.push(controller);
    const emitter = controller.burst({ x: 140, y: 70 });
    expect(emitter.configuration.point.x).toBe(20);
    expect(emitter.configuration.point.y).toBe(10);
  });
});
