/**
 * Shared Storybook controls for particle appearance and behavior.
 *
 * All four story files (Particular, Attractors, MouseForce, Screensaver) extend
 * ParticleStoryArgs and spread particleArgTypes into their meta argTypes.
 *
 * SHARED FIELDS (in ParticleStoryArgs — exposed in every story):
 *   Rendering:      shape, blendMode
 *   Emission:       particleLife, fadeTime, maxCount
 *   Size & Physics: sizeMin, sizeMax, gravity, acceleration, friction
 *   Glow:           glow, glowSize, glowColor, glowAlpha
 *   Trail:          trail, trailLength, trailFade, trailShrink
 *   Shadow:         shadow, shadowBlur, shadowOffsetX, shadowOffsetY, shadowColor, shadowAlpha
 *
 * STORY-SPECIFIC (each story defines its own):
 *   Burst:       renderer, rate, life, velocityMultiplier, continuous, autoStart,
 *                velocityAngle, velocityMagnitude, spread, webglMaxInstances
 *   Attractors:  renderer, strength, radius, attractorSize/Color/Shape/Glow*, count
 *   MouseForce:  renderer, strength, radius, damping, maxSpeed, falloff
 *   Screensaver: renderer, rate
 *
 * NOT EXPOSED (intentionally omitted from Storybook):
 *   imageTint        — WebGL-only, image particles only
 *   scaleStep        — niche, almost always 1
 *   spawnWidth/Height — managed internally by screensaver API
 *   colors           — exposed indirectly via colorPalette select (maps to named palette arrays)
 *   pixelRatio, zIndex — engine internals
 *
 * When adding new ParticleConfig/ShapeConfig fields that affect visuals across all
 * contexts, add them here. For fields specific to one story mode, add to that story file.
 */

import type { InputType } from '@storybook/core/types';

import { defaultParticular, defaultParticle } from './particular/core/defaults';
import { colorPalettes } from './particular/presets';
import type { FullParticularConfig } from './particular/types';

/** Particle config fields shared across all story files. */
export interface ParticleStoryArgs {
  colorPalette: string;
  shape: 'circle' | 'rectangle' | 'square' | 'roundedRectangle' | 'triangle' | 'star' | 'ring' | 'sparkle';
  blendMode: 'normal' | 'additive' | 'multiply' | 'screen';
  glow: boolean;
  glowSize: number;
  glowColor: string;
  glowAlpha: number;
  trail: boolean;
  trailLength: number;
  trailFade: number;
  trailShrink: number;
  shadow: boolean;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  shadowAlpha: number;
  sizeMin: number;
  sizeMax: number;
  gravity: number;
  acceleration: number;
  friction: number;
  particleLife: number;
  fadeTime: number;
  maxCount: number;
}

