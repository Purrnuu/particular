import React, { useEffect, useRef, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { InputType } from '@storybook/core/types';

import { createParticles } from './index';
import { defaultContainerGlow } from './particular/core/defaults';
import { colorPalettes } from './particular/presets';
import type { ContainerGlowConfig, ParticleShape, BlendMode } from './particular/types';
import type { ContainerGlowHandle } from './index';

/* ─── Glow-specific story args ─── */

interface GlowStoryArgs {
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
  pulseSpeed: number;
  pulseAmplitude: number;
  maxCount: number;
}

const glowArgTypes: Record<string, InputType> = {
  colorPalette: {
    control: 'select',
    options: ['default', ...Object.keys(colorPalettes)],
    description: 'Color palette',
    table: { category: 'Appearance' },
  },
  shape: {
    control: 'select',
    options: ['circle', 'square', 'triangle', 'star', 'ring', 'sparkle'],
    description: 'Particle shape',
    table: { category: 'Appearance' },
  },
  blendMode: {
    control: 'select',
    options: ['normal', 'additive', 'multiply', 'screen'],
    description: 'Blend mode',
    table: { category: 'Appearance' },
  },
  rate: { control: { type: 'number', min: 0.1, max: 3, step: 0.1 }, description: 'Emission rate per edge', table: { category: 'Emission' } },
  sizeMin: { control: { type: 'number', min: 0.5, max: 10, step: 0.5 }, description: 'Min particle size', table: { category: 'Emission' } },
  sizeMax: { control: { type: 'number', min: 0.5, max: 15, step: 0.5 }, description: 'Max particle size', table: { category: 'Emission' } },
  particleLife: { control: { type: 'number', min: 20, max: 300, step: 10 }, description: 'Particle lifetime (ticks)', table: { category: 'Emission' } },
  fadeTime: { control: { type: 'number', min: 5, max: 100, step: 5 }, description: 'Fade duration (ticks)', table: { category: 'Emission' } },
  velocity: { control: { type: 'number', min: 0.1, max: 3, step: 0.1 }, description: 'Outward velocity', table: { category: 'Physics' } },
  spread: { control: { type: 'number', min: 0, max: 1.5, step: 0.05 }, description: 'Spread angle (radians)', table: { category: 'Physics' } },
  friction: { control: { type: 'number', min: 0, max: 0.1, step: 0.005 }, description: 'Friction', table: { category: 'Physics' } },
  glow: { control: 'boolean', description: 'Enable glow', table: { category: 'Glow' } },
  glowColor: { control: 'color', description: 'Glow color', table: { category: 'Glow' } },
  glowAlpha: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Glow opacity', table: { category: 'Glow' } },
  glowSize: { control: { type: 'number', min: 2, max: 30, step: 1 }, description: 'Glow size', table: { category: 'Glow' } },
  pulseSpeed: { control: { type: 'number', min: 0, max: 0.1, step: 0.005 }, description: 'Pulse speed (0 = off)', table: { category: 'Pulse' } },
  pulseAmplitude: { control: { type: 'number', min: 0, max: 1, step: 0.05 }, description: 'Pulse amplitude', table: { category: 'Pulse' } },
  maxCount: { control: { type: 'number', min: 100, max: 3000, step: 100 }, description: 'Max particles', table: { category: 'Emission' } },
};

const defaultGlowArgs: GlowStoryArgs = {
  colorPalette: 'default',
  shape: defaultContainerGlow.shape,
  blendMode: defaultContainerGlow.blendMode,
  rate: defaultContainerGlow.rate,
  sizeMin: defaultContainerGlow.sizeMin,
  sizeMax: defaultContainerGlow.sizeMax,
  particleLife: defaultContainerGlow.particleLife,
  fadeTime: defaultContainerGlow.fadeTime,
  velocity: defaultContainerGlow.velocity,
  spread: defaultContainerGlow.spread,
  friction: defaultContainerGlow.friction,
  glow: defaultContainerGlow.glow,
  glowColor: defaultContainerGlow.glowColor,
  glowAlpha: defaultContainerGlow.glowAlpha,
  glowSize: defaultContainerGlow.glowSize,
  pulseSpeed: defaultContainerGlow.pulseSpeed,
  pulseAmplitude: defaultContainerGlow.pulseAmplitude,
  maxCount: 600,
};

/** Convert story args to ContainerGlowConfig fields (minus element). */
function argsToGlowConfig(args: GlowStoryArgs): Omit<ContainerGlowConfig, 'element'> {
  return {
    colors: args.colorPalette === 'default' ? defaultContainerGlow.colors : (colorPalettes[args.colorPalette] ?? []),
    shape: args.shape,
    rate: args.rate,
    sizeMin: args.sizeMin,
    sizeMax: args.sizeMax,
    particleLife: args.particleLife,
    fadeTime: args.fadeTime,
    velocity: args.velocity,
    spread: args.spread,
    friction: args.friction,
    glow: args.glow,
    glowColor: args.glowColor,
    glowAlpha: args.glowAlpha,
    glowSize: args.glowSize,
    blendMode: args.blendMode,
    pulseSpeed: args.pulseSpeed,
    pulseAmplitude: args.pulseAmplitude,
  };
}

/* ─── Shared styles ─── */

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100vh',
  background: '#0a0a1a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/* ─── Basic Glow (continuous, with controls) ─── */

const BasicGlowDemo: React.FC<GlowStoryArgs> = (args) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const box = boxRef.current;
    if (!container || !box) return;

    const controller = createParticles({
      container,
      config: { maxCount: args.maxCount, continuous: true },
      renderer: 'webgl',
      autoResize: true,
    });

    const glow = controller.addContainerGlow({ element: box, ...argsToGlowConfig(args) });

    return () => {
      glow.destroy();
      controller.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)]);

  return (
    <div ref={containerRef} style={containerStyle}>
      <div
        ref={boxRef}
        style={{
          width: 280,
          height: 160,
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.9rem',
          fontFamily: 'system-ui, sans-serif',
          zIndex: 1,
          position: 'relative',
        }}
      >
        Continuous glow
      </div>
    </div>
  );
};

