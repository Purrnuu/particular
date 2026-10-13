import { readFileSync, cpSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', process.env.PARTICULAR_TEST_DIST ?? '.build/lib');

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

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1)
  );
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

    window.eval(
      `${script}\nwindow.Particular = typeof Particular !== 'undefined' ? Particular : window.Particular;`
    );

    const api = (window as typeof window & { Particular?: any }).Particular;
    expect(api).toBeDefined();
    expect(typeof api.Particular).toBe('function');
    expect(typeof api.Emitter).toBe('function');
    expect(typeof api.Vector).toBe('function');
    expect(typeof api.createParticles).toBe('function');
    const predator = new api.MouseForce({ mode: 'repel', x: 100, y: 100, strength: 2, radius: 100 });
    expect(predator.getForce(new api.Vector(120, 100)).x).toBeGreaterThan(0);

    const canvas = document.createElement('canvas');
    const controller = api.createParticles({
      canvas,
      preset: 'sparkles',
      renderer: 'canvas',
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
        renderer: 'canvas',
        config: { rate: 4, life: 10, maxCount: 100 },
      });

      return React.createElement(
        React.Fragment,
        null,
        React.createElement('canvas', { ref: canvasRef, className: 'particular' }),
        React.createElement('button', { onClick: burstFromEvent }, 'burst')
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

describe('package entry boundaries', () => {
  it('loads vanilla, core, renderers, and image helpers without React installed', () => {
    const isolated = mkdtempSync(path.join(tmpdir(), 'particular-package-'));
    try {
      cpSync(distDir, path.join(isolated, 'dist'), { recursive: true });
      writeFileSync(
        path.join(isolated, 'package.json'),
        readFileSync(path.resolve(__dirname, '../package.json'))
      );
      const result = execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `
        import { createRequire } from 'node:module';
        const require = createRequire(process.cwd() + '/package.json');
        try { require.resolve('react'); throw new Error('React unexpectedly available'); }
        catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
        const modules = ['vanilla', 'core', 'renderers/canvas', 'renderers/webgl', 'renderers/webgl3d', 'effects/images'];
        for (const entry of modules) {
          const api = await import('@purrnuu/particular/' + entry);
          const cjs = require('@purrnuu/particular/' + entry);
          if (!Object.keys(api).length || !Object.keys(cjs).length) throw new Error('Empty entry: ' + entry);
        }
        console.log('entry boundaries OK');
      `,
        ],
        { cwd: isolated, encoding: 'utf8' }
      );
      expect(result.trim()).toBe('entry boundaries OK');
      writeFileSync(
        path.join(isolated, 'consumer.ts'),
        `
        import { createParticles, type CanvasLayerStyle } from '@purrnuu/particular/vanilla';
        import { Particular, Vector, configureParticular, createFeatureContext } from '@purrnuu/particular/core';
        import { CanvasRenderer } from '@purrnuu/particular/renderers/canvas';
        import { createImageParticles } from '@purrnuu/particular/effects/images';
        const engine = new Particular();
        const config = configureParticular({ rate: 1 });
        engine.initialize(config);
        engine.addRenderer(new CanvasRenderer(document.createElement('canvas')));
        const images = createImageParticles(createFeatureContext(engine, config));
        const particles = createParticles();
        particles.addForce({ getForce: () => new Vector(1, 0), update: (frame) => { void frame.dt; } });
        const style: CanvasLayerStyle = { position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' };
        void images; void style;
      `
      );
      writeFileSync(
        path.join(isolated, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            noEmit: true,
            strict: true,
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            target: 'ES2020',
            lib: ['ES2020', 'DOM'],
            types: [],
          },
          include: ['consumer.ts'],
        })
      );
      execFileSync(
        process.execPath,
        [
          path.resolve(__dirname, '../node_modules/typescript/bin/tsc'),
          '-p',
          path.join(isolated, 'tsconfig.json'),
        ],
        { cwd: isolated, encoding: 'utf8' }
      );
    } finally {
      rmSync(isolated, { recursive: true, force: true });
    }
  });
});
