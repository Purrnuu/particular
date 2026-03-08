import React, { useEffect, useRef, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles } from './index';
import type { ParticlesController } from './index';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';

/* ─── Explosion (manual explode) ─── */

interface ExplosionStoryArgs {
  renderer: 'canvas' | 'webgl';
}

const ExplosionDemo: React.FC<ExplosionStoryArgs> = ({ renderer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      renderer,
      autoResize: true,
      autoClick: true,
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [renderer]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'e' || e.key === 'E') {
      controllerRef.current?.explode();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ minHeight: '100vh', cursor: 'pointer' }}>
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '40vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        CLICK TO BURST, PRESS E TO EXPLODE
      </h1>
      <p
        style={{
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.6,
        }}
      >
        Burst some particles first, then press E to explode them into sub-bursts
      </p>
    </div>
  );
};

const meta: Meta<ExplosionStoryArgs> = {
  title: 'Particular/Explosion',
  component: ExplosionDemo,
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: { category: 'Rendering' },
    },
  },
  args: {
    renderer: 'webgl',
  },
};

export default meta;
type Story = StoryObj<ExplosionStoryArgs>;

export const Explosion: Story = {};

/* ─── Fireworks Detonation (timed auto-explode) ─── */

interface DetonationStoryArgs {
  renderer: 'canvas' | 'webgl';
}

const DetonationDemo: React.FC<DetonationStoryArgs> = ({ renderer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'fireworksDetonation',
      renderer,
      autoResize: true,
      autoClick: true,
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [renderer]);

  return (
    <div style={{ minHeight: '100vh', cursor: 'pointer' }}>
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '40vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        CLICK TO LAUNCH FIREWORKS
      </h1>
      <p
        style={{
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.6,
        }}
      >
        Particles rise, then auto-detonate into bursts
      </p>
    </div>
  );
};

export const FireworksDetonation: StoryObj<DetonationStoryArgs> = {
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: { category: 'Rendering' },
    },
  },
  args: {
    renderer: 'webgl',
  } as any,
  render: (args) => <DetonationDemo {...(args as unknown as DetonationStoryArgs)} />,
};
