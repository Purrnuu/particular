import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import sad1 from './icons/smiley_sad.png';
import sad2 from './icons/smiley_cry.png';
import sad3 from './icons/smiley_sad_2.png';

import { ParticularWrapper, presets } from './index';
import { defaultParticular, defaultParticle } from './particular/core/defaults';
import type { BurstSettings, FullParticularConfig } from './particular/types';
import Vector from './particular/utils/vector';

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

export type StoryArgs = {
  renderer: 'canvas' | 'webgl';
  shape: 'circle' | 'rectangle' | 'square' | 'roundedRectangle' | 'triangle' | 'star' | 'ring' | 'sparkle';
  blendMode: 'normal' | 'additive' | 'multiply' | 'screen';
  glow: boolean;
  glowSize: number;
  glowColor: string;
  glowAlpha: number;
  shadow: boolean;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  shadowAlpha: number;
  rate: number;
  life: number;
  sizeMin: number;
  sizeMax: number;
  velocityMultiplier: number;
  gravity: number;
  maxCount: number;
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
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
    },
    shape: {
      control: 'select',
      options: ['circle', 'rectangle', 'square', 'roundedRectangle', 'triangle', 'star', 'ring', 'sparkle'],
      description: 'Particle shape',
    },
    blendMode: {
      control: 'select',
      options: ['normal', 'additive', 'multiply', 'screen'],
      description: 'Blend mode',
    },
    glow: { control: 'boolean', description: 'Enable glow effect' },
    glowSize: { control: { type: 'number', min: 8, max: 30 }, description: 'Glow size' },
    glowColor: { control: 'color', description: 'Glow color' },
    glowAlpha: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Glow opacity' },
    shadow: { control: 'boolean', description: 'Enable drop shadow' },
    shadowBlur: { control: { type: 'number', min: 0, max: 40 }, description: 'Shadow blur radius (px)' },
    shadowOffsetX: { control: { type: 'number', min: -30, max: 30 }, description: 'Shadow X offset (px)' },
    shadowOffsetY: { control: { type: 'number', min: -30, max: 30 }, description: 'Shadow Y offset (px)' },
    shadowColor: { control: 'color', description: 'Shadow color' },
    shadowAlpha: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Shadow opacity' },
    rate: { control: { type: 'number', min: 1, max: 100 }, description: 'Particles per burst' },
    life: { control: { type: 'number', min: 8, max: 200 }, description: 'Emitter life (ticks)' },
    sizeMin: { control: { type: 'number', min: 1, max: 30 }, description: 'Min particle size' },
    sizeMax: { control: { type: 'number', min: 1, max: 50 }, description: 'Max particle size' },
    velocityMultiplier: {
      control: { type: 'number', min: 1, max: 15 },
      description: 'Velocity multiplier',
    },
    gravity: { control: { type: 'number', min: 0, max: 0.5, step: 0.01 }, description: 'Gravity' },
    maxCount: { control: { type: 'number', min: 50, max: 5000 }, description: 'Max particles' },
    continuous: { control: 'boolean', description: 'Continuous emission' },
    autoStart: { control: 'boolean', description: 'Auto-start on mount' },
    velocityAngle: {
      control: { type: 'number', min: -180, max: 180 },
      description: 'Velocity angle (degrees)',
    },
    velocityMagnitude: {
      control: { type: 'number', min: 1, max: 15 },
      description: 'Velocity magnitude',
    },
    spread: {
      control: { type: 'number', min: 0.2, max: 2, step: 0.1 },
      description: 'Spread (× π)',
    },
    webglMaxInstances: {
      control: { type: 'number', min: 1024, max: 65536 },
      description: 'WebGL max instances per draw',
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
