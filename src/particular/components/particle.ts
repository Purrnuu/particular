import randomcolor from 'randomcolor';

import Vector from '../utils/vector';
import { getRandomInt } from '../utils/math';
import EventDispatcher from '../utils/eventDispatcher';
import type { ParticleConstructorParams, ParticleShape, BlendMode } from '../types';
import type Particular from '../core/particular';

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
  
  // Shape configuration
  shape: ParticleShape;
  blendMode: BlendMode;
  glow: boolean;
  glowSize: number;
  glowColor: string;
  glowAlpha: number;
  trail: boolean;
  trailLength: number;
  imageTint: boolean;
  shadow: boolean;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  shadowAlpha: number;
  shadowLightOrigin: Vector;

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
    imageTint = false,
    shadow = false,
    shadowBlur = 8,
    shadowOffsetX = 4,
    shadowOffsetY = 4,
    shadowColor = '#000000',
    shadowAlpha = 0.5,
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

    this.lifeTime = getRandomInt(75, 100);
    this.lifeTick = 0;
    this.size = size ?? getRandomInt(5, 15);

    this.gravity = gravity;
    this.scaleStep = scaleStep;
    this.fadeTime = fadeTime;

    this.alpha = 1;
    this.color = randomcolor();
    
    // Shape configuration
    this.shape = shape;
    this.blendMode = blendMode;
    this.glow = glow;
    this.glowSize = glowSize;
    this.glowColor = glowColor;
    this.glowAlpha = glowAlpha;
    this.trail = trail;
    this.trailLength = trailLength;
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

  update(): void {
    this.velocity.add(this.acceleration);
    this.velocity.addFriction(this.friction);
    this.velocity.addGravity(this.gravity);
    this.position.add(this.velocity);
    this.rotation = this.rotation + this.rotationVelocity;
    this.factoredSize = Math.min(this.factoredSize + this.scaleStep, this.size);
    this.alpha = Math.min(1, Math.max((this.lifeTime - this.lifeTick) / this.fadeTime, 0));
    this.lifeTick++;
    this.dispatch('PARTICLE_UPDATE', this);
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
