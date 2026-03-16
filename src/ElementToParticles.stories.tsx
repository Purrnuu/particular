import React, { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles } from './index';
import type { ParticlesController } from './index';
import { particlesContainerLayerStyle } from './particular/canvasStyles';

/* ─── Args ─── */

interface ElementStoryArgs {
  resolution: number;
  particleShape: 'circle' | 'square' | 'triangle' | 'star' | 'sparkle';
}

/* ─── Element to Particles Demo ─── */

const ElementDemo: React.FC<ElementStoryArgs> = ({ resolution, particleShape }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);
  const [dissolved, setDissolved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: 'imageShape',
      renderer: 'webgl',
      autoResize: true,
      mouseForce: { strength: 2, radius: 60 },
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
      setDissolved(new Set());
    };
  }, []);

  const dissolveElement = (id: string) => {
    const controller = controllerRef.current;
    const container = containerRef.current;
    if (!controller || !container) return;

    const el = container.querySelector(`[data-particle-id="${id}"]`) as HTMLElement;
    if (!el) return;

    controller.elementToParticles(el, {
      resolution,
      shape: particleShape,
      intro: { mode: 'ripple', duration: 600 },
    });
    setDissolved((prev) => new Set(prev).add(id));
  };

  const dissolveAll = () => {
    const controller = controllerRef.current;
    const container = containerRef.current;
    if (!controller || !container) return;

    const els = container.querySelectorAll('[data-particle-id]');
    els.forEach((el, i) => {
      const id = el.getAttribute('data-particle-id');
      if (id && !dissolved.has(id)) {
        setTimeout(() => dissolveElement(id), i * 200);
      }
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0f0f23',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <canvas ref={canvasRef} style={particlesContainerLayerStyle} />

      <div style={{ padding: '60px 40px', maxWidth: 800, margin: '0 auto' }}>
        <h1
          data-particle-id="heading"
          onClick={() => dissolveElement('heading')}
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#e2e8f0',
            cursor: 'pointer',
            margin: '0 0 12px 0',
            lineHeight: 1.2,
          }}
        >
          Dissolve{' '}
          <span style={{ color: '#ff6b6b' }}>any</span>{' '}
          HTML into{' '}
          <span style={{
            background: 'linear-gradient(135deg, #feca57, #48dbfb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>particles</span>
        </h1>

        <p
          data-particle-id="subtitle"
          onClick={() => dissolveElement('subtitle')}
          style={{
            fontSize: 18,
            color: '#8892b0',
            lineHeight: 1.6,
            margin: '0 0 40px 0',
            cursor: 'pointer',
          }}
        >
          Click any element to dissolve it. Words with{' '}
          <span style={{ color: '#ff9ff3', fontWeight: 600 }}>different</span>{' '}
          <span style={{ color: '#48dbfb', fontWeight: 600 }}>colors</span>{' '}
          and <span style={{ fontStyle: 'italic', color: '#feca57' }}>styles</span>{' '}
          are captured faithfully.
        </p>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
          <div
            data-particle-id="card1"
            onClick={() => dissolveElement('card1')}
            style={{
              flex: '1 1 200px',
              padding: '24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Gradient Card</h3>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
              CSS gradients are captured pixel-perfect.
            </p>
          </div>

          <div
            data-particle-id="card2"
            onClick={() => dissolveElement('card2')}
            style={{
              flex: '1 1 200px',
              padding: '24px',
              borderRadius: 12,
              background: '#1a1a3e',
              border: '2px solid #48dbfb',
              color: '#48dbfb',
              cursor: 'pointer',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Bordered Card</h3>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
              Borders, shadows, and complex layouts work too.
            </p>
          </div>

          <div
            data-particle-id="card3"
            onClick={() => dissolveElement('card3')}
            style={{
              flex: '1 1 200px',
              padding: '24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Pink Card</h3>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
              Any styled HTML element can be dissolved.
            </p>
          </div>
        </div>

        <button
          onClick={dissolveAll}
          style={{
            padding: '12px 32px',
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
            color: '#1a1a2e',
            cursor: 'pointer',
          }}
        >
          Dissolve Everything
        </button>

        <p
          style={{
            marginTop: 40,
            fontSize: 13,
            color: '#4a5568',
            textAlign: 'center',
          }}
        >
          Move mouse to push particles &middot; Click individual elements or use the button
        </p>
      </div>
    </div>
  );
};

/* ─── Meta ─── */

const meta: Meta<ElementStoryArgs> = {
  title: 'Particular/Element to Particles',
  argTypes: {
    resolution: {
      control: { type: 'number', min: 50, max: 1000, step: 50 },
      description: 'Particle grid resolution (particles along longest axis). Higher = more detail, more particles.',
      table: { category: 'Image' },
    },
    particleShape: {
      control: 'radio',
      options: ['circle', 'square', 'triangle', 'star', 'sparkle'],
      description: 'Shape of individual particles',
      table: { category: 'Image' },
    },
  },
  args: {
    resolution: 300,
    particleShape: 'triangle',
  },
};

export default meta;
type Story = StoryObj<ElementStoryArgs>;

export const ElementDissolve: Story = {
  render: (args) => <ElementDemo {...args} />,
};
