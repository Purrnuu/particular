import { sample, each } from 'lodash';

import Vector from '../utils/vector';
import Particle from './particle';
import { getRandomInt } from '../utils/math';
import { destroy } from '../utils/genericUtils';

export default class Emitter {
  constructor(configuration) {
    this.configuration = configuration;
    // Internal defaults
    this.particles = [];
    this.isEmitting = false;
    this.particular = null;
    this.lifeCycle = 0;
  }

  emit = () => {
    if (!this.isEmitting) return;
    for (let j = 0; j < this.configuration.rate; j++) {
      const particle = this.createParticle();
      const icon = sample(this.configuration.icons, 1);
      particle.init(icon, this.particular);
      this.particles.push(particle);
    }
  };

  assignParticular = particular => {
    this.particular = particular;
  };

  update = (boundsX, boundsY) => {
    const currentParticles = [];

    each(this.particles, particle => {
      const pos = particle.position;
      if (!(pos.x < 0 || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY)) {
        particle.update();
        currentParticles.push(particle);
      } else {
        particle.destroy();
      }
    });

    this.particles = currentParticles;
    this.isEmitting = this.lifeCycle < this.configuration.life;
  };

  isAlive = () => this.isEmitting || this.particles.length > 0;

  createParticle = () => {
    const {
      velocity,
      spread,
      point,
      sizeMin,
      sizeMax,
      velocityMultiplier,
      gravity,
      scaleStep,
      fadeTime,
    } = this.configuration;
    const angle = velocity.getAngle() + spread - Math.random() * spread * 2;
    const magnitude = velocity.getMagnitude();
    const newPoint = new Vector(point.x, point.y);
    const newVelocity = Vector.fromAngle(angle, magnitude);

    const size = getRandomInt(sizeMin, sizeMax);
    newVelocity.add({ x: 0, y: -((sizeMax - size) / 15) * velocityMultiplier });
    const friction = size / 2000;
    const acceleration = new Vector(0, size / 100);

    this.lifeCycle++;

    return new Particle({
      point: newPoint,
      velocity: newVelocity,
      acceleration,
      friction,
      size,
      gravity,
      scaleStep,
      fadeTime,
    });
  };

  destroy = () => {
    destroy(this.particles);
  };
}
