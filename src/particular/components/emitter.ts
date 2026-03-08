import { sample, forEach } from 'lodash-es';

import Vector from '../utils/vector';
import Particle from './particle';
import { getRandomInt } from '../utils/math';
import { generateHarmoniousPalette } from '../utils/color';
import { createExplosionChild } from '../utils/explosion';
import { destroy } from '../utils/genericUtils';
import type { EmitterConfiguration, ForceSource } from '../types';
import type Particular from '../core/particular';

export default class Emitter {
  configuration: EmitterConfiguration;
  particles: Particle[] = [];
  isEmitting = false;
  particular: Particular | null = null;
  lifeCycle = 0;
  private emitAccumulator = 0;

  constructor(configuration: EmitterConfiguration) {
    if (!configuration.colors || configuration.colors.length === 0) {
      this.configuration = { ...configuration, colors: generateHarmoniousPalette() };
    } else {
      this.configuration = configuration;
    }
  }

  emit(dt = 1): void {
    if (!this.isEmitting) return;
    if (!this.particular) return;

    this.emitAccumulator += this.configuration.rate * dt;
    const count = Math.floor(this.emitAccumulator);
    this.emitAccumulator -= count;

    for (let j = 0; j < count; j++) {
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

  update(boundsX: number, boundsY: number, forces?: ForceSource[], dt = 1): void {
    const currentParticles: Particle[] = [];
    const detonate = this.configuration.detonate;
    const newChildren: Particle[] = [];

    forEach(this.particles, (particle) => {
      const pos = particle.position;
      if (pos.x < 0 || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY) {
        const hasTrail = particle.trail && particle.trailSegments.length > 0;
        if (hasTrail) {
          particle.advanceTrail(dt);
          if (particle.trailSegments.length > 0) {
            currentParticles.push(particle);
          } else {
            particle.destroy();
          }
        } else {
          particle.destroy();
        }
        return;
      }

      particle.update(forces, dt);

      // Timed detonation — auto-explode into sub-burst at lifetime fraction
      if (
        detonate &&
        !particle.isDetonationChild &&
        this.particular &&
        particle.lifeTick >= particle.lifeTime * detonate.at
      ) {
        const childCount = detonate.childCount ?? 5;
        const budget = Math.max(0, this.particular.maxCount - this.particular.getCount() - newChildren.length);
        const toSpawn = Math.min(childCount, budget);
        for (let i = 0; i < toSpawn; i++) {
          const child = createExplosionChild(
            {
              x: particle.position.x,
              y: particle.position.y,
              color: particle.color,
              shape: particle.shape,
              blendMode: particle.blendMode,
            },
            detonate,
            this.particular,
            this.configuration.colors,
          );
          child.isDetonationChild = true;
          newChildren.push(child);
        }
        particle.destroy();
        return; // parent dies — don't push to currentParticles
      }

      const trailActive = particle.trail && particle.trailSegments.length > 0;
      const fadedOut = particle.alpha <= 0 && particle.lifeTick >= particle.lifeTime;

      // Keep particle alive until trail has fully faded out.
      if (!fadedOut || trailActive) {
        currentParticles.push(particle);
      } else {
        particle.destroy();
      }
    });

    this.particles = newChildren.length > 0
      ? [...currentParticles, ...newChildren]
      : currentParticles;
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
      particleLife,
      gravity,
      scaleStep,
      fadeTime,
      spawnWidth,
      spawnHeight,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      colors,
      acceleration: accelBase,
      accelerationSize,
      friction: frictionBase,
      frictionSize,
    } = this.configuration;
    const angle = velocity.getAngle() + spread - Math.random() * spread * 2;
    const magnitude = velocity.getMagnitude();
    const offsetX = spawnWidth > 0 ? (Math.random() - 0.5) * spawnWidth : 0;
    const offsetY = spawnHeight > 0 ? (Math.random() - 0.5) * spawnHeight : 0;
    const newPoint = new Vector(point.x + offsetX, point.y + offsetY);
    const newVelocity = Vector.fromAngle(angle, magnitude);

    const size = getRandomInt(sizeMin, sizeMax);
    newVelocity.add({ x: 0, y: -((sizeMax - size) / 15) * velocityMultiplier });
    const friction = frictionBase + frictionSize * size;
    const acceleration = new Vector(0, accelBase + accelerationSize * size);

    this.lifeCycle++;

    return new Particle({
      point: newPoint,
      velocity: newVelocity,
      acceleration,
      friction,
      size,
      particleLife,
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
      trailFade,
      trailShrink,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      colors,
    });
  }

  destroy(): void {
    destroy(this.particles);
  }
}
