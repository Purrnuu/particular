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
    this.context.restore();
  };

  onParticleCreated = (): void => {
    // Can be used for particle creation effects
  };

  onParticleUpdated = (particle?: Particle): void => {
    if (!particle) return;
    
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
    this.context.fillStyle = particle.color;

    this.context.beginPath();
    const pixelRounded = particle.getRoundedLocation();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2, true);

    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }

    this.context.closePath();
    this.context.fill();
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
