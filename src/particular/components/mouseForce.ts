import Vector from '../utils/vector';
import type { ForceSource, MouseForceConfig } from '../types';
import { defaultMouseForce } from '../core/defaults';

export default class MouseForce implements ForceSource {
  position: Vector;
  velocity: Vector;
  strength: number;
  radius: number;
  damping: number;
  maxSpeed: number;
  falloff: number;

  private _trackListener: ((e: MouseEvent) => void) | null = null;
  private _trackTarget: EventTarget | null = null;
  private _pixelRatio = 1;

  constructor(config: MouseForceConfig = {}) {
    const merged = { ...defaultMouseForce, ...config };
    this.position = new Vector(merged.x, merged.y);
    this.velocity = new Vector(0, 0);
    this.strength = merged.strength;
    this.radius = merged.radius;
    this.damping = merged.damping;
    this.maxSpeed = merged.maxSpeed;
    this.falloff = merged.falloff;
  }

  get isTracking(): boolean {
    return this._trackTarget !== null;
  }

  startTracking(target: EventTarget, pixelRatio: number): void {
    this.stopTracking();
    this._pixelRatio = pixelRatio;
    this._trackListener = (e: MouseEvent) => {
      this.updatePosition(e.clientX / this._pixelRatio, e.clientY / this._pixelRatio);
    };
    this._trackTarget = target;
    target.addEventListener('mousemove', this._trackListener as EventListener);
  }

  stopTracking(): void {
    if (this._trackTarget && this._trackListener) {
      this._trackTarget.removeEventListener('mousemove', this._trackListener as EventListener);
    }
    this._trackTarget = null;
    this._trackListener = null;
  }

  destroy(): void {
    this.stopTracking();
  }

  updatePosition(x: number, y: number): void {
    this.velocity.x = x - this.position.x;
    this.velocity.y = y - this.position.y;
    this.position.x = x;
    this.position.y = y;
  }

  decay(dt = 1): void {
    const factor = Math.pow(this.damping, dt);
    this.velocity.x *= factor;
    this.velocity.y *= factor;
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
