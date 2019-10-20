import _ from 'lodash';

import EventDispatcher from '../utils/eventDispatcher';

import { defaultConfiguration } from './defaults';
import { destroy } from '../utils/genericUtils';

export default class Particular {
  static UPDATE = 'UPDATE';

  static UPDATE_AFTER = 'UPDATE_AFTER';

  static RESIZE = 'RESIZE';

  constructor() {
    this.isOn = false;
    this.emitters = [];
    this.renderers = [];
    this.maxCount = defaultConfiguration.maxCount;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 2;
    this.continuous = false;
  }

  initialize = ({ maxCount, continuous, pixelRatio }) => {
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.update();
  };

  start = () => {
    this.isOn = true;
  };

  stop = () => {
    this.isOn = false;
  };

  onResize = () => {
    const height = (this.height = window.innerHeight);
    const width = (this.width = window.innerWidth);
    this.dispatchEvent(Particular.RESIZE, { width, height });
  };

  addRenderer = renderer => {
    this.renderers.push(renderer);
    renderer.init(this, this.pixelRatio);
    this.start();
  };

  addEmitter = emitter => {
    this.emitters.push(emitter);
    emitter.assignParticular(this);
    this.start();
  };

  update = () => {
    this.animateRequest = window.requestAnimationFrame(this.update);
    if (this.isOn) {
      // General update event for renderers and other tidbits
      this.dispatchEvent(Particular.UPDATE);

      // Update all state from emitters and particles
      this.updateEmitters();

      this.dispatchEvent(Particular.UPDATE_AFTER);
    }
  };

  updateEmitters = () => {
    if (this.getCount() <= this.maxCount) {
      _.each(this.emitters, emitter => {
        emitter.emit();
      });
    }

    _.each(this.emitters, emitter => {
      emitter.update(this.width, this.height);
    });

    this.emitters = _.filter(this.emitters, emitter => {
      if (this.continuous || emitter.isAlive()) {
        return emitter;
      }
      emitter.destroy();
      return null;
    });

    if (!this.emitters.length) {
      this.stop();
    }
  };

  getCount = () => {
    return this.getAllParticles().length;
  };

  getAllParticles = () => {
    let particles = [];
    let i = this.emitters.length;
    while (i--) particles = particles.concat(this.emitters[i].particles);
    return particles;
  };

  destroy = () => {
    window.clearInterval(this.animateRequest);
    destroy(this.renderers);
    destroy(this.emitters);
  };
}

EventDispatcher.bind(Particular);
