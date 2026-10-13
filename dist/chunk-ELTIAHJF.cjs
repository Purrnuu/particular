'use strict';

var chunkDSCJ6LNA_cjs = require('./chunk-DSCJ6LNA.cjs');

// src/particular/core/particular.ts
var _Particular = class _Particular {
  constructor() {
    this.isOn = false;
    this.emitters = [];
    this.attractors = [];
    this.mouseForces = [];
    this.flockingForces = [];
    this.renderers = [];
    /** Custom forces; typed force arrays remain available for compatibility. */
    this.forces = [];
    this.resources = new chunkDSCJ6LNA_cjs.ResourceScope();
    this.frame = { timestamp: 0, dt: 1, deltaSeconds: 1 / 60, elapsedSeconds: 0 };
    this.destroyed = false;
    this.maxCount = chunkDSCJ6LNA_cjs.defaultParticular.maxCount;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 2;
    /** Multiplier for kill-zone bounds. 3D renderers set this higher so perspective-visible particles aren't culled prematurely. */
    this.boundsPadding = 1;
    this.continuous = false;
    this.container = null;
    this.animateRequest = null;
    this.lastTimestamp = -1;
    this._combinedForces = [];
    this._allParticlesCache = [];
    this.update = (timestamp) => {
      if (this.destroyed) return;
      this.animateRequest = window.requestAnimationFrame(this.update);
      if (this.isOn) {
        let dt = 1;
        if (timestamp !== void 0 && this.lastTimestamp >= 0) {
          dt = Math.max(0, Math.min((timestamp - this.lastTimestamp) * 60 / 1e3, 3));
        }
        if (timestamp !== void 0) {
          this.lastTimestamp = timestamp;
        }
        this.frame.timestamp = timestamp ?? 0;
        this.frame.dt = dt;
        this.frame.deltaSeconds = dt / 60;
        this.frame.elapsedSeconds += this.frame.deltaSeconds;
        this.dispatchEvent(_Particular.UPDATE, this.frame);
        if (this.destroyed) return;
        this.updateEmitters(dt);
        if (!this.destroyed) this.dispatchEvent(_Particular.UPDATE_AFTER, this.frame);
      }
    };
  }
  get isDestroyed() {
    return this.destroyed;
  }
  initialize({
    maxCount = chunkDSCJ6LNA_cjs.defaultParticular.maxCount,
    continuous = chunkDSCJ6LNA_cjs.defaultParticular.continuous,
    pixelRatio = chunkDSCJ6LNA_cjs.defaultParticular.pixelRatio,
    particlePoolSize = chunkDSCJ6LNA_cjs.defaultParticular.particlePoolSize,
    container
  }) {
    this.resources.assertActive();
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.container = container ?? null;
    chunkDSCJ6LNA_cjs.setParticlePoolSize(particlePoolSize);
    if (this.animateRequest === null) this.update();
  }
  start() {
    this.resources.assertActive();
    if (!this.isOn) this.lastTimestamp = -1;
    this.isOn = true;
  }
  stop() {
    if (this.isOn) {
      this.isOn = false;
      this.dispatchEvent(_Particular.UPDATE_AFTER, this.frame);
    }
  }
  onResize() {
    if (this.container) {
      const height = this.height = this.container.clientHeight;
      const width = this.width = this.container.clientWidth;
      this.dispatchEvent(_Particular.RESIZE, { width, height });
    } else {
      const height = this.height = window.innerHeight;
      const width = this.width = window.innerWidth;
      this.dispatchEvent(_Particular.RESIZE, { width, height });
    }
  }
  addRenderer(renderer) {
    this.resources.assertActive();
    this.renderers.push(renderer);
    renderer.init(this, this.pixelRatio);
    this.start();
    if (this.width > 0 && this.height > 0) {
      this.dispatchEvent(_Particular.RESIZE, { width: this.width, height: this.height });
    }
  }
  addEmitter(emitter) {
    this.resources.assertActive();
    if (this.emitters.includes(emitter)) return;
    this.emitters.push(emitter);
    emitter.assignParticular(this);
    this.start();
  }
  addAttractor(attractor) {
    this.resources.assertActive();
    if (this.attractors.includes(attractor)) return;
    this.removeForce(attractor);
    this.attractors.push(attractor);
  }
  removeAttractor(attractor) {
    const index = this.attractors.indexOf(attractor);
    if (index !== -1) {
      this.attractors.splice(index, 1);
    }
  }
  addMouseForce(mouseForce) {
    this.resources.assertActive();
    if (this.mouseForces.includes(mouseForce)) return;
    this.removeForce(mouseForce);
    this.mouseForces.push(mouseForce);
  }
  removeMouseForce(mouseForce) {
    const index = this.mouseForces.indexOf(mouseForce);
    if (index !== -1) {
      this.mouseForces.splice(index, 1);
    }
  }
  addFlockingForce(flockingForce) {
    this.resources.assertActive();
    if (this.flockingForces.includes(flockingForce)) return;
    this.removeForce(flockingForce);
    this.flockingForces.push(flockingForce);
  }
  removeFlockingForce(flockingForce) {
    const index = this.flockingForces.indexOf(flockingForce);
    if (index !== -1) {
      this.flockingForces.splice(index, 1);
    }
  }
  addForce(force) {
    this.resources.assertActive();
    if (!this.forces.includes(force) && !this.attractors.includes(force) && !this.mouseForces.includes(force) && !this.flockingForces.includes(force)) {
      this.forces.push(force);
    }
  }
  removeForce(force) {
    for (const list of [
      this.forces,
      this.attractors,
      this.mouseForces,
      this.flockingForces
    ]) {
      const index = list.indexOf(force);
      if (index !== -1) list.splice(index, 1);
    }
  }
  getForces() {
    const combined = this._combinedForces;
    combined.length = 0;
    for (const force of this.attractors) combined.push(force);
    for (const force of this.mouseForces) combined.push(force);
    for (const force of this.flockingForces) combined.push(force);
    for (const force of this.forces) combined.push(force);
    return combined;
  }
  updateEmitters(dt = 1) {
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
    let writeIdx = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i];
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
  getCount() {
    let count = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      count += this.emitters[i].particles.length;
    }
    return count;
  }
  getAllParticles() {
    const particles = this._allParticlesCache;
    particles.length = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i];
      for (let j = 0; j < emitter.particles.length; j++) {
        particles.push(emitter.particles[j]);
      }
    }
    return particles;
  }
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.isOn = false;
    if (this.animateRequest !== null) {
      window.cancelAnimationFrame(this.animateRequest);
    }
    this.animateRequest = null;
    let failed = false;
    let firstError;
    try {
      this.resources.dispose();
    } catch (error) {
      firstError = error;
      failed = true;
    }
    chunkDSCJ6LNA_cjs.destroy(this.renderers);
    chunkDSCJ6LNA_cjs.destroy(this.emitters);
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
};
_Particular.UPDATE = "UPDATE";
_Particular.UPDATE_AFTER = "UPDATE_AFTER";
_Particular.RESIZE = "RESIZE";
var Particular = _Particular;
chunkDSCJ6LNA_cjs.EventDispatcher.bind(Particular);

// src/particular/convenience/context.ts
function createFeatureContext(engine, config) {
  const container = config.container;
  const localToEngine = (x, y) => ({
    x: x / engine.pixelRatio,
    y: y / engine.pixelRatio
  });
  return {
    engine,
    config,
    container,
    resources: engine.resources,
    coordinates: {
      localToEngine,
      clientToEngine: (x, y) => {
        const rect = container?.getBoundingClientRect();
        return localToEngine(x - (rect?.left ?? 0), y - (rect?.top ?? 0));
      }
    }
  };
}

exports.Particular = Particular;
exports.createFeatureContext = createFeatureContext;
//# sourceMappingURL=chunk-ELTIAHJF.cjs.map
//# sourceMappingURL=chunk-ELTIAHJF.cjs.map