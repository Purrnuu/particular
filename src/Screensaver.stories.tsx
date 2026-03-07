import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { startScreensaver } from './index';
import type { ScreensaverController } from './index';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';
import { particleArgTypes, defaultParticleStoryArgs, particleStoryArgsToConfig } from './storyArgs';
import type { ParticleStoryArgs } from './storyArgs';

interface ScreensaverStoryArgs extends ParticleStoryArgs {
  renderer: 'canvas' | 'webgl';
  rate: number;
}

const ScreensaverDemo: React.FC<ScreensaverStoryArgs> = (props) => {
  const { renderer, rate } = props;
  const particleConfig = particleStoryArgsToConfig(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const screensaver: ScreensaverController = startScreensaver({
      canvas,
      preset: 'snow',
      config: {
        rate,
        ...particleConfig,
      },
      renderer,
      autoResize: true,
    });

    return () => {
      screensaver.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, rate, JSON.stringify(particleConfig)]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a' }}>
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          pointerEvents: 'none',
          userSelect: 'none',
          color: 'rgba(255, 255, 255, 0.3)',
          fontWeight: 300,
          letterSpacing: '0.1em',
        }}
      >
        SCREENSAVER
      </h1>
    </div>
  );
};

const meta: Meta<ScreensaverStoryArgs> = {
  title: 'Particular/Screensaver',
  component: ScreensaverDemo,
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: { category: 'Rendering' },
    },
    // Shared particle appearance controls
    ...particleArgTypes,
    // — Screensaver —
    rate: {
      control: { type: 'number', min: 0.1, max: 20, step: 0.1 },
      description: 'Particles emitted per frame (fractional OK)',
      table: { category: 'Screensaver' },
    },
  },
  args: {
    ...defaultParticleStoryArgs,
    renderer: 'webgl',
    rate: 0.4,
    particleLife: 400,
    sizeMin: 2,
    sizeMax: 6,
    gravity: 0.02,
    maxCount: 200,
    glowAlpha: 0.2,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Snow: Story = {};

export const HeavySnow: Story = {
  args: {
    rate: 1.5,
    maxCount: 400,
    sizeMin: 3,
    sizeMax: 10,
  },
};

export const GentleAmbient: Story = {
  args: {
    rate: 0.15,
    maxCount: 80,
    particleLife: 600,
    sizeMin: 1,
    sizeMax: 4,
    gravity: 0.01,
    glowAlpha: 0.15,
  },
};
