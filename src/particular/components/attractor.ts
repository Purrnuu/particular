import Vector from '../utils/vector';
import type { AttractorConfig, ParticleShape, BlendMode } from '../types';
import type Particle from './particle';

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
    this.position = new Vector(config.x, config.y);
    this.strength = config.strength ?? 1;
    this.radius = config.radius ?? 200;

    // Visual properties
    this.visible = config.visible ?? false;
    this.icon = config.icon ?? null;
    this.size = config.size ?? 12;
    this.color = config.color ?? '#74c0fc';
    this.shape = config.shape ?? 'circle';
    this.glow = config.glow ?? false;
    this.glowSize = config.glowSize ?? 10;
    this.glowColor = config.glowColor ?? '#74c0fc';
    this.glowAlpha = config.glowAlpha ?? 0.35;

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
    const force = new Vector(this.position.x, this.position.y);
    force.subtract(particlePosition);

    const dist = force.getMagnitude();
    if (dist === 0 || dist > this.radius) {
      return new Vector(0, 0);
    }

    force.normalize();
    const falloff = 1 - dist / this.radius;
    force.scale(this.strength * falloff);

    return force;
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
