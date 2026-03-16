import { degToRad } from '../utils/math';
import type Particular from '../core/particular';
import type Particle from '../components/particle';

interface StrokeConfig {
  color: string;
  thickness: number;
}

export default class CanvasRenderer {
  target: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  name = 'CanvasRenderer';
  particular: Particular | null = null;
  pixelRatio = 2;
  stroke?: StrokeConfig;

  constructor(target: HTMLCanvasElement) {
    this.target = target;
    const context = this.target.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.context = context;
  }

  init(particular: Particular, pixelRatio: number): void {
    this.particular = particular;
    this.pixelRatio = pixelRatio;
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.context.imageSmoothingEnabled = true;

    particular.addEventListener('UPDATE', this.onUpdate);
    particular.addEventListener('UPDATE_AFTER', this.onUpdateAfter);
    particular.addEventListener('RESIZE', this.resize);

    particular.addEventListener('PARTICLE_CREATED', this.onParticleCreated);
    particular.addEventListener('PARTICLE_UPDATE', this.onParticleUpdated);
    particular.addEventListener('PARTICLE_DEAD', this.onParticleDead);
  }

  resize = (args?: { width: number; height: number }): void => {
    if (!args) return;
    const { width, height } = args;
    this.target.width = width;
    this.target.height = height;
  };

  onUpdate = (): void => {
    this.context.save();
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.context.clearRect(0, 0, this.target.width, this.target.height);
  };

  onUpdateAfter = (): void => {
    // Draw visible attractors on top of particles
    if (this.particular) {
      for (const attractor of this.particular.attractors) {
        if (!attractor.visible) continue;
        const drawable = attractor.toDrawable();
        if (drawable.image && drawable.image instanceof Image) {
          this.drawImage(drawable);
        } else {
          this.drawBasicElement(drawable);
        }
      }
    }
    this.context.restore();
  };

  onParticleCreated = (): void => {
    // Can be used for particle creation effects
  };

  onParticleUpdated = (particle?: Particle): void => {
    if (!particle) return;

    this.drawTrails(particle);

    if (particle.image) {
      if (particle.image instanceof Image) {
        this.drawImage(particle);
      }
    } else {
      this.drawBasicElement(particle);
    }
  };

  onParticleDead = (particle?: Particle): void => {
    if (particle) {
      particle.resetImage();
    }
  };

  drawImage(particle: Particle): void {
    if (!particle.image || !(particle.image instanceof Image)) return;

    this.context.save();
    this.context.globalAlpha = particle.alpha;

    this.applyShadow(particle);

    const pixelRounded = particle.getRoundedLocation();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.drawImage(
      particle.image,
      -particle.factoredSize,
      -particle.factoredSize,
      particle.factoredSize * 2,
      particle.factoredSize * 2
    );

    this.context.globalAlpha = 1;
    this.context.restore();
  }

  drawBasicElement(particle: Particle): void {
    this.context.save();
    this.context.globalAlpha = particle.alpha;

    // Set blend mode
    this.setBlendMode(particle.blendMode);

    this.applyShadow(particle);
    
    // Draw the appropriate shape
    switch (particle.shape) {
      case 'circle':
        this.drawCircle(particle);
        break;
      case 'square':
      case 'rectangle':
        this.drawSquare(particle);
        break;
      case 'roundedRectangle':
        this.drawRoundedRectangle(particle);
        break;
      case 'triangle':
        this.drawTriangle(particle);
        break;
      case 'star':
        this.drawStar(particle);
        break;
      case 'ring':
        this.drawRing(particle);
        break;
      case 'sparkle':
        this.drawSparkle(particle);
        break;
      default:
        this.drawCircle(particle);
    }
    
    this.context.restore();
  }

  private drawTrails(particle: Particle): void {
    if (!particle.trail || particle.trailSegments.length === 0) return;

    const maxAge = Math.max(1, Math.floor(particle.trailLength));
    for (const segment of particle.trailSegments) {
      const life = 1 - segment.age / maxAge;
      if (life <= 0) continue;

      const ghost = this.makeTrailGhost(particle, segment, life);
      if (ghost.image) {
        this.drawImage(ghost);
      } else {
        this.drawBasicElement(ghost);
      }
    }
  }

  private makeTrailGhost(particle: Particle, segment: Particle['trailSegments'][number], life: number): Particle {
    const sizeScale = particle.trailShrink + life * (1 - particle.trailShrink);
    const alphaScale = life * particle.trailFade;

    return {
      ...particle,
      position: { x: segment.x, y: segment.y } as any,
      factoredSize: Math.max(0.1, segment.size * sizeScale),
      rotation: segment.rotation,
      alpha: segment.alpha * alphaScale,
      glow: false,
      shadow: false,
      trailSegments: [],
      getRoundedLocation: () => [
        ((segment.x * 10) << 0) * 0.1,
        ((segment.y * 10) << 0) * 0.1,
      ],
    } as unknown as Particle;
  }
  
