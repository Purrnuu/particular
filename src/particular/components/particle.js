import randomcolor from 'randomcolor';

import Vector from '../utils/vector';
import { getRandomInt } from '../utils/math';
import EventDispatcher from '../utils/eventDispatcher';

const SCALE_STEP = 1;
const GRAVITY = 0.15;
const FADE_TIME = 30;

export default class Particle {
  constructor(point, velocity, acceleration, friction, size) {
    this.position = point || new Vector(0, 0);
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
    this.friction = friction || 0;

    this.rotation = Math.random() * 360;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.rotationVelocity = this.rotationDirection * getRandomInt(1, 3);

    this.factoredSize = 1;

    this.lifeTime = getRandomInt(75, 100);
    this.lifeTick = 0;
    this.size = size || getRandomInt(5, 15);

    this.alpha = 1;
    this.color = randomcolor();
    this.particular = null;
  }

  init = (image, particular) => {
    this.image = image;
    this.particular = particular;
    this.dispatch('PARTICLE_CREATED', this);
  };

  update = () => {
    this.velocity.add(this.acceleration);
    this.velocity.addFriction(this.friction);
    this.velocity.addGravity(GRAVITY);
    this.position.add(this.velocity);
    this.rotation = this.rotation + this.rotationVelocity;
    this.factoredSize = Math.min(this.factoredSize + SCALE_STEP, this.size);
    this.alpha = Math.max((this.lifeTime - this.lifeTick) / FADE_TIME, 0);
    this.lifeTick++;
    this.dispatch('PARTICLE_UPDATE', this);
  };

  resetImage = () => {
    this.image = null;
  };

  getRoundedLocation = () => {
    return [((this.position.x * 10) << 0) * 0.1, ((this.position.y * 10) << 0) * 0.1];
  };

  dispatch = (event, target) => {
    this.particular && this.particular.dispatchEvent(event, target); // eslint-disable-line
  };

  destroy = () => {
    this.dispatch('PARTICLE_DEAD', this);
  };
}

EventDispatcher.bind(Particle);
