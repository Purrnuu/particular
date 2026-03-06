import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles } from './index';
import type { ParticlesController, ParticleShape } from './index';
import Attractor from './particular/components/attractor';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';

interface AttractorStoryArgs {
  strength: number;
  radius: number;
  renderer: 'canvas' | 'webgl';
  attractorSize: number;
  attractorColor: string;
  attractorShape: ParticleShape;
  attractorGlow: boolean;
  attractorGlowSize: number;
  attractorGlowColor: string;
  attractorGlowAlpha: number;
  count: number;
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
    attractorSize: {
      control: { type: 'number', min: 4, max: 40 },
      description: 'Attractor visual size',
    },
    attractorColor: {
      control: 'color',
      description: 'Attractor visual color',
    },
    attractorShape: {
      control: 'select',
      options: ['circle', 'star', 'ring', 'sparkle', 'square', 'triangle'],
      description: 'Attractor visual shape',
    },
    attractorGlow: {
      control: 'boolean',
      description: 'Enable attractor glow',
    },
    attractorGlowSize: {
      control: { type: 'number', min: 4, max: 30 },
      description: 'Attractor glow size',
    },
    attractorGlowColor: {
      control: 'color',
      description: 'Attractor glow color',
    },
    attractorGlowAlpha: {
      control: { type: 'number', min: 0, max: 1, step: 0.05 },
      description: 'Attractor glow opacity',
    },
    count: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of random attractors',
    },
  },
  args: {
    renderer: 'webgl',
    strength: 1,
    radius: 200,
    attractorSize: 14,
    attractorColor: '#74c0fc',
    attractorShape: 'circle',
    attractorGlow: true,
    attractorGlowSize: 15,
    attractorGlowColor: '#74c0fc',
    attractorGlowAlpha: 0.5,
    count: 4,
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

/* ─── Visible Attractors ─── */

const VisibleAttractorDemo: React.FC<AttractorStoryArgs> = ({
  strength,
  radius,
  renderer,
  attractorSize,
  attractorColor,
  attractorShape,
  attractorGlow,
  attractorGlowSize,
  attractorGlowColor,
  attractorGlowAlpha,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attractorRef = useRef<Attractor | null>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      config: { continuous: true, maxCount: 150 },
      renderer,
      autoResize: true,
    });

    const pixelRatio = controller.engine.pixelRatio;

    controller.burst({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const attractor = controller.addAttractor({
      x: window.innerWidth / 2 / pixelRatio,
      y: window.innerHeight / 2 / pixelRatio,
      strength,
      radius,
      visible: true,
      size: attractorSize,
      color: attractorColor,
      shape: attractorShape,
      glow: attractorGlow,
      glowSize: attractorGlowSize,
      glowColor: attractorGlowColor,
      glowAlpha: attractorGlowAlpha,
    });

    attractorRef.current = attractor;
    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
      attractorRef.current = null;
    };
  }, [renderer]);

  useEffect(() => {
    const a = attractorRef.current;
    if (!a) return;
    a.strength = strength;
    a.radius = radius;
    a.size = attractorSize;
    a.color = attractorColor;
    a.shape = attractorShape;
    a.glow = attractorGlow;
    a.glowSize = attractorGlowSize;
    a.glowColor = attractorGlowColor;
    a.glowAlpha = attractorGlowAlpha;
  }, [strength, radius, attractorSize, attractorColor, attractorShape, attractorGlow, attractorGlowSize, attractorGlowColor, attractorGlowAlpha]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const attractor = attractorRef.current;
    const controller = controllerRef.current;
    if (!attractor || !controller) return;

    const pixelRatio = controller.engine.pixelRatio;
    attractor.position.x = e.clientX / pixelRatio;
    attractor.position.y = e.clientY / pixelRatio;
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
        VISIBLE ATTRACTOR — MOVE MOUSE
      </h1>
    </div>
  );
};

export const VisibleAttractor: Story = {
  args: {
    strength: 1.5,
    radius: 250,
  },
  render: (args) => <VisibleAttractorDemo {...args} />,
};

export const VisibleRepulsion: Story = {
  args: {
    strength: -2,
    radius: 300,
    attractorColor: '#339af0',
    attractorGlowColor: '#339af0',
    attractorShape: 'circle',
  },
  render: (args) => <VisibleAttractorDemo {...args} />,
};

/* ─── Random Attractors ─── */

const RandomAttractorsDemo: React.FC<AttractorStoryArgs> = ({
  count,
  strength,
  radius,
  renderer,
  attractorSize,
  attractorColor,
  attractorShape,
  attractorGlow,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      config: { continuous: true, maxCount: 200 },
      renderer,
      autoResize: true,
    });

    // Emitter at center
    controller.burst({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    controller.addRandomAttractors(count, {
      strength,
      radius,
      visible: true,
      size: attractorSize,
      color: attractorColor,
      shape: attractorShape,
      glow: attractorGlow,
      glowColor: attractorColor,
      glowAlpha: 0.4,
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [renderer, count, strength, radius, attractorSize, attractorColor, attractorShape, attractorGlow]);

  return (
    <div
      onClick={(e) => {
        controllerRef.current?.burst({ x: e.clientX, y: e.clientY });
      }}
      style={{ minHeight: '100vh', cursor: 'pointer' }}
    >
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        RANDOM ATTRACTORS — CLICK FOR PARTICLES
      </h1>
    </div>
  );
};

export const RandomAttractors: Story = {
  args: {
    count: 4,
    strength: 1.5,
    radius: 250,
  },
  render: (args) => <RandomAttractorsDemo {...args} />,
};
