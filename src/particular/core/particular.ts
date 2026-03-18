import EventDispatcher, { type IEventDispatcher } from '../utils/eventDispatcher';
import { defaultParticular } from './defaults';
import { destroy } from '../utils/genericUtils';
import { setParticlePoolSize } from '../components/particle';
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
  private _combinedForces: ForceSource[] = [];
  private _allParticlesCache: Particle[] = [];

  addEventListener!: EventDispatcher['addEventListener'];
  removeEventListener!: EventDispatcher['removeEventListener'];
  removeAllEventListeners!: EventDispatcher['removeAllEventListeners'];
  dispatchEvent!: EventDispatcher['dispatchEvent'];
  hasEventListener!: EventDispatcher['hasEventListener'];

  initialize({
    maxCount = defaultParticular.maxCount,
    continuous = defaultParticular.continuous,
    pixelRatio = defaultParticular.pixelRatio,
    particlePoolSize = defaultParticular.particlePoolSize,
    container,
  }: ParticularConfig): void {
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.container = container ?? null;
    setParticlePoolSize(particlePoolSize);
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
      const height = (this.height = this.container.clientHeight);
      const width = (this.width = this.container.clientWidth);
      this.dispatchEvent(Particular.RESIZE, { width, height });
    } else {
      const height = (this.height = window.innerHeight);
      const width = (this.width = window.innerWidth);
      this.dispatchEvent(Particular.RESIZE, { width, height });
    }
  }

  addRenderer(renderer: Renderer): void {
    this.renderers.push(renderer);
    renderer.init(this, this.pixelRatio);
    this.start();
    // Ensure new renderer gets current dimensions (RESIZE may have fired before it was added)
    if (this.width > 0 && this.height > 0) {
      this.dispatchEvent(Particular.RESIZE, { width: this.width, height: this.height });
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
      for (const emitter of this.emitters) {
        emitter.emit(dt);
      }
    }

    for (const mf of this.mouseForces) {
      mf.decay(dt);
    }

    // Reuse cached array for combined forces to avoid per-frame allocation
    let forces: ForceSource[];
    if (this.mouseForces.length > 0) {
      const combined = this._combinedForces;
      combined.length = 0;
      for (const a of this.attractors) combined.push(a);
      for (const mf of this.mouseForces) combined.push(mf);
      forces = combined;
    } else {
      forces = this.attractors;
    }

    for (const emitter of this.emitters) {
      emitter.update(this.width, this.height, forces, dt);
    }

    // Compact in-place instead of filter() to avoid array allocation
    let writeIdx = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i]!;
      if (this.continuous || emitter.isAlive()) {
        this.emitters[writeIdx++] = emitter;
      } else {
        emitter.destroy();
      }
    }
    this.emitters.length = writeIdx;

    if (!this.emitters.length) {
      this.stop();
    }
  }

  getCount(): number {
    let count = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      count += this.emitters[i]!.particles.length;
    }
    return count;
  }

  getAllParticles(): Particle[] {
    const particles = this._allParticlesCache;
    particles.length = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i]!;
      for (let j = 0; j < emitter.particles.length; j++) {
        particles.push(emitter.particles[j]!);
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
