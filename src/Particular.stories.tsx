import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import sad1 from './icons/smiley_sad.png';
import sad2 from './icons/smiley_cry.png';
import sad3 from './icons/smiley_sad_2.png';

import { ParticularWrapper, presets } from './index';
import type { BurstSettings, FullParticularConfig } from './particular/types';

const customIcons = [sad1, sad2, sad3];

interface PlaygroundProps {
  burst: (settings: BurstSettings) => void;
}

const Playground: React.FC<PlaygroundProps> = ({ burst }) => {
  return (
    <div onClick={(e) => burst({ clientX: e.clientX, clientY: e.clientY })}>
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          paddingBottom: '40vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        CLICK ME FOR PARTICLES
      </h1>
    </div>
  );
};

const PlaygroundWithoutClick: React.FC = () => {
  return (
    <div>
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        I AM CONTINUOUS. <br />I EXIST FOREVER.
      </h1>
    </div>
  );
};

const PlaygroundWithRandomParameters: React.FC<PlaygroundProps> = ({ burst }) => {
  const doBurst = (e: React.MouseEvent<HTMLDivElement>) => {
    burst({
      clientX: e.clientX,
      clientY: e.clientY,
      sizeMin: Math.random() * 10,
      sizeMax: 10 + Math.random() * 10,
      velocityMultiplier: Math.random() * 15,
      gravity: Math.random() * 0.5,
    });
  };
  return (
    <div onClick={doBurst}>
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          paddingBottom: '40vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        CLICK ME FOR PARTICLES
      </h1>
    </div>
  );
};

// Helper to create wrapped component with renderer from args
const withRenderer = (
  args: StoryArgs,
  config: FullParticularConfig,
  Child: React.ComponentType<any>
) => {
  const Wrapped = ParticularWrapper({ ...config, renderer: args.renderer ?? 'canvas' })(Child);
  return <Wrapped />;
};

// Story args include renderer (control-only, passed to withRenderer)
type StoryArgs = { renderer?: 'canvas' | 'webgl' };

const meta: Meta<typeof Playground> = {
  title: 'Particular',
  component: Playground,
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
    },
  } as Meta<typeof Playground>['argTypes'],
  args: {
    renderer: 'canvas',
  } as Meta<typeof Playground>['args'],
};

export default meta;
type Story = StoryObj<typeof Playground> & { args?: StoryArgs };

// Stories
export const Burst: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.magic, Playground as any),
};

export const BurstWithCustomIcons: Story = {
  args: {
    renderer: 'webgl',
  },

  render: (args) => withRenderer(args as StoryArgs, { icons: customIcons }, Playground as any),
};

export const BurstWithCustomEmitterControls: Story = {
  render: (args) =>
    withRenderer(
      args as StoryArgs,
      { icons: customIcons, rate: 1, life: 200, maxCount: 1000 },
      Playground as any
    ),
};

export const PerformanceBeauty: Story = {
  render: (args) =>
    withRenderer(args as StoryArgs, { rate: 1000, life: 1000, maxCount: 1000 }, Playground as any),
};

export const ParticleSizing: Story = {
  render: (args) =>
    withRenderer(
      args as StoryArgs,
      {
        rate: 8,
        life: 30,
        sizeMin: 1,
        sizeMax: 5,
        maxCount: 300,
        velocityMultiplier: 110,
      },
      PlaygroundWithRandomParameters as any
    ),
};

export const AutomaticAndContinuous: Story = {
  render: (args) =>
    withRenderer(
      args as StoryArgs,
      {
        icons: customIcons,
        rate: 1,
        life: 200,
        maxCount: 1000,
        continuous: true,
        autoStart: true,
      },
      PlaygroundWithoutClick as any
    ),
};

// Shape variations
const shapeStarsConfig = {
  shape: 'star' as const,
  sizeMin: 8,
  sizeMax: 20,
  glow: true,
  glowSize: 15,
  rate: 15,
  life: 50,
};

const shapeSparklesConfig = {
  shape: 'sparkle' as const,
  blendMode: 'additive' as const,
  sizeMin: 10,
  sizeMax: 25,
  rate: 20,
  life: 40,
};

const shapeMixConfig = { rate: 10, life: 50 };

const glowRingsConfig = {
  shape: 'ring' as const,
  blendMode: 'additive' as const,
  glow: true,
  glowSize: 20,
  sizeMin: 5,
  sizeMax: 30,
  rate: 8,
  life: 30,
};

const PlaygroundWithShapeMix: React.FC<PlaygroundProps> = ({ burst }) => {
  const doBurst = (e: React.MouseEvent<HTMLDivElement>) => {
    const shapes = ['circle', 'square', 'triangle', 'star', 'ring', 'sparkle'] as const;
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

    burst({
      clientX: e.clientX,
      clientY: e.clientY,
      shape: randomShape,
    });
  };

  return (
    <div onClick={doBurst}>
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          paddingBottom: '40vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        CLICK FOR RANDOM SHAPES
      </h1>
    </div>
  );
};

export const Stars: Story = {
  render: (args) => withRenderer(args as StoryArgs, shapeStarsConfig, Playground as any),
};

export const Sparkles: Story = {
  render: (args) => withRenderer(args as StoryArgs, shapeSparklesConfig, Playground as any),
};

export const ShapeMix: Story = {
  render: (args) => withRenderer(args as StoryArgs, shapeMixConfig, PlaygroundWithShapeMix as any),
};

export const GlowRings: Story = {
  render: (args) => withRenderer(args as StoryArgs, glowRingsConfig, Playground as any),
};
