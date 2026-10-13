import { vi } from 'vitest';

export function mockBrowser() {
  const context = new Proxy(
    {
      getImageData: (_x: number, _y: number, w: number, h: number) => ({
        data: new Uint8ClampedArray(w * h * 4).fill(255),
      }),
    },
    {
      get: (target, key) => (key in target ? target[key as keyof typeof target] : vi.fn()),
    }
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(((type: string) =>
    type === '2d' ? context : null) as typeof HTMLCanvasElement.prototype.getContext);
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1)
  );
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnect;
    }
  );
  return { disconnect };
}

export function mockImage(complete = true): HTMLImageElement {
  const image = new Image();
  Object.defineProperties(image, {
    complete: { value: complete, configurable: true },
    naturalWidth: { value: 4 },
    naturalHeight: { value: 4 },
  });
  return image;
}
