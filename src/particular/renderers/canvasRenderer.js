import { degToRad } from '../utils/math';

export default class CanvasRenderer {
  constructor(target) {
    this.target = target;
    this.context = this.target.getContext('2d');
    this.name = 'CanvasRenderer';
  }

  init(particular, pixelRatio) {
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

  resize = ({ width, height }) => {
    this.target.width = width;
    this.target.height = height;
  };

  onUpdate = () => {
    this.context.save();
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.context.clearRect(0, 0, this.target.width, this.target.height);
  };

  onUpdateAfter = () => {
    this.context.restore();
  };

  onParticleCreated = () => {
    // console.log(particle);
  };

  onParticleUpdated = particle => {
    if (particle.image) {
      if (particle.image instanceof Image) this.drawImage(particle);
    } else {
      this.drawBasicElement(particle);
    }
  };

  onParticleDead = particle => {
    particle.resetImage();
  };

  drawImage = particle => {
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
      particle.factoredSize * 2,
    );

    this.context.globalAlpha = 1;
    this.context.restore();
  };

  drawBasicElement = particle => {
    this.context.fillStyle = particle.color;

    this.context.beginPath();
    const pixelRounded = particle.getRoundedLocation();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2, true);

    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thinkness;
      this.context.stroke();
    }

    this.context.closePath();
    this.context.fill();
  };

  destroy() {
    this.remove();
  }

  remove() {
    this.particular.removeEventListener('UPDATE', this.onUpdate);
    this.particular.removeEventListener('UPDATE_AFTER', this.onUpdateAfter);

    this.particular.removeEventListener('PARTICLE_CREATED', this.onParticleCreated);
    this.particular.removeEventListener('PARTICLE_UPDATE', this.onParticleUpdated);
    this.particular.removeEventListener('PARTICLE_DEAD', this.onParticleDead);

    this.particular = null;
  }
}
