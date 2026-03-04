import { sample, forEach } from 'lodash-es';

import Vector from '../utils/vector';
import Particle from './particle';
import { getRandomInt } from '../utils/math';
import { destroy } from '../utils/genericUtils';
import type { EmitterConfiguration } from '../types';
import type Particular from '../core/particular';

export default class Emitter {
  configuration: EmitterConfiguration;
  particles: Particle[] = [];
  isEmitting = false;
  particular: Particular | null = null;
  lifeCycle = 0;

  constructor(configuration: EmitterConfiguration) {
    this.configuration = configuration;
  }

  emit(): void {
    if (!this.isEmitting) return;
    if (!this.particular) return;
    
    for (let j = 0; j < this.configuration.rate; j++) {
      const particle = this.createParticle();
      const icon = this.configuration.icons.length > 0
        ? (sample(this.configuration.icons) ?? this.configuration.icons[0]!)
        : null;
      particle.init(icon, this.particular);
      this.particles.push(particle);
    }
  }

  assignParticular(particular: Particular): void {
    this.particular = particular;
  }

  update(boundsX: number, boundsY: number): void {
    const currentParticles: Particle[] = [];

    forEach(this.particles, (particle) => {
      const pos = particle.position;
      if (!(pos.x < 0 || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY)) {
        particle.update();
        currentParticles.push(particle);
      } else {
        particle.destroy();
      }
    });

    this.particles = currentParticles;
    this.isEmitting = this.particular?.continuous ? true : this.lifeCycle < this.configuration.life;
  }

  isAlive(): boolean {
    return this.isEmitting || this.particles.length > 0;
  }

  createParticle(): Particle {
    const {
      velocity,
      spread,
      point,
      sizeMin,
      sizeMax,
      velocityMultiplier,
      gravity,
      scaleStep,
      fadeTime,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      trail,
      trailLength,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
    } = this.configuration;
    const angle = velocity.getAngle() + spread - Math.random() * spread * 2;
    const magnitude = velocity.getMagnitude();
    const newPoint = new Vector(point.x, point.y);
    const newVelocity = Vector.fromAngle(angle, magnitude);

    const size = getRandomInt(sizeMin, sizeMax);
    newVelocity.add({ x: 0, y: -((sizeMax - size) / 15) * velocityMultiplier });
    const friction = size / 2000;
    const acceleration = new Vector(0, size / 100);

    this.lifeCycle++;

    return new Particle({
      point: newPoint,
      velocity: newVelocity,
      acceleration,
      friction,
      size,
      gravity,
      scaleStep,
      fadeTime,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      trail,
      trailLength,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
    });
  }

  destroy(): void {
    destroy(this.particles);
  }
}
