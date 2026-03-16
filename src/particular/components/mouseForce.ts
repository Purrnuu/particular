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
  private _touchListener: ((e: TouchEvent) => void) | null = null;
  private _trackTarget: EventTarget | null = null;
  private _pixelRatio = 1;
  private _container: HTMLElement | null = null;

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

  startTracking(target: EventTarget, pixelRatio: number, container?: HTMLElement | null): void {
    this.stopTracking();
    this._pixelRatio = pixelRatio;
    this._container = container ?? null;

    const handleCoords = (clientX: number, clientY: number) => {
      let x = clientX;
      let y = clientY;
      if (this._container) {
        const rect = this._container.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
      }
      this.updatePosition(x / this._pixelRatio, y / this._pixelRatio);
    };

    this._trackListener = (e: MouseEvent) => {
      handleCoords(e.clientX, e.clientY);
    };

    this._touchListener = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handleCoords(touch.clientX, touch.clientY);
      }
    };

    this._trackTarget = target;
    target.addEventListener('mousemove', this._trackListener as EventListener);
    target.addEventListener('touchmove', this._touchListener as EventListener, { passive: true });
    target.addEventListener('touchstart', this._touchListener as EventListener, { passive: true });
  }

  stopTracking(): void {
    if (this._trackTarget) {
      if (this._trackListener) {
        this._trackTarget.removeEventListener('mousemove', this._trackListener as EventListener);
      }
      if (this._touchListener) {
        this._trackTarget.removeEventListener('touchmove', this._touchListener as EventListener);
        this._trackTarget.removeEventListener('touchstart', this._touchListener as EventListener);
      }
    }
    this._trackTarget = null;
    this._trackListener = null;
    this._touchListener = null;
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