/* ─── Text Glow (hover, with controls) ─── */

const TextGlowDemo: React.FC<GlowStoryArgs> = (args) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<ContainerGlowHandle | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const controller = createParticles({
      container,
      config: { maxCount: args.maxCount, continuous: true },
      renderer: 'webgl',
      autoResize: true,
    });

    const glow = controller.addContainerGlow({ element: text, ...argsToGlowConfig(args) });
    glow.stop();
    glowRef.current = glow;

    return () => {
      glowRef.current = null;
      controller.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)]);

  const onEnter = useCallback(() => glowRef.current?.start(), []);
  const onLeave = useCallback(() => glowRef.current?.stop(), []);

  return (
    <div ref={containerRef} style={containerStyle}>
      <h1
        ref={textRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '-0.02em',
          zIndex: 1,
          position: 'relative',
          margin: 0,
          cursor: 'default',
        }}
      >
        Hover me
      </h1>
    </div>
  );
};

/* ─── Multiple Elements (hover, with controls) ─── */

const cardPalettes = [
  { colorPalette: 'coolBlue', glowColor: '#74c0fc' },
  { colorPalette: 'default', glowColor: '#9775fa' },
  { colorPalette: 'green', glowColor: '#40c057' },
];

const MultiGlowDemo: React.FC<GlowStoryArgs> = (args) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const glowRefs = useRef<ContainerGlowHandle[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardRefs.current;
    if (!container || cards.length === 0) return;

    const controller = createParticles({
      container,
      config: { maxCount: args.maxCount, continuous: true },
      renderer: 'webgl',
      autoResize: true,
    });

    const baseConfig = argsToGlowConfig(args);

    glowRefs.current = cards.map((card, i) => {
      const palette = cardPalettes[i]!;
      const glow = controller.addContainerGlow({
        element: card,
        ...baseConfig,
        colors: colorPalettes[palette.colorPalette] ?? defaultContainerGlow.colors,
        glowColor: palette.glowColor,
      });
      glow.stop();
      return glow;
    });

    return () => {
      glowRefs.current = [];
      controller.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)]);

  const onEnter = useCallback((index: number) => glowRefs.current[index]?.start(), []);
  const onLeave = useCallback((index: number) => glowRefs.current[index]?.stop(), []);

  const cardStyle: React.CSSProperties = {
    width: 200,
    height: 120,
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.85rem',
    fontFamily: 'system-ui, sans-serif',
    zIndex: 1,
    position: 'relative',
    cursor: 'default',
  };

  const labels = ['Blue', 'Purple', 'Green'];

  return (
    <div ref={containerRef} style={{ ...containerStyle, gap: 60 }}>
      {labels.map((label, i) => (
        <div
          key={label}
          ref={(el) => { if (el) cardRefs.current[i] = el; }}
          style={cardStyle}
          onMouseEnter={() => onEnter(i)}
          onMouseLeave={() => onLeave(i)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

/* ─── Meta ─── */

const meta: Meta<GlowStoryArgs> = {
  title: 'Particular/Container Glow',
  argTypes: glowArgTypes,
  args: defaultGlowArgs,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicGlow: Story = {
  render: (args) => <BasicGlowDemo {...(args as GlowStoryArgs)} />,
};

export const TextGlow: Story = {
  args: {
    colorPalette: 'orange',
    glowColor: '#ff9500',
    rate: 0.6,
    velocity: 0.6,
    particleLife: 80,
  },
  render: (args) => <TextGlowDemo {...(args as GlowStoryArgs)} />,
};

export const MultipleElements: Story = {
  args: {
    maxCount: 1500,
  },
  render: (args) => <MultiGlowDemo {...(args as GlowStoryArgs)} />,
};
