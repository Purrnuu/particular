import Vector from '../utils/vector';
import type { AttractorConfig, ParticleShape, BlendMode } from '../types';
import { defaultAttractor } from '../core/defaults';
import type Particle from './particle';

// Reusable force vector — safe because getForce result is consumed immediately by velocity.add()
const _tempForce = new Vector(0, 0);

export default class Attractor {
  position: Vector;
  strength: number;
  radius: number;

  // Visual properties
  visible: boolean;
  icon: string | HTMLImageElement | null;
  size: number;
  color: string;
  shape: ParticleShape;
  glow: boolean;
  glowSize: number;
  glowColor: string;
  glowAlpha: number;

  private _resolvedImage: HTMLImageElement | null = null;

  constructor(config: AttractorConfig) {
    const merged = { ...defaultAttractor, ...config };
    this.position = new Vector(merged.x, merged.y);
    this.strength = merged.strength;
    this.radius = merged.radius;

    // Visual properties
    this.visible = merged.visible;
    this.icon = config.icon ?? null;
    this.size = merged.size;
    this.color = merged.color;
    this.shape = merged.shape;
    this.glow = merged.glow;
    this.glowSize = merged.glowSize;
    this.glowColor = merged.glowColor;
    this.glowAlpha = merged.glowAlpha;

    // Resolve string icon to HTMLImageElement
    if (typeof this.icon === 'string') {
      const img = new Image();
      img.src = this.icon;
      this._resolvedImage = img;
    } else if (this.icon instanceof HTMLImageElement) {
      this._resolvedImage = this.icon;
    }
  }

  getForce(particlePosition: Vector): Vector {
    const dx = this.position.x - particlePosition.x;
    const dy = this.position.y - particlePosition.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0 || dist > this.radius) {
      _tempForce.x = 0;
      _tempForce.y = 0;
      return _tempForce;
    }

    // Combine normalize + scale: (dx/dist) * strength * falloff
    const scale = this.strength * (1 - dist / this.radius) / dist;
    _tempForce.x = dx * scale;
    _tempForce.y = dy * scale;
    return _tempForce;
  }

  /** Returns a lightweight Particle-compatible object for use by renderers. */
  toDrawable(): Particle {
    const image = this._resolvedImage;
    return {
      position: this.position,
      factoredSize: this.size,
      rotation: 0,
      alpha: 1,
      color: this.color,
      shape: this.shape,
      blendMode: 'normal' as BlendMode,
      glow: this.glow,
      glowSize: this.glowSize,
      glowColor: this.glowColor,
      glowAlpha: this.glowAlpha,
      shadow: false,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: '#000000',
      shadowAlpha: 0,
      shadowLightOrigin: this.position,
      image: image,
      imageTint: false,
      trail: false,
      trailSegments: [],
      trailLength: 0,
      getRoundedLocation: () => [
        ((this.position.x * 10) << 0) * 0.1,
        ((this.position.y * 10) << 0) * 0.1,
      ] as [number, number],
    } as unknown as Particle;
  }
}