/** Storybook argTypes for all shared particle appearance controls, grouped by category. */
export const particleArgTypes: Record<string, InputType> = {
  // — Rendering —
  colorPalette: {
    control: 'select',
    options: ['random', 'snow', 'grayscale', 'coolBlue', 'muted', 'blue', 'orange', 'green', 'finland', 'usa'],
    description: 'Color palette (random = randomcolor fallback)',
    table: { category: 'Rendering' },
  },
  shape: {
    control: 'select',
    options: ['circle', 'rectangle', 'square', 'roundedRectangle', 'triangle', 'star', 'ring', 'sparkle'],
    description: 'Particle shape',
    table: { category: 'Rendering' },
  },
  blendMode: {
    control: 'select',
    options: ['normal', 'additive', 'multiply', 'screen'],
    description: 'Blend mode',
    table: { category: 'Rendering' },
  },
  // — Emission —
  particleLife: { control: { type: 'number', min: 20, max: 500, step: 5 }, description: 'Individual particle lifetime (ticks)', table: { category: 'Emission' } },
  fadeTime: { control: { type: 'number', min: 0, max: 100, step: 5 }, description: 'Fade duration before death (ticks)', table: { category: 'Emission' } },
  maxCount: { control: { type: 'number', min: 50, max: 5000 }, description: 'Max simultaneous particles', table: { category: 'Emission' } },
  // — Size & Physics —
  sizeMin: { control: { type: 'number', min: 1, max: 30 }, description: 'Min particle size', table: { category: 'Size & Physics' } },
  sizeMax: { control: { type: 'number', min: 1, max: 50 }, description: 'Max particle size', table: { category: 'Size & Physics' } },
  gravity: { control: { type: 'number', min: 0, max: 0.5, step: 0.01 }, description: 'Gravity', table: { category: 'Size & Physics' } },
  acceleration: { control: { type: 'number', min: 0, max: 3, step: 0.1 }, description: 'Acceleration scale (size-derived downward pull)', table: { category: 'Size & Physics' } },
  friction: { control: { type: 'number', min: 0, max: 3, step: 0.1 }, description: 'Friction scale (size-derived air resistance)', table: { category: 'Size & Physics' } },
  // — Glow —
  glow: { control: 'boolean', description: 'Enable glow effect', table: { category: 'Glow' } },
  glowSize: { control: { type: 'number', min: 8, max: 30 }, description: 'Glow size', table: { category: 'Glow' } },
  glowColor: { control: 'color', description: 'Glow color', table: { category: 'Glow' } },
  glowAlpha: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Glow opacity', table: { category: 'Glow' } },
  // — Trail —
  trail: { control: 'boolean', description: 'Enable particle trails', table: { category: 'Trail' } },
  trailLength: { control: { type: 'number', min: 1, max: 20 }, description: 'Trail length (segments)', table: { category: 'Trail' } },
  trailFade: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Trail alpha multiplier (0=invisible, 1=solid)', table: { category: 'Trail' } },
  trailShrink: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Trail min size ratio (0=vanish, 1=no shrink)', table: { category: 'Trail' } },
  // — Shadow —
  shadow: { control: 'boolean', description: 'Enable drop shadow', table: { category: 'Shadow' } },
  shadowBlur: { control: { type: 'number', min: 0, max: 40 }, description: 'Shadow blur radius (px)', table: { category: 'Shadow' } },
  shadowOffsetX: { control: { type: 'number', min: -30, max: 30 }, description: 'Shadow X offset (px)', table: { category: 'Shadow' } },
  shadowOffsetY: { control: { type: 'number', min: -30, max: 30 }, description: 'Shadow Y offset (px)', table: { category: 'Shadow' } },
  shadowColor: { control: 'color', description: 'Shadow color', table: { category: 'Shadow' } },
  shadowAlpha: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Shadow opacity', table: { category: 'Shadow' } },
};

/** Default values for all shared particle story args, derived from defaultParticle. */
export const defaultParticleStoryArgs: ParticleStoryArgs = {
  colorPalette: 'random',
  shape: defaultParticle.shape,
  blendMode: defaultParticle.blendMode,
  glow: defaultParticle.glow,
  glowSize: defaultParticle.glowSize,
  glowColor: defaultParticle.glowColor,
  glowAlpha: defaultParticle.glowAlpha,
  trail: defaultParticle.trail,
  trailLength: defaultParticle.trailLength,
  trailFade: defaultParticle.trailFade,
  trailShrink: defaultParticle.trailShrink,
  shadow: defaultParticle.shadow,
  shadowBlur: defaultParticle.shadowBlur,
  shadowOffsetX: defaultParticle.shadowOffsetX,
  shadowOffsetY: defaultParticle.shadowOffsetY,
  shadowColor: defaultParticle.shadowColor,
  shadowAlpha: defaultParticle.shadowAlpha,
  sizeMin: defaultParticle.sizeMin,
  sizeMax: defaultParticle.sizeMax,
  gravity: defaultParticle.gravity,
  acceleration: defaultParticle.acceleration,
  friction: defaultParticle.friction,
  particleLife: defaultParticle.particleLife,
  fadeTime: defaultParticle.fadeTime,
  maxCount: defaultParticular.maxCount,
};

/** Extract the particle config fields from story args into a Partial<FullParticularConfig>. */
export function particleStoryArgsToConfig(args: ParticleStoryArgs): Partial<FullParticularConfig> {
  return {
    colors: args.colorPalette === 'random' ? [] : (colorPalettes[args.colorPalette] ?? []),
    shape: args.shape,
    blendMode: args.blendMode,
    glow: args.glow,
    glowSize: args.glowSize,
    glowColor: args.glowColor,
    glowAlpha: args.glowAlpha,
    trail: args.trail,
    trailLength: args.trailLength,
    trailFade: args.trailFade,
    trailShrink: args.trailShrink,
    shadow: args.shadow,
    shadowBlur: args.shadowBlur,
    shadowOffsetX: args.shadowOffsetX,
    shadowOffsetY: args.shadowOffsetY,
    shadowColor: args.shadowColor,
    shadowAlpha: args.shadowAlpha,
    sizeMin: args.sizeMin,
    sizeMax: args.sizeMax,
    gravity: args.gravity,
    acceleration: args.acceleration,
    friction: args.friction,
    particleLife: args.particleLife,
    fadeTime: args.fadeTime,
    maxCount: args.maxCount,
  };
}
