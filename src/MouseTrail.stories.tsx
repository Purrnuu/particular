import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { InputType } from '@storybook/core/types';

import { createParticles } from './index';
import { defaultMouseTrail } from './particular/core/defaults';
import { colorPalettes } from './particular/presets';
import type { MouseTrailConfig, ParticleShape, BlendMode } from './particular/types';

/* ─── Story args ─── */

interface TrailStoryArgs {
  colorPalette: string;
  shape: ParticleShape;
  blendMode: BlendMode;
  rate: number;
  sizeMin: number;
  sizeMax: number;
  particleLife: number;
  fadeTime: number;
  velocity: number;
  spread: number;
  friction: number;
  glow: boolean;
  glowColor: string;
  glowAlpha: number;
  glowSize: number;
  trail: boolean;
  trailLength: number;
  trailFade: number;
  trailShrink: number;
  minSpeed: number;
  maxCount: number;
}

const trailArgTypes: Record<string, InputType> = {
  colorPalette: { control: 'select', options: ['default', ...Object.keys(colorPalettes)], description: 'Color palette', table: { category: 'Appearance' } },
  shape: { control: 'select', options: ['circle', 'square', 'triangle', 'star', 'ring', 'sparkle'], description: 'Particle shape', table: { category: 'Appearance' } },
  blendMode: { control: 'select', options: ['normal', 'additive', 'multiply', 'screen'], description: 'Blend mode', table: { category: 'Appearance' } },
  rate: { control: { type: 'number', min: 0.1, max: 10, step: 0.1 }, description: 'Emission rate while moving', table: { category: 'Emission' } },
  sizeMin: { control: { type: 'number', min: 0.5, max: 10, step: 0.5 }, description: 'Min particle size', table: { category: 'Emission' } },
  sizeMax: { control: { type: 'number', min: 0.5, max: 15, step: 0.5 }, description: 'Max particle size', table: { category: 'Emission' } },
  particleLife: { control: { type: 'number', min: 10, max: 200, step: 5 }, description: 'Particle lifetime (ticks)', table: { category: 'Emission' } },
  fadeTime: { control: { type: 'number', min: 5, max: 100, step: 5 }, description: 'Fade duration (ticks)', table: { category: 'Emission' } },
  velocity: { control: { type: 'number', min: 0.1, max: 5, step: 0.1 }, description: 'Base velocity', table: { category: 'Physics' } },
  spread: { control: { type: 'number', min: 0, max: 3, step: 0.1 }, description: 'Spread angle (radians)', table: { category: 'Physics' } },
  friction: { control: { type: 'number', min: 0, max: 0.1, step: 0.005 }, description: 'Friction', table: { category: 'Physics' } },
  minSpeed: { control: { type: 'number', min: 0, max: 5, step: 0.1 }, description: 'Min mouse speed to emit', table: { category: 'Physics' } },
  glow: { control: 'boolean', description: 'Enable glow', table: { category: 'Glow' } },
  glowColor: { control: 'color', description: 'Glow color', table: { category: 'Glow' } },
  glowAlpha: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Glow opacity', table: { category: 'Glow' } },
  glowSize: { control: { type: 'number', min: 2, max: 30, step: 1 }, description: 'Glow size', table: { category: 'Glow' } },
  trail: { control: 'boolean', description: 'Enable trail streak', table: { category: 'Trail' } },
  trailLength: { control: { type: 'number', min: 1, max: 20, step: 1 }, description: 'Trail length (segments)', table: { category: 'Trail' } },
  trailFade: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Trail fade', table: { category: 'Trail' } },
  trailShrink: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Trail shrink', table: { category: 'Trail' } },
  maxCount: { control: { type: 'number', min: 100, max: 3000, step: 100 }, description: 'Max particles', table: { category: 'Emission' } },
};

const defaultTrailArgs: TrailStoryArgs = {
  colorPalette: 'default',
  shape: defaultMouseTrail.shape,
  blendMode: defaultMouseTrail.blendMode,
  rate: defaultMouseTrail.rate,
  sizeMin: defaultMouseTrail.sizeMin,
  sizeMax: defaultMouseTrail.sizeMax,
  particleLife: defaultMouseTrail.particleLife,
  fadeTime: defaultMouseTrail.fadeTime,
  velocity: defaultMouseTrail.velocity,
  spread: defaultMouseTrail.spread,
  friction: defaultMouseTrail.friction,
  minSpeed: defaultMouseTrail.minSpeed,
  glow: defaultMouseTrail.glow,
  glowColor: defaultMouseTrail.glowColor,
  glowAlpha: defaultMouseTrail.glowAlpha,
  glowSize: defaultMouseTrail.glowSize,
  trail: defaultMouseTrail.trail,
  trailLength: defaultMouseTrail.trailLength,
  trailFade: defaultMouseTrail.trailFade,
  trailShrink: defaultMouseTrail.trailShrink,
  maxCount: 800,
};

function argsToTrailConfig(args: TrailStoryArgs): MouseTrailConfig {
  return {
    colors: args.colorPalette === 'default' ? defaultMouseTrail.colors : (colorPalettes[args.colorPalette] ?? []),
    shape: args.shape,
    rate: args.rate,
    sizeMin: args.sizeMin,
    sizeMax: args.sizeMax,
    particleLife: args.particleLife,
    fadeTime: args.fadeTime,
    velocity: args.velocity,
    spread: args.spread,
    friction: args.friction,
    minSpeed: args.minSpeed,
    glow: args.glow,
    glowColor: args.glowColor,
    glowAlpha: args.glowAlpha,
    glowSize: args.glowSize,
    blendMode: args.blendMode,
    trail: args.trail,
    trailLength: args.trailLength,
    trailFade: args.trailFade,
    trailShrink: args.trailShrink,
  };
}

/* ─── Demo ─── */

const MouseTrailDemo: React.FC<TrailStoryArgs> = (args) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const controller = createParticles({
      container,
      config: { maxCount: args.maxCount, continuous: true },
      renderer: 'webgl',
      autoResize: true,
    });

    controller.addMouseTrail(argsToTrailConfig(args));

    return () => controller.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
      }}
    >
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.2)',
          fontSize: '1.1rem',
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        Move your mouse
      </p>
    </div>
  );
};

/* ─── Meta ─── */

const meta: Meta<TrailStoryArgs> = {
  title: 'Particular/Mouse Trail',
  argTypes: trailArgTypes,
  args: defaultTrailArgs,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <MouseTrailDemo {...(args as TrailStoryArgs)} />,
};

export const WarmWisps: Story = {
  args: {
    colorPalette: 'orange',
    glowColor: '#ff9500',
    rate: 2,
    velocity: 2,
    particleLife: 50,
    trailLength: 8,
  },
  render: (args) => <MouseTrailDemo {...(args as TrailStoryArgs)} />,
};

export const SnowDust: Story = {
  args: {
    colorPalette: 'snow',
    shape: 'circle',
    glowColor: '#ffffff',
    glowAlpha: 0.2,
    rate: 3,
    sizeMin: 0.5,
    sizeMax: 2,
    velocity: 0.8,
    spread: 1.2,
    particleLife: 60,
    trail: false,
  },
  render: (args) => <MouseTrailDemo {...(args as TrailStoryArgs)} />,
};
