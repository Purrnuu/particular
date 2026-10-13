import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useParticles, type UseParticlesResult } from '../src/particular/useParticles';
import type Emitter from '../src/particular/components/emitter';
import WebGLRenderer from '../src/particular/renderers/webglRenderer';
import { mockBrowser, mockImage } from './helpers/browser';

let root: Root;
let latest: UseParticlesResult;
function Demo({ rate = 2, renderer = 'canvas' }: { rate?: number; renderer?: 'canvas' | 'webgl' }) {
  latest = useParticles({ renderer, autoResize: false, config: { rate, colors: ['#ff0000'] } });
  return <canvas key={latest.canvasKey} ref={latest.canvasRef} />;
}

beforeEach(() => {
  mockBrowser();
  const container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('React adapter', () => {
  it('remounts the canvas when switching an already-locked rendering context', async () => {
    const locked = new WeakSet<HTMLCanvasElement>();
    const context = vi.mocked(HTMLCanvasElement.prototype.getContext).getMockImplementation()!;
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockImplementation(function (
      this: HTMLCanvasElement,
      type: string
    ) {
      if (locked.has(this) && type === '2d') return null;
      return context.call(this, type);
    } as typeof HTMLCanvasElement.prototype.getContext);
    vi.spyOn(WebGLRenderer.prototype, 'init').mockImplementation(function () {
      locked.add((this as unknown as { target: HTMLCanvasElement }).target);
    });
    await act(async () => root.render(<Demo renderer="webgl" />));
    const firstCanvas = latest.canvasRef.current;
    await act(async () => root.render(<Demo renderer="canvas" />));
    expect(latest.canvasRef.current).not.toBe(firstCanvas);
    expect(latest.controller!.engine.isDestroyed).toBe(false);
  });
  it('publishes a reactive controller after mounting', async () => {
    await act(async () => root.render(<Demo />));
    expect(latest.controller).not.toBeNull();
    expect(latest.controller!.engine.isDestroyed).toBe(false);
  });

  it('preserves particles for equivalent inline configs on rerender', async () => {
    await act(async () => root.render(<Demo />));
    const controller = latest.controller!;
    controller.burst({ x: 20, y: 20 });
    await act(async () => root.render(<Demo />));
    expect(latest.controller).toBe(controller);
    expect(controller.engine.getCount()).toBeGreaterThan(0);
  });

  it('recreates the engine when configuration values change', async () => {
    await act(async () => root.render(<Demo />));
    const controller = latest.controller!;
    await act(async () => root.render(<Demo rate={3} />));
    expect(latest.controller).not.toBe(controller);
    expect(controller.engine.isDestroyed).toBe(true);
  });

  it('returns asynchronous results and propagates rejection', async () => {
    await act(async () => root.render(<Demo />));
    const controller = latest.controller!;
    const emitter = {} as Emitter;
    const spy = vi.spyOn(controller, 'imageToParticles').mockResolvedValue(emitter);
    await expect(latest.imageToParticles({ image: mockImage() })).resolves.toBe(emitter);
    spy.mockRejectedValue(new Error('load failed'));
    await expect(latest.imageToParticles({ image: mockImage() })).rejects.toThrow('load failed');
  });

  it('survives StrictMode mount-cleanup-remount and cancels pending work on unmount', async () => {
    await act(async () =>
      root.render(
        <React.StrictMode>
          <Demo />
        </React.StrictMode>
      )
    );
    const controller = latest.controller!;
    expect(controller.engine.isDestroyed).toBe(false);
    const pending = latest.imageToParticles({ image: mockImage(false) });
    const rejection = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    await act(async () => root.unmount());
    await rejection;
    expect(controller.engine.isDestroyed).toBe(true);
  });
});
