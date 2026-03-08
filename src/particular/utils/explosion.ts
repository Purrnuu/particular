import Vector from './vector';
import { getRandomInt } from './math';
import Particle from '../components/particle';
import { defaultExplosionChild } from '../core/defaults';
import type { ChildExplosionConfig } from '../types';
import type Particular from '../core/particular';

export interface ParentSnapshot {
  x: number;
  y: number;
  color: string;
  shape: string;
  blendMode: string;
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
  const angle = Math.random() * Math.PI * 2;
  const velocity = Vector.fromAngle(angle, merged.velocity);

  const colors = merged.inheritColor
    ? [parent.color]
    : fallbackColors.length > 0
      ? fallbackColors
      : [parent.color];

  const particle = new Particle({
    point: new Vector(parent.x, parent.y),
    velocity,
    acceleration: new Vector(0, 0),
    friction: 0,
    size,
    particleLife: merged.childLife,
    gravity: merged.gravity,
    scaleStep: size, // instant full size
    fadeTime: merged.fadeTime,
    shape: merged.shape !== defaultExplosionChild.shape ? merged.shape : (parent.shape as any),
    blendMode: merged.blendMode !== defaultExplosionChild.blendMode ? merged.blendMode : (parent.blendMode as any),
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
