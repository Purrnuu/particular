import { describe, expect, it } from 'vitest';
import FlockingForce from '../src/particular/components/flockingForce';
import Particle from '../src/particular/components/particle';
import Vector from '../src/particular/utils/vector';
import { presets } from '../src/particular/presets';

/** Create a minimal particle at given position with given velocity. */
function makeParticle(x: number, y: number, vx = 0, vy = 0, z = 0): Particle {
  const p = Particle.create({
    particleLife: 100,
    gravity: 0,
    scaleStep: 1,
    fadeTime: 30,
    point: new Vector(x, y, z),
    velocity: new Vector(vx, vy),
  });
  return p;
}

describe('FlockingForce', () => {
  describe('constructor', () => {
    it('merges config with defaults', () => {
      const ff = new FlockingForce({ neighborRadius: 200, separationWeight: 3 });
      expect(ff.neighborRadius).toBe(200);
      expect(ff.separationWeight).toBe(3);
      expect(ff.alignmentWeight).toBe(1.5); // default
      expect(ff.cohesionWeight).toBe(0.15); // default
      expect(ff.maxSteeringForce).toBe(0.08); // default
      expect(ff.maxSpeed).toBe(4); // default
      expect(ff.minSpeed).toBe(1.5);
      expect(ff.separationDistance).toBe(25); // default
    });

    it('uses all defaults when no config provided', () => {
      const ff = new FlockingForce();
      expect(ff.neighborRadius).toBe(100);
      expect(ff.separationWeight).toBe(1.2);
      expect(ff.alignmentWeight).toBe(1.5);
      expect(ff.cohesionWeight).toBe(0.15);
      expect(ff.maxSteeringForce).toBe(0.08);
      expect(ff.maxSpeed).toBe(4);
      expect(ff.minSpeed).toBe(1.5);
      expect(ff.separationDistance).toBe(25);
    });
  });

  describe('preCompute + getForce', () => {
    it.each([30, 60, 120, 144])('uses gentle edge turns without bouncing at %i Hz', (hz) => {
      const force = new FlockingForce();
      force.setBounds(320, 180);
      const bird = makeParticle(160, 90, 2, 0);
      let previous = 0;
      const dt = 60 / hz;
      for (let i = 0; i < hz * 12; i++) {
        force.preCompute([bird], dt);
        bird.update([force], dt);
        const heading = Math.atan2(bird.velocity.y, bird.velocity.x);
        const difference = Math.atan2(Math.sin(heading - previous), Math.cos(heading - previous));
        expect(Math.abs(difference) / dt).toBeLessThan(5 * Math.PI / 180);
        previous = heading;
        expect(bird.velocity.getMagnitude()).toBeGreaterThanOrEqual(1.5 - 1e-8);
      }
    });

    it('supports containment opt-out and direct legacy bounds writes', () => {
      const force = new FlockingForce({ maxSteeringForce: 0 });
      force.boundsWidth = 200;
      force.boundsHeight = 150;
      const bird = makeParticle(199, 75, 2, 0);
      force.preCompute([bird], 1);
      bird.update([force], 1);
      expect(bird.position.x).toBeLessThanOrEqual(200 - bird.size);
      force.containment = false;
      bird.position.x = 199;
      bird.velocity.x = 2;
      force.preCompute([bird], 1);
      bird.update([force], 1);
      expect(bird.position.x).toBeGreaterThan(200);
    });

    it('constrains a centered 3D flight volume, including an external shove', () => {
      const force = new FlockingForce({ boundsScale: 0.5, boundsDepth: 40 });
      force.setBounds(400, 200);
      const bird = makeParticle(500, -100, 40, -40, 100);
      bird.velocity.z = 40;
      force.preCompute([bird], 3);
      bird.update([force, { getForce: () => new Vector(100, -100, 100) }], 3);
      expect(bird.position.x).toBeGreaterThanOrEqual(150 + bird.size);
      expect(bird.position.x).toBeLessThanOrEqual(250 - bird.size);
      expect(bird.position.y).toBeGreaterThanOrEqual(50 + bird.size);
      expect(bird.position.y).toBeLessThanOrEqual(150 - bird.size);
      expect(Math.abs(bird.position.z)).toBeLessThanOrEqual(20 - bird.size);
      expect(bird.velocity.x).toBeLessThan(0);
      expect(bird.velocity.y).toBeGreaterThan(0);
      expect(bird.velocity.z).toBeLessThan(0);
    });

    it.each([
      [180, 75, 2, 0, 0, 1], [20, 75, -2, 0, 0, -1],
      [100, 20, 0, -2, 1, 0], [100, 130, 0, 2, -1, 0],
    ])('turns away from a head-on boundary at (%s, %s)', (x, y, vx, vy, tx, ty) => {
      const force = new FlockingForce();
      force.setBounds(200, 150);
      const bird = makeParticle(x, y, vx, vy);
      force.preCompute([bird], 1);
      bird.update([force], 1);
      if (tx) expect(bird.velocity.x * tx).toBeGreaterThan(0);
      if (ty) expect(bird.velocity.y * ty).toBeGreaterThan(0);
    });

    it.each([30, 60, 120, 144])('sustains cruising speed despite drag at %i Hz', (hz) => {
      const force = new FlockingForce();
      const bird = makeParticle(100, 100, 1.5, 0);
      bird.friction = presets.Ambient.flock.friction;
      const dt = 60 / hz;
      for (let i = 0; i < hz; i++) {
        force.preCompute([bird], dt);
        bird.update([force], dt);
        expect(bird.velocity.x).toBeCloseTo(1.5, 10);
      }
      expect(bird.position.x).toBeCloseTo(190, 10);
    });

    it('preserves heading and depth when restoring cruise speed', () => {
      const force = new FlockingForce();
      const bird = makeParticle(100, 100, 0.5, 0.5, 10);
      bird.velocity.z = 0.5;
      force.preCompute([bird], 0.5);
      bird.update([force], 0.5);
      expect(bird.velocity.getMagnitude()).toBeCloseTo(1.5, 10);
      expect(bird.velocity.x).toBeCloseTo(bird.velocity.y, 10);
      expect(bird.velocity.x).toBeCloseTo(bird.velocity.z, 10);
    });

    it('retains the flight heading when alignment exactly cancels speed', () => {
      const force = new FlockingForce({
        alignmentWeight: 0.5, separationWeight: 0, cohesionWeight: 0,
        maxSteeringForce: 10,
      });
      const bird = makeParticle(100, 100, 1, 0);
      const opposite = makeParticle(110, 100, -1, 0);
      force.preCompute([bird, opposite], 1);
      bird.update([force], 1);
      expect(bird.velocity.x).toBeCloseTo(1.5, 10);
      expect(bird.velocity.y).toBe(0);
    });

    it('caps the cruise floor by maxSpeed and permits passive swarms', () => {
      const bird = makeParticle(100, 100, 0.5, 0);
      const force = new FlockingForce({ minSpeed: 3, maxSpeed: 0.75 });
      force.preCompute([bird], 1);
      bird.update([force], 1);
      expect(bird.velocity.x).toBeCloseTo(0.75, 10);
      const passive = new FlockingForce({ minSpeed: 0 });
      passive.preCompute([bird], 1);
      expect(passive.getForce(bird.position, bird).x).toBe(0);
    });

    it.each([0.5, 1, 2])('turns more gently than the old defaults at dt=%s', (dt) => {
      const turn = (force: FlockingForce) => {
        const bird = makeParticle(100, 100, 2, 0);
        const neighbor = makeParticle(100, 110, 2, 0);
        force.preCompute([bird, neighbor], dt);
        bird.update([force], dt);
        return Math.abs(Math.atan2(bird.velocity.y, bird.velocity.x));
      };
      const gentle = turn(new FlockingForce());
      const previous = turn(new FlockingForce({
        maxSteeringForce: 0.5, separationWeight: 1.5, cohesionWeight: 0.3,
      }));
      expect(gentle).toBeGreaterThan(0);
      expect(gentle).toBeLessThan(previous * 0.25);
      expect(gentle / dt).toBeLessThan(3 * Math.PI / 180);
    });

    it('keeps flight momentum in the flock preset without a size-based upward bias', () => {
      const flock = presets.Ambient.flock;
      expect(flock.velocityMultiplier).toBe(0);
      const bird = Particle.create({
        particleLife: 600, gravity: 0, scaleStep: 1, fadeTime: 30,
        velocity: new Vector(2, 0), friction: flock.friction,
      });
      for (let i = 0; i < 60; i++) bird.update(undefined, 1);
      expect(bird.velocity.x).toBeGreaterThan(1.75);
      expect(bird.velocity.y).toBe(0);
    });

    it.each([30, 60, 120, 144, 240])('preserves smoothing over one second at %i Hz', (hz) => {
      const ff = new FlockingForce({
        separationWeight: 0, alignmentWeight: 0, cohesionWeight: 1,
        maxSteeringForce: 10, maxSpeed: 1000,
        minSpeed: 0,
      });
      const p = makeParticle(100, 100);
      const neighbor = makeParticle(110, 100);
      ff.preCompute([p, neighbor], 1);
      neighbor.position.x = 130;
      for (let i = 0; i < hz; i++) ff.preCompute([p, neighbor], 60 / hz);
      expect(ff.getForce(p.position, p).x).toBeCloseTo(0.3 - 0.2 * Math.pow(0.98, 60), 10);
    });

    it.each([0, 0.25, 0.5, 1, 2])('applies the 3D speed cap without double dt (dt=%s)', (dt) => {
      const ff = new FlockingForce({ maxSpeed: 4 });
      const p = makeParticle(100, 100, 10, 0, 10);
      p.velocity.z = 10;
      ff.preCompute([p], dt);
      p.update([ff], dt);
      expect(p.velocity.getMagnitude()).toBeCloseTo(dt > 0 ? 4 : Math.sqrt(200), 10);
    });

    it('lone particle produces zero force', () => {
      const ff = new FlockingForce();
      const p = makeParticle(100, 100);
      ff.preCompute([p], 1);
      const f = ff.getForce(p.position, p);
      expect(f.x).toBe(0);
      expect(f.y).toBe(0);
    });

    it('two nearby particles produce non-zero force', () => {
      const ff = new FlockingForce({ neighborRadius: 200 });
      const p1 = makeParticle(100, 100, 1, 0);
      const p2 = makeParticle(130, 100, -1, 0);
      ff.preCompute([p1, p2], 1);
      const f = ff.getForce(p1.position, p1);
      // Should have some force from alignment and cohesion at minimum
      expect(f.x !== 0 || f.y !== 0).toBe(true);
    });

    it('separation pushes apart close particles', () => {
      const ff = new FlockingForce({
        neighborRadius: 200,
        separationDistance: 50,
        separationWeight: 2,
        alignmentWeight: 0,
        cohesionWeight: 0,
        minSpeed: 0,
      });
      // Two particles within separation distance, same velocity
      const p1 = makeParticle(100, 100, 1, 0);
      const p2 = makeParticle(110, 100, 1, 0);
      ff.preCompute([p1, p2], 1);
      const f = ff.getForce(p1.position, p1);
      // p1 should be pushed away from p2 (negative x direction)
      expect(f.x).toBeLessThan(0);
    });

    it('alignment steers toward average neighbor velocity', () => {
      const ff = new FlockingForce({
        neighborRadius: 200,
        separationDistance: 5, // very small so separation doesn't kick in
        separationWeight: 0,
        alignmentWeight: 1,
        cohesionWeight: 0,
      });
      // p1 moving right, p2 and p3 moving up
      const p1 = makeParticle(100, 100, 2, 0);
      const p2 = makeParticle(150, 100, 0, -2);
      const p3 = makeParticle(100, 150, 0, -2);
      ff.preCompute([p1, p2, p3], 1);
      const f = ff.getForce(p1.position, p1);
      // Alignment should push p1 upward (negative y) and slow it rightward
      expect(f.y).toBeLessThan(0);
      expect(f.x).toBeLessThan(0);
    });

    it('cohesion steers toward average neighbor position', () => {
      const ff = new FlockingForce({
        neighborRadius: 500,
        separationDistance: 5,
        separationWeight: 0,
        alignmentWeight: 0,
        cohesionWeight: 1,
      });
      // p1 far left, neighbors are to the right
      const p1 = makeParticle(0, 100, 0, 0);
      const p2 = makeParticle(200, 100, 0, 0);
      const p3 = makeParticle(200, 100, 0, 0);
      ff.preCompute([p1, p2, p3], 1);
      const f = ff.getForce(p1.position, p1);
      // Cohesion should pull p1 rightward (positive x)
      expect(f.x).toBeGreaterThan(0);
    });

    it('force is clamped to maxSteeringForce', () => {
      const maxSteer = 0.3;
      const ff = new FlockingForce({
        neighborRadius: 200,
        separationDistance: 100,
        separationWeight: 100, // very high to ensure clamping
        maxSteeringForce: maxSteer,
        minSpeed: 0,
      });
      const p1 = makeParticle(100, 100, 1, 0);
      const p2 = makeParticle(105, 100, 1, 0);
      ff.preCompute([p1, p2], 1);
      const f = ff.getForce(p1.position, p1);
      const mag = Math.sqrt(f.x * f.x + f.y * f.y + f.z * f.z);
      expect(mag).toBeLessThanOrEqual(maxSteer + 0.001);
    });

    it('returns zero force when no particle param (backward compat)', () => {
      const ff = new FlockingForce();
      const p1 = makeParticle(100, 100);
      const p2 = makeParticle(120, 100);
      ff.preCompute([p1, p2], 1);
      const f = ff.getForce(p1.position); // no particle param
      expect(f.x).toBe(0);
      expect(f.y).toBe(0);
      expect(f.z).toBe(0);
    });

    it('includes z in distance for 3D particles', () => {
      const ff = new FlockingForce({
        neighborRadius: 50,
        separationDistance: 5,
        separationWeight: 0,
        alignmentWeight: 0,
        cohesionWeight: 1,
      });
      // p2 is within xy radius but far in z — should still be a neighbor with 3D distance
      const p1 = makeParticle(100, 100, 0, 0, 0);
      const p2 = makeParticle(110, 100, 0, 0, 30);
      ff.preCompute([p1, p2], 1);
      const f = ff.getForce(p1.position, p1);
      // With z included, p2 is at sqrt(100+900) = ~31.6, within radius 50
      expect(f.x !== 0 || f.z !== 0).toBe(true);
    });

    it('particles beyond neighbor radius produce zero force', () => {
      const ff = new FlockingForce({ neighborRadius: 50, minSpeed: 0 });
      const p1 = makeParticle(0, 0, 1, 0);
      const p2 = makeParticle(200, 0, -1, 0);
      ff.preCompute([p1, p2], 1);
      const f = ff.getForce(p1.position, p1);
      expect(f.x).toBe(0);
      expect(f.y).toBe(0);
    });
  });
});
