import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import sad1 from './icons/smiley_sad.png';
import sad2 from './icons/smiley_cry.png';
import sad3 from './icons/smiley_sad_2.png';

import { ParticularWrapper, presets } from './index';
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
  shape: 'circle' | 'square' | 'triangle' | 'star' | 'ring' | 'sparkle';
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

function buildConfig(
  base: Partial<FullParticularConfig>,
  args: Partial<StoryArgs>
): FullParticularConfig {
  const angle = args.velocityAngle ?? -90;
  const magnitude = args.velocityMagnitude ?? 5;
  return {
    ...presets.magic,
    ...base,
    renderer: args.renderer ?? 'canvas',
    shape: args.shape ?? 'star',
    blendMode: args.blendMode ?? 'normal',
    glow: args.glow ?? false,
    glowSize: args.glowSize ?? 14,
    glowColor: args.glowColor ?? '#ffffff',
    glowAlpha: args.glowAlpha ?? 0.35,
    shadow: args.shadow ?? false,
    shadowBlur: args.shadowBlur ?? 8,
    shadowOffsetX: args.shadowOffsetX ?? 4,
    shadowOffsetY: args.shadowOffsetY ?? 4,
    shadowColor: args.shadowColor ?? '#000000',
    shadowAlpha: args.shadowAlpha ?? 0.5,
    rate: args.rate ?? 14,
    life: args.life ?? 32,
    sizeMin: args.sizeMin ?? 6,
    sizeMax: args.sizeMax ?? 16,
    velocityMultiplier: args.velocityMultiplier ?? 5,
    gravity: args.gravity ?? 0.1,
    maxCount: args.maxCount ?? 350,
    continuous: args.continuous ?? false,
    autoStart: args.autoStart ?? false,
    velocity: Vector.fromAngle((angle * Math.PI) / 180, magnitude),
    spread: (args.spread ?? 1.15) * Math.PI,
    webglMaxInstances: args.webglMaxInstances ?? 4096,
  };
}

const meta: Meta<StoryArgs> = {
  title: 'Particular',
  component: () => null,
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square', 'triangle', 'star', 'ring', 'sparkle'],
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
  args: {
    renderer: 'canvas',
    shape: 'star',
    blendMode: 'normal',
    glow: true,
    glowSize: 14,
    glowColor: '#ffffff',
    glowAlpha: 0.35,
    shadow: false,
    shadowBlur: 8,
    shadowOffsetX: 4,
    shadowOffsetY: 4,
    shadowColor: '#000000',
    shadowAlpha: 0.5,
    rate: 14,
    life: 32,
    sizeMin: 6,
    sizeMax: 16,
    velocityMultiplier: 5,
    gravity: 0.1,
    maxCount: 350,
    continuous: false,
    autoStart: false,
    velocityAngle: -90,
    velocityMagnitude: 5,
    spread: 1.15,
    webglMaxInstances: 4096,
  },
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

export const Default: Story = {
  args: {
    renderer: 'canvas',
    shape: 'star',
    blendMode: 'normal',
    glow: true,
    glowSize: 14,
    rate: 14,
    life: 32,
    maxCount: 350,
  },
  render: withBaseConfig(presets.magic),
};

export const WithImages: Story = {
  args: {
    renderer: 'webgl',
    rate: 8,
    life: 50,
    maxCount: 300,
  },
  render: withBaseConfig({ icons: customIcons, ...presets.magic }),
};

export const Complex: Story = {
  args: {
    renderer: 'canvas',
    shape: 'star',
    blendMode: 'additive',
    glow: true,
    glowSize: 18,
    rate: 12,
    life: 60,
    continuous: true,
    autoStart: true,
    maxCount: 400,
  },
  render: withBaseConfig({ icons: customIcons, continuous: true, autoStart: true }),
};

export const Gigantic: Story = {
  args: {
    renderer: 'webgl',
    shape: 'circle',
    blendMode: 'additive',
    glow: false,
    rate: 100,
    life: 80,
    maxCount: 2000,
    webglMaxInstances: 16384,
  },
  render: withBaseConfig({ rate: 100, life: 80, maxCount: 2000 }),
};
