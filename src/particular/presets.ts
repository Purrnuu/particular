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
const fireworksPalette: string[] = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6b81', '#eccc68', '#7bed9f', '#70a1ff', '#ffffff'];
const meteorPalette: string[] = ['#ffffff', '#e0f0ff', '#80d0ff', '#40a0e0', '#2060c0', '#6040ff', '#a080ff'];
const waterPalette: string[] = ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00acc1', '#ffffff'];
const finlandPalette: string[] = ['#003580', '#002f6c', '#ffffff', '#f8f9fa'];
const usaPalette: string[] = ['#B22234', '#ffffff', '#3C3B6E'];
export const magicPalette: string[] = ['#a5d8ff', '#74c0fc', '#4dabf7', '#d0bfff', '#b197fc', '#9775fa'];
const nebulaPalette: string[] = ['#a5d8ff', '#74c0fc', '#4dabf7', '#d0bfff', '#b197fc', '#9775fa', '#e599f7', '#f783ac'];
const solarPalette: string[] = ['#ff6b6b', '#ffa502', '#ff6348', '#ff4757', '#ffffff', '#ffd32a', '#ff9f1a'];
const autumnPalette: string[] = ['#c0392b', '#d35400', '#e67e22', '#f39c12', '#d4a574', '#8b4513', '#a0522d', '#cd853f'];
const ashPalette: string[] = ['#555566', '#606070', '#6a6a7a', '#757585', '#808090'];
const slatePalette: string[] = ['#3a4a4f', '#455558', '#4f6065', '#5a6b70', '#647578'];
const fairyPalette: string[] = ['#a5d8ff', '#74c0fc', '#d0bfff', '#b197fc', '#99e9f2', '#c3fae8'];
const amberPalette: string[] = ['#ffad33', '#ff9500', '#f57c00', '#e86100', '#ffcc66', '#ffd699'];
const rosePalette: string[] = ['#ff4757', '#ff6b81', '#ff8fa3', '#ffa8b8', '#ffc9d3', '#ffe0e6'];
const goldPalette: string[] = ['#ffd699', '#ffcc66', '#ffad33', '#ff9500', '#f57c00', '#e86100'];
const violetPalette: string[] = ['#d0bfff', '#b197fc', '#9775fa', '#845ef7', '#7048e8', '#5f3dc4'];
const emeraldPalette: string[] = ['#006b3f', '#00a85e', '#1edd80', '#4deda0', '#96f2c8', '#c3fae8'];

// ── Presets ─────────────────────────────────────────────────────────────────

/**
 * Pre-defined particle presets for beautiful, aesthetic effects out of the box.
 * Use with ParticularWrapper: e.g. ParticularWrapper(presets.Burst.confetti)(MyComponent)
 * Combine with custom options: ParticularWrapper({ ...presets.Burst.magic, rate: 20 })(MyComponent)
 */
