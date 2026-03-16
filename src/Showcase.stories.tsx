import React, { useEffect, useRef, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles, startScreensaver, presets } from './index';
import type { ParticlesController, ScreensaverController, BoundaryHandle } from './index';
import Emitter from './particular/components/emitter';
import { configureParticle } from './particular/core/defaults';
import Vector from './particular/utils/vector';
import { particlesContainerLayerStyle } from './particular/canvasStyles';

/* ─── Shared Styles ─── */

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  padding: '28px 24px',
  color: '#fff',
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
  color: 'rgba(255, 255, 255, 0.55)',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#fff',
  marginBottom: 12,
};

const sectionSubStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: 'rgba(255, 255, 255, 0.45)',
  maxWidth: 520,
};

/* ─── Subtle snow palette ─── */

const subtleSnowColors = ['#555566', '#606070', '#6a6a7a', '#757585', '#808090'];

/* ─── Muted river palette — dimmed cyans that read as subtle accents ─── */

const mutedRiverColors = ['#3a4a4f', '#455558', '#4f6065', '#5a6b70', '#647578'];

/* ─── Responsive CSS (injected once) — inline styles can't do media queries ─── */

const RESPONSIVE_CSS = `
.showcase-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  pointer-events: none;
}
.showcase-hero-section {
  height: 100vh;
  height: 100dvh;
}
.showcase-section-heading {
  font-size: 1.8rem;
}
@media (max-width: 768px) {
  .showcase-features-grid { grid-template-columns: repeat(2, 1fr); }
  .showcase-section-heading { font-size: 1.4rem; }
}
@media (max-width: 480px) {
  .showcase-features-grid { grid-template-columns: 1fr; }
  .showcase-section-heading { font-size: 1.2rem; }
}
`;

