import React, { useEffect, useRef, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { InputType } from '@storybook/core/types';

import { createParticles, createHeartImage, canvasToDataURL } from './index';
import type { ParticlesController, HomePositionConfig, ImageParticlesConfig } from './index';
import { defaultHomeConfig } from './particular/core/defaults';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';
import woltLogoSvg from './icons/woltLogo.svg';
import vikingPng from './icons/viking.png';

/* ─── Shared Args ─── */

interface ImageParticlesStoryArgs {
  renderer: 'canvas' | 'webgl';
  resolution: number;
  particleShape: 'circle' | 'square' | 'triangle';
  idlePulseStrength: number;
  idlePulseIntervalMin: number;
  idlePulseIntervalMax: number;
  springStrength: number;
  mouseStrength: number;
  mouseRadius: number;
}

function buildHomeConfig(args: ImageParticlesStoryArgs): HomePositionConfig {
  return {
    springStrength: args.springStrength,
    idlePulseStrength: args.idlePulseStrength,
    idlePulseIntervalMin: args.idlePulseIntervalMin,
    idlePulseIntervalMax: args.idlePulseIntervalMax,
  };
}

const sharedArgTypes: Record<string, InputType> = {
  renderer: {
    control: 'radio',
    options: ['canvas', 'webgl'],
    description: 'Rendering backend',
    table: { category: 'Rendering' },
  },
  resolution: {
    control: { type: 'number', min: 20, max: 500, step: 10 },
    description: 'Particle grid resolution (particles along longest axis)',
    table: { category: 'Image' },
  },
  particleShape: {
    control: 'radio',
    options: ['circle', 'square', 'triangle'],
    description: 'Shape of individual particles',
    table: { category: 'Image' },
  },
  idlePulseStrength: {
    control: { type: 'number', min: 0, max: 3, step: 0.1 },
    description: 'Idle pulse velocity (0 = off). Particles randomly twitch and spring back.',
    table: { category: 'Idle Animation' },
  },
  idlePulseIntervalMin: {
    control: { type: 'number', min: 60, max: 1800, step: 60 },
    description: 'Minimum ticks between pulse waves (~60 ticks = 1 sec)',
    table: { category: 'Idle Animation' },
  },
  idlePulseIntervalMax: {
    control: { type: 'number', min: 60, max: 3600, step: 60 },
    description: 'Maximum ticks between pulse waves (~60 ticks = 1 sec)',
    table: { category: 'Idle Animation' },
  },
  springStrength: {
    control: { type: 'number', min: 0.005, max: 0.1, step: 0.005 },
    description: 'Spring return force strength',
    table: { category: 'Physics' },
  },
  mouseStrength: {
    control: { type: 'number', min: 0, max: 10, step: 0.5 },
    description: 'Mouse push force strength',
    table: { category: 'Mouse' },
  },
  mouseRadius: {
    control: { type: 'number', min: 20, max: 200, step: 10 },
    description: 'Mouse force radius',
    table: { category: 'Mouse' },
  },
};

const sharedArgs: ImageParticlesStoryArgs = {
  renderer: 'webgl',
  resolution: 200,
  particleShape: 'square',
  idlePulseStrength: defaultHomeConfig.idlePulseStrength,
  idlePulseIntervalMin: defaultHomeConfig.idlePulseIntervalMin,
  idlePulseIntervalMax: defaultHomeConfig.idlePulseIntervalMax,
  springStrength: defaultHomeConfig.springStrength,
  mouseStrength: 3,
  mouseRadius: 80,
};

/* ─── Shared Image Demo ─── */

interface ImageDemoProps extends ImageParticlesStoryArgs {
  buildImage: () => Omit<ImageParticlesConfig, 'homeConfig' | 'shape' | 'resolution'>;
  background?: string;
}

const ImageDemo: React.FC<ImageDemoProps> = ({ buildImage, background = '#1a1a2e', ...args }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'imageShape',
      renderer: args.renderer,
      autoResize: true,
    });

    controllerRef.current = controller;

    const imageConfig = buildImage();
    controller.imageToParticles({
      ...imageConfig,
      resolution: args.resolution,
      shape: args.particleShape,
      homeConfig: buildHomeConfig(args),
    });

    controller.addMouseForce({
      track: true,
      strength: args.mouseStrength,
      radius: args.mouseRadius,
    });

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [args.renderer, args.resolution, args.particleShape, args.idlePulseStrength, args.idlePulseIntervalMin, args.idlePulseIntervalMax, args.springStrength, args.mouseStrength, args.mouseRadius]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'e' || e.key === 'E') {
      controllerRef.current?.scatter({ velocity: 12 });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ minHeight: '100vh', background }}>
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <p
        style={{
          textAlign: 'center',
          paddingTop: '85vh',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.5,
          color: '#fff',
        }}
      >
        Move mouse to push particles &middot; Press E to scatter
      </p>
    </div>
  );
};

