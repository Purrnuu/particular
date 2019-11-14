import { sample, each } from 'lodash';

import Vector from '../utils/vector';
import Particle from './particle';
import { getRandomInt } from '../utils/math';
import { destroy } from '../utils/genericUtils';

export default class Emitter {
  constructor(life, rate, icons, point, velocity, spread) {
    this.position = point;
    this.velocity = velocity;
    this.spread = spread || Math.PI / 32;
    this.lifeCycle = 0;
    this.icons = icons;
    this.particles = [];
    this.isEmitting = false;
    this.particular = null;
    this.emitterLife = life;
    this.emitterRate = rate;
  }

  emit = () => {
    if (!this.isEmitting) return;
    for (let j = 0; j < this.emitterRate; j++) {
      const particle = this.createParticle();
      const icon = sample(this.icons, 1);
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
    this.isEmitting = this.lifeCycle < this.emitterLife;
  };

  isAlive = () => this.isEmitting || this.particles.length > 0;

  createParticle = () => {
    const angle = this.velocity.getAngle() + this.spread - Math.random() * this.spread * 2;
    const magnitude = this.velocity.getMagnitude();
    const position = new Vector(this.position.x, this.position.y);
    const velocity = Vector.fromAngle(angle, magnitude);

    const size = getRandomInt(5, 15);
    velocity.add({ x: 0, y: -((15 - size) / 15) * 6 });
    const friction = size / 2000;
    const acceleration = new Vector(0, size / 100);

    this.lifeCycle++;

    return new Particle(position, velocity, acceleration, friction, size);
  };

  destroy = () => {
    destroy(this.particles);
  };
}
