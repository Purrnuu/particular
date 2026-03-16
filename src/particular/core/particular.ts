import { forEach, filter } from 'lodash-es';

import EventDispatcher, { type IEventDispatcher } from '../utils/eventDispatcher';
import { defaultParticular } from './defaults';
import { destroy } from '../utils/genericUtils';
import type Emitter from '../components/emitter';
import type Attractor from '../components/attractor';
import type MouseForce from '../components/mouseForce';
import type { ParticularConfig, ForceSource } from '../types';

interface Renderer {
  init(particular: Particular, pixelRatio: number): void;
  destroy(): void;
}

export default class Particular implements IEventDispatcher {
  static UPDATE = 'UPDATE';
  static UPDATE_AFTER = 'UPDATE_AFTER';
  static RESIZE = 'RESIZE';

  isOn = false;
  emitters: Emitter[] = [];
  attractors: Attractor[] = [];
  mouseForces: MouseForce[] = [];
  renderers: Renderer[] = [];
  maxCount: number = defaultParticular.maxCount;
  width = 0;
  height = 0;
  pixelRatio = 2;
  continuous = false;
  container: HTMLElement | null = null;
  private animateRequest: number | null = null;
  private lastTimestamp = -1;

  addEventListener!: EventDispatcher['addEventListener'];
  removeEventListener!: EventDispatcher['removeEventListener'];
  removeAllEventListeners!: EventDispatcher['removeAllEventListeners'];
  dispatchEvent!: EventDispatcher['dispatchEvent'];
  hasEventListener!: EventDispatcher['hasEventListener'];

  initialize({
    maxCount = defaultParticular.maxCount,
    continuous = defaultParticular.continuous,
    pixelRatio = defaultParticular.pixelRatio,
    container,
  }: ParticularConfig): void {
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.container = container ?? null;
    this.update();
  }

  start(): void {
    this.isOn = true;
  }

  stop(): void {
    this.isOn = false;
  }

  onResize(): void {
    if (this.container) {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
    } else {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
    // Canvas buffer dimensions must be in physical pixels for sharp rendering
    const bufferWidth = this.width * this.pixelRatio;
    const bufferHeight = this.height * this.pixelRatio;
    this.dispatchEvent(Particular.RESIZE, { width: bufferWidth, height: bufferHeight });
  }

  addRenderer(renderer: Renderer): void {
    this.renderers.push(renderer);
    renderer.init(this, this.pixelRatio);
    this.start();
    // Ensure new renderer gets current dimensions (RESIZE may have fired before it was added)
    if (this.width > 0 && this.height > 0) {
      this.dispatchEvent(Particular.RESIZE, {
        width: this.width * this.pixelRatio,
        height: this.height * this.pixelRatio,
      });
    }
  }

  addEmitter(emitter: Emitter): void {
    this.emitters.push(emitter);
    emitter.assignParticular(this);
    this.start();
  }

  addAttractor(attractor: Attractor): void {
    this.attractors.push(attractor);
  }

  removeAttractor(attractor: Attractor): void {
    const index = this.attractors.indexOf(attractor);
    if (index !== -1) {
      this.attractors.splice(index, 1);
    }
  }

  addMouseForce(mouseForce: MouseForce): void {
    this.mouseForces.push(mouseForce);
  }

  removeMouseForce(mouseForce: MouseForce): void {
    const index = this.mouseForces.indexOf(mouseForce);
    if (index !== -1) {
      this.mouseForces.splice(index, 1);
    }
  }

  update = (timestamp?: DOMHighResTimeStamp): void => {
    this.animateRequest = window.requestAnimationFrame(this.update);
    if (this.isOn) {
      let dt = 1;
      if (timestamp !== undefined && this.lastTimestamp >= 0) {
        dt = Math.min((timestamp - this.lastTimestamp) * 60 / 1000, 3);
      }
      if (timestamp !== undefined) {
        this.lastTimestamp = timestamp;
      }

      // General update event for renderers and other tidbits
      this.dispatchEvent(Particular.UPDATE);

      // Update all state from emitters and particles
      this.updateEmitters(dt);

      this.dispatchEvent(Particular.UPDATE_AFTER);
    }
  };

  updateEmitters(dt = 1): void {
    if (this.getCount() <= this.maxCount) {
      forEach(this.emitters, (emitter) => {
        emitter.emit(dt);
      });
    }

    for (const mf of this.mouseForces) {
      mf.decay(dt);
    }

    const forces: ForceSource[] =
      this.mouseForces.length > 0
        ? [...this.attractors, ...this.mouseForces]
        : this.attractors;

    forEach(this.emitters, (emitter) => {
      emitter.update(this.width, this.height, forces, dt);
    });

    this.emitters = filter(this.emitters, (emitter) => {
      if (this.continuous || emitter.isAlive()) {
        return true;
      }
      emitter.destroy();
      return false;
    });

    if (!this.emitters.length) {
      this.stop();
    }
  }

  getCount(): number {
    return this.getAllParticles().length;
  }

  getAllParticles(): Particle[] {
    let particles: Particle[] = [];
    let i = this.emitters.length;
    while (i--) {
      const emitter = this.emitters[i];
      if (emitter) {
        particles = particles.concat(emitter.particles);
      }
    }
    return particles;
  }

  destroy(): void {
    if (this.animateRequest !== null) {
      window.cancelAnimationFrame(this.animateRequest);
    }
    destroy(this.renderers);
    destroy(this.emitters);
    this.attractors = [];
    destroy(this.mouseForces);
  }
}

EventDispatcher.bind(Particular);

// Type import to avoid circular dependency
import type Particle from '../components/particle';