/* ─── Text Demo (uses textToParticles) ─── */

const TextToParticlesDemo: React.FC<ImageParticlesStoryArgs> = (args) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'imageText',
      renderer: args.renderer,
      autoResize: true,
    });

    controllerRef.current = controller;

    controller.textToParticles('Particular', {
      resolution: args.resolution,
      shape: args.particleShape,
      homeConfig: buildHomeConfig(args),
    });

    controller.addMouseForce({
      track: true,
      strength: args.mouseStrength,
      radius: args.mouseRadius,
    });

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [args.renderer, args.resolution, args.particleShape, args.idlePulseStrength, args.idlePulseIntervalMin, args.idlePulseIntervalMax, args.springStrength, args.mouseStrength, args.mouseRadius]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'e' || e.key === 'E') {
      controllerRef.current?.scatter({ velocity: 12 });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e' }}>
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <p
        style={{
          textAlign: 'center',
          paddingTop: '85vh',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.5,
          color: '#fff',
        }}
      >
        Move mouse to push particles &middot; Press E to scatter
      </p>
    </div>
  );
};

/* ─── Meta ─── */

const meta: Meta<ImageParticlesStoryArgs> = {
  title: 'Particular/Image to Particles',
  argTypes: sharedArgTypes,
  args: sharedArgs,
};

export default meta;
type Story = StoryObj<ImageParticlesStoryArgs>;

/* ─── Stories ─── */

export const TextToParticles: Story = {
  args: { resolution: 300 },
  render: (args) => <TextToParticlesDemo {...args} />,
};

export const Heart: Story = {
  render: (args) => (
    <ImageDemo
      {...args}
      buildImage={() => ({
        image: canvasToDataURL(createHeartImage(400)),
      })}
    />
  ),
};

export const WoltLogo: Story = {
  args: { particleShape: 'triangle' },
  render: (args) => (
    <ImageDemo
      {...args}
      buildImage={() => ({
        image: woltLogoSvg,
      })}
      background="#0a0a1a"
    />
  ),
};

export const Viking: Story = {
  render: (args) => (
    <ImageDemo
      {...args}
      buildImage={() => ({
        image: vikingPng,
      })}
      background="#1a1a2e"
    />
  ),
};

export const IntroScatter: Story = {
  name: 'Intro — Scatter',
  render: (args) => (
    <ImageDemo
      {...args}
      buildImage={() => ({
        image: vikingPng,
        intro: { mode: 'scatter' },
      })}
      background="#1a1a2e"
    />
  ),
};

export const IntroScaleIn: Story = {
  name: 'Intro — Scale In',
  render: (args) => (
    <ImageDemo
      {...args}
      buildImage={() => ({
        image: vikingPng,
        intro: { mode: 'scaleIn' },
      })}
      background="#1a1a2e"
    />
  ),
};

export const IntroRipple: Story = {
  name: 'Intro — Ripple',
  render: (args) => (
    <ImageDemo
      {...args}
      buildImage={() => ({
        image: vikingPng,
        intro: { mode: 'ripple' },
      })}
      background="#1a1a2e"
    />
  ),
};

export const IntroPaint: Story = {
  name: 'Intro — Paint',
  render: (args) => (
    <ImageDemo
      {...args}
      buildImage={() => ({
        image: vikingPng,
        intro: { mode: 'paint' },
      })}
      background="#1a1a2e"
    />
  ),
};
