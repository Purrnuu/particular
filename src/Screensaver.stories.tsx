import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { startScreensaver, presets } from './index';
import type { ScreensaverController, MouseForceConfig } from './index';
import { defaultParticle, defaultMouseWind } from './particular/core/defaults';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';
import { particleArgTypes, particleStoryArgsToConfig, resolveColorPalette } from './storyArgs';
import type { ParticleStoryArgs } from './storyArgs';

/** Snow preset merged with particle defaults so every shared field is present. */
const snow = { ...defaultParticle, ...presets.Ambient.snow };

interface ScreensaverStoryArgs extends ParticleStoryArgs {
  renderer: 'canvas' | 'webgl';
  rate: number;
  windStrength: number;
  windRadius: number;
  windDamping: number;
  windMaxSpeed: number;
  windFalloff: number;
}

const ScreensaverDemo: React.FC<ScreensaverStoryArgs> = (props) => {
  const { renderer, rate, windStrength, windRadius, windDamping, windMaxSpeed, windFalloff } = props;
  const particleConfig = particleStoryArgsToConfig(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseWind: MouseForceConfig = {
    strength: windStrength,
    radius: windRadius,
    damping: windDamping,
    maxSpeed: windMaxSpeed,
    falloff: windFalloff,
  };

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
      mouseWind,
    });

    return () => {
      screensaver.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, rate, JSON.stringify(particleConfig), JSON.stringify(mouseWind)]);

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
    // — Mouse Wind —
    windStrength: {
      control: { type: 'number', min: 0, max: 2, step: 0.01 },
      description: 'Mouse wind force strength',
      table: { category: 'Mouse Wind' },
    },
    windRadius: {
      control: { type: 'number', min: 10, max: 1000, step: 10 },
      description: 'Mouse wind effect radius (px)',
      table: { category: 'Mouse Wind' },
    },
    windDamping: {
      control: { type: 'number', min: 0.5, max: 1, step: 0.01 },
      description: 'Mouse wind velocity damping per frame',
      table: { category: 'Mouse Wind' },
    },
    windMaxSpeed: {
      control: { type: 'number', min: 1, max: 50, step: 1 },
      description: 'Mouse wind max speed cap',
      table: { category: 'Mouse Wind' },
    },
    windFalloff: {
      control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
      description: 'Mouse wind falloff exponent (<1 broad, >1 localized)',
      table: { category: 'Mouse Wind' },
    },
  },
  args: {
    colorPalette: resolveColorPalette(snow.colors),
    renderer: 'webgl',
    shape: snow.shape,
    blendMode: snow.blendMode,
    glow: snow.glow,
    glowSize: snow.glowSize,
    glowColor: snow.glowColor,
    glowAlpha: snow.glowAlpha,
    trail: snow.trail,
    trailLength: snow.trailLength,
    trailFade: snow.trailFade,
    trailShrink: snow.trailShrink,
    shadow: snow.shadow,
    shadowBlur: snow.shadowBlur,
    shadowOffsetX: snow.shadowOffsetX,
    shadowOffsetY: snow.shadowOffsetY,
    shadowColor: snow.shadowColor,
    shadowAlpha: snow.shadowAlpha,
    rate: snow.rate,
    sizeMin: snow.sizeMin,
    sizeMax: snow.sizeMax,
    gravity: snow.gravity,
    acceleration: snow.acceleration,
    accelerationSize: snow.accelerationSize,
    friction: snow.friction,
    frictionSize: snow.frictionSize,
    particleLife: snow.particleLife,
    fadeTime: snow.fadeTime,
    maxCount: snow.maxCount,
    windStrength: defaultMouseWind.strength!,
    windRadius: defaultMouseWind.radius!,
    windDamping: defaultMouseWind.damping!,
    windMaxSpeed: defaultMouseWind.maxSpeed!,
    windFalloff: defaultMouseWind.falloff!,
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
