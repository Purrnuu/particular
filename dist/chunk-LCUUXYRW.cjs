'use strict';

// src/particular/devFPSOverlay.ts
var SMOOTHING_SAMPLES = 20;
var DEFAULT_STYLE = {
  position: "fixed",
  top: "8px",
  right: "8px",
  padding: "6px 10px",
  fontFamily: "ui-monospace, monospace",
  fontSize: "12px",
  lineHeight: "1.4",
  color: "#e0e0e0",
  backgroundColor: "rgba(0,0,0,0.75)",
  borderRadius: "6px",
  pointerEvents: "none",
  zIndex: "2147483647",
  userSelect: "none"
};
function showFPSOverlay(options = {}) {
  const {
    container = document.body,
    getParticleCount,
    smoothing = SMOOTHING_SAMPLES
  } = options;
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, DEFAULT_STYLE);
  container.appendChild(el);
  const samples = [];
  let lastTime = performance.now();
  let rafId = null;
  const tick = () => {
    rafId = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = now - lastTime;
    lastTime = now;
    if (dt > 0) {
      samples.push(dt);
      if (samples.length > smoothing) samples.shift();
    }
    const avgMs = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
    const fps = avgMs > 0 ? Math.round(1e3 / avgMs) : 0;
    const parts = [`FPS: ${fps}`];
    if (getParticleCount) {
      try {
        const count = getParticleCount();
        parts.push(`Particles: ${count}`);
      } catch {
        parts.push("Particles: \u2014");
      }
    }
    el.textContent = parts.join("  \xB7  ");
  };
  rafId = requestAnimationFrame(tick);
  return {
    destroy() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.remove();
    }
  };
}

exports.showFPSOverlay = showFPSOverlay;
//# sourceMappingURL=chunk-LCUUXYRW.cjs.map
//# sourceMappingURL=chunk-LCUUXYRW.cjs.map