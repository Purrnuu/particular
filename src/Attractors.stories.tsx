import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles } from './index';
import type { ParticlesController } from './index';
import Attractor from './particular/components/attractor';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';

interface AttractorStoryArgs {
  strength: number;
  radius: number;
  renderer: 'canvas' | 'webgl';
}

const AttractorDemo: React.FC<AttractorStoryArgs> = ({ strength, radius, renderer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attractorRef = useRef<Attractor | null>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      config: { continuous: true, maxCount: 100 },
      renderer,
      autoResize: true,
    });

    const pixelRatio = controller.engine.pixelRatio;

    // Start continuous emitter at center
    controller.burst({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    // Add attractor at center (engine coordinates = screen / pixelRatio)
    const attractor = controller.addAttractor({
      x: window.innerWidth / 2 / pixelRatio,
      y: window.innerHeight / 2 / pixelRatio,
      strength,
      radius,
    });

    attractorRef.current = attractor;
    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
      attractorRef.current = null;
    };
  }, [renderer]);

  // Update attractor properties when controls change
  useEffect(() => {
    if (attractorRef.current) {
      attractorRef.current.strength = strength;
      attractorRef.current.radius = radius;
    }
  }, [strength, radius]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const attractor = attractorRef.current;
    const controller = controllerRef.current;
    if (!attractor || !controller) return;

    const pixelRatio = controller.engine.pixelRatio;
    attractor.position.x = e.clientX / pixelRatio;
    attractor.position.y = e.clientY / pixelRatio;
  };

  const label = strength >= 0
    ? 'MOVE MOUSE TO ATTRACT PARTICLES'
    : 'MOVE MOUSE TO REPEL PARTICLES';

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
        {label}
      </h1>
    </div>
  );
};

const meta: Meta<AttractorStoryArgs> = {
  title: 'Particular/Attractors',
  component: AttractorDemo,
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
    },
    strength: {
      control: { type: 'number', min: -5, max: 5, step: 0.1 },
      description: 'Attractor strength (negative = repulsion)',
    },
    radius: {
      control: { type: 'number', min: 50, max: 800, step: 10 },
      description: 'Attractor radius of influence',
    },
  },
  args: {
    renderer: 'webgl',
    strength: 1,
    radius: 200,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MouseFollow: Story = {};

export const Repulsion: Story = {
  args: {
    strength: -2,
    radius: 300,
  },
};
