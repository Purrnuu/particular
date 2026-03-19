import { describe, expect, it } from 'vitest';
import FlockingForce from '../src/particular/components/flockingForce';
import Particle from '../src/particular/components/particle';
import Vector from '../src/particular/utils/vector';

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
      expect(ff.alignmentWeight).toBe(1.0); // default
      expect(ff.cohesionWeight).toBe(1.0); // default
      expect(ff.maxSteeringForce).toBe(0.5); // default
      expect(ff.maxSpeed).toBe(4); // default
      expect(ff.separationDistance).toBe(25); // default
    });

    it('uses all defaults when no config provided', () => {
      const ff = new FlockingForce();
      expect(ff.neighborRadius).toBe(100);
      expect(ff.separationWeight).toBe(1.5);
      expect(ff.alignmentWeight).toBe(1.0);
      expect(ff.cohesionWeight).toBe(1.0);
      expect(ff.maxSteeringForce).toBe(0.5);
      expect(ff.maxSpeed).toBe(4);
      expect(ff.separationDistance).toBe(25);
    });
  });

  describe('preCompute + getForce', () => {
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
      const ff = new FlockingForce({ neighborRadius: 50 });
      const p1 = makeParticle(0, 0, 1, 0);
      const p2 = makeParticle(200, 0, -1, 0);
      ff.preCompute([p1, p2], 1);
      const f = ff.getForce(p1.position, p1);
      expect(f.x).toBe(0);
      expect(f.y).toBe(0);
    });
  });
});
