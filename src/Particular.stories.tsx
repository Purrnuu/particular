import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import sad1 from './icons/smiley_sad.png';
import sad2 from './icons/smiley_cry.png';
import sad3 from './icons/smiley_sad_2.png';

import { ParticularWrapper, presets } from './index';
import { defaultParticular, defaultParticle } from './particular/core/defaults';
import type { BurstSettings, FullParticularConfig } from './particular/types';
import Vector from './particular/utils/vector';
import { particleArgTypes, defaultParticleStoryArgs } from './storyArgs';
import type { ParticleStoryArgs } from './storyArgs';

const customIcons = [sad1, sad2, sad3];

interface PlaygroundProps {
  burst: (settings: BurstSettings) => void;
}

const Playground: React.FC<PlaygroundProps> = ({ burst }) => (
  <div
    onClick={(e) => burst({ clientX: e.clientX, clientY: e.clientY })}
    style={{ minHeight: '100vh', cursor: 'pointer' }}
  >
    <h1
      style={{
        textAlign: 'center',
        paddingTop: '45vh',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      CLICK FOR PARTICLES
    </h1>
  </div>
);

const PlaygroundContinuous: React.FC<PlaygroundProps> = () => (
  <div style={{ minHeight: '100vh' }}>
    <h1
      style={{
        textAlign: 'center',
        paddingTop: '45vh',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      CONTINUOUS AUTO-START
    </h1>
  </div>
);

export type StoryArgs = ParticleStoryArgs & {
  renderer: 'canvas' | 'webgl';
  rate: number;
  life: number;
  velocityMultiplier: number;
  continuous: boolean;
  autoStart: boolean;
  velocityAngle: number;
  velocityMagnitude: number;
  spread: number;
  webglMaxInstances: number;
};

function toStoryArgs(config: Partial<FullParticularConfig>): StoryArgs {
  const merged = {
    ...defaultParticular,
    ...defaultParticle,
    ...config,
  };
  const velocity = merged.velocity ?? defaultParticle.velocity;
  return {
    renderer: merged.renderer ?? 'webgl',
    shape: merged.shape,
    blendMode: merged.blendMode,
    glow: merged.glow,
    glowSize: merged.glowSize,
    glowColor: merged.glowColor,
    glowAlpha: merged.glowAlpha,
    trail: merged.trail,
    trailLength: merged.trailLength,
    trailFade: merged.trailFade,
    trailShrink: merged.trailShrink,
    shadow: merged.shadow,
    shadowBlur: merged.shadowBlur,
    shadowOffsetX: merged.shadowOffsetX,
    shadowOffsetY: merged.shadowOffsetY,
    shadowColor: merged.shadowColor,
    shadowAlpha: merged.shadowAlpha,
    rate: merged.rate,
    life: merged.life,
    sizeMin: merged.sizeMin,
    sizeMax: merged.sizeMax,
    velocityMultiplier: merged.velocityMultiplier,
    gravity: merged.gravity,
    particleLife: merged.particleLife,
    fadeTime: merged.fadeTime,
    maxCount: merged.maxCount,
    continuous: merged.continuous,
    autoStart: merged.autoStart,
    velocityAngle: (velocity.getAngle() * 180) / Math.PI,
    velocityMagnitude: velocity.getMagnitude(),
    spread: merged.spread / Math.PI,
    webglMaxInstances: merged.webglMaxInstances,
  };
}

function buildConfig(base: Partial<FullParticularConfig>, args: Partial<StoryArgs>): FullParticularConfig {
  const mergedBase = {
    ...defaultParticular,
    ...defaultParticle,
    ...base,
  };
  const baseVelocity = mergedBase.velocity ?? defaultParticle.velocity;
  const angle = args.velocityAngle ?? (baseVelocity.getAngle() * 180) / Math.PI;
  const magnitude = args.velocityMagnitude ?? baseVelocity.getMagnitude();

  return {
    ...mergedBase,
    renderer: args.renderer ?? (mergedBase.renderer ?? 'webgl'),
    shape: args.shape ?? mergedBase.shape,
    blendMode: args.blendMode ?? mergedBase.blendMode,
    glow: args.glow ?? mergedBase.glow,
    glowSize: args.glowSize ?? mergedBase.glowSize,
    glowColor: args.glowColor ?? mergedBase.glowColor,
    glowAlpha: args.glowAlpha ?? mergedBase.glowAlpha,
    trail: args.trail ?? mergedBase.trail,
    trailLength: args.trailLength ?? mergedBase.trailLength,
    trailFade: args.trailFade ?? mergedBase.trailFade,
    trailShrink: args.trailShrink ?? mergedBase.trailShrink,
    shadow: args.shadow ?? mergedBase.shadow,
    shadowBlur: args.shadowBlur ?? mergedBase.shadowBlur,
    shadowOffsetX: args.shadowOffsetX ?? mergedBase.shadowOffsetX,
    shadowOffsetY: args.shadowOffsetY ?? mergedBase.shadowOffsetY,
    shadowColor: args.shadowColor ?? mergedBase.shadowColor,
    shadowAlpha: args.shadowAlpha ?? mergedBase.shadowAlpha,
    rate: args.rate ?? mergedBase.rate,
    life: args.life ?? mergedBase.life,
    sizeMin: args.sizeMin ?? mergedBase.sizeMin,
    sizeMax: args.sizeMax ?? mergedBase.sizeMax,
    velocityMultiplier: args.velocityMultiplier ?? mergedBase.velocityMultiplier,
    gravity: args.gravity ?? mergedBase.gravity,
    particleLife: args.particleLife ?? mergedBase.particleLife,
    fadeTime: args.fadeTime ?? mergedBase.fadeTime,
    maxCount: args.maxCount ?? mergedBase.maxCount,
    continuous: args.continuous ?? mergedBase.continuous,
    autoStart: args.autoStart ?? mergedBase.autoStart,
    velocity: Vector.fromAngle((angle * Math.PI) / 180, magnitude),
    spread: (args.spread ?? mergedBase.spread / Math.PI) * Math.PI,
    webglMaxInstances: args.webglMaxInstances ?? mergedBase.webglMaxInstances,
  };
}

const meta: Meta<StoryArgs> = {
  title: 'Particular/Burst',
  component: () => null,
  argTypes: {
    // — Rendering —
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: { category: 'Rendering' },
    },
    // Shared particle appearance controls
    ...particleArgTypes,
    // — Emission (burst-specific) —
    rate: { control: { type: 'number', min: 1, max: 100 }, description: 'Particles per burst', table: { category: 'Emission' } },
    life: { control: { type: 'number', min: 8, max: 200 }, description: 'Emitter life (ticks)', table: { category: 'Emission' } },
    continuous: { control: 'boolean', description: 'Continuous emission', table: { category: 'Emission' } },
    autoStart: { control: 'boolean', description: 'Auto-start on mount', table: { category: 'Emission' } },
    // — Size & Physics (burst-specific) —
    velocityAngle: {
      control: { type: 'number', min: -180, max: 180 },
      description: 'Velocity angle (degrees)',
      table: { category: 'Size & Physics' },
    },
    velocityMagnitude: {
      control: { type: 'number', min: 1, max: 15 },
      description: 'Velocity magnitude',
      table: { category: 'Size & Physics' },
    },
    velocityMultiplier: {
      control: { type: 'number', min: 1, max: 15 },
      description: 'Velocity multiplier',
      table: { category: 'Size & Physics' },
    },
    spread: {
      control: { type: 'number', min: 0.2, max: 2, step: 0.1 },
      description: 'Spread (× π)',
      table: { category: 'Size & Physics' },
    },
    // — Advanced —
    webglMaxInstances: {
      control: { type: 'number', min: 1024, max: 65536 },
      description: 'WebGL max instances per draw',
      table: { category: 'Advanced' },
    },
  },
  args: toStoryArgs({ ...presets.Burst.magic, renderer: 'webgl' }),
};

export default meta;
type Story = StoryObj<Meta<StoryArgs>>;

const withBaseConfig = (
  baseConfig: Partial<FullParticularConfig>
): Story['render'] => (args: Partial<StoryArgs>) => {
  const config = buildConfig(baseConfig, args as Partial<StoryArgs>);
  const Child = (args as Partial<StoryArgs>).continuous ? PlaygroundContinuous : Playground;
  const Wrapped = ParticularWrapper(config)(Child);
  return <Wrapped burst={() => {}} key={JSON.stringify(args)} />;
};

export const Confetti: Story = {
  args: toStoryArgs({ ...presets.Burst.confetti, renderer: 'webgl' }),
  render: withBaseConfig(presets.Burst.confetti),
};

export const Magic: Story = {
  args: toStoryArgs({ ...presets.Burst.magic, renderer: 'webgl' }),
  render: withBaseConfig(presets.Burst.magic),
};

export const Images: Story = {
  args: toStoryArgs({ ...presets.Images.showcase, renderer: 'webgl' }),
  render: withBaseConfig({ ...presets.Images.showcase, icons: customIcons }),
};

export const Fireworks: Story = {
  args: toStoryArgs({ ...presets.Burst.fireworks, renderer: 'webgl' }),
  render: withBaseConfig(presets.Burst.fireworks),
};

export const Continuous: Story = {
  args: toStoryArgs({
    ...presets.Burst.magic,
    renderer: 'webgl',
    continuous: true,
    autoStart: true,
  }),
  render: withBaseConfig({
    ...presets.Burst.magic,
    icons: customIcons,
    continuous: true,
    autoStart: true,
  }),
};

export const Performance5000: Story = {
  args: toStoryArgs({
    ...presets.Burst.fireworks,
    renderer: 'webgl',
    rate: 220,
    life: 120,
    maxCount: 5000,
    webglMaxInstances: 16384,
    continuous: true,
    autoStart: true,
    glow: false,
    shadow: false,
  }),
  render: withBaseConfig({
    ...presets.Burst.fireworks,
    rate: 220,
    life: 120,
    maxCount: 5000,
    continuous: true,
    autoStart: true,
    glow: false,
    shadow: false,
  }),
};
