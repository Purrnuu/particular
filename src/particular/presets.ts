import Vector from './utils/vector';
import type { FullParticularConfig } from './types';

/**
 * Pre-defined particle presets for beautiful, aesthetic effects out of the box.
 * Use with ParticularWrapper: e.g. ParticularWrapper(presets.confetti)(MyComponent)
 * Combine with custom options: ParticularWrapper({ ...presets.sparkles, rate: 20 })(MyComponent)
 */
export const presets = {
  /** Classic celebration: mixed shapes, vibrant colors, satisfying burst */
  confetti: {
    shape: 'square' as const,
    blendMode: 'normal' as const,
    rate: 12,
    life: 35,
    velocity: Vector.fromAngle(-90, 6),
    spread: Math.PI * 0.95,
    sizeMin: 6,
    sizeMax: 14,
    velocityMultiplier: 5,
    fadeTime: 25,
    gravity: 0.18,
    scaleStep: 0.8,
    maxCount: 400,
  } satisfies FullParticularConfig,

  /** Crisp additive sparkles; great for magic or success feedback */
  sparkles: {
    shape: 'sparkle' as const,
    blendMode: 'additive' as const,
    rate: 18,
    life: 28,
    velocity: Vector.fromAngle(-90, 7),
    spread: Math.PI * 1.1,
    sizeMin: 8,
    sizeMax: 18,
    velocityMultiplier: 4,
    fadeTime: 22,
    gravity: 0.12,
    scaleStep: 1,
    maxCount: 350,
  } satisfies FullParticularConfig,

  /** Soft glowing stars; dreamy, premium feel */
  stardust: {
    shape: 'star' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 12,
    rate: 10,
    life: 40,
    velocity: Vector.fromAngle(-90, 4),
    spread: Math.PI * 1.2,
    sizeMin: 4,
    sizeMax: 12,
    velocityMultiplier: 5,
    fadeTime: 35,
    gravity: 0.08,
    scaleStep: 0.6,
    maxCount: 300,
  } satisfies FullParticularConfig,

  /** Bold additive burst; fireworks-style impact */
  fireworks: {
    shape: 'circle' as const,
    blendMode: 'additive' as const,
    rate: 25,
    life: 20,
    velocity: Vector.fromAngle(-90, 9),
    spread: Math.PI,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 8,
    fadeTime: 18,
    gravity: 0.2,
    scaleStep: 1.2,
    maxCount: 500,
  } satisfies FullParticularConfig,

  /** Delicate rings with glow; bubbles or orbs */
  bubbles: {
    shape: 'ring' as const,
    blendMode: 'normal' as const,
    glow: true,
    glowSize: 18,
    rate: 6,
    life: 45,
    velocity: Vector.fromAngle(-90, 3),
    spread: Math.PI / 2,
    sizeMin: 8,
    sizeMax: 22,
    velocityMultiplier: 3,
    fadeTime: 40,
    gravity: 0.06,
    scaleStep: 0.5,
    maxCount: 200,
  } satisfies FullParticularConfig,

  /** Stars + glow; strong “magic” effect */
  magic: {
    shape: 'star' as const,
    blendMode: 'normal' as const,
    glow: true,
    glowSize: 14,
    rate: 14,
    life: 32,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1.15,
    sizeMin: 6,
    sizeMax: 16,
    velocityMultiplier: 5,
    fadeTime: 28,
    gravity: 0.1,
    scaleStep: 0.9,
    maxCount: 350,
  } satisfies FullParticularConfig,

  /** Gentle falling circles; snow or petals */
  snow: {
    shape: 'circle' as const,
    blendMode: 'normal' as const,
    rate: 5,
    life: 50,
    velocity: Vector.fromAngle(-95, 2),
    spread: Math.PI / 4,
    sizeMin: 4,
    sizeMax: 10,
    velocityMultiplier: 2,
    fadeTime: 45,
    gravity: 0.04,
    scaleStep: 0.4,
    maxCount: 250,
  } satisfies FullParticularConfig,

  /** Warm glowing circles; embers or fireflies */
  embers: {
    shape: 'circle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 16,
    rate: 8,
    life: 38,
    velocity: Vector.fromAngle(-88, 4),
    spread: Math.PI * 0.8,
    sizeMin: 3,
    sizeMax: 9,
    velocityMultiplier: 4,
    fadeTime: 32,
    gravity: 0.07,
    scaleStep: 0.7,
    maxCount: 280,
  } satisfies FullParticularConfig,

  /** Sharp triangles; confetti variant with edge */
  confettiSharp: {
    shape: 'triangle' as const,
    blendMode: 'normal' as const,
    rate: 14,
    life: 30,
    velocity: Vector.fromAngle(-90, 6),
    spread: Math.PI,
    sizeMin: 7,
    sizeMax: 15,
    velocityMultiplier: 6,
    fadeTime: 24,
    gravity: 0.16,
    scaleStep: 0.85,
    maxCount: 380,
  } satisfies FullParticularConfig,
} as const;

export type PresetName = keyof typeof presets;