const Burst = {
  /** Celebratory confetti burst: colorful rectangles fluttering outward and drifting down */
  confetti: {
    shape: 'rectangle' as const,
    blendMode: 'normal' as const,
    shadow: true,
    rate: 20,
    life: 28,
    velocity: Vector.fromAngle(-90, 7),
    spread: Math.PI * 0.85,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 6,
    fadeTime: 35,
    gravity: 0.14,
    gravityJitter: 0.2,
    scaleStep: 1.2,
    friction: 0.005,
    maxCount: 500,
    colors: mutedPalette,
  } satisfies FullParticularConfig,

  /** Signature magical burst: glowing sparkles with soft trails */
  magic: {
    shape: 'sparkle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 10,
    glowColor: '#74c0fc',
    glowAlpha: 0.35,

    rate: 16,
    life: 34,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1.15,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 5,
    fadeTime: 35,
    gravity: 0.08,
    gravityJitter: 0.15,
    scaleStep: 0.9,
    friction: 0.005,
    maxCount: 400,
    trail: true,
    trailLength: 8,
    trailFade: 0.35,
    trailShrink: 0.5,
    colors: magicPalette,
  } satisfies FullParticularConfig,

  /** Cinematic fireworks: glowing triangles with bright trailing bloom */
  fireworks: {
    shape: 'triangle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 8,
    glowColor: '#ff9500',
    glowAlpha: 0.3,

    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-90, 8.8),
    spread: Math.PI * 1.05,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 8,
    fadeTime: 22,
    gravity: 0.18,
    gravityJitter: 0.2,
    scaleStep: 1.15,
    friction: 0.003,
    maxCount: 520,
    trail: true,
    trailLength: 10,
    trailFade: 0.3,
    trailShrink: 0.45,
    colors: mutedPalette,
  } satisfies FullParticularConfig,

  /** Fireworks with timed detonation: narrow upward launch that auto-explodes into colorful sub-bursts */
  fireworksDetonation: {
    shape: 'triangle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 8,
    glowColor: '#74c0fc',
    glowAlpha: 0.3,

    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-Math.PI / 2, 8.8),
    spread: Math.PI / 4,
    sizeMin: 3,
    sizeMax: 6,
    velocityMultiplier: 8,
    fadeTime: 20,
    gravity: 0.08,
    gravityJitter: 0.15,
    scaleStep: 1.15,
    maxCount: 3000,
    particleLife: 80,
    trail: true,
    trailLength: 6,
    trailFade: 0.3,
    trailShrink: 0.5,
    detonate: {
      at: 0.7,
      childCount: 8,
      velocity: 5,
      velocitySpread: 0.6,
      friction: 0.015,
      scaleStep: 1,
      childLife: 45,
      sizeMin: 1,
      sizeMax: 4,
      fadeTime: 18,
      inheritColor: true,
      shape: 'triangle',
      trail: true,
      trailLength: 4,
      trailFade: 0.5,
      trailShrink: 0.65,
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

    rate: 0.4,
    life: 999999,
    particleLife: 500,
    velocity: Vector.fromAngle(Math.PI / 2, 0.4),
    spread: Math.PI * 0.15,
    gravityJitter: 0.5,
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
    maxCount: 200,
    continuous: true,
    autoStart: true,
    colors: snowPalette,
  } satisfies FullParticularConfig,

  /** Meteors: fast diagonal streaks with long glowing trails, additive blending */
  meteors: {
    shape: 'ring' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 14,
    glowColor: '#ff6d00',
    glowAlpha: 0.5,

    trail: true,
    trailLength: 12,
    trailFade: 0.25,
    trailShrink: 0.4,
    rate: 0.5,
    life: 999999,
    particleLife: 90,
    velocity: Vector.fromAngle(Math.PI * 0.65, 14),
    spread: Math.PI * 0.15,
    sizeMin: 2,
    sizeMax: 6,
    velocityMultiplier: 2,
    fadeTime: 20,
    gravity: 0.12,
    gravityJitter: 0.4,
    acceleration: 0.04,
    accelerationSize: 0.008,
    friction: 0,
    frictionSize: 0,
    scaleStep: 1,
    maxCount: 100,
    continuous: true,
    autoStart: true,
    colors: meteorPalette,
  } satisfies FullParticularConfig,
  /** Fireworks show: gentle rockets launch from the bottom and auto-explode into colorful bursts */
  fireworksShow: {
    shape: 'triangle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 8,
    glowColor: '#ff9500',
    glowAlpha: 0.3,

    trail: true,
    trailLength: 6,
    trailFade: 0.3,
    trailShrink: 0.5,
    rate: 0.25,
    life: 999999,
    particleLife: 120,
    velocity: Vector.fromAngle(-Math.PI / 2, 7),
    spread: Math.PI / 6,
    sizeMin: 2,
    sizeMax: 4,
    velocityMultiplier: 3,
    fadeTime: 15,
    gravity: 0.05,
    gravityJitter: 0.15,
    scaleStep: 1,
    maxCount: 1200,
    continuous: true,
    autoStart: true,
    colors: fireworksPalette,
    detonate: {
      at: 0.65,
      childCount: 10,
      velocity: 4,
      velocitySpread: 0.6,
      friction: 0.02,
      scaleStep: 0.8,
      childLife: 50,
      sizeMin: 1,
      sizeMax: 3,
      fadeTime: 20,
      inheritColor: true,
      shape: 'triangle',
      trail: true,
      trailLength: 4,
      trailFade: 0.5,
      trailShrink: 0.6,
    },
  } satisfies FullParticularConfig,

  /** Boids flock: self-organizing swarm of triangles. Use with addFlockingForce() for full effect. */
  flock: {
    shape: 'triangle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 8,
    glowColor: '#74c0fc',
    glowAlpha: 0.3,

    trail: true,
    trailLength: 6,
    trailFade: 0.35,
    trailShrink: 0.5,
    rate: 2,
    life: 999999,
    particleLife: 600,
    velocity: Vector.fromAngle(0, 2),
    spread: Math.PI * 2,
    sizeMin: 3,
    sizeMax: 7,
    velocityMultiplier: 3,
    fadeTime: 80,
    gravity: 0,
    acceleration: 0,
    accelerationSize: 0,
    friction: 0.005,
    frictionSize: 0,
    scaleStep: 1,
    maxCount: 300,
    continuous: true,
    autoStart: true,
    colors: coolBluePalette,
  } satisfies FullParticularConfig,

  /** River flow: horizontal stream of water particles, designed for use with attractors */
  river: {
    shape: 'circle' as const,
    blendMode: 'normal' as const,
    glow: true,
    glowSize: 6,
    glowColor: '#80deea',
    glowAlpha: 0.25,

    trail: true,
    trailLength: 6,
    trailFade: 0.5,
    trailShrink: 0.4,
    rate: 4,
    life: 999999,
    particleLife: 220,
    velocity: Vector.fromAngle(0, 1.8),
    spread: Math.PI / 10,
    sizeMin: 1,
    sizeMax: 4,
    velocityMultiplier: 0,
    fadeTime: 80,
    gravity: 0,
    friction: 0,
    scaleStep: 1,
    maxCount: 500,
    continuous: true,
    autoStart: true,
    colors: waterPalette,
  } satisfies FullParticularConfig,
} as const;

