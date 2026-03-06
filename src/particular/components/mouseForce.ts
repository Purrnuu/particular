import Vector from '../utils/vector';
import type { ForceSource } from '../types';

export default class MouseForce implements ForceSource {
  position: Vector;
  velocity: Vector;
  strength: number;
  radius: number;
  damping: number;
  maxSpeed: number;
  falloff: number;

  constructor(
    x = 0,
    y = 0,
    strength = 1,
    radius = 200,
    damping = 0.85,
    maxSpeed = 10,
    falloff = 1,
  ) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.strength = strength;
    this.radius = radius;
    this.damping = damping;
    this.maxSpeed = maxSpeed;
    this.falloff = falloff;
  }

  updatePosition(x: number, y: number): void {
    this.velocity.x = x - this.position.x;
    this.velocity.y = y - this.position.y;
    this.position.x = x;
    this.position.y = y;
  }

  decay(): void {
    this.velocity.x *= this.damping;
    this.velocity.y *= this.damping;
  }

  getForce(particlePosition: Vector): Vector {
    const dx = particlePosition.x - this.position.x;
    const dy = particlePosition.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0 || dist > this.radius) {
      return new Vector(0, 0);
    }

    const speed = this.velocity.getMagnitude();
    if (speed < 0.01) {
      return new Vector(0, 0);
    }

    const linearFalloff = 1 - dist / this.radius;
    const distanceFalloff = this.falloff === 1
      ? linearFalloff
      : Math.pow(linearFalloff, this.falloff);
    const speedFactor = Math.min(speed, this.maxSpeed) / this.maxSpeed;

    const force = new Vector(this.velocity.x, this.velocity.y);
    force.normalize();
    force.scale(this.strength * distanceFalloff * speedFactor);

    return force;
  }
}
