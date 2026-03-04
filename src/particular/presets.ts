import Vector from './utils/vector';
import type { FullParticularConfig } from './types';

/**
 * Pre-defined particle presets for beautiful, aesthetic effects out of the box.
 * Use with ParticularWrapper: e.g. ParticularWrapper(presets.confetti)(MyComponent)
 * Combine with custom options: ParticularWrapper({ ...presets.sparkles, rate: 20 })(MyComponent)
 */
export const presets = {
  /** Polished confetti burst: playful, readable, and balanced */
  confetti: {
    shape: 'square' as const,
    blendMode: 'normal' as const,
    rate: 14,
    life: 34,
    velocity: Vector.fromAngle(-90, 6.2),
    spread: Math.PI * 1.0,
    sizeMin: 6,
    sizeMax: 13,
    velocityMultiplier: 5,
    fadeTime: 28,
    gravity: 0.17,
    scaleStep: 0.85,
    maxCount: 420,
  } satisfies FullParticularConfig,

  /** Signature magical burst: soft white glow + star silhouettes */
  magic: {
    shape: 'star' as const,
    blendMode: 'normal' as const,
    glow: false,  
    rate: 14,
    life: 34,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1.15,
    sizeMin: 6,
    sizeMax: 16,
    velocityMultiplier: 5,
    fadeTime: 30,
    gravity: 0.1,
    scaleStep: 0.9,
    maxCount: 360,
  } satisfies FullParticularConfig,

  /** Cinematic fireworks: energetic additive circles with bright bloom */
  fireworks: {
    shape: 'circle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 14,
    glowColor: '#fff7d6',
    glowAlpha: 0.5,
    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-90, 8.8),
    spread: Math.PI * 1.05,
    sizeMin: 4,
    sizeMax: 12,
    velocityMultiplier: 8,
    fadeTime: 20,
    gravity: 0.18,
    scaleStep: 1.15,
    maxCount: 520,
  } satisfies FullParticularConfig,
} as const;

export type PresetName = keyof typeof presets;