  private applyShadow(particle: Particle): void {
    if (particle.glow) {
      const hex = particle.glowColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const glowAlpha = Math.max(0, Math.min(1, particle.glowAlpha));
      const glowScale = Math.max(0.75, Math.min(2.5, particle.factoredSize / 12));
      this.context.shadowColor = `rgba(${r},${g},${b},${glowAlpha})`;
      this.context.shadowBlur = particle.glowSize * glowScale;
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
    } else if (particle.shadow) {
      const hex = particle.shadowColor;
      const shadowScale = Math.max(0, Math.min(1, particle.alpha));
      const sizeScale = Math.max(0.45, Math.min(2.2, particle.factoredSize / 12));
      const earlyShadowFade = Math.max(0, Math.min(1, (particle.alpha - 0.1) / 0.95));
      const alpha = particle.shadowAlpha * earlyShadowFade;
      const baseDistance = Math.hypot(particle.shadowOffsetX, particle.shadowOffsetY);
      const lightDx = particle.position.x - particle.shadowLightOrigin.x;
      const lightDy = particle.position.y - particle.shadowLightOrigin.y;
      const lightDist = Math.hypot(lightDx, lightDy);

      let offsetX = particle.shadowOffsetX;
      let offsetY = particle.shadowOffsetY;
      if (baseDistance > 0 && lightDist > 0.0001) {
        offsetX = (lightDx / lightDist) * baseDistance;
        offsetY = (lightDy / lightDist) * baseDistance;
      }
      // Convert hex to rgba for Canvas 2D shadowColor
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      this.context.shadowColor = `rgba(${r},${g},${b},${alpha})`;
      this.context.shadowBlur = particle.shadowBlur * shadowScale * sizeScale;
      this.context.shadowOffsetX = offsetX * shadowScale * sizeScale;
      this.context.shadowOffsetY = offsetY * shadowScale * sizeScale;
    } else {
      this.context.shadowColor = 'transparent';
      this.context.shadowBlur = 0;
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
    }
  }

  private setBlendMode(mode: string): void {
    switch (mode) {
      case 'additive':
        this.context.globalCompositeOperation = 'lighter';
        break;
      case 'multiply':
        this.context.globalCompositeOperation = 'multiply';
        break;
      case 'screen':
        this.context.globalCompositeOperation = 'screen';
        break;
      default:
        this.context.globalCompositeOperation = 'source-over';
    }
  }
  
  private drawCircle(particle: Particle): void {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    
    this.context.beginPath();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2);
    this.context.closePath();
    this.context.fill();
    
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
  }
  
  private drawSquare(particle: Particle): void {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize * 2;
    
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.fillRect(-particle.factoredSize, -particle.factoredSize, size, size);
    
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.strokeRect(-particle.factoredSize, -particle.factoredSize, size, size);
    }
    this.context.restore();
  }

  private drawRoundedRectangle(particle: Particle): void {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize * 2;
    const radius = Math.min(particle.factoredSize * 0.35, size / 2);

    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.beginPath();
    this.context.roundRect(-particle.factoredSize, -particle.factoredSize, size, size, radius);
    this.context.closePath();
    this.context.fill();

    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  
  private drawTriangle(particle: Particle): void {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize;
    
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    
    // Equilateral triangle centered at centroid (matches WebGL sdEquilateralTriangle SDF)
    const k = 0.5773502691896258; // 1 / sqrt(3)
    this.context.beginPath();
    this.context.moveTo(0, -size * 2 * k);
    this.context.lineTo(size, size * k);
    this.context.lineTo(-size, size * k);
    this.context.closePath();
    this.context.fill();
    
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  
  private drawStar(particle: Particle): void {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const outerRadius = particle.factoredSize;
    const innerRadius = particle.factoredSize / 2;
    const spikes = 5;
    
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    
    this.context.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / spikes) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }
    this.context.closePath();
    this.context.fill();
    
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  
  private drawRing(particle: Particle): void {
    this.context.strokeStyle = particle.color;
    this.context.lineWidth = Math.max(2, particle.factoredSize / 4);
    const pixelRounded = particle.getRoundedLocation();
    
    this.context.beginPath();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2);
    this.context.stroke();
  }
  
  private drawSparkle(particle: Particle): void {
    this.context.strokeStyle = particle.color;
    this.context.lineWidth = 2;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize;
    
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    
    // Draw cross
    this.context.beginPath();
    this.context.moveTo(-size, 0);
    this.context.lineTo(size, 0);
    this.context.moveTo(0, -size);
    this.context.lineTo(0, size);
    
    // Draw diagonals
    const diag = size * 0.7;
    this.context.moveTo(-diag, -diag);
    this.context.lineTo(diag, diag);
    this.context.moveTo(-diag, diag);
    this.context.lineTo(diag, -diag);
    
    this.context.stroke();
    this.context.restore();
  }

  destroy(): void {
    this.remove();
  }

  remove(): void {
    if (!this.particular) return;

    this.particular.removeEventListener('UPDATE', this.onUpdate);
    this.particular.removeEventListener('UPDATE_AFTER', this.onUpdateAfter);
    this.particular.removeEventListener('RESIZE', this.resize);

    this.particular.removeEventListener('PARTICLE_CREATED', this.onParticleCreated);
    this.particular.removeEventListener('PARTICLE_UPDATE', this.onParticleUpdated);
    this.particular.removeEventListener('PARTICLE_DEAD', this.onParticleDead);

    this.particular = null;
  }
}
