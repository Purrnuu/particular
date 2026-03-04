import Vector from './utils/vector';
import type { FullParticularConfig } from './types';

/**
 * Pre-defined particle presets for beautiful, aesthetic effects out of the box.
 * Use with ParticularWrapper: e.g. ParticularWrapper(presets.Burst.confetti)(MyComponent)
 * Combine with custom options: ParticularWrapper({ ...presets.Burst.magic, rate: 20 })(MyComponent)
 */
const Burst = {
  /** Polished confetti burst: playful, readable, and balanced */
  confetti: {
    shape: 'square' as const,
    blendMode: 'normal' as const,
    rate: 14,
    life: 34,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1.0,
    sizeMin: 3,
    sizeMax: 16,
    velocityMultiplier: 5,
    fadeTime: 28,
    gravity: 0.1,
    scaleStep: 0.85,
    maxCount: 420,
  } satisfies FullParticularConfig,

  /** Signature magical burst: soft white glow + star silhouettes */
  magic: {
    shape: 'circle' as const,
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
    trail: true,
    trailLength: 12,
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

const Images = {
  /** Tuned for icon/image particles (no tint by default). */
  showcase: {
    shape: 'roundedRectangle' as const,
    blendMode: 'normal' as const,
    imageTint: false,
    glow: false,
    rate: 12,
    life: 36,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1.0,
    sizeMin: 5,
    sizeMax: 22,
    velocityMultiplier: 4,
    fadeTime: 30,
    gravity: 0.2,
    scaleStep: 0.8,
    maxCount: 380,
  } satisfies FullParticularConfig,
} as const;

const presetRegistry = {
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  images: Images.showcase,
} as const;

export const presets = {
  Burst,
  Images,
  // Backward-compatible aliases
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  images: Images.showcase,
} as const;

export type PresetName = keyof typeof presetRegistry;

export function getPreset(name: PresetName): FullParticularConfig {
  return presetRegistry[name];
}