function useInjectStyles(css: string) {
  useEffect(() => {
    const id = 'showcase-responsive-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, [css]);
}

/* ─── Welcome: text particles hero + snow + river + scroll fireworks ─── */

const WelcomeDemo: React.FC = () => {
  useInjectStyles(RESPONSIVE_CSS);
  const containerRef = useRef<HTMLDivElement>(null);
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const riverCanvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const riverDividerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const snowControllerRef = useRef<ParticlesController | null>(null);
  const textControllerRef = useRef<ParticlesController | null>(null);
  const riverControllerRef = useRef<ParticlesController | null>(null);
  const fireworksControllerRef = useRef<ParticlesController | null>(null);
  const boundariesRef = useRef<BoundaryHandle[]>([]);
  const firedFireworksRef = useRef(false);
  let cardIndex = 0;

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  // Snow screensaver — container-aware, flows through the scrolling page
  useEffect(() => {
    const canvas = snowCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const screensaver: ScreensaverController = startScreensaver({
      canvas,
      container,
      preset: 'snow',
      config: {
        rate: 0.6,
        maxCount: 300,
        particleLife: 1200,
        colors: subtleSnowColors,
        glow: false,
        sizeMin: 1,
        sizeMax: 3,
      },
      renderer: 'webgl',
      autoResize: true,
    });

    snowControllerRef.current = screensaver.controller;

    return () => {
      screensaver.destroy();
      snowControllerRef.current = null;
    };
  }, []);

  // Boundaries — snow flows around all cards
  useEffect(() => {
    const ctrl = snowControllerRef.current;
    if (!ctrl) return;

    const timer = setTimeout(() => {
      for (const b of boundariesRef.current) b.destroy();
      boundariesRef.current = [];

      for (const card of cardRefs.current) {
        if (!card) continue;
        boundariesRef.current.push(
          ctrl.addBoundary({ element: card, strength: -1.5, radius: 10 }),
        );
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      for (const b of boundariesRef.current) b.destroy();
      boundariesRef.current = [];
    };
  }, []);

  // Text particles — container-aware, scrolls with page
  useEffect(() => {
    const canvas = textCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: 'imageText',
      renderer: 'webgl',
      autoResize: true,
    });

    textControllerRef.current = controller;

    const w = container.clientWidth;
    const heroH = window.innerHeight;

    controller.textToParticles('Particular', {
      x: w / 2,
      y: heroH * 0.38,
      width: Math.min(w * 0.75, 800),
      intro: { mode: 'scatter', duration: 1200 },
    });

    controller.addMouseForce({
      track: true,
      strength: 3,
      radius: 80,
    });

    return () => {
      controller.destroy();
      textControllerRef.current = null;
    };
  }, []);

  // River — container-aware, continuous, flows between features and CTA
  useEffect(() => {
    const canvas = riverCanvasRef.current;
    const container = containerRef.current;
    const divider = riverDividerRef.current;
    if (!canvas || !container || !divider) return;

    const controller = createParticles({
      canvas,
      container,
      preset: 'river',
      config: { maxCount: 300 },
      renderer: 'webgl',
      autoResize: true,
    });

    riverControllerRef.current = controller;

    const pr = controller.engine.pixelRatio;
    const w = container.clientWidth / pr;
    const dividerY = divider.offsetTop / pr;

    const riverConfig = configureParticle({
      ...presets.Ambient.river,
      rate: 1.5,
      velocity: Vector.fromAngle(0, 0.8),
      sizeMin: 0.5,
      sizeMax: 2,
      particleLife: 300,
      fadeTime: 100,
      glow: false,
      trail: true,
      trailLength: 4,
      trailFade: 0.6,
      trailShrink: 0.5,
      colors: mutedRiverColors,
    });
    const riverEmitter = new Emitter({
      point: new Vector(0, dividerY),
      ...riverConfig,
      spawnWidth: 0,
      spawnHeight: 20 / pr,
      icons: [],
    });
    controller.engine.addEmitter(riverEmitter);
    riverEmitter.isEmitting = true;
    riverEmitter.emit();

    // S-curve attractors — strong enough to carry particles across horizontally
    const curve = [
      { x: 0.20, y: dividerY - 12 / pr },
      { x: 0.40, y: dividerY + 12 / pr },
      { x: 0.60, y: dividerY - 12 / pr },
      { x: 0.80, y: dividerY + 12 / pr },
    ];
    for (const pt of curve) {
      controller.addAttractor({
        x: w * pt.x,
        y: pt.y,
        strength: 0.2,
        radius: w * 0.35,
      });
    }

    // Edge repulsors to keep river in a horizontal band
    for (let fx = 0.1; fx <= 0.9; fx += 0.2) {
      controller.addAttractor({ x: w * fx, y: dividerY - 45 / pr, strength: -0.25, radius: 40 / pr });
      controller.addAttractor({ x: w * fx, y: dividerY + 45 / pr, strength: -0.25, radius: 40 / pr });
    }

    // Subtle mouse push on river particles
    controller.addMouseForce({ track: true, strength: 1.5, radius: 60 });

    return () => {
      controller.destroy();
      riverControllerRef.current = null;
    };
  }, []);

  // Fireworks — separate non-continuous controller, triggered by scroll
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: 'fireworksShow',
      config: { maxCount: 500, continuous: false },
      renderer: 'webgl',
      autoResize: true,
    });

    fireworksControllerRef.current = controller;

    const onScroll = () => {
      if (firedFireworksRef.current) return;

      const scrollBottom = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= totalHeight - 150) {
        firedFireworksRef.current = true;

        const pr = controller.engine.pixelRatio;
        const w = container.clientWidth / pr;
        const h = container.clientHeight / pr;

        // Gentle fireworks — one rocket at a time, relaxed pacing
        const fwConfig = configureParticle({
          ...presets.Ambient.fireworksShow,
          rate: 1,
          life: 2,
        });
        const positions = [0.35, 0.55, 0.7];

        positions.forEach((xFrac, i) => {
          setTimeout(() => {
            const emitter = new Emitter({
              point: new Vector(w * xFrac, h),
              ...fwConfig,
              spawnWidth: w * 0.08,
              spawnHeight: 0,
              icons: [],
            });
            controller.engine.addEmitter(emitter);
            emitter.isEmitting = true;
            emitter.emit();
          }, i * 800);
        });

        // Allow re-triggering after cooldown
        setTimeout(() => {
          firedFireworksRef.current = false;
        }, 8000);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      controller.destroy();
      fireworksControllerRef.current = null;
    };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'e' || e.key === 'E') {
      textControllerRef.current?.scatter({ velocity: 12 });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const features = [
    { icon: '\u26A1', title: 'Lightning Fast', body: 'WebGL2 instanced rendering pushes thousands of particles at 60fps.' },
    { icon: '\uD83C\uDFA8', title: 'Beautiful Defaults', body: 'Curated presets that look stunning out of the box.' },
    { icon: '\uD83D\uDD27', title: 'Fully Configurable', body: 'Every parameter is tunable. Physics, visuals, timing.' },
    { icon: '\uD83D\uDCE6', title: 'Tiny Bundle', body: 'Tree-shakeable ESM with zero runtime dependencies.' },
    { icon: '\uD83C\uDF10', title: 'Container Aware', body: 'Fill the viewport or live inside any HTML element.' },
    { icon: '\uD83E\uDDF2', title: 'Force Fields', body: 'Attractors, mouse forces, and element boundaries.' },
  ];

  const steps = [
    { num: '01', title: 'Install', body: 'npm install particular \u2014 zero dependencies, tree-shakeable.' },
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
      {/* Snow canvas — container-aware, scrolls with page */}
      <canvas ref={snowCanvasRef} style={particlesContainerLayerStyle} />

      {/* Text particles canvas — container-aware, scrolls with page */}
      <canvas ref={textCanvasRef} style={particlesContainerLayerStyle} />

      {/* River canvas — continuous flow between sections */}
      <canvas ref={riverCanvasRef} style={particlesContainerLayerStyle} />

      {/* Fireworks canvas — triggered on scroll to bottom */}
      <canvas ref={fireworksCanvasRef} style={particlesContainerLayerStyle} />

      {/* Hero — text particles render at ~38% viewport height, subtitle sits below */}
      <section
        className="showcase-hero-section"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ paddingTop: '58vh' }}>
          <p
            style={{
              ...sectionSubStyle,
              fontSize: '1.1rem',
              margin: '0 auto 20px',
            }}
          >
            A particle engine for the modern web.
            <br />
            Beautiful defaults, zero config, endless possibilities.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
            Touch or move mouse to push particles
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
          Scroll down
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="showcase-section-heading" style={sectionHeadingStyle}>Why Particular?</h2>
          <p style={{ ...sectionSubStyle, margin: '0 auto' }}>
            Everything you need for production-quality particle effects.
          </p>
        </div>
        <div className="showcase-features-grid">
          {features.map((feat, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{feat.icon}</div>
              <div style={headingStyle}>{feat.title}</div>
              <div style={bodyStyle}>{feat.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* River divider — invisible element that marks the Y position for the river */}
      <div ref={riverDividerRef} style={{ height: 1 }} />

      {/* CTA Banner */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div
          ref={setCardRef(cardIndex++)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '48px 32px',
            textAlign: 'center',
            margin: '0 auto',
            maxWidth: 700,
          }}
        >
          <h2 className="showcase-section-heading" style={{ ...sectionHeadingStyle, fontSize: '1.5rem' }}>
            Ready to add particles to your project?
          </h2>
          <p style={{ ...sectionSubStyle, margin: '0 auto 24px' }}>
            Get started in under a minute with our React hooks or vanilla API.
          </p>
          <div
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'rgba(116, 192, 252, 0.12)',
              border: '1px solid rgba(116, 192, 252, 0.25)',
              borderRadius: 10,
              color: '#74c0fc',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            npm install particular
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="showcase-section-heading" style={sectionHeadingStyle}>Three Steps</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, pointerEvents: 'none' }}>
          {steps.map((step, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(116, 192, 252, 0.35)', flexShrink: 0, width: 56, textAlign: 'center' }}>
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

      {/* Footer */}
      <section
        ref={footerRef}
        style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.85rem' }}>
          Particles flow around every element on this page.
        </p>
      </section>
    </div>
  );
};

/* ─── Meta ─── */

const meta: Meta = {
  title: 'Showcase',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const Showcase: Story = {
  render: () => <WelcomeDemo />,
};
