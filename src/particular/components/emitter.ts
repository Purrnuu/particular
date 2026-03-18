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
  private _newChildren: Particle[] = [];

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
      const icons = this.configuration.icons;
      const icon = icons.length > 0
        ? icons[Math.floor(Math.random() * icons.length)]!
        : null;
      particle.init(icon, this.particular);
      this.particles.push(particle);
    }
  }

  assignParticular(particular: Particular): void {
    this.particular = particular;
  }

  update(boundsX: number, boundsY: number, forces?: ForceSource[], dt = 1): void {
    let writeIdx = 0;
    const detonate = this.configuration.detonate;
    const newChildren = this._newChildren;
    newChildren.length = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]!;
      const pos = particle.position;
      if (pos.x < 0 || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY) {
        // Particles with a home position are never killed by bounds — they'll spring back
        if (particle.homePosition) {
          particle.update(forces, dt);
          this.particles[writeIdx++] = particle;
          continue;
        }
        const hasTrail = particle.trail && particle.trailSegments.length > 0;
        if (hasTrail) {
          particle.advanceTrail(dt);
          if (particle.trailSegments.length > 0) {
            this.particles[writeIdx++] = particle;
          } else {
            particle.destroy();
          }
        } else {
          particle.destroy();
        }
        continue;
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
        for (let j = 0; j < toSpawn; j++) {
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
        continue; // parent dies
      }

      const trailActive = particle.trail && particle.trailSegments.length > 0;
      const fadedOut = particle.alpha <= 0 && particle.lifeTick >= particle.lifeTime;

      // Keep particle alive until trail has fully faded out.
      if (!fadedOut || trailActive) {
        this.particles[writeIdx++] = particle;
      } else {
        particle.destroy();
      }
    }

    // Trim dead particles and append detonation children
    this.particles.length = writeIdx;
    for (let i = 0; i < newChildren.length; i++) {
      this.particles.push(newChildren[i]!);
    }
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
      gravityJitter,
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
    const jitter = gravityJitter ?? 0;
    const jitteredGravity = jitter > 0
      ? gravity * (1 - jitter + Math.random() * jitter * 2)
      : gravity;

    this.lifeCycle++;

    return Particle.create({
      point: newPoint,
      velocity: newVelocity,
      acceleration,
      friction,
      size,
      particleLife,
      gravity: jitteredGravity,
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
