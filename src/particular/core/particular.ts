import EventDispatcher, { type IEventDispatcher } from '../utils/eventDispatcher';
import { defaultParticular } from './defaults';
import { destroy } from '../utils/genericUtils';
import { setParticlePoolSize } from '../components/particle';
import type Emitter from '../components/emitter';
import type Attractor from '../components/attractor';
import type MouseForce from '../components/mouseForce';
import type FlockingForce from '../components/flockingForce';
import type { ParticularConfig, ForceSource, FrameContext } from '../types';
import { ResourceScope } from './resourceScope';

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
  flockingForces: FlockingForce[] = [];
  renderers: Renderer[] = [];
  /** Custom forces; typed force arrays remain available for compatibility. */
  forces: ForceSource[] = [];
  readonly resources = new ResourceScope();
  readonly frame: FrameContext = { timestamp: 0, dt: 1, deltaSeconds: 1 / 60, elapsedSeconds: 0 };
  private destroyed = false;
  maxCount: number = defaultParticular.maxCount;
  width = 0;
  height = 0;
  pixelRatio = 2;
  /** Multiplier for kill-zone bounds. 3D renderers set this higher so perspective-visible particles aren't culled prematurely. */
  boundsPadding = 1;
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

  get isDestroyed(): boolean {
    return this.destroyed;
  }

  initialize({
    maxCount = defaultParticular.maxCount,
    continuous = defaultParticular.continuous,
    pixelRatio = defaultParticular.pixelRatio,
    particlePoolSize = defaultParticular.particlePoolSize,
    container,
  }: ParticularConfig): void {
    this.resources.assertActive();
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.container = container ?? null;
    setParticlePoolSize(particlePoolSize);
    if (this.animateRequest === null) this.update();
  }

  start(): void {
    this.resources.assertActive();
    if (!this.isOn) this.lastTimestamp = -1;
    this.isOn = true;
  }

  stop(): void {
    if (this.isOn) {
      this.isOn = false;
      // Fire one final render so particles that just settled are drawn at their snapped home positions.
      this.dispatchEvent(Particular.UPDATE_AFTER, this.frame);
    }
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
    this.resources.assertActive();
    this.renderers.push(renderer);
    renderer.init(this, this.pixelRatio);
    this.start();
    // Ensure new renderer gets current dimensions (RESIZE may have fired before it was added)
    if (this.width > 0 && this.height > 0) {
      this.dispatchEvent(Particular.RESIZE, { width: this.width, height: this.height });
    }
  }

  addEmitter(emitter: Emitter): void {
    this.resources.assertActive();
    if (this.emitters.includes(emitter)) return;
    this.emitters.push(emitter);
    emitter.assignParticular(this);
    this.start();
  }

  addAttractor(attractor: Attractor): void {
    this.resources.assertActive();
    if (this.attractors.includes(attractor)) return;
    this.removeForce(attractor);
    this.attractors.push(attractor);
  }

  removeAttractor(attractor: Attractor): void {
    const index = this.attractors.indexOf(attractor);
    if (index !== -1) {
      this.attractors.splice(index, 1);
    }
  }

  addMouseForce(mouseForce: MouseForce): void {
    this.resources.assertActive();
    if (this.mouseForces.includes(mouseForce)) return;
    this.removeForce(mouseForce);
    this.mouseForces.push(mouseForce);
  }

  removeMouseForce(mouseForce: MouseForce): void {
    const index = this.mouseForces.indexOf(mouseForce);
    if (index !== -1) {
      this.mouseForces.splice(index, 1);
    }
  }

  addFlockingForce(flockingForce: FlockingForce): void {
    this.resources.assertActive();
    if (this.flockingForces.includes(flockingForce)) return;
    this.removeForce(flockingForce);
    this.flockingForces.push(flockingForce);
  }

  removeFlockingForce(flockingForce: FlockingForce): void {
    const index = this.flockingForces.indexOf(flockingForce);
    if (index !== -1) {
      this.flockingForces.splice(index, 1);
    }
  }

  addForce(force: ForceSource): void {
    this.resources.assertActive();
    if (
      !this.forces.includes(force) &&
      !this.attractors.includes(force as Attractor) &&
      !this.mouseForces.includes(force as MouseForce) &&
      !this.flockingForces.includes(force as FlockingForce)
    ) {
      this.forces.push(force);
    }
  }

  removeForce(force: ForceSource): void {
    for (const list of [
      this.forces,
      this.attractors,
      this.mouseForces,
      this.flockingForces,
    ] as ForceSource[][]) {
      const index = list.indexOf(force);
      if (index !== -1) list.splice(index, 1);
    }
  }

  private getForces(): ForceSource[] {
    const combined = this._combinedForces;
    combined.length = 0;
    for (const force of this.attractors) combined.push(force);
    for (const force of this.mouseForces) combined.push(force);
    for (const force of this.flockingForces) combined.push(force);
    for (const force of this.forces) combined.push(force);
    return combined;
  }

  update = (timestamp?: DOMHighResTimeStamp): void => {
    if (this.destroyed) return;
    this.animateRequest = window.requestAnimationFrame(this.update);
    if (this.isOn) {
      let dt = 1;
      if (timestamp !== undefined && this.lastTimestamp >= 0) {
        dt = Math.max(0, Math.min(((timestamp - this.lastTimestamp) * 60) / 1000, 3));
      }
      if (timestamp !== undefined) {
        this.lastTimestamp = timestamp;
      }

      // General update event for renderers and other tidbits
      this.frame.timestamp = timestamp ?? 0;
      this.frame.dt = dt;
      this.frame.deltaSeconds = dt / 60;
      this.frame.elapsedSeconds += this.frame.deltaSeconds;
      this.dispatchEvent(Particular.UPDATE, this.frame);
      if (this.destroyed) return;

      // Update all state from emitters and particles
      this.updateEmitters(dt);

      if (!this.destroyed) this.dispatchEvent(Particular.UPDATE_AFTER, this.frame);
    }
  };

  updateEmitters(dt = 1): void {
    if (this.destroyed) return;
    if (this.getCount() < this.maxCount) {
      for (const emitter of this.emitters) {
        emitter.emit(dt);
      }
    }

    const forces = this.getForces();
    this.frame.dt = dt;
    this.frame.deltaSeconds = dt / 60;
    const allParticles = forces.some((force) => force.preCompute) ? this.getAllParticles() : null;
    for (const force of forces) {
      force.setBounds?.(this.width / this.pixelRatio, this.height / this.pixelRatio);
      force.update?.(this.frame);
      if (allParticles) force.preCompute?.(allParticles, dt);
    }

    const margin = this.boundsPadding - 1;
    const bx = this.width * (1 + margin);
    const by = this.height * (1 + margin);
    const mx = this.width * margin;
    const my = this.height * margin;
    for (const emitter of this.emitters) {
      emitter.update(bx, by, mx, my, forces, dt);
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
    if (this.destroyed) return;
    this.destroyed = true;
    this.isOn = false;
    if (this.animateRequest !== null) {
      window.cancelAnimationFrame(this.animateRequest);
    }
    this.animateRequest = null;
    let failed = false;
    let firstError: unknown;
    try {
      this.resources.dispose();
    } catch (error) {
      firstError = error;
      failed = true;
    }
    destroy(this.renderers);
    destroy(this.emitters);
    for (const force of this.getForces()) {
      try {
        force.destroy?.();
      } catch (error) {
        if (!failed) firstError = error;
        failed = true;
      }
    }
    this.attractors.length = 0;
    this.flockingForces.length = 0;
    this.mouseForces.length = 0;
    this.forces.length = 0;
    this._combinedForces.length = 0;
    this._allParticlesCache.length = 0;
    this.removeAllEventListeners();
    if (failed) throw firstError;
  }
}

EventDispatcher.bind(Particular);

// Type import to avoid circular dependency
import type Particle from '../components/particle';
