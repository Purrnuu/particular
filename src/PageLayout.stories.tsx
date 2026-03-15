import React, { useEffect, useRef, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles, startScreensaver } from './index';
import type { ParticlesController, BoundaryHandle } from './index';
import { particlesContainerLayerStyle } from './particular/canvasStyles';

/* ─── Shared Styles ──────────────────────────────────────────────────────── */

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 16,
  padding: '28px 24px',
  color: '#fff',
  transition: 'border-color 0.2s',
};

const headingStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 600,
  marginBottom: 8,
  letterSpacing: '0.02em',
};

const bodyStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  lineHeight: 1.5,
  color: 'rgba(255, 255, 255, 0.6)',
};

/* ─── Hook: create boundaries for card elements ─────────────────────────── */

function useBoundaries(
  controllerRef: React.RefObject<ParticlesController | null>,
  cardRefs: React.MutableRefObject<HTMLDivElement[]>,
  strength: number,
  radius: number,
) {
  const boundariesRef = useRef<BoundaryHandle[]>([]);

  // Re-create boundaries when params change
  useEffect(() => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;

    // Destroy previous boundaries
    for (const b of boundariesRef.current) b.destroy();
    boundariesRef.current = [];

    // Create a boundary for each card
    for (const card of cardRefs.current) {
      if (!card) continue;
      boundariesRef.current.push(
        ctrl.addBoundary({ element: card, strength, radius }),
      );
    }

    return () => {
      for (const b of boundariesRef.current) b.destroy();
      boundariesRef.current = [];
    };
  }, [controllerRef, cardRefs, strength, radius]);
}

/* ─── Story Args ─────────────────────────────────────────────────────────── */

interface PageLayoutArgs {
  renderer: 'canvas' | 'webgl';
  repulsionStrength: number;
  repulsionRadius: number;
  mouseStrength: number;
  mouseRadius: number;
}

/* ─── Demo: Snowfall with Card Repulsors ─────────────────────────────────── */

