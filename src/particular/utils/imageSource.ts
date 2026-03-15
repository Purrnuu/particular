import type { TextImageConfig } from '../types';

const defaultGradientStops = [
  { offset: 0, color: '#ff6b6b' },
  { offset: 0.3, color: '#feca57' },
  { offset: 0.5, color: '#48dbfb' },
  { offset: 0.7, color: '#ff9ff3' },
  { offset: 1, color: '#54a0ff' },
];

/**
 * Render a text string to an offscreen canvas.
 * Returns a canvas that can be converted to a data URL for imageToParticles().
 */
export function createTextImage(config: TextImageConfig): HTMLCanvasElement {
  const {
    text,
    fontSize = 200,
    fontFamily = 'system-ui, -apple-system, sans-serif',
    fontWeight = 'bold',
    fill,
  } = config;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  canvas.width = Math.ceil(metrics.width) + 4;
  canvas.height = Math.ceil(fontSize * 1.3);
  // Re-set font after canvas resize
  ctx.font = font;
  ctx.textBaseline = 'top';

  if (typeof fill === 'string') {
    ctx.fillStyle = fill;
  } else {
    const stops = fill ?? defaultGradientStops;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    for (const stop of stops) {
      gradient.addColorStop(stop.offset, stop.color);
    }
    ctx.fillStyle = gradient;
  }
  ctx.fillText(text, 2, fontSize * 0.12);
  return canvas;
}

/**
 * Render a heart shape to an offscreen canvas.
 */
export function createHeartImage(size = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(
    size * 0.5, size * 0.4, size * 0.05,
    size * 0.5, size * 0.5, size * 0.5,
  );
  gradient.addColorStop(0, '#ff4757');
  gradient.addColorStop(0.4, '#ff6b81');
  gradient.addColorStop(0.7, '#ee5a24');
  gradient.addColorStop(1, '#c44569');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  const cx = size / 2;
  const cy = size / 2;
  const s = size * 0.28;
  ctx.moveTo(cx, cy + s * 0.7);
  ctx.bezierCurveTo(cx - s * 2, cy - s * 0.6, cx - s * 1.2, cy - s * 2, cx, cy - s * 0.8);
  ctx.bezierCurveTo(cx + s * 1.2, cy - s * 2, cx + s * 2, cy - s * 0.6, cx, cy + s * 0.7);
  ctx.closePath();
  ctx.fill();
  return canvas;
}

/**
 * Convert a canvas element to a data URL for use as an image source.
 */
export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}
