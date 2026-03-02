import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ParticularWrapper, presets } from './index';
import type { BurstSettings } from './particular/types';

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

type StoryArgs = { renderer?: 'canvas' | 'webgl' };

const meta: Meta<typeof Playground> = {
  title: 'Particular/Presets',
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

const withRenderer = (args: StoryArgs, preset: typeof presets.confetti) => {
  const Wrapped = ParticularWrapper({ ...preset, renderer: args.renderer ?? 'canvas' })(
    Playground as any,
  );
  return <Wrapped />;
};

export const Confetti: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.confetti),
};
export const Sparkles: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.sparkles),
};
export const Stardust: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.stardust),
};
export const Fireworks: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.fireworks),
};
export const Bubbles: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.bubbles),
};
export const Magic: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.magic),
};
export const Snow: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.snow),
};
export const Embers: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.embers),
};
export const ConfettiSharp: Story = {
  render: (args) => withRenderer(args as StoryArgs, presets.confettiSharp),
};
