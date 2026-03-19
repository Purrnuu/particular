import Vector from './vector';
import { getRandomInt } from './math';
import Particle from '../components/particle';
import { defaultExplosionChild } from '../core/defaults';
import type { ChildExplosionConfig, ParticleShape, BlendMode } from '../types';
import type Particular from '../core/particular';

export interface ParentSnapshot {
  x: number;
  y: number;
  z?: number;
  color: string;
  shape: ParticleShape;
  blendMode: BlendMode;
}

/**
 * Create a single explosion child particle from a parent snapshot.
 * Caller loops over `childCount` to spawn the full sub-burst.
 */
export function createExplosionChild(
  parent: ParentSnapshot,
  config: ChildExplosionConfig,
  engine: Particular,
  fallbackColors: string[],
): Particle {
  const merged = { ...defaultExplosionChild, ...config };
  const size = getRandomInt(merged.sizeMin, merged.sizeMax);
  // Velocity spread: randomize magnitude around base velocity
  const spread = merged.velocitySpread;
  const speed = merged.velocity * (1 - spread + Math.random() * spread * 2);

  let velocity: Vector;
  if (merged.spread3d && merged.spread3d > 0) {
    // Spherical 3D burst
    const azimuth = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * 2 * merged.spread3d;
    velocity = Vector.fromSpherical(azimuth, elevation, speed);
  } else {
    const angle = Math.random() * Math.PI * 2;
    velocity = Vector.fromAngle(angle, speed);
  }

  const colors = merged.inheritColor
    ? [parent.color]
    : fallbackColors.length > 0
      ? fallbackColors
      : [parent.color];

  const particle = Particle.create({
    point: new Vector(parent.x, parent.y, parent.z ?? 0),
    velocity,
    acceleration: new Vector(0, 0),
    friction: merged.friction,
    size,
    particleLife: merged.childLife,
    gravity: merged.gravity,
    scaleStep: merged.scaleStep,
    fadeTime: merged.fadeTime,
    shape: merged.shape !== defaultExplosionChild.shape ? merged.shape : parent.shape,
    blendMode: merged.blendMode !== defaultExplosionChild.blendMode ? merged.blendMode : parent.blendMode,
    glow: merged.glow,
    glowSize: merged.glowSize,
    glowColor: merged.glowColor,
    glowAlpha: merged.glowAlpha,
    shadow: merged.shadow,
    trail: merged.trail,
    trailLength: merged.trailLength,
    trailFade: merged.trailFade,
    trailShrink: merged.trailShrink,
    colors,
  });

  particle.init(null, engine);
  return particle;
}
