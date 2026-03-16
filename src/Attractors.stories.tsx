import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles } from './index';
import type { ParticlesController, ParticleShape } from './index';
import Emitter from './particular/components/emitter';
import Attractor from './particular/components/attractor';
import { configureParticle } from './particular/core/defaults';
import { presets } from './particular/presets';
import Vector from './particular/utils/vector';
import { particlesBackgroundLayerStyle } from './particular/canvasStyles';
import { particleArgTypes, defaultParticleStoryArgs, particleStoryArgsToConfig } from './storyArgs';
import type { ParticleStoryArgs } from './storyArgs';

interface AttractorStoryArgs extends ParticleStoryArgs {
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

const AttractorDemo: React.FC<AttractorStoryArgs> = (props) => {
  const { strength, radius, renderer } = props;
  const particleConfig = particleStoryArgsToConfig(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attractorRef = useRef<Attractor | null>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      config: { continuous: true, trail: false, ...particleConfig },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, JSON.stringify(particleConfig)]);

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
      table: { category: 'Rendering' },
    },
    // Shared particle appearance controls
    ...particleArgTypes,
    // — Attractor —
    strength: {
      control: { type: 'number', min: -5, max: 5, step: 0.1 },
      description: 'Attractor strength (negative = repulsion)',
      table: { category: 'Attractor' },
    },
    radius: {
      control: { type: 'number', min: 50, max: 800, step: 10 },
      description: 'Attractor radius of influence',
      table: { category: 'Attractor' },
    },
    attractorSize: {
      control: { type: 'number', min: 4, max: 40 },
      description: 'Attractor visual size',
      table: { category: 'Attractor' },
    },
    attractorColor: {
      control: 'color',
      description: 'Attractor visual color',
      table: { category: 'Attractor' },
    },
    attractorShape: {
      control: 'select',
      options: ['circle', 'star', 'ring', 'sparkle', 'square', 'triangle'],
      description: 'Attractor visual shape',
      table: { category: 'Attractor' },
    },
    attractorGlow: {
      control: 'boolean',
      description: 'Enable attractor glow',
      table: { category: 'Attractor' },
    },
    attractorGlowSize: {
      control: { type: 'number', min: 4, max: 30 },
      description: 'Attractor glow size',
      table: { category: 'Attractor' },
    },
    attractorGlowColor: {
      control: 'color',
      description: 'Attractor glow color',
      table: { category: 'Attractor' },
    },
    attractorGlowAlpha: {
      control: { type: 'number', min: 0, max: 1, step: 0.05 },
      description: 'Attractor glow opacity',
      table: { category: 'Attractor' },
    },
    count: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of random attractors',
      table: { category: 'Attractor' },
    },
  },
  args: {
    ...defaultParticleStoryArgs,
    maxCount: 150,
    renderer: 'webgl',
    strength: 1,
    radius: 50,
    attractorSize: 14,
    attractorColor: '#adb5bd',
    attractorShape: 'circle',
    attractorGlow: true,
    attractorGlowSize: 15,
    attractorGlowColor: '#adb5bd',
    attractorGlowAlpha: 0.5,
    count: 4,
  },
};

export default meta;
type Story = StoryObj<AttractorStoryArgs>;

export const MouseFollow: Story = {
  args: { maxCount: 100 },
};

export const Repulsion: Story = {
  args: {
    maxCount: 100,
    strength: -1,
    radius: 100,
  },
};

/* ─── Visible Attractors ─── */

const VisibleAttractorDemo: React.FC<AttractorStoryArgs> = (props) => {
  const {
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
  } = props;
  const particleConfig = particleStoryArgsToConfig(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attractorRef = useRef<Attractor | null>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      config: { continuous: true, trail: false, ...particleConfig },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, JSON.stringify(particleConfig)]);

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
    radius: 50,
  },
  render: (args) => <VisibleAttractorDemo {...args} />,
};

export const VisibleRepulsion: Story = {
  args: {
    strength: -1,
    radius: 50,
    attractorColor: '#339af0',
    attractorGlowColor: '#339af0',
    attractorShape: 'circle',
  },
  render: (args) => <VisibleAttractorDemo {...args} />,
};

/* ─── Random Attractors ─── */

const RandomAttractorsDemo: React.FC<AttractorStoryArgs> = (props) => {
  const {
    count,
    strength,
    radius,
    renderer,
    attractorSize,
    attractorColor,
    attractorShape,
    attractorGlow,
  } = props;
  const particleConfig = particleStoryArgsToConfig(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'magic',
      config: { continuous: true, trail: false, ...particleConfig },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, count, strength, radius, attractorSize, attractorColor, attractorShape, attractorGlow, JSON.stringify(particleConfig)]);

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
    maxCount: 200,
    count: 4,
    strength: 1.5,
    radius: 250,
  },
  render: (args) => <RandomAttractorsDemo {...args} />,
};

/* ─── River Flow ─── */

const RiverDemo: React.FC<{ renderer: 'canvas' | 'webgl' }> = ({ renderer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'river',
      renderer,
      autoResize: true,
    });

    controllerRef.current = controller;

    const pr = controller.engine.pixelRatio;
    const viewW = window.innerWidth / pr;
    const viewH = window.innerHeight / pr;

    // Emitter on the left edge, vertical band covering 40% of viewport
    const riverConfig = configureParticle(presets.Ambient.river);
    const emitter = new Emitter({
      point: new Vector(0, viewH / 2),
      ...riverConfig,
      spawnWidth: 0,
      spawnHeight: viewH * 0.4,
      icons: [],
    });
    controller.engine.addEmitter(emitter);
    emitter.isEmitting = true;
    emitter.emit();

    // S-curve attractors guide the flow like a river through a ridge
    const curve = [
      { x: 0.20, y: 0.35 },
      { x: 0.40, y: 0.65 },
      { x: 0.60, y: 0.35 },
      { x: 0.80, y: 0.65 },
    ];
    for (const pt of curve) {
      controller.addAttractor({
        x: viewW * pt.x,
        y: viewH * pt.y,
        strength: 0.15,
        radius: viewW * 0.3,
      });
    }

    // Repulsors at top and bottom edges to keep particles in bounds
    for (let fx = 0.1; fx <= 0.9; fx += 0.2) {
      controller.addAttractor({ x: viewW * fx, y: viewH * 0.02, strength: -0.3, radius: viewH * 0.15 });
      controller.addAttractor({ x: viewW * fx, y: viewH * 0.98, strength: -0.3, radius: viewH * 0.15 });
    }

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [renderer]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
      <p
        style={{
          textAlign: 'center',
          paddingTop: '90vh',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.4,
          color: '#80deea',
        }}
      >
        River flow — particles stream through attractor waypoints
      </p>
    </div>
  );
};

export const River: StoryObj<{ renderer: 'canvas' | 'webgl' }> = {
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: { category: 'Rendering' },
    },
  },
  args: { renderer: 'webgl' } as any,
  render: (args) => <RiverDemo {...(args as unknown as { renderer: 'canvas' | 'webgl' })} />,
};