const ImageParticles = {
  /** High-fidelity text rendered as tiny particles with spring return. */
  text: {
    shape: 'square' as const,
    blendMode: 'normal' as const,

    glow: false,
    maxCount: 10000,
  } satisfies FullParticularConfig,

  /** Shape/icon rendered as particles with soft glow. */
  shape: {
    shape: 'circle' as const,
    blendMode: 'normal' as const,

    glow: true,
    glowSize: 8,
    glowAlpha: 0.3,
    maxCount: 10000,
  } satisfies FullParticularConfig,
} as const;

const Burst3D = {
  /** Spinning galaxy: spherical emission with slow orbit drift */
  galaxySpin: {
    shape: 'ring' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 12,
    glowColor: '#b197fc',
    glowAlpha: 0.35,
    trail: true,
    trailLength: 14,
    trailFade: 0.35,
    trailShrink: 0.45,

    rate: 4,
    life: 999999,
    particleLife: 400,
    velocity: Vector.fromAngle(-90, 1),
    spread: Math.PI * 2,
    spread3d: Math.PI * 2,
    spawnDepth: 300,
    sizeMin: 2,
    sizeMax: 6,
    velocityMultiplier: 5,
    gravityJitter: 0.6,
    fadeTime: 80,
    gravity: 0,
    acceleration: 0,
    accelerationSize: 0,
    friction: 0.004,
    scaleStep: 0.8,
    maxCount: 600,
    continuous: true,
    autoStart: true,
    colors: nebulaPalette,
  } satisfies FullParticularConfig,

  /** Depth field: particles spread along z-axis for parallax effect */
  depthField: {
    shape: 'circle' as const,
    blendMode: 'normal' as const,
    glow: true,
    glowSize: 8,
    glowColor: '#ffffff',
    glowAlpha: 0.2,

    rate: 0.5,
    life: 999999,
    particleLife: 400,
    velocity: Vector.fromAngle(Math.PI / 2, 0.3),
    spread: Math.PI * 0.2,
    spawnDepth: 600,
    spawnWidth: 400,
    sizeMin: 1,
    sizeMax: 5,
    velocityMultiplier: 0.3,
    fadeTime: 80,
    gravity: 0.002,
    friction: 0.001,
    scaleStep: 1,
    maxCount: 300,
    continuous: true,
    autoStart: true,
    colors: snowPalette,
  } satisfies FullParticularConfig,

  /** Supernova: explosive 3D burst with spherical emission */
  supernova: {
    shape: 'star' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 14,
    glowColor: '#ff6b6b',
    glowAlpha: 0.4,
    trail: true,
    trailLength: 8,
    trailFade: 0.25,
    trailShrink: 0.4,

    rate: 30,
    life: 30,
    particleLife: 120,
    velocity: Vector.fromAngle(-90, 6),
    spread: Math.PI,
    spread3d: Math.PI,
    sizeMin: 2,
    sizeMax: 8,
    velocityMultiplier: 8,
    fadeTime: 40,
    gravity: 0,
    friction: 0.008,
    scaleStep: 1.2,
    maxCount: 800,
    colors: solarPalette,
  } satisfies FullParticularConfig,

  /** 3D fireworks show: rockets launch upward and detonate into spherical sub-bursts */
  fireworks3d: {
    shape: 'triangle' as const,
    blendMode: 'additive' as const,
    glow: true,
    glowSize: 12,
    glowColor: '#ff9500',
    glowAlpha: 0.4,
    trail: true,
    trailLength: 6,
    trailFade: 0.3,
    trailShrink: 0.5,

    rate: 0.3,
    life: 999999,
    particleLife: 100,
    velocity: Vector.fromAngle(-Math.PI / 2, 7),
    spread: Math.PI / 8,
    spread3d: Math.PI / 8,
    spawnDepth: 150,
    spawnWidth: 0,
    sizeMin: 2,
    sizeMax: 4,
    velocityMultiplier: 2.5,
    fadeTime: 15,
    gravity: 0.05,
    acceleration: 0,
    accelerationSize: 0,
    friction: 0.003,
    scaleStep: 1,
    maxCount: 2000,
    continuous: true,
    autoStart: true,
    colors: fireworksPalette,
    detonate: {
      at: 0.65,
      childCount: 18,
      velocity: 4,
      velocitySpread: 0.5,
      friction: 0.012,
      scaleStep: 0.8,
      childLife: 60,
      sizeMin: 1,
      sizeMax: 3,
      fadeTime: 25,
      inheritColor: true,
      shape: 'sparkle',
      spread3d: Math.PI,
      trail: true,
      trailLength: 5,
      trailFade: 0.4,
      trailShrink: 0.5,
      glow: true,
      glowSize: 10,
      glowColor: '#ffa502',
      glowAlpha: 0.45,
    },
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
  /** Cyan-to-white water palette */
  water: { colors: waterPalette },
  /** Blue-purple sparkle (magic preset signature) */
  magic: { colors: magicPalette },
  /** Extended blue-purple-pink (galaxy/nebula effects) */
  nebula: { colors: nebulaPalette },
  /** Hot reds, oranges, whites (explosions/supernova) */
  solar: { colors: solarPalette },
  /** Earth tones: deep reds, burnt orange, sienna */
  autumn: { colors: autumnPalette },
  /** Dark greys for subtle/muted backgrounds */
  ash: { colors: ashPalette },
  /** Dark blue-grey tones */
  slate: { colors: slatePalette },
  /** Pastel blue, purple, teal, mint mix */
  fairy: { colors: fairyPalette },
  /** Warm glowing orange-gold */
  amber: { colors: amberPalette },
  /** Soft pink gradient from hot to pastel */
  rose: { colors: rosePalette },
  /** Warm yellow-orange gradient */
  gold: { colors: goldPalette },
  /** Deep violet-purple range */
  violet: { colors: violetPalette },
  /** Bright green to pastel mint */
  emerald: { colors: emeraldPalette },
  /** Multicolor vivid fireworks */
  fireworks: { colors: fireworksPalette },
} as const;

// ── Registry & Exports ─────────────────────────────────────────────────────

const presetRegistry = {
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  imageText: ImageParticles.text,
  imageShape: ImageParticles.shape,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
  flock: Ambient.flock,
  river: Ambient.river,
  fireworksShow: Ambient.fireworksShow,
  galaxySpin: Burst3D.galaxySpin,
  depthField: Burst3D.depthField,
  supernova: Burst3D.supernova,
  fireworks3d: Burst3D.fireworks3d,
} as const;

export const presets = {
  Burst,
  Burst3D,
  Images,
  ImageParticles,
  Ambient,
  Colors,
  // Backward-compatible aliases
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  imageText: ImageParticles.text,
  imageShape: ImageParticles.shape,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
  flock: Ambient.flock,
  river: Ambient.river,
  fireworksShow: Ambient.fireworksShow,
  galaxySpin: Burst3D.galaxySpin,
  depthField: Burst3D.depthField,
  supernova: Burst3D.supernova,
  fireworks3d: Burst3D.fireworks3d,
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
  water: waterPalette,
  magic: magicPalette,
  nebula: nebulaPalette,
  solar: solarPalette,
  autumn: autumnPalette,
  ash: ashPalette,
  slate: slatePalette,
  fairy: fairyPalette,
  amber: amberPalette,
  rose: rosePalette,
  gold: goldPalette,
  violet: violetPalette,
  emerald: emeraldPalette,
  fireworks: fireworksPalette,
};
