import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import sad1 from './icons/smiley_sad.png';
import sad2 from './icons/smiley_cry.png';
import sad3 from './icons/smiley_sad_2.png';

import { ParticularWrapper } from './index';
import type { BurstSettings } from './particular/types';

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

// Wrapped components - cast to any to work around HOC type issues
const PlaygroundWrapped = ParticularWrapper()(Playground as any);
const PlaygroundCustomWrapped = ParticularWrapper({ icons: customIcons })(Playground as any);
const PlaygroundCustomControlsWrapped = ParticularWrapper({
  icons: customIcons,
  rate: 1,
  life: 200,
  maxCount: 1000,
})(Playground as any);
const PlaygroundAutomaticWrapped = ParticularWrapper({
  icons: customIcons,
  rate: 1,
  life: 200,
  maxCount: 1000,
  continuous: true,
  autoStart: true,
})(PlaygroundWithoutClick as any);
const PlaygroundMassive = ParticularWrapper({
  rate: 1000,
  life: 1000,
  maxCount: 1000,
})(Playground as any);
const PlaygroundParticleControls = ParticularWrapper({
  rate: 8,
  life: 30,
  sizeMin: 1,
  sizeMax: 5,
  maxCount: 300,
  velocityMultiplier: 110,
})(PlaygroundWithRandomParameters as any);

// Meta configuration
const meta: Meta<typeof Playground> = {
  title: 'Particular',
  component: Playground,
};

export default meta;
type Story = StoryObj<typeof Playground>;

// Stories
export const Burst: Story = {
  render: () => <PlaygroundWrapped />,
};

export const BurstWithCustomIcons: Story = {
  render: () => <PlaygroundCustomWrapped />,
};

export const BurstWithCustomEmitterControls: Story = {
  render: () => <PlaygroundCustomControlsWrapped />,
};

export const PerformanceBeauty: Story = {
  render: () => <PlaygroundMassive />,
};

export const ParticleSizing: Story = {
  render: () => <PlaygroundParticleControls />,
};

export const AutomaticAndContinuous: Story = {
  render: () => <PlaygroundAutomaticWrapped />,
};
