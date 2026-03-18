import Vector from '../utils/vector';
import type { ForceSource, MouseForceConfig } from '../types';
import { defaultMouseForce } from '../core/defaults';

// Reusable force vector — safe because getForce result is consumed immediately by velocity.add()
const _tempForce = new Vector(0, 0);

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
  private _cachedRect: { left: number; top: number } | null = null;
  private _rectDirty = true;
  private _rectInvalidator: (() => void) | null = null;
  private _resizeObserver: ResizeObserver | null = null;

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
    this._rectDirty = true;
    this._cachedRect = null;

    // Cache container rect — invalidate on scroll/resize instead of reading per mousemove
    if (this._container) {
      this._rectInvalidator = () => { this._rectDirty = true; };
      this._resizeObserver = new ResizeObserver(this._rectInvalidator);
      this._resizeObserver.observe(this._container);
      window.addEventListener('scroll', this._rectInvalidator, { passive: true });
      this._container.addEventListener('scroll', this._rectInvalidator, { passive: true });
    }

    const handleCoords = (clientX: number, clientY: number) => {
      let x = clientX;
      let y = clientY;
      if (this._container) {
        if (this._rectDirty || !this._cachedRect) {
          const rect = this._container.getBoundingClientRect();
          this._cachedRect = { left: rect.left, top: rect.top };
          this._rectDirty = false;
        }
        x -= this._cachedRect.left;
        y -= this._cachedRect.top;
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
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._rectInvalidator) {
      window.removeEventListener('scroll', this._rectInvalidator);
      if (this._container) {
        this._container.removeEventListener('scroll', this._rectInvalidator);
      }
      this._rectInvalidator = null;
    }
    this._cachedRect = null;
    this._rectDirty = true;
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
      _tempForce.x = 0;
      _tempForce.y = 0;
      return _tempForce;
    }

    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed < 0.01) {
      _tempForce.x = 0;
      _tempForce.y = 0;
      return _tempForce;
    }

    const linearFalloff = 1 - dist / this.radius;
    const distanceFalloff = this.falloff === 1
      ? linearFalloff
      : Math.pow(linearFalloff, this.falloff);
    const speedFactor = Math.min(speed, this.maxSpeed) / this.maxSpeed;

    // Combine normalize + scale: (vel/speed) * strength * falloff * speedFactor
    const scale = this.strength * distanceFalloff * speedFactor / speed;
    _tempForce.x = this.velocity.x * scale;
    _tempForce.y = this.velocity.y * scale;
    return _tempForce;
  }
}
