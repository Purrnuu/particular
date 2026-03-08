import Vector from '../utils/vector';
import { getRandomInt } from '../utils/math';
import EventDispatcher from '../utils/eventDispatcher';
import type { ParticleConstructorParams, ParticleShape, BlendMode, ForceSource } from '../types';
import type Particular from '../core/particular';

export interface TrailSegment {
  x: number;
  y: number;
  size: number;
  rotation: number;
  alpha: number;
  age: number;
}

export default class Particle {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  friction: number;
  rotation: number;
  rotationDirection: number;
  rotationVelocity: number;
  factoredSize: number;
  lifeTime: number;
  lifeTick: number;
  size: number;
  gravity: number;
  scaleStep: number;
  fadeTime: number;
  alpha: number;
  color: string;
  particular: Particular | null = null;
  image: string | HTMLImageElement | null = null;
  isDetonationChild = false;
  
  // Shape configuration
  shape: ParticleShape;
  blendMode: BlendMode;
  glow: boolean;
  glowSize: number;
  glowColor: string;
  glowAlpha: number;
  trail: boolean;
  trailLength: number;
  trailFade: number;
  trailShrink: number;
  imageTint: boolean;
  shadow: boolean;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  shadowAlpha: number;
  shadowLightOrigin: Vector;
  trailSegments: TrailSegment[] = [];

  addEventListener!: EventDispatcher['addEventListener'];
  removeEventListener!: EventDispatcher['removeEventListener'];
  removeAllEventListeners!: EventDispatcher['removeAllEventListeners'];
  dispatchEvent!: EventDispatcher['dispatchEvent'];
  hasEventListener!: EventDispatcher['hasEventListener'];

  constructor({
    point,
    velocity,
    acceleration,
    friction,
    size,
    particleLife,
    gravity,
    scaleStep,
    fadeTime,
    shape = 'circle',
    blendMode = 'normal',
    glow = false,
    glowSize = 10,
    glowColor = '#ffffff',
    glowAlpha = 0.35,
    trail = false,
    trailLength = 3,
    trailFade = 0.75,
    trailShrink = 0.55,
    imageTint = false,
    shadow = false,
    shadowBlur = 8,
    shadowOffsetX = 3,
    shadowOffsetY = 3,
    shadowColor = '#000000',
    shadowAlpha = 0.3,
    colors,
  }: ParticleConstructorParams) {
    this.position = point ?? new Vector(0, 0);
    this.shadowLightOrigin = new Vector(this.position.x, this.position.y);
    this.velocity = velocity ?? new Vector(0, 0);
    this.acceleration = acceleration ?? new Vector(0, 0);
    this.friction = friction ?? 0;

    this.rotation = Math.random() * 360;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.rotationVelocity = this.rotationDirection * getRandomInt(1, 3);

    this.factoredSize = 1;

    this.lifeTime = getRandomInt(Math.round(particleLife * 0.75), particleLife);
    this.lifeTick = 0;
    this.size = size ?? getRandomInt(5, 15);

    this.gravity = gravity;
    this.scaleStep = scaleStep;
    this.fadeTime = fadeTime;

    this.alpha = 1;
    this.color = colors && colors.length > 0
      ? colors[Math.floor(Math.random() * colors.length)]!
      : '#888888';
    
    // Shape configuration
    this.shape = shape;
    this.blendMode = blendMode;
    this.glow = glow;
    this.glowSize = glowSize;
    this.glowColor = glowColor;
    this.glowAlpha = glowAlpha;
    this.trail = trail;
    this.trailLength = trailLength;
    this.trailFade = trailFade;
    this.trailShrink = trailShrink;
    this.imageTint = imageTint;
    this.shadow = shadow;
    this.shadowBlur = shadowBlur;
    this.shadowOffsetX = shadowOffsetX;
    this.shadowOffsetY = shadowOffsetY;
    this.shadowColor = shadowColor;
    this.shadowAlpha = shadowAlpha;
  }

  init(image: string | HTMLImageElement | null, particular: Particular): void {
    this.image = image;
    this.particular = particular;
    this.dispatch('PARTICLE_CREATED', this);
  }

  update(forces?: ForceSource[], dt = 1): void {
    this.updateTrail(true, dt);
    this.velocity.add(this.acceleration, dt);
    this.velocity.addFriction(this.friction, dt);
    this.velocity.addGravity(this.gravity, dt);
    if (forces) {
      for (const force of forces) {
        this.velocity.add(force.getForce(this.position), dt);
      }
    }
    this.position.add(this.velocity, dt);
    this.rotation = this.rotation + this.rotationVelocity * dt;
    this.factoredSize = Math.min(this.factoredSize + this.scaleStep * dt, this.size);
    this.alpha = Math.min(1, Math.max((this.lifeTime - this.lifeTick) / this.fadeTime, 0));
    this.lifeTick += dt;
    this.dispatch('PARTICLE_UPDATE', this);
  }

  advanceTrail(dt = 1): void {
    this.updateTrail(false, dt);
  }

  private updateTrail(addCurrentPoint: boolean, dt = 1): void {
    if (!this.trail || this.trailLength <= 0) {
      if (this.trailSegments.length) this.trailSegments = [];
      return;
    }

    const maxAge = Math.max(1, Math.floor(this.trailLength));
    this.trailSegments = this.trailSegments
      .map((segment) => ({ ...segment, age: segment.age + dt }))
      .filter((segment) => segment.age < maxAge);

    if (!addCurrentPoint) return;

    // Do not add new trail points once particle is fully transparent.
    if (this.alpha <= 0) return;

    this.trailSegments.push({
      x: this.position.x,
      y: this.position.y,
      size: this.factoredSize,
      rotation: this.rotation,
      alpha: this.alpha,
      age: 0,
    });
  }

  resetImage(): void {
    this.image = null;
  }

  getRoundedLocation(): [number, number] {
    return [((this.position.x * 10) << 0) * 0.1, ((this.position.y * 10) << 0) * 0.1];
  }

  private dispatch<T>(event: string, target: T): void {
    if (this.particular) {
      this.particular.dispatchEvent(event, target);
    }
  }

  destroy(): void {
    this.dispatch('PARTICLE_DEAD', this);
  }
}

EventDispatcher.bind(Particle);
