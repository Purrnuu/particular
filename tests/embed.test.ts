import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

function createMockCanvasContext(): Partial<CanvasRenderingContext2D> {
  return {
    scale: vi.fn(),
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    globalCompositeOperation: 'source-over',
    globalAlpha: 1,
    shadowBlur: 0,
    shadowColor: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    imageSmoothingEnabled: true,
  };
}

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: vi.fn(() => createMockCanvasContext()),
  });

  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('built standalone embed', () => {
  it('exposes browser global and runs emitter pipeline', () => {
    const iifePath = path.resolve(distDir, 'particular.global.js');
    const script = readFileSync(iifePath, 'utf8');

    window.eval(`${script}\nwindow.Particular = typeof Particular !== 'undefined' ? Particular : window.Particular;`);

    const api = (window as typeof window & { Particular?: any }).Particular;
    expect(api).toBeDefined();
    expect(typeof api.Particular).toBe('function');
    expect(typeof api.Emitter).toBe('function');
    expect(typeof api.Vector).toBe('function');
    expect(typeof api.createParticles).toBe('function');

    const canvas = document.createElement('canvas');
    const controller = api.createParticles({
      canvas,
      preset: 'sparkles',
      autoResize: false,
    });
    const emitter = controller.burst({
      x: 100,
      y: 100,
    });

    expect(emitter.particles.length).toBeGreaterThan(0);
    controller.destroy();
  });
});

describe('built react embed', () => {
  it('mounts hook-based component and emits particles', async () => {
    const moduleUrl = pathToFileURL(path.resolve(distDir, 'index.js')).href;
    const lib = await import(moduleUrl);

    const HookDemo = () => {
      const { canvasRef, burstFromEvent } = lib.useParticles({
        preset: 'sparkles',
        config: { rate: 4, life: 10, maxCount: 100 },
      });

      return React.createElement(
        React.Fragment,
        null,
        React.createElement('canvas', { ref: canvasRef, className: 'particular' }),
        React.createElement('button', { onClick: burstFromEvent }, 'burst'),
      );
    };

    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(HookDemo));
    });

    expect(document.querySelector('canvas.particular')).not.toBeNull();
    expect(container.querySelector('button')).not.toBeNull();

    await act(async () => {
      container
        .querySelector('button')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 40, clientY: 40 }));
    });

    await act(async () => {
      root.unmount();
    });
  });
});
