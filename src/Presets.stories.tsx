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

const meta: Meta<typeof Playground> = {
  title: 'Particular/Presets',
  component: Playground,
};

export default meta;
type Story = StoryObj<typeof Playground>;

export const Confetti: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.confetti)(Playground as any);
    return <Wrapped />;
  },
};
export const Sparkles: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.sparkles)(Playground as any);
    return <Wrapped />;
  },
};
export const Stardust: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.stardust)(Playground as any);
    return <Wrapped />;
  },
};
export const Fireworks: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.fireworks)(Playground as any);
    return <Wrapped />;
  },
};
export const Bubbles: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.bubbles)(Playground as any);
    return <Wrapped />;
  },
};
export const Magic: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.magic)(Playground as any);
    return <Wrapped />;
  },
};
export const Snow: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.snow)(Playground as any);
    return <Wrapped />;
  },
};
export const Embers: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.embers)(Playground as any);
    return <Wrapped />;
  },
};
export const ConfettiSharp: Story = {
  render: () => {
    const Wrapped = ParticularWrapper(presets.confettiSharp)(Playground as any);
    return <Wrapped />;
  },
};
