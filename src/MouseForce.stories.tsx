import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles } from './index';
import type { ParticlesController } from './index';
import type MouseForce from './particular/components/mouseForce';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';
import { particleArgTypes, defaultParticleStoryArgs, particleStoryArgsToConfig } from './storyArgs';
import type { ParticleStoryArgs } from './storyArgs';

interface MouseForceStoryArgs extends ParticleStoryArgs {
  strength: number;
  radius: number;
  damping: number;
  maxSpeed: number;
  falloff: number;
  renderer: 'canvas' | 'webgl';
}

const MouseForceDemo: React.FC<MouseForceStoryArgs> = (props) => {
  const { strength, radius, damping, maxSpeed, falloff, renderer } = props;
  const particleConfig = particleStoryArgsToConfig(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseForceRef = useRef<MouseForce | null>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      config: { continuous: true, ...particleConfig },
      renderer,
      autoResize: true,
    });

    // Start continuous emitter at center
    controller.burst({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const mouseForce = controller.addMouseForce({
      strength,
      radius,
      damping,
      maxSpeed,
      falloff,
    });

    mouseForceRef.current = mouseForce;
    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
      mouseForceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, JSON.stringify(particleConfig)]);

  // Update mouse force properties when controls change
  useEffect(() => {
    if (mouseForceRef.current) {
      mouseForceRef.current.strength = strength;
      mouseForceRef.current.radius = radius;
      mouseForceRef.current.damping = damping;
      mouseForceRef.current.maxSpeed = maxSpeed;
      mouseForceRef.current.falloff = falloff;
    }
  }, [strength, radius, damping, maxSpeed, falloff]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const mf = mouseForceRef.current;
    const controller = controllerRef.current;
    if (!mf || !controller) return;

    const pixelRatio = controller.engine.pixelRatio;
    mf.updatePosition(e.clientX / pixelRatio, e.clientY / pixelRatio);
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ minHeight: '100vh', cursor: 'crosshair' }}>
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        SWEEP MOUSE TO PUSH PARTICLES
      </h1>
    </div>
  );
};

const meta: Meta<MouseForceStoryArgs> = {
  title: 'Particular/MouseForce',
  component: MouseForceDemo,
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: { category: 'Rendering' },
    },
    // Shared particle appearance controls
    ...particleArgTypes,
    // — Mouse Force —
    strength: {
      control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
      description: 'Force strength multiplier',
      table: { category: 'Mouse Force' },
    },
    radius: {
      control: { type: 'number', min: 50, max: 2000, step: 10 },
      description: 'Radius of influence around the mouse',
      table: { category: 'Mouse Force' },
    },
    damping: {
      control: { type: 'number', min: 0.5, max: 0.99, step: 0.01 },
      description: 'Velocity damping per frame (higher = longer momentum)',
      table: { category: 'Mouse Force' },
    },
    maxSpeed: {
      control: { type: 'number', min: 1, max: 30, step: 1 },
      description: 'Max mouse speed for force calculation',
      table: { category: 'Mouse Force' },
    },
    falloff: {
      control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
      description: 'Falloff exponent: < 1 = broad wind, 1 = linear, > 1 = localized push',
      table: { category: 'Mouse Force' },
    },
  },
  args: {
    ...defaultParticleStoryArgs,
    maxCount: 150,
    renderer: 'webgl',
    strength: 1,
    radius: 200,
    damping: 0.85,
    maxSpeed: 10,
    falloff: 1,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sweep: Story = {};

export const StrongPush: Story = {
  args: {
    strength: 5,
    radius: 400,
    damping: 0.9,
    maxSpeed: 10,
    falloff: 2,
  },
};

export const Wind: Story = {
  args: {
    strength: 2,
    radius: 1000,
    damping: 0.92,
    maxSpeed: 15,
    falloff: 0.3,
  },
};
