import Vector from './utils/vector';
import type { FullParticularConfig } from './types';

// ── Color Palettes ──────────────────────────────────────────────────────────

const snowPalette: string[] = ['#ffffff', '#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6'];
const grayscalePalette: string[] = ['#f8f9fa', '#dee2e6', '#adb5bd', '#868e96', '#495057', '#212529'];
const coolBluePalette: string[] = ['#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0', '#228be6'];
const bluePalette: string[] = ['#003d99', '#0057d9', '#0077ff', '#1a8cff', '#3da1ff', '#66b8ff'];
const orangePalette: string[] = ['#b33600', '#cc4a00', '#e86100', '#f57c00', '#ff9500', '#ffad33'];
const greenPalette: string[] = ['#006b3f', '#008c51', '#00a85e', '#00c46b', '#1edd80', '#4deda0'];
const mutedPalette: string[] = ['#d4a373', '#ccd5ae', '#e9edc9', '#a8dadc', '#b5838d', '#e5989b', '#8d99ae'];
const meteorPalette: string[] = ['#ffffff', '#fff4e0', '#ffd699', '#ff9500', '#ff6b00', '#e84d00'];
const finlandPalette: string[] = ['#003580', '#002f6c', '#ffffff', '#f8f9fa'];
const usaPalette: string[] = ['#B22234', '#ffffff', '#3C3B6E'];

// ── Presets ─────────────────────────────────────────────────────────────────

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
    colors: mutedPalette,
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
    colors: coolBluePalette,
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
    colors: mutedPalette,
  } satisfies FullParticularConfig,

  /** Fireworks with timed detonation: narrow upward launch that auto-explodes into colorful sub-bursts */
  fireworksDetonation: {
    shape: 'circle' as const,
    blendMode: 'normal' as const,
    glow: true,
    glowSize: 14,
    glowColor: '#fff7d6',
    glowAlpha: 0.5,
    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-Math.PI / 2, 8.8),
    spread: Math.PI / 4,
    sizeMin: 3,
    sizeMax: 6,
    velocityMultiplier: 8,
    fadeTime: 20,
    gravity: 0.08,
    scaleStep: 1.15,
    maxCount: 3000,
    particleLife: 80,
    detonate: {
      at: 0.7,
      childCount: 12,
      velocity: 4,
      childLife: 50,
      fadeTime: 20,
      glow: true,
      glowSize: 8,
      inheritColor: true,
    },
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

const Ambient = {
  /** Gentle snowfall: soft white particles drifting downward across the viewport */
  snow: {
    shape: 'circle' as const,
    blendMode: 'normal' as const,
    glow: true,
    glowSize: 8,
    glowColor: '#ffffff',
    glowAlpha: 0.2,
    shadow: false,
    rate: 0.55,
    life: 999999,
    particleLife: 500,
    velocity: Vector.fromAngle(Math.PI / 2, 0.4),
    spread: Math.PI * 0.15,
    sizeMin: 1,
    sizeMax: 4,
    velocityMultiplier: 0.3,
    fadeTime: 60,
    gravity: 0.005,
    acceleration: 0,
    accelerationSize: 0.001,
    friction: 0.001,
    frictionSize: 0.003,
    scaleStep: 1,
    maxCount: 280,
    continuous: true,
    autoStart: true,
    colors: snowPalette,
  } satisfies FullParticularConfig,

  /** Meteors: bright diagonal streaks with glowing trails, accelerating as they fall */
  meteors: {
    shape: 'circle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 12,
    glowColor: '#ff8c00',
    glowAlpha: 0.4,
    shadow: false,
    trail: true,
    trailLength: 15,
    trailFade: 0.2,
    trailShrink: 0.5,
    rate: 0.3,
    life: 999999,
    particleLife: 250,
    velocity: Vector.fromAngle(Math.PI * 0.5, 8.5),
    spread: Math.PI * 0.5,
    sizeMin: 1,
    sizeMax: 8,
    velocityMultiplier: 0.5,
    fadeTime: 40,
    gravity: 0.05,
    acceleration: 0.02,
    accelerationSize: 0.005,
    friction: 0,
    frictionSize: 0,
    scaleStep: 1,
    maxCount: 150,
    continuous: true,
    autoStart: true,
    colors: meteorPalette,
  } satisfies FullParticularConfig,
} as const;

// ── Spreadable Color Presets ────────────────────────────────────────────────

const Colors = {
  /** White to offwhite range */
  snow: { colors: snowPalette },
  /** Full black-to-white range */
  grayscale: { colors: grayscalePalette },
  /** Single-hue cool blue range */
  coolBlue: { colors: coolBluePalette },
  /** Desaturated warm/cool mix */
  muted: { colors: mutedPalette },
  /** Bold saturated blue */
  blue: { colors: bluePalette },
  /** Bold saturated orange */
  orange: { colors: orangePalette },
  /** Bold saturated green */
  green: { colors: greenPalette },
  /** Finnish flag blue and white */
  finland: { colors: finlandPalette },
  /** American flag red, white, blue */
  usa: { colors: usaPalette },
  /** White-hot to deep red meteor palette */
  meteor: { colors: meteorPalette },
} as const;

// ── Registry & Exports ─────────────────────────────────────────────────────

const presetRegistry = {
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
} as const;

export const presets = {
  Burst,
  Images,
  Ambient,
  Colors,
  // Backward-compatible aliases
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
} as const;

export type PresetName = keyof typeof presetRegistry;

export function getPreset(name: PresetName): FullParticularConfig {
  return presetRegistry[name];
}

/** Mutable lookup of all named color palettes, for Storybook controls. */
export const colorPalettes: Record<string, string[]> = {
  snow: snowPalette,
  grayscale: grayscalePalette,
  coolBlue: coolBluePalette,
  muted: mutedPalette,
  finland: finlandPalette,
  usa: usaPalette,
  blue: bluePalette,
  orange: orangePalette,
  green: greenPalette,
  meteor: meteorPalette,
};
