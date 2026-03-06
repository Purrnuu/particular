import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { startScreensaver } from './index';
import type { ScreensaverController } from './index';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';

interface ScreensaverStoryArgs {
  renderer: 'canvas' | 'webgl';
  rate: number;
  particleLife: number;
  sizeMin: number;
  sizeMax: number;
  gravity: number;
  maxCount: number;
  glowAlpha: number;
}

const ScreensaverDemo: React.FC<ScreensaverStoryArgs> = ({
  renderer,
  rate,
  particleLife,
  sizeMin,
  sizeMax,
  gravity,
  maxCount,
  glowAlpha,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const screensaver: ScreensaverController = startScreensaver({
      canvas,
      preset: 'snow',
      config: {
        rate,
        particleLife,
        sizeMin,
        sizeMax,
        gravity,
        maxCount,
        glowAlpha,
      },
      renderer,
      autoResize: true,
    });

    return () => {
      screensaver.destroy();
    };
  }, [renderer, rate, particleLife, sizeMin, sizeMax, gravity, maxCount, glowAlpha]);

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
    },
    rate: {
      control: { type: 'number', min: 0.1, max: 20, step: 0.1 },
      description: 'Particles emitted per frame (fractional OK)',
    },
    particleLife: {
      control: { type: 'number', min: 50, max: 1000, step: 10 },
      description: 'Individual particle lifetime in ticks',
    },
    sizeMin: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Minimum particle size',
    },
    sizeMax: {
      control: { type: 'number', min: 1, max: 30, step: 1 },
      description: 'Maximum particle size',
    },
    gravity: {
      control: { type: 'number', min: 0, max: 0.5, step: 0.01 },
      description: 'Gravity pull strength',
    },
    maxCount: {
      control: { type: 'number', min: 50, max: 1000, step: 10 },
      description: 'Maximum simultaneous particles',
    },
    glowAlpha: {
      control: { type: 'number', min: 0, max: 1, step: 0.05 },
      description: 'Glow opacity',
    },
  },
  args: {
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