const SnowAroundCardsDemo: React.FC<PageLayoutArgs> = ({
  renderer,
  repulsionStrength,
  repulsionRadius,
  mouseStrength,
  mouseRadius,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const controllerRef = useRef<ParticlesController | null>(null);

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const screensaver = startScreensaver({
      canvas,
      container,
      preset: 'snow',
      config: { rate: 0.8, maxCount: 350 },
      renderer,
      autoResize: true,
    });

    screensaver.controller.addMouseForce({
      track: true,
      strength: mouseStrength,
      radius: mouseRadius,
    });

    controllerRef.current = screensaver.controller;

    return () => {
      screensaver.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer]);

  useBoundaries(controllerRef, cardRefs, repulsionStrength, repulsionRadius);

  const cards = [
    { title: 'Analytics', body: 'Real-time metrics dashboard with live data streaming and customizable widgets.' },
    { title: 'Security', body: 'Enterprise-grade encryption and access controls for your infrastructure.' },
    { title: 'Integrations', body: 'Connect with 200+ tools and services through our API ecosystem.' },
    { title: 'Performance', body: 'Sub-millisecond response times with global edge distribution.' },
    { title: 'Collaboration', body: 'Team workspaces with real-time editing and version history.' },
    { title: 'Automation', body: 'Workflow automation that scales from simple tasks to complex pipelines.' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #1b2838 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={particlesContainerLayerStyle} />

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 40px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 700, marginBottom: 12 }}>
          Particles + Page Layout
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
          Snowflakes flow around the cards below. Each card creates a repulsion field that pushes particles away.
        </p>
      </div>

      {/* Card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 24px 60px',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {cards.map((card, i) => (
          <div key={i} ref={setCardRef(i)} style={cardStyle}>
            <div style={headingStyle}>{card.title}</div>
            <div style={bodyStyle}>{card.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Demo: Burst on click with card repulsors ───────────────────────────── */

const BurstAroundCardsDemo: React.FC<PageLayoutArgs> = ({
  renderer,
  repulsionStrength,
  repulsionRadius,
  mouseStrength,
  mouseRadius,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const controllerRef = useRef<ParticlesController | null>(null);

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: 'magic',
      renderer,
      autoResize: true,
    });

    controller.addMouseForce({
      track: true,
      strength: mouseStrength,
      radius: mouseRadius,
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer]);

  useBoundaries(controllerRef, cardRefs, repulsionStrength, repulsionRadius);

  const handleClick = (e: React.MouseEvent) => {
    const controller = controllerRef.current;
    if (!controller) return;
    controller.burst({ x: e.clientX, y: e.clientY });
  };

  const features = [
    { icon: '\u26A1', title: 'Lightning Fast', body: 'Optimized WebGL2 rendering with instanced draw calls.' },
    { icon: '\uD83C\uDFA8', title: 'Beautiful Defaults', body: 'Curated presets that look great out of the box.' },
    { icon: '\uD83D\uDD27', title: 'Fully Configurable', body: 'Every parameter is tunable via a clean API.' },
    { icon: '\uD83D\uDCE6', title: 'Tiny Bundle', body: 'Tree-shakeable ESM with zero runtime dependencies.' },
  ];

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0b1020 0%, #0a1628 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        cursor: 'crosshair',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={particlesContainerLayerStyle} />

      <div style={{ textAlign: 'center', padding: '60px 24px 40px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 700, marginBottom: 12 }}>
          Click Anywhere
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
          Particle bursts are repelled by the feature cards. The force fields keep the layout readable.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
          maxWidth: 600,
          margin: '0 auto',
          padding: '0 24px 60px',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {features.map((feat, i) => (
          <div key={i} ref={setCardRef(i)} style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{feat.icon}</div>
            <div style={headingStyle}>{feat.title}</div>
            <div style={bodyStyle}>{feat.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Demo: Text particles with card repulsors ───────────────────────────── */

const TextWithCardsDemo: React.FC<PageLayoutArgs> = ({
  renderer,
  repulsionStrength,
  repulsionRadius,
  mouseStrength,
  mouseRadius,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const controllerRef = useRef<ParticlesController | null>(null);

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: 'imageText',
      renderer,
      autoResize: true,
    });

    const w = container.clientWidth;
    const h = container.clientHeight;

    controller.textToParticles('Particular', {
      x: w / 2,
      y: h * 0.22,
      width: Math.min(w * 0.75, 700),
    });

    controller.addMouseForce({
      track: true,
      strength: mouseStrength,
      radius: mouseRadius,
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer]);

  useBoundaries(controllerRef, cardRefs, repulsionStrength, repulsionRadius);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'e' || e.key === 'E') {
      controllerRef.current?.scatter({ velocity: 12 });
    }
  }, []);

  const stats = [
    { value: '60fps', label: 'Smooth rendering' },
    { value: '~3KB', label: 'Gzipped core' },
    { value: '10K+', label: 'Particles' },
  ];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #12101f 50%, #1a1028 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        outline: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={particlesContainerLayerStyle} />

      {/* Spacer for text particles area */}
      <div style={{ height: '40vh' }} />

      {/* Info text */}
      <div style={{ textAlign: 'center', padding: '0 24px 30px', position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          Push the text with your mouse. Press E to scatter. Cards below repel particles.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          padding: '0 24px 60px',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={setCardRef(i)}
            style={{
              ...cardStyle,
              textAlign: 'center',
              minWidth: 140,
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#74c0fc', marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ ...bodyStyle, fontSize: '0.78rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Demo: Scrolling landing page with particles flowing through ─────────── */

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#fff',
  marginBottom: 12,
};

const sectionSubStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.5)',
  maxWidth: 520,
};

const bannerStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: '48px 32px',
  textAlign: 'center',
  margin: '0 auto',
  maxWidth: 700,
};

const ScrollingLandingDemo: React.FC<PageLayoutArgs> = ({
  renderer,
  repulsionStrength,
  repulsionRadius,
  mouseStrength,
  mouseRadius,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const controllerRef = useRef<ParticlesController | null>(null);
  let cardIndex = 0;

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const screensaver = startScreensaver({
      canvas,
      container,
      preset: 'snow',
      config: { rate: 1.5, maxCount: 600, particleLife: 1200 },
      renderer,
      autoResize: true,
    });

    screensaver.controller.addMouseForce({
      track: true,
      strength: mouseStrength,
      radius: mouseRadius,
    });

    controllerRef.current = screensaver.controller;

    return () => {
      screensaver.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer]);

  useBoundaries(controllerRef, cardRefs, repulsionStrength, repulsionRadius);

  const features = [
    { icon: '\u26A1', title: 'Lightning Fast', body: 'WebGL2 instanced rendering pushes thousands of particles at 60fps without breaking a sweat.' },
    { icon: '\uD83C\uDFA8', title: 'Beautiful Defaults', body: 'Curated presets that look stunning out of the box. No parameter tweaking required.' },
    { icon: '\uD83D\uDD27', title: 'Fully Configurable', body: 'Every parameter is tunable. Physics, visuals, timing — you control it all.' },
    { icon: '\uD83D\uDCE6', title: 'Tiny Bundle', body: 'Tree-shakeable ESM with zero runtime dependencies. Under 10KB gzipped.' },
    { icon: '\uD83C\uDF10', title: 'Container Aware', body: 'Particles can fill the viewport or live inside any HTML element with full coordinate mapping.' },
    { icon: '\uD83E\uDDF2', title: 'Force Fields', body: 'Attractors, mouse forces, and element boundaries create dynamic, interactive particle flows.' },
  ];

  const testimonials = [
    { quote: 'Particular made our landing page come alive. Setup took five minutes.', author: 'Design Lead' },
    { quote: 'The WebGL performance is incredible. 10K particles, buttery smooth.', author: 'Frontend Engineer' },
    { quote: 'We replaced three particle libraries with this one. Cleaner API, better defaults.', author: 'Tech Lead' },
  ];

  const steps = [
    { num: '01', title: 'Install', body: 'npm install particular — zero dependencies, tree-shakeable.' },
    { num: '02', title: 'Create', body: 'One call to createParticles() or useParticles() to get started.' },
    { num: '03', title: 'Customize', body: 'Choose a preset, add forces, boundaries, and interactions.' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #070b14 0%, #0a1628 30%, #0d1b2a 60%, #0a0a1a 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      <canvas ref={canvasRef} style={particlesContainerLayerStyle} />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Particular
        </h1>
        <p style={{ ...sectionSubStyle, fontSize: '1.15rem', marginBottom: 32 }}>
          A particle engine for the modern web. Beautiful defaults, zero config, endless possibilities.
        </p>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Scroll down</div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>Why Particular?</h2>
          <p style={{ ...sectionSubStyle, margin: '0 auto' }}>
            Everything you need for production-quality particle effects.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, pointerEvents: 'none' }}>
          {features.map((feat, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{feat.icon}</div>
              <div style={headingStyle}>{feat.title}</div>
              <div style={bodyStyle}>{feat.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div ref={setCardRef(cardIndex++)} style={bannerStyle}>
          <h2 style={{ ...sectionHeadingStyle, fontSize: '1.5rem' }}>
            Ready to add particles to your project?
          </h2>
          <p style={{ ...sectionSubStyle, margin: '0 auto 24px' }}>
            Get started in under a minute with our React hooks or vanilla API.
          </p>
          <div style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'rgba(116, 192, 252, 0.15)',
            border: '1px solid rgba(116, 192, 252, 0.3)',
            borderRadius: 10,
            color: '#74c0fc',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>
            npm install particular
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>Three Steps</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, pointerEvents: 'none' }}>
          {steps.map((step, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(116, 192, 252, 0.4)', flexShrink: 0, width: 56, textAlign: 'center' }}>
                {step.num}
              </div>
              <div>
                <div style={headingStyle}>{step.title}</div>
                <div style={bodyStyle}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>What People Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, pointerEvents: 'none' }}>
          {testimonials.map((t, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={cardStyle}>
              <div style={{ ...bodyStyle, fontStyle: 'italic', marginBottom: 16 }}>"{t.quote}"</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>— {t.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
          Particles flow around every element on this page.
        </p>
      </section>
    </div>
  );
};

/* ─── Meta & Stories ─────────────────────────────────────────────────────── */

const meta: Meta<PageLayoutArgs> = {
  title: 'Particular/Page Layout',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: { category: 'Rendering' },
    },
    repulsionStrength: {
      control: { type: 'number', min: -5, max: 0, step: 0.1 },
      description: 'How strongly cards repel particles (negative = repulsion)',
      table: { category: 'Repulsion' },
    },
    repulsionRadius: {
      control: { type: 'number', min: 5, max: 80, step: 1 },
      description: 'Repulsion radius around card edges (engine units)',
      table: { category: 'Repulsion' },
    },
    mouseStrength: {
      control: { type: 'number', min: 0, max: 10, step: 0.1 },
      description: 'Mouse push force strength',
      table: { category: 'Mouse Force' },
    },
    mouseRadius: {
      control: { type: 'number', min: 20, max: 200, step: 5 },
      description: 'Mouse push force radius',
      table: { category: 'Mouse Force' },
    },
  },
  args: {
    renderer: 'webgl',
    repulsionStrength: -1.5,
    repulsionRadius: 10,
    mouseStrength: 2,
    mouseRadius: 80,
  },
};

export default meta;
type Story = StoryObj<PageLayoutArgs>;

export const SnowAroundCards: Story = {
  render: (args) => <SnowAroundCardsDemo {...args} />,
};

export const ClickBurstWithCards: Story = {
  args: {
    repulsionStrength: -4,
    repulsionRadius: 35,
  },
  render: (args) => <BurstAroundCardsDemo {...args} />,
};

export const TextWithCards: Story = {
  args: {
    repulsionStrength: -2,
    repulsionRadius: 10,
    mouseStrength: 3,
    mouseRadius: 80,
  },
  render: (args) => <TextWithCardsDemo {...args} />,
};

export const ScrollingLandingPage: Story = {
  render: (args) => <ScrollingLandingDemo {...args} />,
};
