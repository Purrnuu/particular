import type { CSSProperties } from 'react';

const DEFAULT_Z_INDEX = 10000;

/**
 * Recommended inline style for a full-viewport, click-through particle canvas
 * so particles render on top of the page without blocking clicks or other interaction.
 * Use with useParticles (spread as canvasStyle) or with a vanilla canvas element.
 */
export const particlesBackgroundLayerStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: DEFAULT_Z_INDEX,
};

export function getParticlesBackgroundLayerStyle(zIndex?: number): CSSProperties {
  return zIndex !== undefined
    ? { ...particlesBackgroundLayerStyle, zIndex }
    : particlesBackgroundLayerStyle;
}

export { DEFAULT_Z_INDEX as particlesDefaultZIndex };
