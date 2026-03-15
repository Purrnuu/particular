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
 * Render a plush heart shape to an offscreen canvas.
 * Uses parametric curve for guaranteed fat, symmetrical lobes.
 * Layered radial gradients for depth, rim light, and specular highlights.
 */
export function createHeartImage(size = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Parametric heart curve — produces reliably round, plump lobes
  const heartPath = () => {
    const steps = 200;
    const cx = size * 0.5;
    const cy = size * 0.48;
    const scale = size * 0.27;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      // Parametric heart: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const px = cx + hx * scale / 16;
      const py = cy + hy * scale / 16;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };

  // Layer 1: Main body — warm radial gradient, light source top-left
  const bodyGrad = ctx.createRadialGradient(
    size * 0.42, size * 0.36, size * 0.03,
    size * 0.50, size * 0.50, size * 0.42,
  );
  bodyGrad.addColorStop(0, '#ff7e95');
  bodyGrad.addColorStop(0.2, '#ff4d6d');
  bodyGrad.addColorStop(0.45, '#e63356');
  bodyGrad.addColorStop(0.7, '#c41e3a');
  bodyGrad.addColorStop(0.9, '#9b1230');
  bodyGrad.addColorStop(1, '#6e0a22');

  heartPath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // All subsequent layers clipped to heart shape
  ctx.save();
  heartPath();
  ctx.clip();

  // Layer 2: Bottom-edge darkening for grounding / 3D depth
  const bottomDark = ctx.createLinearGradient(0, size * 0.5, 0, size * 0.85);
  bottomDark.addColorStop(0, 'rgba(60, 5, 15, 0)');
  bottomDark.addColorStop(0.6, 'rgba(60, 5, 15, 0.2)');
  bottomDark.addColorStop(1, 'rgba(40, 0, 10, 0.45)');
  ctx.fillStyle = bottomDark;
  ctx.fillRect(0, 0, size, size);

  // Layer 3: Rim light — soft warm glow along top edge
  const rimGrad = ctx.createLinearGradient(0, size * 0.12, 0, size * 0.42);
  rimGrad.addColorStop(0, 'rgba(255, 180, 190, 0.35)');
  rimGrad.addColorStop(0.5, 'rgba(255, 120, 140, 0.1)');
  rimGrad.addColorStop(1, 'rgba(255, 80, 100, 0)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 0, size, size);

  // Layer 4: Primary specular — large soft highlight on left lobe
  const hl1 = ctx.createRadialGradient(
    size * 0.34, size * 0.32, size * 0.01,
    size * 0.37, size * 0.36, size * 0.16,
  );
  hl1.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
  hl1.addColorStop(0.25, 'rgba(255, 220, 225, 0.45)');
  hl1.addColorStop(0.6, 'rgba(255, 160, 175, 0.12)');
  hl1.addColorStop(1, 'rgba(255, 100, 120, 0)');
  ctx.fillStyle = hl1;
  ctx.fillRect(0, 0, size, size);

  // Layer 5: Secondary specular — smaller, sharper highlight on right lobe
  const hl2 = ctx.createRadialGradient(
    size * 0.61, size * 0.31, size * 0.005,
    size * 0.62, size * 0.33, size * 0.09,
  );
  hl2.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  hl2.addColorStop(0.35, 'rgba(255, 210, 215, 0.2)');
  hl2.addColorStop(1, 'rgba(255, 150, 160, 0)');
  ctx.fillStyle = hl2;
  ctx.fillRect(0, 0, size, size);

  // Layer 6: Subtle center glow for warmth
  const centerGlow = ctx.createRadialGradient(
    size * 0.48, size * 0.42, size * 0.01,
    size * 0.48, size * 0.44, size * 0.2,
  );
  centerGlow.addColorStop(0, 'rgba(255, 130, 150, 0.2)');
  centerGlow.addColorStop(1, 'rgba(255, 80, 100, 0)');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();

  return canvas;
}

/**
 * Convert a canvas element to a data URL for use as an image source.
 */
export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}
