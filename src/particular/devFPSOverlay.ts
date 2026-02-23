/**
 * Development aid: shows a small on-screen FPS (and optional particle count)
 * to help debug effect density and rendering performance.
 *
 * Usage:
 *   const { destroy } = showFPSOverlay({
 *     getParticleCount: () => controller.engine.getCount(),
 *   });
 *   // later: destroy();
 */

const SMOOTHING_SAMPLES = 20;
const DEFAULT_STYLE = {
  position: 'fixed',
  top: '8px',
  right: '8px',
  padding: '6px 10px',
  fontFamily: 'ui-monospace, monospace',
  fontSize: '12px',
  lineHeight: '1.4',
  color: '#e0e0e0',
  backgroundColor: 'rgba(0,0,0,0.75)',
  borderRadius: '6px',
  pointerEvents: 'none' as const,
  zIndex: '2147483647',
  userSelect: 'none' as const,
} satisfies Partial<CSSStyleDeclaration>;

export interface FPSOverlayOptions {
  /** Parent element; defaults to document.body */
  container?: HTMLElement;
  /** Called each frame to show particle count (e.g. () => engine.getCount()) */
  getParticleCount?: () => number;
  /** Number of frame-time samples for smoothing (default 20) */
  smoothing?: number;
}

export interface FPSOverlayController {
  destroy: () => void;
}

export function showFPSOverlay(options: FPSOverlayOptions = {}): FPSOverlayController {
  const {
    container = document.body,
    getParticleCount,
    smoothing = SMOOTHING_SAMPLES,
  } = options;

  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, DEFAULT_STYLE);
  container.appendChild(el);

  const samples: number[] = [];
  let lastTime = performance.now();
  let rafId: number | null = null;

  const tick = (): void => {
    rafId = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = now - lastTime;
    lastTime = now;

    if (dt > 0) {
      samples.push(dt);
      if (samples.length > smoothing) samples.shift();
    }

    const avgMs = samples.length
      ? samples.reduce((a, b) => a + b, 0) / samples.length
      : 0;
    const fps = avgMs > 0 ? Math.round(1000 / avgMs) : 0;

    const parts = [`FPS: ${fps}`];
    if (getParticleCount) {
      try {
        const count = getParticleCount();
        parts.push(`Particles: ${count}`);
      } catch {
        parts.push('Particles: —');
      }
    }

    el.textContent = parts.join('  ·  ');
  };

  rafId = requestAnimationFrame(tick);

  return {
    destroy() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.remove();
    },
  };
}
