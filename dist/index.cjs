'use strict';

var lodashEs = require('lodash-es');
var React = require('react');
var reactDom = require('react-dom');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

// src/particular/core/particular.ts

// src/particular/utils/eventDispatcher.ts
var EventDispatcher = class _EventDispatcher {
  constructor() {
    this.listeners = null;
  }
  static bind(TargetClass) {
    TargetClass.prototype.dispatchEvent = _EventDispatcher.prototype.dispatchEvent;
    TargetClass.prototype.hasEventListener = _EventDispatcher.prototype.hasEventListener;
    TargetClass.prototype.addEventListener = _EventDispatcher.prototype.addEventListener;
    TargetClass.prototype.removeEventListener = _EventDispatcher.prototype.removeEventListener;
    TargetClass.prototype.removeAllEventListeners = _EventDispatcher.prototype.removeAllEventListeners;
  }
  addEventListener(type, listener) {
    if (!this.listeners) {
      this.listeners = {};
    } else {
      this.removeEventListener(type, listener);
    }
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
    return listener;
  }
  removeEventListener(type, listener) {
    if (!this.listeners) return;
    if (!this.listeners[type]) return;
    const arr = this.listeners[type];
    const { length } = arr;
    for (let i = 0; i < length; i++) {
      if (arr[i] === listener) {
        if (length === 1) {
          delete this.listeners[type];
        } else {
          arr.splice(i, 1);
        }
        break;
      }
    }
  }
  removeAllEventListeners(type) {
    if (!type) {
      this.listeners = null;
    } else if (this.listeners) {
      delete this.listeners[type];
    }
  }
  dispatchEvent(type, args) {
    let result = false;
    if (type && this.listeners) {
      let arr = this.listeners[type];
      if (!arr) return result;
      arr = arr.slice();
      let handler;
      let i = arr.length;
      while (i--) {
        handler = arr[i];
        result = result || !!handler(args);
      }
    }
    return result;
  }
  hasEventListener(type) {
    return !!(this.listeners && this.listeners[type]);
  }
};

// src/particular/utils/vector.ts
var Vector = class _Vector {
  constructor(x, y) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }
  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  add(vector, scale = 1) {
    this.x += vector.x * scale;
    this.y += vector.y * scale;
  }
  addFriction(friction, dt = 1) {
    const factor = Math.pow(1 - friction, dt);
    this.x *= factor;
    this.y *= factor;
  }
  addGravity(gravity, dt = 1) {
    this.y += gravity * dt;
  }
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }
  normalize() {
    const mag = this.getMagnitude();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
    }
  }
  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
  getAngle() {
    return Math.atan2(this.y, this.x);
  }
  static fromAngle(angle, magnitude) {
    return new _Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }
};

// src/particular/core/defaults.ts
var defaultParticular = {
  pixelRatio: 2,
  zIndex: 1e4,
  maxCount: 500,
  autoStart: false,
  continuous: false,
  webglMaxInstances: 4096
};
var defaultParticle = {
  rate: 8,
  life: 30,
  particleLife: 100,
  velocity: Vector.fromAngle(-90, 5),
  spread: Math.PI / 1.3,
  sizeMin: 5,
  sizeMax: 15,
  velocityMultiplier: 6,
  fadeTime: 30,
  gravity: 0.15,
  scaleStep: 1,
  spawnWidth: 0,
  spawnHeight: 0,
  colors: [],
  acceleration: 0,
  accelerationSize: 0.01,
  friction: 0,
  frictionSize: 5e-4,
  shape: "circle",
  blendMode: "normal",
  glow: false,
  glowSize: 10,
  glowColor: "#ffffff",
  glowAlpha: 0.25,
  trail: false,
  trailLength: 3,
  trailFade: 0.75,
  trailShrink: 0.55,
  imageTint: false,
  shadow: true,
  shadowBlur: 9,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowColor: "#333333",
  shadowAlpha: 0.15
};
var defaultAttractor = {
  strength: 1,
  radius: 150,
  visible: false,
  size: 12,
  color: "#adb5bd",
  shape: "circle",
  glow: false,
  glowSize: 10,
  glowColor: "#adb5bd",
  glowAlpha: 0.35
};
var defaultMouseForce = {
  x: 0,
  y: 0,
  strength: 1,
  radius: 50,
  damping: 0.85,
  maxSpeed: 10,
  falloff: 1
};
var defaultExplosionChild = {
  childCount: 5,
  childLife: 40,
  sizeMin: 1,
  sizeMax: 3,
  velocity: 3,
  velocitySpread: 0.4,
  friction: 0.01,
  scaleStep: 1.5,
  gravity: 0.12,
  fadeTime: 15,
  inheritColor: true,
  shape: "circle",
  blendMode: "normal",
  glow: false,
  glowSize: 10,
  glowColor: "#ffffff",
  glowAlpha: 0.25,
  shadow: false,
  trail: true,
  trailLength: 3,
  trailFade: 0.6,
  trailShrink: 0.65
};
var defaultHomeConfig = {
  springStrength: 0.05,
  springDamping: 0.9,
  homeThreshold: 2,
  velocityThreshold: 0.5,
  wiggleAmplitude: 0,
  wiggleSpeed: 0.05,
  breathingAmplitude: 0,
  breathingSpeed: 0.03,
  waveAmplitude: 0,
  waveSpeed: 0.03,
  waveFrequency: 0.15,
  returnNoise: 0.3,
  idlePulseStrength: 2,
  idlePulseIntervalMin: 300,
  idlePulseIntervalMax: 1800
};
var defaultImageParticles = {
  alphaThreshold: 0.1,
  particleLife: 99999,
  gravity: 0,
  fadeTime: 40,
  shape: "square",
  shadow: false,
  glow: false
};
var defaultMouseWind = {
  strength: 0.12,
  radius: 100,
  damping: 0.92,
  maxSpeed: 8,
  falloff: 0.3
};
function configureParticular(configuration) {
  return { ...defaultParticular, ...defaultParticle, ...configuration };
}
function configureParticle(settings, configuration) {
  return { ...defaultParticle, ...configuration, ...settings };
}

// src/particular/utils/genericUtils.ts
function destroy(array, param) {
  let i = array.length;
  while (i--) {
    try {
      array[i]?.destroy(param);
    } catch (e) {
    }
  }
  array.splice(0, array.length);
}

// src/particular/core/particular.ts
var _Particular = class _Particular {
  constructor() {
    this.isOn = false;
    this.emitters = [];
    this.attractors = [];
    this.mouseForces = [];
    this.renderers = [];
    this.maxCount = defaultParticular.maxCount;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 2;
    this.continuous = false;
    this.container = null;
    this.animateRequest = null;
    this.lastTimestamp = -1;
    this.update = (timestamp) => {
      this.animateRequest = window.requestAnimationFrame(this.update);
      if (this.isOn) {
        let dt = 1;
        if (timestamp !== void 0 && this.lastTimestamp >= 0) {
          dt = Math.min((timestamp - this.lastTimestamp) * 60 / 1e3, 3);
        }
        if (timestamp !== void 0) {
          this.lastTimestamp = timestamp;
        }
        this.dispatchEvent(_Particular.UPDATE);
        this.updateEmitters(dt);
        this.dispatchEvent(_Particular.UPDATE_AFTER);
      }
    };
  }
  initialize({
    maxCount = defaultParticular.maxCount,
    continuous = defaultParticular.continuous,
    pixelRatio = defaultParticular.pixelRatio,
    container
  }) {
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.container = container ?? null;
    this.update();
  }
  start() {
    this.isOn = true;
  }
  stop() {
    this.isOn = false;
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
    this.renderers.push(renderer);
    renderer.init(this, this.pixelRatio);
    this.start();
    if (this.width > 0 && this.height > 0) {
      this.dispatchEvent(_Particular.RESIZE, { width: this.width, height: this.height });
    }
  }
  addEmitter(emitter) {
    this.emitters.push(emitter);
    emitter.assignParticular(this);
    this.start();
  }
  addAttractor(attractor) {
    this.attractors.push(attractor);
  }
  removeAttractor(attractor) {
    const index = this.attractors.indexOf(attractor);
    if (index !== -1) {
      this.attractors.splice(index, 1);
    }
  }
  addMouseForce(mouseForce) {
    this.mouseForces.push(mouseForce);
  }
  removeMouseForce(mouseForce) {
    const index = this.mouseForces.indexOf(mouseForce);
    if (index !== -1) {
      this.mouseForces.splice(index, 1);
    }
  }
  updateEmitters(dt = 1) {
    if (this.getCount() <= this.maxCount) {
      lodashEs.forEach(this.emitters, (emitter) => {
        emitter.emit(dt);
      });
    }
    for (const mf of this.mouseForces) {
      mf.decay(dt);
    }
    const forces = this.mouseForces.length > 0 ? [...this.attractors, ...this.mouseForces] : this.attractors;
    lodashEs.forEach(this.emitters, (emitter) => {
      emitter.update(this.width, this.height, forces, dt);
    });
    this.emitters = lodashEs.filter(this.emitters, (emitter) => {
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
  getCount() {
    return this.getAllParticles().length;
  }
  getAllParticles() {
    let particles = [];
    let i = this.emitters.length;
    while (i--) {
      const emitter = this.emitters[i];
      if (emitter) {
        particles = particles.concat(emitter.particles);
      }
    }
    return particles;
  }
  destroy() {
    if (this.animateRequest !== null) {
      window.cancelAnimationFrame(this.animateRequest);
    }
    destroy(this.renderers);
    destroy(this.emitters);
    this.attractors = [];
    destroy(this.mouseForces);
  }
};
_Particular.UPDATE = "UPDATE";
_Particular.UPDATE_AFTER = "UPDATE_AFTER";
_Particular.RESIZE = "RESIZE";
var Particular = _Particular;
EventDispatcher.bind(Particular);

// src/particular/utils/math.ts
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var TO_RADIANS = Math.PI / 180;
function degToRad(deg) {
  return deg * TO_RADIANS;
}

// src/particular/components/particle.ts
var Particle = class _Particle {
  constructor({
    color,
    baseAlpha = 1,
    point,
    velocity,
    acceleration,
    friction,
    size,
    particleLife,
    gravity,
    scaleStep,
    fadeTime,
    shape = "circle",
    blendMode = "normal",
    glow = false,
    glowSize = 10,
    glowColor = "#ffffff",
    glowAlpha = 0.35,
    trail = false,
    trailLength = 3,
    trailFade = 0.75,
    trailShrink = 0.55,
    imageTint = false,
    shadow = false,
    shadowBlur = 8,
    shadowOffsetX = 3,
    shadowOffsetY = 3,
    shadowColor = "#000000",
    shadowAlpha = 0.3,
    colors,
    homePosition,
    homeCenter,
    homeConfig
  }) {
    this.particular = null;
    this.image = null;
    this.isDetonationChild = false;
    this.trailSegments = [];
    // Home position — spring return + idle animation
    this.homePosition = null;
    this.homeConfig = null;
    /** When false, idle animations (breathing, wiggle, wave, pulse) are suppressed. Spring return still works. */
    this.idleEnabled = true;
    this.breathingPhase = Math.random() * Math.PI * 2;
    /** Per-particle spring multiplier (0.6–1.4) — breaks sync so particles return at different rates. */
    this.springMultiplier = 1;
    /** Monotonic tick counter for coordinated idle wave (never resets). */
    this.idleTicks = 0;
    /** How many pulse cycles this particle has completed. */
    this.pulseCycleCount = 0;
    /** Tick at which the next pulse wave starts (computed deterministically so all particles agree). */
    this.nextPulseAt = 0;
    /** Distance from image center (set once in constructor, used for ripple delay). */
    this.homeDistFromCenter = 0;
    /** Angle from image center to this particle's home (radians). Used for outward ripple direction. */
    this.homeAngleFromCenter = 0;
    this.position = point ?? new Vector(0, 0);
    this.shadowLightOrigin = new Vector(this.position.x, this.position.y);
    this.velocity = velocity ?? new Vector(0, 0);
    this.acceleration = acceleration ?? new Vector(0, 0);
    this.friction = friction ?? 0;
    this.rotation = Math.random() * 360;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.rotationVelocity = this.rotationDirection * getRandomInt(1, 3);
    this.factoredSize = 1;
    this.lifeTime = getRandomInt(Math.round(particleLife * 0.75), particleLife);
    this.lifeTick = 0;
    this.size = size ?? getRandomInt(5, 15);
    this.gravity = gravity;
    this.scaleStep = scaleStep;
    this.fadeTime = fadeTime;
    this.alpha = 1;
    this.baseAlpha = baseAlpha;
    this.color = color ?? (colors && colors.length > 0 ? colors[Math.floor(Math.random() * colors.length)] : "#888888");
    this.shape = shape;
    this.blendMode = blendMode;
    this.glow = glow;
    this.glowSize = glowSize;
    this.glowColor = glowColor;
    this.glowAlpha = glowAlpha;
    this.trail = trail;
    this.trailLength = trailLength;
    this.trailFade = trailFade;
    this.trailShrink = trailShrink;
    this.imageTint = imageTint;
    this.shadow = shadow;
    this.shadowBlur = shadowBlur;
    this.shadowOffsetX = shadowOffsetX;
    this.shadowOffsetY = shadowOffsetY;
    this.shadowColor = shadowColor;
    this.shadowAlpha = shadowAlpha;
    if (homePosition) {
      this.homePosition = new Vector(homePosition.x, homePosition.y);
      this.homeConfig = { ...defaultHomeConfig, ...homeConfig };
      this.rotation = 0;
      this.rotationVelocity = 0;
      this.springMultiplier = 0.6 + Math.random() * 0.8;
      this.nextPulseAt = _Particle.deterministicInterval(
        0,
        this.homeConfig.idlePulseIntervalMin,
        this.homeConfig.idlePulseIntervalMax
      );
      if (homeCenter) {
        const cdx = homePosition.x - homeCenter.x;
        const cdy = homePosition.y - homeCenter.y;
        this.homeDistFromCenter = Math.sqrt(cdx * cdx + cdy * cdy);
        this.homeAngleFromCenter = Math.atan2(cdy, cdx);
      }
    }
  }
  init(image, particular) {
    this.image = image;
    this.particular = particular;
    this.dispatch("PARTICLE_CREATED", this);
  }
  update(forces, dt = 1) {
    this.updateTrail(true, dt);
    this.velocity.add(this.acceleration, dt);
    this.velocity.addFriction(this.friction, dt);
    this.velocity.addGravity(this.gravity, dt);
    if (forces) {
      for (const force of forces) {
        this.velocity.add(force.getForce(this.position), dt);
      }
    }
    if (this.homePosition && this.homeConfig) {
      const dx = this.homePosition.x - this.position.x;
      const dy = this.homePosition.y - this.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
      const isSettled = dist < this.homeConfig.homeThreshold && speed < this.homeConfig.velocityThreshold;
      if (this.homeConfig.idlePulseStrength > 0 && this.homeConfig.idlePulseIntervalMin > 0) {
        this.idleTicks += dt;
      }
      if (isSettled) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.position.x = this.homePosition.x;
        this.position.y = this.homePosition.y;
        if (this.idleEnabled && this.homeConfig.idlePulseStrength > 0 && this.homeConfig.idlePulseIntervalMin > 0) {
          const waveDelay = this.homeDistFromCenter * 0.3;
          if (this.idleTicks >= this.nextPulseAt + waveDelay) {
            const angle = this.homeAngleFromCenter + (Math.random() - 0.5) * 1;
            const mag = this.homeConfig.idlePulseStrength * (0.6 + Math.random() * 0.4);
            this.velocity.x = Math.cos(angle) * mag;
            this.velocity.y = Math.sin(angle) * mag;
            this.pulseCycleCount++;
            this.nextPulseAt += _Particle.deterministicInterval(
              this.pulseCycleCount,
              this.homeConfig.idlePulseIntervalMin,
              this.homeConfig.idlePulseIntervalMax
            );
          }
        }
      } else {
        const k = this.homeConfig.springStrength * this.springMultiplier;
        this.velocity.x += dx * k * dt;
        this.velocity.y += dy * k * dt;
        const dampFactor = Math.pow(this.homeConfig.springDamping, dt);
        this.velocity.x *= dampFactor;
        this.velocity.y *= dampFactor;
        if (this.homeConfig.returnNoise > 0) {
          const noise = this.homeConfig.returnNoise * dt;
          this.velocity.x += (Math.random() - 0.5) * noise;
          this.velocity.y += (Math.random() - 0.5) * noise;
        }
      }
    }
    this.position.add(this.velocity, dt);
    this.rotation = this.rotation + this.rotationVelocity * dt;
    const baseSize = Math.min(this.factoredSize + this.scaleStep * dt, this.size);
    if (this.idleEnabled && this.homePosition && this.homeConfig && this.homeConfig.breathingAmplitude > 0) {
      this.breathingPhase += this.homeConfig.breathingSpeed * dt;
      this.factoredSize = baseSize * (1 + Math.sin(this.breathingPhase) * this.homeConfig.breathingAmplitude);
    } else {
      this.factoredSize = baseSize;
    }
    this.alpha = Math.min(1, Math.max((this.lifeTime - this.lifeTick) / this.fadeTime, 0)) * this.baseAlpha;
    this.lifeTick += dt;
    this.dispatch("PARTICLE_UPDATE", this);
  }
  advanceTrail(dt = 1) {
    this.updateTrail(false, dt);
  }
  updateTrail(addCurrentPoint, dt = 1) {
    if (!this.trail || this.trailLength <= 0) {
      if (this.trailSegments.length) this.trailSegments = [];
      return;
    }
    const maxAge = Math.max(1, Math.floor(this.trailLength));
    this.trailSegments = this.trailSegments.map((segment) => ({ ...segment, age: segment.age + dt })).filter((segment) => segment.age < maxAge);
    if (!addCurrentPoint) return;
    if (this.alpha <= 0) return;
    this.trailSegments.push({
      x: this.position.x,
      y: this.position.y,
      size: this.factoredSize,
      rotation: this.rotation,
      alpha: this.alpha,
      age: 0
    });
  }
  resetImage() {
    this.image = null;
  }
  getRoundedLocation() {
    return [(this.position.x * 10 << 0) * 0.1, (this.position.y * 10 << 0) * 0.1];
  }
  /** Deterministic pseudo-random interval from cycle number — same output for all particles in the same cycle. */
  static deterministicInterval(cycle, min, max) {
    const hash = Math.sin(cycle * 12.9898 + 78.233) * 43758.5453;
    const t = hash - Math.floor(hash);
    return min + t * (max - min);
  }
  dispatch(event, target) {
    if (this.particular) {
      this.particular.dispatchEvent(event, target);
    }
  }
  destroy() {
    this.dispatch("PARTICLE_DEAD", this);
  }
};
EventDispatcher.bind(Particle);

// src/particular/utils/color.ts
function hslToHex(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function generateHarmoniousPalette() {
  const baseHue = Math.random() * 360;
  const offsets = [-20, -8, 0, 10, 20, 30];
  const saturations = [65, 75, 85, 80, 70, 60];
  const lightnesses = [82, 68, 55, 48, 60, 42];
  const colors = [];
  for (let i = 0; i < 6; i++) {
    const h = (baseHue + offsets[i] + 360) % 360;
    colors.push(hslToHex(h, saturations[i], lightnesses[i]));
  }
  return colors;
}

// src/particular/utils/explosion.ts
function createExplosionChild(parent, config, engine, fallbackColors) {
  const merged = { ...defaultExplosionChild, ...config };
  const size = getRandomInt(merged.sizeMin, merged.sizeMax);
  const angle = Math.random() * Math.PI * 2;
  const spread = merged.velocitySpread;
  const speed = merged.velocity * (1 - spread + Math.random() * spread * 2);
  const velocity = Vector.fromAngle(angle, speed);
  const colors = merged.inheritColor ? [parent.color] : fallbackColors.length > 0 ? fallbackColors : [parent.color];
  const particle = new Particle({
    point: new Vector(parent.x, parent.y),
    velocity,
    acceleration: new Vector(0, 0),
    friction: merged.friction,
    size,
    particleLife: merged.childLife,
    gravity: merged.gravity,
    scaleStep: merged.scaleStep,
    fadeTime: merged.fadeTime,
    shape: merged.shape !== defaultExplosionChild.shape ? merged.shape : parent.shape,
    blendMode: merged.blendMode !== defaultExplosionChild.blendMode ? merged.blendMode : parent.blendMode,
    glow: merged.glow,
    glowSize: merged.glowSize,
    glowColor: merged.glowColor,
    glowAlpha: merged.glowAlpha,
    shadow: merged.shadow,
    trail: merged.trail,
    trailLength: merged.trailLength,
    trailFade: merged.trailFade,
    trailShrink: merged.trailShrink,
    colors
  });
  particle.init(null, engine);
  return particle;
}

// src/particular/components/emitter.ts
var Emitter = class {
  constructor(configuration) {
    this.particles = [];
    this.isEmitting = false;
    this.particular = null;
    this.lifeCycle = 0;
    this.emitAccumulator = 0;
    if (!configuration.colors || configuration.colors.length === 0) {
      this.configuration = { ...configuration, colors: generateHarmoniousPalette() };
    } else {
      this.configuration = configuration;
    }
  }
  emit(dt = 1) {
    if (!this.isEmitting) return;
    if (!this.particular) return;
    this.emitAccumulator += this.configuration.rate * dt;
    const count = Math.floor(this.emitAccumulator);
    this.emitAccumulator -= count;
    for (let j = 0; j < count; j++) {
      const particle = this.createParticle();
      const icon = this.configuration.icons.length > 0 ? lodashEs.sample(this.configuration.icons) ?? this.configuration.icons[0] : null;
      particle.init(icon, this.particular);
      this.particles.push(particle);
    }
  }
  assignParticular(particular) {
    this.particular = particular;
  }
  update(boundsX, boundsY, forces, dt = 1) {
    const currentParticles = [];
    const detonate = this.configuration.detonate;
    const newChildren = [];
    lodashEs.forEach(this.particles, (particle) => {
      const pos = particle.position;
      if (pos.x < 0 || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY) {
        if (particle.homePosition) {
          particle.update(forces, dt);
          currentParticles.push(particle);
          return;
        }
        const hasTrail = particle.trail && particle.trailSegments.length > 0;
        if (hasTrail) {
          particle.advanceTrail(dt);
          if (particle.trailSegments.length > 0) {
            currentParticles.push(particle);
          } else {
            particle.destroy();
          }
        } else {
          particle.destroy();
        }
        return;
      }
      particle.update(forces, dt);
      if (detonate && !particle.isDetonationChild && this.particular && particle.lifeTick >= particle.lifeTime * detonate.at) {
        const childCount = detonate.childCount ?? 5;
        const budget = Math.max(0, this.particular.maxCount - this.particular.getCount() - newChildren.length);
        const toSpawn = Math.min(childCount, budget);
        for (let i = 0; i < toSpawn; i++) {
          const child = createExplosionChild(
            {
              x: particle.position.x,
              y: particle.position.y,
              color: particle.color,
              shape: particle.shape,
              blendMode: particle.blendMode
            },
            detonate,
            this.particular,
            this.configuration.colors
          );
          child.isDetonationChild = true;
          newChildren.push(child);
        }
        particle.destroy();
        return;
      }
      const trailActive = particle.trail && particle.trailSegments.length > 0;
      const fadedOut = particle.alpha <= 0 && particle.lifeTick >= particle.lifeTime;
      if (!fadedOut || trailActive) {
        currentParticles.push(particle);
      } else {
        particle.destroy();
      }
    });
    this.particles = newChildren.length > 0 ? [...currentParticles, ...newChildren] : currentParticles;
    this.isEmitting = this.particular?.continuous ? true : this.lifeCycle < this.configuration.life;
  }
  isAlive() {
    return this.isEmitting || this.particles.length > 0;
  }
  createParticle() {
    const {
      velocity,
      spread,
      point,
      sizeMin,
      sizeMax,
      velocityMultiplier,
      particleLife,
      gravity,
      scaleStep,
      fadeTime,
      spawnWidth,
      spawnHeight,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      colors,
      acceleration: accelBase,
      accelerationSize,
      friction: frictionBase,
      frictionSize
    } = this.configuration;
    const angle = velocity.getAngle() + spread - Math.random() * spread * 2;
    const magnitude = velocity.getMagnitude();
    const offsetX = spawnWidth > 0 ? (Math.random() - 0.5) * spawnWidth : 0;
    const offsetY = spawnHeight > 0 ? (Math.random() - 0.5) * spawnHeight : 0;
    const newPoint = new Vector(point.x + offsetX, point.y + offsetY);
    const newVelocity = Vector.fromAngle(angle, magnitude);
    const size = getRandomInt(sizeMin, sizeMax);
    newVelocity.add({ x: 0, y: -((sizeMax - size) / 15) * velocityMultiplier });
    const friction = frictionBase + frictionSize * size;
    const acceleration = new Vector(0, accelBase + accelerationSize * size);
    this.lifeCycle++;
    return new Particle({
      point: newPoint,
      velocity: newVelocity,
      acceleration,
      friction,
      size,
      particleLife,
      gravity,
      scaleStep,
      fadeTime,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      colors
    });
  }
  destroy() {
    destroy(this.particles);
  }
};
var images = [];
function processImages(icons) {
  images = [];
  lodashEs.forEach(icons, (icon) => {
    if (typeof icon === "string") {
      const imageObject = new Image();
      imageObject.src = icon;
      images.push(imageObject);
    } else {
      images.push(icon);
    }
  });
  return images;
}

// src/particular/renderers/canvasRenderer.ts
var CanvasRenderer = class {
  constructor(target) {
    this.name = "CanvasRenderer";
    this.particular = null;
    this.pixelRatio = 2;
    this.resize = (args) => {
      if (!args) return;
      const { width, height } = args;
      this.target.width = width;
      this.target.height = height;
    };
    this.onUpdate = () => {
      this.context.save();
      this.context.scale(this.pixelRatio, this.pixelRatio);
      this.context.clearRect(0, 0, this.target.width, this.target.height);
    };
    this.onUpdateAfter = () => {
      if (this.particular) {
        for (const attractor of this.particular.attractors) {
          if (!attractor.visible) continue;
          const drawable = attractor.toDrawable();
          if (drawable.image && drawable.image instanceof Image) {
            this.drawImage(drawable);
          } else {
            this.drawBasicElement(drawable);
          }
        }
      }
      this.context.restore();
    };
    this.onParticleCreated = () => {
    };
    this.onParticleUpdated = (particle) => {
      if (!particle) return;
      this.drawTrails(particle);
      if (particle.image) {
        if (particle.image instanceof Image) {
          this.drawImage(particle);
        }
      } else {
        this.drawBasicElement(particle);
      }
    };
    this.onParticleDead = (particle) => {
      if (particle) {
        particle.resetImage();
      }
    };
    this.target = target;
    const context = this.target.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.context = context;
  }
  init(particular, pixelRatio) {
    this.particular = particular;
    this.pixelRatio = pixelRatio;
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.context.imageSmoothingEnabled = true;
    particular.addEventListener("UPDATE", this.onUpdate);
    particular.addEventListener("UPDATE_AFTER", this.onUpdateAfter);
    particular.addEventListener("RESIZE", this.resize);
    particular.addEventListener("PARTICLE_CREATED", this.onParticleCreated);
    particular.addEventListener("PARTICLE_UPDATE", this.onParticleUpdated);
    particular.addEventListener("PARTICLE_DEAD", this.onParticleDead);
  }
  drawImage(particle) {
    if (!particle.image || !(particle.image instanceof Image)) return;
    this.context.save();
    this.context.globalAlpha = particle.alpha;
    this.applyShadow(particle);
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
  drawBasicElement(particle) {
    this.context.save();
    this.context.globalAlpha = particle.alpha;
    this.setBlendMode(particle.blendMode);
    this.applyShadow(particle);
    switch (particle.shape) {
      case "circle":
        this.drawCircle(particle);
        break;
      case "square":
      case "rectangle":
        this.drawSquare(particle);
        break;
      case "roundedRectangle":
        this.drawRoundedRectangle(particle);
        break;
      case "triangle":
        this.drawTriangle(particle);
        break;
      case "star":
        this.drawStar(particle);
        break;
      case "ring":
        this.drawRing(particle);
        break;
      case "sparkle":
        this.drawSparkle(particle);
        break;
      default:
        this.drawCircle(particle);
    }
    this.context.restore();
  }
  drawTrails(particle) {
    if (!particle.trail || particle.trailSegments.length === 0) return;
    const maxAge = Math.max(1, Math.floor(particle.trailLength));
    for (const segment of particle.trailSegments) {
      const life = 1 - segment.age / maxAge;
      if (life <= 0) continue;
      const ghost = this.makeTrailGhost(particle, segment, life);
      if (ghost.image) {
        this.drawImage(ghost);
      } else {
        this.drawBasicElement(ghost);
      }
    }
  }
  makeTrailGhost(particle, segment, life) {
    const sizeScale = particle.trailShrink + life * (1 - particle.trailShrink);
    const alphaScale = life * particle.trailFade;
    return {
      ...particle,
      position: { x: segment.x, y: segment.y },
      factoredSize: Math.max(0.1, segment.size * sizeScale),
      rotation: segment.rotation,
      alpha: segment.alpha * alphaScale,
      glow: false,
      shadow: false,
      trailSegments: [],
      getRoundedLocation: () => [
        (segment.x * 10 << 0) * 0.1,
        (segment.y * 10 << 0) * 0.1
      ]
    };
  }
  applyShadow(particle) {
    if (particle.glow) {
      const hex = particle.glowColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const glowAlpha = Math.max(0, Math.min(1, particle.glowAlpha));
      const glowScale = Math.max(0.75, Math.min(2.5, particle.factoredSize / 12));
      this.context.shadowColor = `rgba(${r},${g},${b},${glowAlpha})`;
      this.context.shadowBlur = particle.glowSize * glowScale;
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
    } else if (particle.shadow) {
      const hex = particle.shadowColor;
      const shadowScale = Math.max(0, Math.min(1, particle.alpha));
      const sizeScale = Math.max(0.45, Math.min(2.2, particle.factoredSize / 12));
      const earlyShadowFade = Math.max(0, Math.min(1, (particle.alpha - 0.1) / 0.95));
      const alpha = particle.shadowAlpha * earlyShadowFade;
      const baseDistance = Math.hypot(particle.shadowOffsetX, particle.shadowOffsetY);
      const lightDx = particle.position.x - particle.shadowLightOrigin.x;
      const lightDy = particle.position.y - particle.shadowLightOrigin.y;
      const lightDist = Math.hypot(lightDx, lightDy);
      let offsetX = particle.shadowOffsetX;
      let offsetY = particle.shadowOffsetY;
      if (baseDistance > 0 && lightDist > 1e-4) {
        offsetX = lightDx / lightDist * baseDistance;
        offsetY = lightDy / lightDist * baseDistance;
      }
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      this.context.shadowColor = `rgba(${r},${g},${b},${alpha})`;
      this.context.shadowBlur = particle.shadowBlur * shadowScale * sizeScale;
      this.context.shadowOffsetX = offsetX * shadowScale * sizeScale;
      this.context.shadowOffsetY = offsetY * shadowScale * sizeScale;
    } else {
      this.context.shadowColor = "transparent";
      this.context.shadowBlur = 0;
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
    }
  }
  setBlendMode(mode) {
    switch (mode) {
      case "additive":
        this.context.globalCompositeOperation = "lighter";
        break;
      case "multiply":
        this.context.globalCompositeOperation = "multiply";
        break;
      case "screen":
        this.context.globalCompositeOperation = "screen";
        break;
      default:
        this.context.globalCompositeOperation = "source-over";
    }
  }
  drawCircle(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    this.context.beginPath();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2);
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
  }
  drawSquare(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize * 2;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.fillRect(-particle.factoredSize, -particle.factoredSize, size, size);
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.strokeRect(-particle.factoredSize, -particle.factoredSize, size, size);
    }
    this.context.restore();
  }
  drawRoundedRectangle(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize * 2;
    const radius = Math.min(particle.factoredSize * 0.35, size / 2);
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.beginPath();
    this.context.roundRect(-particle.factoredSize, -particle.factoredSize, size, size, radius);
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  drawTriangle(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    const k = 0.5773502691896258;
    this.context.beginPath();
    this.context.moveTo(0, -size * 2 * k);
    this.context.lineTo(size, size * k);
    this.context.lineTo(-size, size * k);
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  drawStar(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const outerRadius = particle.factoredSize;
    const innerRadius = particle.factoredSize / 2;
    const spikes = 5;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = Math.PI / spikes * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  drawRing(particle) {
    this.context.strokeStyle = particle.color;
    this.context.lineWidth = Math.max(2, particle.factoredSize / 4);
    const pixelRounded = particle.getRoundedLocation();
    this.context.beginPath();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2);
    this.context.stroke();
  }
  drawSparkle(particle) {
    this.context.strokeStyle = particle.color;
    this.context.lineWidth = 2;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.beginPath();
    this.context.moveTo(-size, 0);
    this.context.lineTo(size, 0);
    this.context.moveTo(0, -size);
    this.context.lineTo(0, size);
    const diag = size * 0.7;
    this.context.moveTo(-diag, -diag);
    this.context.lineTo(diag, diag);
    this.context.moveTo(-diag, diag);
    this.context.lineTo(diag, -diag);
    this.context.stroke();
    this.context.restore();
  }
  destroy() {
    this.remove();
  }
  remove() {
    if (!this.particular) return;
    this.particular.removeEventListener("UPDATE", this.onUpdate);
    this.particular.removeEventListener("UPDATE_AFTER", this.onUpdateAfter);
    this.particular.removeEventListener("RESIZE", this.resize);
    this.particular.removeEventListener("PARTICLE_CREATED", this.onParticleCreated);
    this.particular.removeEventListener("PARTICLE_UPDATE", this.onParticleUpdated);
    this.particular.removeEventListener("PARTICLE_DEAD", this.onParticleDead);
    this.particular = null;
  }
};

// src/particular/renderers/webglRenderer.ts
var VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;
in float a_particle_shape;

uniform vec2 u_resolution;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;
out float v_particle_shape;

void main() {
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);
  vec2 pos = (a_particle_pos + rotated * a_particle_size) / u_resolution * 2.0 - 1.0;
  pos.y = -pos.y;
  gl_Position = vec4(pos, 0.0, 1.0);
  v_color = a_particle_color;
  v_uv = a_position;
  v_particle_size = a_particle_size;
  v_particle_shape = a_particle_shape;
}
`;
var FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
in float v_particle_size;
in float v_particle_shape;

uniform float u_softness;
uniform float u_glow;
uniform float u_glowSize;
uniform vec4 u_glowColor;
uniform float u_isShadow;
uniform vec4 u_shadowColor;
uniform float u_shadowBlur;

out vec4 outColor;

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float sdEquilateralTriangle(vec2 p) {
  const float k = 1.7320508;
  p.x = abs(p.x) - 1.0;
  p.y = p.y + 1.0 / k;
  if (p.x + k * p.y > 0.0) {
    p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  }
  p.x -= clamp(p.x, -2.0, 0.0);
  return -length(p) * sign(p.y);
}

float sdStar5(vec2 p, float r, float rf) {
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-k1.x, k1.y);
  p.x = abs(p.x);
  p -= 2.0 * max(dot(k1, p), 0.0) * k1;
  p -= 2.0 * max(dot(k2, p), 0.0) * k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0.0, 1.0);
  float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
  return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}

float shapeSdf(vec2 p, float shapeId) {
  if (shapeId < 0.5) {
    return length(p) - 1.0; // circle
  }
  if (shapeId < 1.5) {
    return sdBox(p, vec2(1.0)); // rectangle/square
  }
  if (shapeId < 2.5) {
    return sdEquilateralTriangle(p); // triangle
  }
  if (shapeId < 3.5) {
    return sdStar5(p, 1.0, 0.45); // star
  }
  return sdRoundedBox(p, vec2(0.75), 0.25); // rounded rectangle
}

void main() {
  float sd = shapeSdf(v_uv, v_particle_shape);
  float particleAlpha = pow(clamp(v_color.a, 0.0, 1.0), 0.8);

  if (u_isShadow > 0.0) {
    float retraction = clamp(v_color.a, 0.0, 1.0);
    float sizeScale = clamp(v_particle_size / 12.0, 0.45, 2.2);
    float effectiveShadowBlur = u_shadowBlur * retraction * sizeScale;
    float shadowAlpha = 1.0 - smoothstep(-0.02, effectiveShadowBlur, sd);
    outColor = vec4(u_shadowColor.rgb, u_shadowColor.a * shadowAlpha * retraction);
    return;
  }

  float coreAlpha = 1.0 - smoothstep(-u_softness, u_softness, sd);
  float alpha = coreAlpha;
  vec3 rgb = v_color.rgb;
  if (u_glow > 0.0) {
    float glowScale = mix(0.75, 1.75, clamp((v_particle_size - 4.0) / 20.0, 0.0, 1.0));
    float glowRange = u_glowSize * glowScale;
    float halo = 1.0 - smoothstep(0.0, glowRange, sd);
    // Quadratic tail softens the outer edge so glow fades more naturally.
    halo = halo * halo;
    float glowAlpha = halo * u_glowColor.a;
    alpha = max(alpha, glowAlpha);
    float glowMix = clamp((1.0 - coreAlpha) * glowAlpha, 0.0, 1.0);
    rgb = mix(rgb, u_glowColor.rgb, glowMix);
  }
  outColor = vec4(rgb, particleAlpha * alpha);
}
`;
var IMAGE_VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;

uniform vec2 u_resolution;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;

void main() {
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);
  vec2 pos = (a_particle_pos + rotated * a_particle_size) / u_resolution * 2.0 - 1.0;
  pos.y = -pos.y;
  gl_Position = vec4(pos, 0.0, 1.0);
  v_color = a_particle_color;
  v_uv = a_position * 0.5 + 0.5;
  v_particle_size = a_particle_size;
}
`;
var IMAGE_FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
in float v_particle_size;

uniform sampler2D u_texture;
uniform float u_tint;
uniform float u_isShadow;
uniform vec4 u_shadowColor;
uniform float u_shadowBlur;

out vec4 outColor;

void main() {
  vec4 tex = texture(u_texture, v_uv);

  if (u_isShadow > 0.0) {
    vec2 texel = 1.0 / vec2(textureSize(u_texture, 0));
    float retraction = clamp(v_color.a, 0.0, 1.0);
    float sizeScale = clamp(v_particle_size / 12.0, 0.45, 2.2);
    vec2 blur = texel * (u_shadowBlur * retraction * sizeScale);

    // 9-tap weighted blur on alpha for softer image shadows.
    float a = tex.a * 0.28;
    a += texture(u_texture, v_uv + vec2( blur.x, 0.0)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(-blur.x, 0.0)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(0.0,  blur.y)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(0.0, -blur.y)).a * 0.12;
    a += texture(u_texture, v_uv + vec2( blur.x,  blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2(-blur.x,  blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2( blur.x, -blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2(-blur.x, -blur.y)).a * 0.06;
    outColor = vec4(u_shadowColor.rgb, min(1.0, a) * u_shadowColor.a * retraction);
    return;
  }

  vec3 rgb = mix(tex.rgb, tex.rgb * v_color.rgb, u_tint);
  float particleAlpha = pow(clamp(v_color.a, 0.0, 1.0), 0.8);
  outColor = vec4(rgb, tex.a * particleAlpha);
}
`;
function hexToRgba(hex) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return [1, 1, 1, 1];
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
    1
  ];
}
function shapeToId(shape) {
  switch (shape) {
    case "square":
    case "rectangle":
      return 1;
    case "triangle":
      return 2;
    case "star":
      return 3;
    case "roundedRectangle":
      return 4;
    default:
      return 0;
  }
}
function setBlendMode(gl, mode) {
  gl.enable(gl.BLEND);
  switch (mode) {
    case "additive":
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case "multiply":
      gl.blendFuncSeparate(gl.DST_COLOR, gl.ZERO, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case "screen":
      gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    default:
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
  }
}
var WebGLRenderer = class {
  constructor(target, options) {
    this.gl = null;
    this.program = null;
    this.imageProgram = null;
    this.quadBuffer = null;
    this.circleQuadBuffer = null;
    this.instanceBuffer = null;
    this.particular = null;
    this.pixelRatio = 2;
    this.instanceStride = 9;
    this.resolutionUniform = null;
    this.softnessUniform = null;
    this.glowUniform = null;
    this.glowSizeUniform = null;
    this.glowColorUniform = null;
    this.isShadowUniform = null;
    this.shadowColorUniform = null;
    this.shadowBlurUniform = null;
    this.imageResolutionUniform = null;
    this.imageTintUniform = null;
    this.imageIsShadowUniform = null;
    this.imageShadowColorUniform = null;
    this.imageShadowBlurUniform = null;
    this.textureCache = /* @__PURE__ */ new Map();
    this.resize = (args) => {
      if (!args || !this.gl) return;
      const { width, height } = args;
      this.target.width = width;
      this.target.height = height;
      this.gl.viewport(0, 0, width, height);
    };
    this.onUpdate = () => {
      if (!this.gl) return;
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    this.onUpdateAfter = () => {
      if (!this.gl || !this.particular || !this.program) return;
      const baseParticles = this.particular.getAllParticles();
      const attractorDrawables = [];
      for (const attractor of this.particular.attractors) {
        if (attractor.visible) {
          attractorDrawables.push(attractor.toDrawable());
        }
      }
      const particles = this.expandParticlesWithTrails(baseParticles).concat(attractorDrawables);
      const pixelRatio = this.particular.pixelRatio;
      const w = this.target.width || this.particular.width;
      const h = this.target.height || this.particular.height;
      const logicalW = w / pixelRatio;
      const logicalH = h / pixelRatio;
      if (logicalW <= 0 || logicalH <= 0) return;
      const batches = this.buildBatches(particles);
      if (!this.resolutionUniform || !this.softnessUniform || !this.glowUniform || !this.glowSizeUniform || !this.glowColorUniform) return;
      this.gl.useProgram(this.program);
      this.gl.uniform2f(this.resolutionUniform, logicalW, logicalH);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleQuadBuffer);
      const posLoc = this.gl.getAttribLocation(this.program, "a_position");
      this.gl.enableVertexAttribArray(posLoc);
      this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);
      for (const batch of batches) {
        if (batch.type === "circle") {
          this.drawCircleBatch(batch);
        } else {
          this.drawImageBatch(batch, logicalW, logicalH);
          this.gl.useProgram(this.program);
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleQuadBuffer);
          this.gl.enableVertexAttribArray(posLoc);
          this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);
        }
      }
    };
    this.target = target;
    this.maxInstances = options?.maxInstances ?? 4096;
    this.instanceStride = 9;
    this.instanceData = new Float32Array(this.maxInstances * this.instanceStride);
  }
  init(particular, pixelRatio) {
    this.particular = particular;
    this.pixelRatio = pixelRatio;
    const gl = this.target.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true
    });
    if (!gl) {
      throw new Error("WebGL2 not supported");
    }
    this.gl = gl;
    const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) throw new Error("Failed to create program");
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Shader link error: " + gl.getProgramInfoLog(program));
    }
    this.program = program;
    this.resolutionUniform = gl.getUniformLocation(program, "u_resolution");
    this.softnessUniform = gl.getUniformLocation(program, "u_softness");
    this.glowUniform = gl.getUniformLocation(program, "u_glow");
    this.glowSizeUniform = gl.getUniformLocation(program, "u_glowSize");
    this.glowColorUniform = gl.getUniformLocation(program, "u_glowColor");
    this.isShadowUniform = gl.getUniformLocation(program, "u_isShadow");
    this.shadowColorUniform = gl.getUniformLocation(program, "u_shadowColor");
    this.shadowBlurUniform = gl.getUniformLocation(program, "u_shadowBlur");
    const imageVs = this.compileShader(gl.VERTEX_SHADER, IMAGE_VERTEX_SHADER);
    const imageFs = this.compileShader(gl.FRAGMENT_SHADER, IMAGE_FRAGMENT_SHADER);
    const imageProgram = gl.createProgram();
    if (!imageProgram) throw new Error("Failed to create image program");
    gl.attachShader(imageProgram, imageVs);
    gl.attachShader(imageProgram, imageFs);
    gl.linkProgram(imageProgram);
    if (!gl.getProgramParameter(imageProgram, gl.LINK_STATUS)) {
      throw new Error("Image shader link error: " + gl.getProgramInfoLog(imageProgram));
    }
    this.imageProgram = imageProgram;
    this.imageResolutionUniform = gl.getUniformLocation(imageProgram, "u_resolution");
    this.imageTintUniform = gl.getUniformLocation(imageProgram, "u_tint");
    this.imageIsShadowUniform = gl.getUniformLocation(imageProgram, "u_isShadow");
    this.imageShadowColorUniform = gl.getUniformLocation(imageProgram, "u_shadowColor");
    this.imageShadowBlurUniform = gl.getUniformLocation(imageProgram, "u_shadowBlur");
    const quadData = new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1
    ]);
    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);
    const circleQuadData = new Float32Array([
      -2,
      -2,
      2,
      -2,
      -2,
      2,
      -2,
      2,
      2,
      -2,
      2,
      2
    ]);
    this.circleQuadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleQuadData, gl.STATIC_DRAW);
    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.instanceData.byteLength,
      gl.DYNAMIC_DRAW
    );
    particular.addEventListener("UPDATE", this.onUpdate);
    particular.addEventListener("UPDATE_AFTER", this.onUpdateAfter);
    particular.addEventListener("RESIZE", this.resize);
  }
  getOrCreateTexture(image) {
    if (!image.complete || image.naturalWidth === 0) return null;
    let tex = this.textureCache.get(image);
    if (tex) return tex;
    const gl = this.gl;
    tex = gl.createTexture();
    if (!tex) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    this.textureCache.set(image, tex);
    return tex;
  }
  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        "Shader compile error: " + gl.getShaderInfoLog(shader)
      );
    }
    return shader;
  }
  expandParticlesWithTrails(particles) {
    const expanded = [];
    for (const particle of particles) {
      expanded.push(particle);
      if (!particle.trail || particle.trailSegments.length === 0) continue;
      const maxAge = Math.max(1, Math.floor(particle.trailLength));
      for (const segment of particle.trailSegments) {
        const life = 1 - segment.age / maxAge;
        if (life <= 0) continue;
        const sizeScale = particle.trailShrink + life * (1 - particle.trailShrink);
        const alphaScale = life * particle.trailFade;
        const ghost = {
          ...particle,
          position: { x: segment.x, y: segment.y },
          factoredSize: Math.max(0.1, segment.size * sizeScale),
          rotation: segment.rotation,
          alpha: segment.alpha * alphaScale,
          glow: false,
          shadow: false,
          trailSegments: []
        };
        expanded.push(ghost);
      }
    }
    return expanded;
  }
  buildBatches(particles) {
    const batches = [];
    let current = null;
    for (const p of particles) {
      const img = p.image && p.image instanceof HTMLImageElement ? p.image : null;
      const tex = img ? this.getOrCreateTexture(img) : null;
      const isImage = !!tex;
      const blendMode = p.blendMode;
      const imageTint = !!p.imageTint;
      const sameBatch = current && current.type === (isImage ? "image" : "circle") && current.blendMode === blendMode && current.shadow === p.shadow && (!p.shadow || current.shadowOffsetX === p.shadowOffsetX && current.shadowOffsetY === p.shadowOffsetY && current.shadowBlur === p.shadowBlur && current.shadowColor === p.shadowColor && current.shadowAlpha === p.shadowAlpha) && (isImage ? current.texture === tex && current.imageTint === imageTint : current.glow === p.glow && (!p.glow || current.glowSize === p.glowSize && current.glowColor === p.glowColor && current.glowAlpha === p.glowAlpha));
      if (!sameBatch) {
        current = {
          type: isImage ? "image" : "circle",
          blendMode,
          shadow: p.shadow,
          shadowBlur: p.shadowBlur,
          shadowOffsetX: p.shadowOffsetX,
          shadowOffsetY: p.shadowOffsetY,
          shadowColor: p.shadowColor,
          shadowAlpha: p.shadowAlpha,
          particles: []
        };
        if (isImage && tex) {
          current.texture = tex;
          current.image = img;
          current.imageTint = imageTint;
        } else {
          current.glow = p.glow;
          current.glowSize = p.glowSize;
          current.glowColor = p.glowColor;
          current.glowAlpha = p.glowAlpha;
        }
        batches.push(current);
      }
      current.particles.push(p);
    }
    return batches;
  }
  fillInstanceData(particles, offsetX = 0, offsetY = 0, scaleOffsetByAlpha = false, directionalFromLightOrigin = false) {
    let offset = 0;
    for (const p of particles) {
      const [r, g, b] = hexToRgba(p.color);
      let effectiveOffsetX = offsetX;
      let effectiveOffsetY = offsetY;
      if (directionalFromLightOrigin) {
        const baseDistance = Math.hypot(offsetX, offsetY);
        const lightDx = p.position.x - p.shadowLightOrigin.x;
        const lightDy = p.position.y - p.shadowLightOrigin.y;
        const lightDist = Math.hypot(lightDx, lightDy);
        if (baseDistance > 0 && lightDist > 1e-4) {
          effectiveOffsetX = lightDx / lightDist * baseDistance;
          effectiveOffsetY = lightDy / lightDist * baseDistance;
        }
      }
      if (scaleOffsetByAlpha) {
        const retraction = Math.max(0, Math.min(1, p.alpha));
        const sizeScale = Math.max(0.45, Math.min(2.2, p.factoredSize / 12));
        effectiveOffsetX *= retraction;
        effectiveOffsetY *= retraction;
        effectiveOffsetX *= sizeScale;
        effectiveOffsetY *= sizeScale;
      }
      this.instanceData[offset++] = p.position.x + effectiveOffsetX;
      this.instanceData[offset++] = p.position.y + effectiveOffsetY;
      this.instanceData[offset++] = p.factoredSize;
      this.instanceData[offset++] = p.rotation * Math.PI / 180;
      this.instanceData[offset++] = r;
      this.instanceData[offset++] = g;
      this.instanceData[offset++] = b;
      this.instanceData[offset++] = p.alpha;
      this.instanceData[offset++] = shapeToId(p.shape);
    }
  }
  drawCircleInstances(list, offsetX, offsetY, scaleOffsetByAlpha = false, directionalFromLightOrigin = false) {
    const gl = this.gl;
    const stride = this.instanceStride;
    const posLoc2 = gl.getAttribLocation(this.program, "a_particle_pos");
    const sizeLoc = gl.getAttribLocation(this.program, "a_particle_size");
    const rotLoc = gl.getAttribLocation(this.program, "a_particle_rotation");
    const colLoc = gl.getAttribLocation(this.program, "a_particle_color");
    const shapeLoc = gl.getAttribLocation(this.program, "a_particle_shape");
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const chunk = list.slice(i, i + this.maxInstances);
      this.fillInstanceData(
        chunk,
        offsetX,
        offsetY,
        scaleOffsetByAlpha,
        directionalFromLightOrigin
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, chunk.length * stride));
      gl.enableVertexAttribArray(posLoc2);
      gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, stride * 4, 0);
      gl.vertexAttribDivisor(posLoc2, 1);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride * 4, 8);
      gl.vertexAttribDivisor(sizeLoc, 1);
      gl.enableVertexAttribArray(rotLoc);
      gl.vertexAttribPointer(rotLoc, 1, gl.FLOAT, false, stride * 4, 12);
      gl.vertexAttribDivisor(rotLoc, 1);
      gl.enableVertexAttribArray(colLoc);
      gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, stride * 4, 16);
      gl.vertexAttribDivisor(colLoc, 1);
      gl.enableVertexAttribArray(shapeLoc);
      gl.vertexAttribPointer(shapeLoc, 1, gl.FLOAT, false, stride * 4, 32);
      gl.vertexAttribDivisor(shapeLoc, 1);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, chunk.length);
      gl.vertexAttribDivisor(posLoc2, 0);
      gl.vertexAttribDivisor(sizeLoc, 0);
      gl.vertexAttribDivisor(rotLoc, 0);
      gl.vertexAttribDivisor(colLoc, 0);
      gl.vertexAttribDivisor(shapeLoc, 0);
    }
  }
  drawCircleBatch(batch) {
    const gl = this.gl;
    const list = batch.particles;
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? "#000000");
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.isShadowUniform, 1);
      gl.uniform4f(this.shadowColorUniform, sr, sg, sb, sa);
      gl.uniform1f(this.shadowBlurUniform, Math.min(1, (batch.shadowBlur ?? 8) / 20));
      this.drawCircleInstances(list, batch.shadowOffsetX ?? 4, batch.shadowOffsetY ?? 4, true, true);
      gl.uniform1f(this.isShadowUniform, 0);
    }
    setBlendMode(gl, batch.blendMode);
    gl.uniform1f(this.softnessUniform, 0.1);
    gl.uniform1f(this.glowUniform, batch.glow ? 1 : 0);
    gl.uniform1f(this.glowSizeUniform, Math.min(0.5, (batch.glowSize ?? 10) / 30));
    const [gr, gg, gb] = hexToRgba(batch.glowColor ?? "#ffffff");
    gl.uniform4f(this.glowColorUniform, gr, gg, gb, Math.max(0, Math.min(1, batch.glowAlpha ?? 0.35)));
    this.drawCircleInstances(list, 0, 0);
  }
  drawImageInstances(list, offsetX, offsetY, scaleOffsetByAlpha = false, directionalFromLightOrigin = false) {
    const gl = this.gl;
    const stride = this.instanceStride;
    const posLoc2 = gl.getAttribLocation(this.imageProgram, "a_particle_pos");
    const sizeLoc = gl.getAttribLocation(this.imageProgram, "a_particle_size");
    const rotLoc = gl.getAttribLocation(this.imageProgram, "a_particle_rotation");
    const colLoc = gl.getAttribLocation(this.imageProgram, "a_particle_color");
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const chunk = list.slice(i, i + this.maxInstances);
      this.fillInstanceData(
        chunk,
        offsetX,
        offsetY,
        scaleOffsetByAlpha,
        directionalFromLightOrigin
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, chunk.length * stride));
      gl.enableVertexAttribArray(posLoc2);
      gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, stride * 4, 0);
      gl.vertexAttribDivisor(posLoc2, 1);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride * 4, 8);
      gl.vertexAttribDivisor(sizeLoc, 1);
      gl.enableVertexAttribArray(rotLoc);
      gl.vertexAttribPointer(rotLoc, 1, gl.FLOAT, false, stride * 4, 12);
      gl.vertexAttribDivisor(rotLoc, 1);
      gl.enableVertexAttribArray(colLoc);
      gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, stride * 4, 16);
      gl.vertexAttribDivisor(colLoc, 1);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, chunk.length);
      gl.vertexAttribDivisor(posLoc2, 0);
      gl.vertexAttribDivisor(sizeLoc, 0);
      gl.vertexAttribDivisor(rotLoc, 0);
      gl.vertexAttribDivisor(colLoc, 0);
    }
  }
  drawImageBatch(batch, logicalW, logicalH) {
    const gl = this.gl;
    const list = batch.particles;
    if (!this.imageProgram || !batch.texture || !this.imageResolutionUniform || !this.imageTintUniform || !this.imageShadowBlurUniform) return;
    gl.useProgram(this.imageProgram);
    gl.uniform2f(this.imageResolutionUniform, logicalW, logicalH);
    gl.uniform1f(this.imageTintUniform, batch.imageTint ? 1 : 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, batch.texture);
    const texLoc = gl.getUniformLocation(this.imageProgram, "u_texture");
    gl.uniform1i(texLoc, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    const posLoc = gl.getAttribLocation(this.imageProgram, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? "#000000");
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.imageIsShadowUniform, 1);
      gl.uniform4f(this.imageShadowColorUniform, sr, sg, sb, sa);
      gl.uniform1f(this.imageShadowBlurUniform, Math.max(0, batch.shadowBlur ?? 8));
      this.drawImageInstances(list, batch.shadowOffsetX ?? 4, batch.shadowOffsetY ?? 4, true, true);
      gl.uniform1f(this.imageIsShadowUniform, 0);
    }
    setBlendMode(gl, batch.blendMode);
    this.drawImageInstances(list, 0, 0);
  }
  destroy() {
    this.remove();
  }
  remove() {
    if (!this.particular || !this.gl) return;
    this.particular.removeEventListener("UPDATE", this.onUpdate);
    this.particular.removeEventListener("UPDATE_AFTER", this.onUpdateAfter);
    this.particular.removeEventListener("RESIZE", this.resize);
    if (this.quadBuffer) this.gl.deleteBuffer(this.quadBuffer);
    if (this.circleQuadBuffer) this.gl.deleteBuffer(this.circleQuadBuffer);
    if (this.instanceBuffer) this.gl.deleteBuffer(this.instanceBuffer);
    if (this.program) this.gl.deleteProgram(this.program);
    if (this.imageProgram) this.gl.deleteProgram(this.imageProgram);
    for (const tex of this.textureCache.values()) {
      this.gl.deleteTexture(tex);
    }
    this.textureCache.clear();
    this.particular = null;
    this.gl = null;
    this.program = null;
    this.imageProgram = null;
    this.quadBuffer = null;
    this.circleQuadBuffer = null;
    this.instanceBuffer = null;
  }
};

// src/particular/canvasStyles.ts
var DEFAULT_Z_INDEX = 1e4;
var particlesBackgroundLayerStyle = {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: DEFAULT_Z_INDEX
};
function getParticlesBackgroundLayerStyle(zIndex) {
  return zIndex !== void 0 ? { ...particlesBackgroundLayerStyle, zIndex } : particlesBackgroundLayerStyle;
}
var particlesContainerLayerStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none"
};
function getParticlesContainerLayerStyle(zIndex) {
  return zIndex !== void 0 ? { ...particlesContainerLayerStyle, zIndex } : particlesContainerLayerStyle;
}
function applyCanvasStyles(canvas, container, zIndex) {
  const style = container ? getParticlesContainerLayerStyle(zIndex) : getParticlesBackgroundLayerStyle(zIndex);
  Object.assign(canvas.style, style);
}
var CanvasWrapper = class extends React__default.default.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.onWindowResize = () => {
      this.particular.onResize();
      const height = window.innerHeight;
      const width = window.innerWidth;
      this.setState({ width, height });
    };
    this.configure = (configuration) => {
      this.configuration = configureParticular(configuration);
      this.particular.initialize(this.configuration);
      if (this.canvas) {
        const renderer = this.configuration?.renderer === "webgl" ? new WebGLRenderer(this.canvas, {
          maxInstances: this.configuration?.webglMaxInstances
        }) : new CanvasRenderer(this.canvas);
        this.particular.addRenderer(renderer);
      }
      if (this.configuration.autoStart) {
        this.create({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
    };
    this.create = (settings) => {
      if (!this.configuration) return;
      const combinedSettings = configureParticle(settings, this.configuration);
      let icons = [];
      if (combinedSettings.icons) {
        icons = processImages(combinedSettings.icons);
      }
      const x = (settings?.x ?? 0) / this.configuration.pixelRatio;
      const y = (settings?.y ?? 0) / this.configuration.pixelRatio;
      this.particular.addEmitter(
        new Emitter({
          point: new Vector(x, y),
          ...combinedSettings,
          icons
        })
      );
    };
    this.state = { width: 100, height: 100 };
    this.particular = new Particular();
  }
  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    this.particular.destroy();
  }
  render() {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "canvas",
      {
        ref: (canvas) => {
          this.canvas = canvas;
        },
        className: "particular",
        width: this.state.width,
        height: this.state.height,
        style: {
          ...particlesBackgroundLayerStyle,
          position: "absolute",
          width: this.state.width,
          height: this.state.height,
          cursor: "auto",
          opacity: 1,
          zIndex: this.configuration?.zIndex ?? particlesBackgroundLayerStyle.zIndex
        }
      }
    );
  }
};

// src/particular/presets.ts
var snowPalette = ["#ffffff", "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6"];
var grayscalePalette = ["#f8f9fa", "#dee2e6", "#adb5bd", "#868e96", "#495057", "#212529"];
var coolBluePalette = ["#d0ebff", "#a5d8ff", "#74c0fc", "#4dabf7", "#339af0", "#228be6"];
var bluePalette = ["#003d99", "#0057d9", "#0077ff", "#1a8cff", "#3da1ff", "#66b8ff"];
var orangePalette = ["#b33600", "#cc4a00", "#e86100", "#f57c00", "#ff9500", "#ffad33"];
var greenPalette = ["#006b3f", "#008c51", "#00a85e", "#00c46b", "#1edd80", "#4deda0"];
var mutedPalette = ["#d4a373", "#ccd5ae", "#e9edc9", "#a8dadc", "#b5838d", "#e5989b", "#8d99ae"];
var fireworksPalette = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#ff6b81", "#eccc68", "#7bed9f", "#70a1ff", "#ffffff"];
var meteorPalette = ["#ffffff", "#fff4e0", "#ffd699", "#ff9500", "#ff6b00", "#e84d00"];
var waterPalette = ["#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da", "#00acc1", "#ffffff"];
var finlandPalette = ["#003580", "#002f6c", "#ffffff", "#f8f9fa"];
var usaPalette = ["#B22234", "#ffffff", "#3C3B6E"];
var Burst = {
  /** Celebratory confetti burst: colorful rectangles fluttering outward and drifting down */
  confetti: {
    shape: "rectangle",
    blendMode: "normal",
    rate: 20,
    life: 28,
    velocity: Vector.fromAngle(-90, 7),
    spread: Math.PI * 0.85,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 6,
    fadeTime: 35,
    gravity: 0.14,
    scaleStep: 1.2,
    friction: 5e-3,
    maxCount: 500,
    colors: mutedPalette
  },
  /** Signature magical burst: soft white glow + star silhouettes */
  magic: {
    shape: "circle",
    blendMode: "normal",
    glow: false,
    rate: 14,
    life: 34,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1.15,
    sizeMin: 6,
    sizeMax: 16,
    velocityMultiplier: 5,
    fadeTime: 30,
    gravity: 0.1,
    scaleStep: 0.9,
    maxCount: 360,
    trail: true,
    trailLength: 12,
    colors: coolBluePalette
  },
  /** Cinematic fireworks: energetic circles with bright bloom */
  fireworks: {
    shape: "circle",
    blendMode: "normal",
    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-90, 8.8),
    spread: Math.PI * 1.05,
    sizeMin: 4,
    sizeMax: 12,
    velocityMultiplier: 8,
    fadeTime: 20,
    gravity: 0.18,
    scaleStep: 1.15,
    maxCount: 520,
    trail: true,
    trailLength: 8,
    trailFade: 0.35,
    trailShrink: 0.5,
    colors: mutedPalette
  },
  /** Fireworks with timed detonation: narrow upward launch that auto-explodes into colorful sub-bursts */
  fireworksDetonation: {
    shape: "circle",
    blendMode: "normal",
    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-Math.PI / 2, 8.8),
    spread: Math.PI / 4,
    sizeMin: 3,
    sizeMax: 6,
    velocityMultiplier: 8,
    fadeTime: 20,
    gravity: 0.08,
    scaleStep: 1.15,
    maxCount: 3e3,
    particleLife: 80,
    detonate: {
      at: 0.7,
      childCount: 8,
      velocity: 5,
      velocitySpread: 0.6,
      friction: 0.015,
      scaleStep: 1,
      childLife: 45,
      sizeMin: 1,
      sizeMax: 4,
      fadeTime: 18,
      inheritColor: true,
      trail: true,
      trailLength: 4,
      trailFade: 0.5,
      trailShrink: 0.65
    }
  }
};
var Images = {
  /** Tuned for icon/image particles (no tint by default). */
  showcase: {
    shape: "roundedRectangle",
    blendMode: "normal",
    imageTint: false,
    glow: false,
    rate: 12,
    life: 36,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1,
    sizeMin: 5,
    sizeMax: 22,
    velocityMultiplier: 4,
    fadeTime: 30,
    gravity: 0.2,
    scaleStep: 0.8,
    maxCount: 380
  }
};
var Ambient = {
  /** Gentle snowfall: soft white particles drifting downward across the viewport */
  snow: {
    shape: "circle",
    blendMode: "normal",
    glow: true,
    glowSize: 8,
    glowColor: "#ffffff",
    glowAlpha: 0.2,
    shadow: false,
    rate: 0.55,
    life: 999999,
    particleLife: 500,
    velocity: Vector.fromAngle(Math.PI / 2, 0.4),
    spread: Math.PI * 0.15,
    sizeMin: 1,
    sizeMax: 4,
    velocityMultiplier: 0.3,
    fadeTime: 60,
    gravity: 5e-3,
    acceleration: 0,
    accelerationSize: 1e-3,
    friction: 1e-3,
    frictionSize: 3e-3,
    scaleStep: 1,
    maxCount: 280,
    continuous: true,
    autoStart: true,
    colors: snowPalette
  },
  /** Meteors: bright diagonal streaks with glowing trails, accelerating as they fall */
  meteors: {
    shape: "circle",
    blendMode: "normal",
    glow: true,
    glowSize: 12,
    glowColor: "#ff8c00",
    glowAlpha: 0.4,
    shadow: false,
    trail: true,
    trailLength: 15,
    trailFade: 0.2,
    trailShrink: 0.5,
    rate: 0.3,
    life: 999999,
    particleLife: 250,
    velocity: Vector.fromAngle(Math.PI * 0.5, 8.5),
    spread: Math.PI * 0.5,
    sizeMin: 1,
    sizeMax: 8,
    velocityMultiplier: 0.5,
    fadeTime: 40,
    gravity: 0.05,
    acceleration: 0.02,
    accelerationSize: 5e-3,
    friction: 0,
    frictionSize: 0,
    scaleStep: 1,
    maxCount: 150,
    continuous: true,
    autoStart: true,
    colors: meteorPalette
  },
  /** Fireworks show: gentle rockets launch from the bottom and auto-explode into colorful bursts */
  fireworksShow: {
    shape: "triangle",
    blendMode: "normal",
    trail: true,
    trailLength: 6,
    trailFade: 0.3,
    trailShrink: 0.5,
    rate: 0.25,
    life: 999999,
    particleLife: 120,
    velocity: Vector.fromAngle(-Math.PI / 2, 7),
    spread: Math.PI / 6,
    sizeMin: 2,
    sizeMax: 4,
    velocityMultiplier: 3,
    fadeTime: 15,
    gravity: 0.05,
    scaleStep: 1,
    maxCount: 1200,
    continuous: true,
    autoStart: true,
    colors: fireworksPalette,
    detonate: {
      at: 0.65,
      childCount: 10,
      velocity: 4,
      velocitySpread: 0.6,
      friction: 0.02,
      scaleStep: 0.8,
      childLife: 50,
      sizeMin: 1,
      sizeMax: 3,
      fadeTime: 20,
      inheritColor: true,
      trail: true,
      trailLength: 4,
      trailFade: 0.5,
      trailShrink: 0.6
    }
  },
  /** River flow: horizontal stream of water particles, designed for use with attractors */
  river: {
    shape: "circle",
    blendMode: "normal",
    glow: true,
    glowSize: 6,
    glowColor: "#80deea",
    glowAlpha: 0.25,
    shadow: false,
    trail: true,
    trailLength: 6,
    trailFade: 0.5,
    trailShrink: 0.4,
    rate: 4,
    life: 999999,
    particleLife: 220,
    velocity: Vector.fromAngle(0, 1.8),
    spread: Math.PI / 10,
    sizeMin: 1,
    sizeMax: 4,
    velocityMultiplier: 0,
    fadeTime: 80,
    gravity: 0,
    friction: 0,
    scaleStep: 1,
    maxCount: 500,
    continuous: true,
    autoStart: true,
    colors: waterPalette
  }
};
var ImageParticles = {
  /** High-fidelity text rendered as tiny particles with spring return. */
  text: {
    shape: "square",
    blendMode: "normal",
    shadow: false,
    glow: false,
    maxCount: 1e4
  },
  /** Shape/icon rendered as particles with soft glow. */
  shape: {
    shape: "circle",
    blendMode: "normal",
    shadow: false,
    glow: true,
    glowSize: 8,
    glowAlpha: 0.3,
    maxCount: 1e4
  }
};
var Colors = {
  /** White to offwhite range */
  snow: { colors: snowPalette },
  /** Full black-to-white range */
  grayscale: { colors: grayscalePalette },
  /** Single-hue cool blue range */
  coolBlue: { colors: coolBluePalette },
  /** Desaturated warm/cool mix */
  muted: { colors: mutedPalette },
  /** Bold saturated blue */
  blue: { colors: bluePalette },
  /** Bold saturated orange */
  orange: { colors: orangePalette },
  /** Bold saturated green */
  green: { colors: greenPalette },
  /** Finnish flag blue and white */
  finland: { colors: finlandPalette },
  /** American flag red, white, blue */
  usa: { colors: usaPalette },
  /** White-hot to deep red meteor palette */
  meteor: { colors: meteorPalette },
  /** Cyan-to-white water palette */
  water: { colors: waterPalette }
};
var presetRegistry = {
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  imageText: ImageParticles.text,
  imageShape: ImageParticles.shape,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
  river: Ambient.river,
  fireworksShow: Ambient.fireworksShow
};
var presets = {
  Burst,
  Images,
  ImageParticles,
  Ambient,
  Colors,
  // Backward-compatible aliases
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  imageText: ImageParticles.text,
  imageShape: ImageParticles.shape,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
  river: Ambient.river,
  fireworksShow: Ambient.fireworksShow
};
function getPreset(name) {
  return presetRegistry[name];
}
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
var particularWrapper = (configuration = presets.Burst.magic) => (WrappedComponent) => {
  const { icons } = configuration;
  class ParticularWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.particles = null;
      this.burst = (settings) => {
        if (this.particles && settings.clientX !== void 0 && settings.clientY !== void 0) {
          this.particles.create({
            x: settings.clientX,
            y: settings.clientY,
            ...settings,
            icons: icons ?? settings.icons
          });
        }
      };
      this.portalContainer = document.createElement("div");
      document.body.appendChild(this.portalContainer);
    }
    componentDidMount() {
      if (this.particles) {
        this.particles.configure(configuration);
      }
    }
    componentWillUnmount() {
      if (this.portalContainer.parentNode) {
        this.portalContainer.parentNode.removeChild(this.portalContainer);
      }
    }
    render() {
      const wrappedProps = {
        ...this.props,
        burst: this.burst
      };
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        reactDom.createPortal(
          /* @__PURE__ */ jsxRuntime.jsx(
            CanvasWrapper,
            {
              ref: (particles) => {
                this.particles = particles;
              }
            }
          ),
          this.portalContainer
        ),
        /* @__PURE__ */ jsxRuntime.jsx(WrappedComponent, { ...wrappedProps })
      ] });
    }
  }
  ParticularWrapper.displayName = `Particular(${getDisplayName(WrappedComponent)})`;
  return ParticularWrapper;
};
var ParticularWrapper_default = particularWrapper;
var withParticles = particularWrapper;

// src/particular/components/attractor.ts
var Attractor = class {
  constructor(config) {
    this._resolvedImage = null;
    const merged = { ...defaultAttractor, ...config };
    this.position = new Vector(merged.x, merged.y);
    this.strength = merged.strength;
    this.radius = merged.radius;
    this.visible = merged.visible;
    this.icon = config.icon ?? null;
    this.size = merged.size;
    this.color = merged.color;
    this.shape = merged.shape;
    this.glow = merged.glow;
    this.glowSize = merged.glowSize;
    this.glowColor = merged.glowColor;
    this.glowAlpha = merged.glowAlpha;
    if (typeof this.icon === "string") {
      const img = new Image();
      img.src = this.icon;
      this._resolvedImage = img;
    } else if (this.icon instanceof HTMLImageElement) {
      this._resolvedImage = this.icon;
    }
  }
  getForce(particlePosition) {
    const force = new Vector(this.position.x, this.position.y);
    force.subtract(particlePosition);
    const dist = force.getMagnitude();
    if (dist === 0 || dist > this.radius) {
      return new Vector(0, 0);
    }
    force.normalize();
    const falloff = 1 - dist / this.radius;
    force.scale(this.strength * falloff);
    return force;
  }
  /** Returns a lightweight Particle-compatible object for use by renderers. */
  toDrawable() {
    const image = this._resolvedImage;
    return {
      position: this.position,
      factoredSize: this.size,
      rotation: 0,
      alpha: 1,
      color: this.color,
      shape: this.shape,
      blendMode: "normal",
      glow: this.glow,
      glowSize: this.glowSize,
      glowColor: this.glowColor,
      glowAlpha: this.glowAlpha,
      shadow: false,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: "#000000",
      shadowAlpha: 0,
      shadowLightOrigin: this.position,
      image,
      imageTint: false,
      trail: false,
      trailSegments: [],
      trailLength: 0,
      getRoundedLocation: () => [
        (this.position.x * 10 << 0) * 0.1,
        (this.position.y * 10 << 0) * 0.1
      ]
    };
  }
};

// src/particular/components/mouseForce.ts
var MouseForce = class {
  constructor(config = {}) {
    this._trackListener = null;
    this._trackTarget = null;
    this._pixelRatio = 1;
    this._container = null;
    const merged = { ...defaultMouseForce, ...config };
    this.position = new Vector(merged.x, merged.y);
    this.velocity = new Vector(0, 0);
    this.strength = merged.strength;
    this.radius = merged.radius;
    this.damping = merged.damping;
    this.maxSpeed = merged.maxSpeed;
    this.falloff = merged.falloff;
  }
  get isTracking() {
    return this._trackTarget !== null;
  }
  startTracking(target, pixelRatio, container) {
    this.stopTracking();
    this._pixelRatio = pixelRatio;
    this._container = container ?? null;
    this._trackListener = (e) => {
      let x = e.clientX;
      let y = e.clientY;
      if (this._container) {
        const rect = this._container.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
      }
      this.updatePosition(x / this._pixelRatio, y / this._pixelRatio);
    };
    this._trackTarget = target;
    target.addEventListener("mousemove", this._trackListener);
  }
  stopTracking() {
    if (this._trackTarget && this._trackListener) {
      this._trackTarget.removeEventListener("mousemove", this._trackListener);
    }
    this._trackTarget = null;
    this._trackListener = null;
  }
  destroy() {
    this.stopTracking();
  }
  updatePosition(x, y) {
    this.velocity.x = x - this.position.x;
    this.velocity.y = y - this.position.y;
    this.position.x = x;
    this.position.y = y;
  }
  decay(dt = 1) {
    const factor = Math.pow(this.damping, dt);
    this.velocity.x *= factor;
    this.velocity.y *= factor;
  }
  getForce(particlePosition) {
    const dx = particlePosition.x - this.position.x;
    const dy = particlePosition.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0 || dist > this.radius) {
      return new Vector(0, 0);
    }
    const speed = this.velocity.getMagnitude();
    if (speed < 0.01) {
      return new Vector(0, 0);
    }
    const linearFalloff = 1 - dist / this.radius;
    const distanceFalloff = this.falloff === 1 ? linearFalloff : Math.pow(linearFalloff, this.falloff);
    const speedFactor = Math.min(speed, this.maxSpeed) / this.maxSpeed;
    const force = new Vector(this.velocity.x, this.velocity.y);
    force.normalize();
    force.scale(this.strength * distanceFalloff * speedFactor);
    return force;
  }
};

// src/particular/convenience/forces.ts
function createForces(engine, container, cleanups) {
  const addAttractor = (config) => {
    const attractor = new Attractor(config);
    engine.addAttractor(attractor);
    return attractor;
  };
  const removeAttractor = (attractor) => {
    engine.removeAttractor(attractor);
  };
  const addRandomAttractors = (count, config) => {
    const pixelRatio = engine.pixelRatio;
    const sourceW = container ? container.clientWidth : window.innerWidth;
    const sourceH = container ? container.clientHeight : window.innerHeight;
    const viewW = sourceW / pixelRatio;
    const viewH = sourceH / pixelRatio;
    const marginX = viewW * 0.1;
    const marginY = viewH * 0.1;
    const result = [];
    for (let i = 0; i < count; i++) {
      const x = marginX + Math.random() * (viewW - marginX * 2);
      const y = marginY + Math.random() * (viewH - marginY * 2);
      const attractor = addAttractor({
        x,
        y,
        strength: 1,
        radius: 200,
        visible: true,
        ...config
      });
      result.push(attractor);
    }
    return result;
  };
  const removeAllAttractors = () => {
    engine.attractors.splice(0);
  };
  const addMouseForce = (config = {}) => {
    const { track, ...forceConfig } = config;
    const mouseForce = new MouseForce(forceConfig);
    engine.addMouseForce(mouseForce);
    if (track) {
      const target = track === true ? window : track;
      mouseForce.startTracking(target, engine.pixelRatio, container);
      cleanups.push(() => mouseForce.stopTracking());
    }
    return mouseForce;
  };
  const removeMouseForce = (mouseForce) => {
    mouseForce.stopTracking();
    engine.removeMouseForce(mouseForce);
  };
  return { addAttractor, removeAttractor, addRandomAttractors, removeAllAttractors, addMouseForce, removeMouseForce };
}

// src/particular/convenience/boundary.ts
function createBoundaryHelper(engine, container, cleanups) {
  const addBoundary = (config) => {
    const {
      element,
      strength = -1.5,
      radius = 10,
      inset: insetFraction = 0.4
    } = config;
    const pr = engine.pixelRatio;
    let attractors = [];
    let offsets = [];
    const rebuild = () => {
      for (const a of attractors) engine.removeAttractor(a);
      attractors = [];
      offsets = [];
      const refRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      const elW = elRect.width / pr;
      const elH = elRect.height / pr;
      const ins = radius * insetFraction;
      const localL = ins;
      const localR = elW - ins;
      const localT = ins;
      const localB = elH - ins;
      const w = localR - localL;
      const h = localB - localT;
      if (w <= 0 || h <= 0) return;
      const stepsX = Math.max(2, Math.ceil(w / radius) + 1);
      const stepsY = Math.max(2, Math.ceil(h / radius) + 1);
      const add = (dx, dy) => {
        const a = new Attractor({ x: elLeft + dx, y: elTop + dy, strength, radius });
        engine.addAttractor(a);
        attractors.push(a);
        offsets.push({ dx, dy });
      };
      for (let i = 0; i < stepsX; i++) {
        const x = localL + w * i / (stepsX - 1);
        add(x, localT);
        add(x, localB);
      }
      for (let i = 1; i < stepsY - 1; i++) {
        const y = localT + h * i / (stepsY - 1);
        add(localL, y);
        add(localR, y);
      }
    };
    const reposition = () => {
      if (attractors.length === 0) return;
      const refRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      for (let i = 0; i < attractors.length; i++) {
        const a = attractors[i];
        const o = offsets[i];
        a.position.x = elLeft + o.dx;
        a.position.y = elTop + o.dy;
      }
    };
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(element);
    if (container) ro.observe(container);
    let scrollRafId = 0;
    const onScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        reposition();
      });
    };
    const scrollTarget = container ?? window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    const handle = {
      update: rebuild,
      destroy: () => {
        ro.disconnect();
        scrollTarget.removeEventListener("scroll", onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const a of attractors) engine.removeAttractor(a);
        attractors = [];
        offsets = [];
      }
    };
    cleanups.push(() => handle.destroy());
    return handle;
  };
  return { addBoundary };
}

// src/particular/convenience/effects.ts
function createEffects(engine, mergedConfig) {
  const explode = (options = {}) => {
    const destroyParents = options.destroyParents ?? true;
    const allParticles = engine.getAllParticles();
    if (allParticles.length === 0) return;
    const snapshots = allParticles.map((p) => ({
      x: p.position.x,
      y: p.position.y,
      color: p.color,
      shape: p.shape,
      blendMode: p.blendMode
    }));
    if (destroyParents) {
      for (const emitter of engine.emitters) {
        for (const p of emitter.particles) {
          p.destroy();
        }
        emitter.particles = [];
      }
    }
    const fallbackColors = generateHarmoniousPalette();
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: []
    });
    collector.isEmitting = false;
    const childCount = options.childCount ?? 5;
    const currentCount = engine.getCount();
    const budget = Math.max(0, engine.maxCount - currentCount);
    let spawned = 0;
    for (const parent of snapshots) {
      for (let i = 0; i < childCount; i++) {
        if (spawned >= budget) break;
        const child = createExplosionChild(parent, options, engine, fallbackColors);
        collector.particles.push(child);
        spawned++;
      }
      if (spawned >= budget) break;
    }
    engine.addEmitter(collector);
  };
  const scatter = (options = {}) => {
    const baseVelocity = options.velocity ?? 10;
    const allParticles = engine.getAllParticles();
    for (const particle of allParticles) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = baseVelocity * (0.3 + Math.random() * 1.4);
      particle.velocity.x += Math.cos(angle) * magnitude;
      particle.velocity.y += Math.sin(angle) * magnitude;
    }
  };
  return { explode, scatter };
}

// src/particular/utils/pixelSampler.ts
function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (src instanceof HTMLCanvasElement) {
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = reject;
      img2.src = src.toDataURL("image/png");
      return;
    }
    if (src instanceof HTMLImageElement) {
      if (src.complete && src.naturalWidth > 0) {
        resolve(src);
      } else {
        src.onload = () => resolve(src);
        src.onerror = reject;
      }
      return;
    }
    const img = new Image();
    try {
      const absolute = new URL(src, window.location.href);
      if (absolute.origin !== window.location.origin && /^https?:$/.test(absolute.protocol)) {
        img.crossOrigin = "anonymous";
      }
    } catch {
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
function sampleImagePixels(source, resolution, alphaThreshold) {
  const srcWidth = source instanceof HTMLCanvasElement ? source.width : source.naturalWidth;
  const srcHeight = source instanceof HTMLCanvasElement ? source.height : source.naturalHeight;
  const aspect = srcWidth / srcHeight;
  let sampleW;
  let sampleH;
  if (aspect >= 1) {
    sampleW = resolution;
    sampleH = Math.max(1, Math.round(resolution / aspect));
  } else {
    sampleH = resolution;
    sampleW = Math.max(1, Math.round(resolution * aspect));
  }
  const canvas = document.createElement("canvas");
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, sampleW, sampleH);
  const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
  const { data } = imageData;
  const samples = [];
  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const i = (y * sampleW + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3] / 255;
      if (a < alphaThreshold) continue;
      const hex = "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
      samples.push({
        nx: (x + 0.5) / sampleW,
        ny: (y + 0.5) / sampleH,
        color: hex,
        alpha: a,
        gridX: x,
        gridY: y
      });
    }
  }
  return samples;
}

// src/particular/utils/imageSource.ts
var defaultGradientStops = [
  { offset: 0, color: "#ff6b6b" },
  { offset: 0.3, color: "#feca57" },
  { offset: 0.5, color: "#48dbfb" },
  { offset: 0.7, color: "#ff9ff3" },
  { offset: 1, color: "#54a0ff" }
];
function createTextImage(config) {
  const {
    text,
    fontSize = 200,
    fontFamily = "system-ui, -apple-system, sans-serif",
    fontWeight = "bold",
    fill
  } = config;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  canvas.width = Math.ceil(metrics.width) + 4;
  canvas.height = Math.ceil(fontSize * 1.3);
  ctx.font = font;
  ctx.textBaseline = "top";
  if (typeof fill === "string") {
    ctx.fillStyle = fill;
  } else {
    const stops = fill ?? defaultGradientStops;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    for (const stop of stops) {
      gradient.addColorStop(stop.offset, stop.color);
    }
    ctx.fillStyle = gradient;
  }
  ctx.fillText(text, 2, fontSize * 0.12);
  return canvas;
}
function createHeartImage(size = 400) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const heartPath = () => {
    const steps = 200;
    const cx = size * 0.5;
    const cy = size * 0.48;
    const scale = size * 0.27;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const px = cx + hx * scale / 16;
      const py = cy + hy * scale / 16;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };
  const bodyGrad = ctx.createRadialGradient(
    size * 0.42,
    size * 0.36,
    size * 0.03,
    size * 0.5,
    size * 0.5,
    size * 0.42
  );
  bodyGrad.addColorStop(0, "#ff7e95");
  bodyGrad.addColorStop(0.2, "#ff4d6d");
  bodyGrad.addColorStop(0.45, "#e63356");
  bodyGrad.addColorStop(0.7, "#c41e3a");
  bodyGrad.addColorStop(0.9, "#9b1230");
  bodyGrad.addColorStop(1, "#6e0a22");
  heartPath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.save();
  heartPath();
  ctx.clip();
  const bottomDark = ctx.createLinearGradient(0, size * 0.5, 0, size * 0.85);
  bottomDark.addColorStop(0, "rgba(60, 5, 15, 0)");
  bottomDark.addColorStop(0.6, "rgba(60, 5, 15, 0.2)");
  bottomDark.addColorStop(1, "rgba(40, 0, 10, 0.45)");
  ctx.fillStyle = bottomDark;
  ctx.fillRect(0, 0, size, size);
  const rimGrad = ctx.createLinearGradient(0, size * 0.12, 0, size * 0.42);
  rimGrad.addColorStop(0, "rgba(255, 180, 190, 0.35)");
  rimGrad.addColorStop(0.5, "rgba(255, 120, 140, 0.1)");
  rimGrad.addColorStop(1, "rgba(255, 80, 100, 0)");
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 0, size, size);
  const hl1 = ctx.createRadialGradient(
    size * 0.34,
    size * 0.32,
    size * 0.01,
    size * 0.37,
    size * 0.36,
    size * 0.16
  );
  hl1.addColorStop(0, "rgba(255, 255, 255, 0.75)");
  hl1.addColorStop(0.25, "rgba(255, 220, 225, 0.45)");
  hl1.addColorStop(0.6, "rgba(255, 160, 175, 0.12)");
  hl1.addColorStop(1, "rgba(255, 100, 120, 0)");
  ctx.fillStyle = hl1;
  ctx.fillRect(0, 0, size, size);
  const hl2 = ctx.createRadialGradient(
    size * 0.61,
    size * 0.31,
    size * 5e-3,
    size * 0.62,
    size * 0.33,
    size * 0.09
  );
  hl2.addColorStop(0, "rgba(255, 255, 255, 0.55)");
  hl2.addColorStop(0.35, "rgba(255, 210, 215, 0.2)");
  hl2.addColorStop(1, "rgba(255, 150, 160, 0)");
  ctx.fillStyle = hl2;
  ctx.fillRect(0, 0, size, size);
  const centerGlow = ctx.createRadialGradient(
    size * 0.48,
    size * 0.42,
    size * 0.01,
    size * 0.48,
    size * 0.44,
    size * 0.2
  );
  centerGlow.addColorStop(0, "rgba(255, 130, 150, 0.2)");
  centerGlow.addColorStop(1, "rgba(255, 80, 100, 0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();
  return canvas;
}
function canvasToDataURL(canvas) {
  return canvas.toDataURL("image/png");
}

// src/particular/convenience/imageParticles.ts
function createImageParticles(engine, mergedConfig, container) {
  const getViewportSize = () => {
    if (container) {
      return { w: container.clientWidth, h: container.clientHeight };
    }
    return { w: window.innerWidth, h: window.innerHeight };
  };
  const imageToParticles = async (config) => {
    const merged = { ...defaultImageParticles, ...config };
    const {
      image: imageSrc,
      resolution: resolutionOverride,
      alphaThreshold = 0.1,
      particleLife = 99999,
      gravity = 0,
      fadeTime = 40,
      particleSize: sizeOverride,
      scaleStep: scaleStepOverride,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      homeConfig,
      intro
    } = merged;
    const resolution = resolutionOverride ?? (shape === "square" ? 400 : 200);
    const image = await loadImage(imageSrc);
    const aspect = image.naturalWidth / image.naturalHeight;
    const viewport = getViewportSize();
    const x = config.x ?? viewport.w / 2;
    const y = config.y ?? viewport.h / 2;
    let displayW;
    let displayH;
    if (config.width != null && config.height != null) {
      displayW = config.width;
      displayH = config.height;
    } else if (config.width != null) {
      displayW = config.width;
      displayH = config.width / aspect;
    } else if (config.height != null) {
      displayH = config.height;
      displayW = config.height * aspect;
    } else {
      displayW = Math.min(viewport.w * 0.8, 800);
      displayH = displayW / aspect;
    }
    const pr = mergedConfig.pixelRatio;
    const engineW = displayW / pr;
    const engineH = displayH / pr;
    const centerX = x / pr;
    const centerY = y / pr;
    const originX = centerX - engineW / 2;
    const originY = centerY - engineH / 2;
    const sizeForRes = (res, particleShape) => {
      const cols = aspect >= 1 ? res : Math.max(1, Math.round(res * aspect));
      const sp = engineW / cols;
      const scale = particleShape === "square" ? 0.55 : particleShape === "triangle" ? 0.95 : 0.7;
      return sp * scale;
    };
    const imageCenter = new Vector(centerX, centerY);
    const samples = sampleImagePixels(image, resolution, alphaThreshold);
    const size = sizeOverride != null ? sizeOverride / pr : sizeForRes(resolution, shape ?? "square");
    const scaleStep = scaleStepOverride ?? size;
    if (engine.maxCount < engine.getCount() + samples.length) {
      engine.maxCount = engine.getCount() + samples.length;
    }
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: []
    });
    collector.isEmitting = false;
    const makeParticle = (sample2, introScaleStep) => {
      const px = originX + sample2.nx * engineW;
      const py = originY + sample2.ny * engineH;
      const homePos = new Vector(px, py);
      const particle = new Particle({
        color: sample2.color,
        baseAlpha: sample2.alpha,
        point: new Vector(px, py),
        velocity: new Vector(0, 0),
        acceleration: new Vector(0, 0),
        friction: 0,
        size,
        particleLife,
        gravity,
        scaleStep: introScaleStep ?? scaleStep,
        fadeTime,
        shape,
        blendMode,
        glow,
        glowSize,
        glowColor,
        glowAlpha,
        shadow,
        shadowBlur,
        shadowOffsetX,
        shadowOffsetY,
        shadowColor,
        shadowAlpha,
        trail,
        trailLength,
        trailFade,
        trailShrink,
        imageTint,
        homePosition: homePos,
        homeCenter: imageCenter,
        homeConfig
      });
      if (shape === "triangle" && (sample2.gridX + sample2.gridY) % 2 === 1) {
        particle.rotation = 180;
      }
      particle.init(null, engine);
      return particle;
    };
    if (intro) {
      const mode = intro.mode ?? "scatter";
      const duration = intro.duration ?? 800;
      const introScaleStep = size / 15;
      if (mode === "scatter") {
        const scatterRadius = Math.max(engineW, engineH) * 0.3;
        for (const sample2 of samples) {
          const particle = makeParticle(sample2, introScaleStep);
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * scatterRadius;
          particle.position.x += Math.cos(angle) * dist;
          particle.position.y += Math.sin(angle) * dist;
          particle.velocity.x = (Math.random() - 0.5) * 2;
          particle.velocity.y = (Math.random() - 0.5) * 2;
          particle.factoredSize = 0;
          collector.particles.push(particle);
        }
        engine.addEmitter(collector);
      } else if (mode === "scaleIn") {
        const sorted = [...samples];
        sorted.sort((a, b) => {
          const dA = Math.hypot(a.nx - 0.5, a.ny - 0.5);
          const dB = Math.hypot(b.nx - 0.5, b.ny - 0.5);
          return dB - dA;
        });
        const spread = Math.max(engineW, engineH) * 0.03;
        const numBatches = 30;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const speedVariance = 0.5 + Math.random() * 1;
              const particle = makeParticle(sorted[i], introScaleStep * speedVariance);
              particle.position.x = centerX + (Math.random() - 0.5) * spread;
              particle.position.y = centerY + (Math.random() - 0.5) * spread;
              particle.factoredSize = 0;
              particle.homeConfig.springDamping = 0.75;
              particle.homeConfig.springStrength = 0.08;
              particle.homeConfig.returnNoise = 0;
              const dx = particle.homePosition.x - centerX;
              const dy = particle.homePosition.y - centerY;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const nudge = dist * 0.03 * (0.8 + Math.random() * 0.4);
              particle.velocity.x = dx / dist * nudge;
              particle.velocity.y = dy / dist * nudge;
              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };
          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      } else if (mode === "ripple") {
        const sorted = [...samples];
        sorted.sort((a, b) => {
          const dA = Math.hypot(a.nx - 0.5, a.ny - 0.5);
          const dB = Math.hypot(b.nx - 0.5, b.ny - 0.5);
          return dA - dB;
        });
        const numBatches = 40;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const s = sorted[i];
              const speedVariance = 0.4 + Math.random() * 1.2;
              const particle = makeParticle(s, introScaleStep * speedVariance);
              particle.factoredSize = 0;
              const dx = s.nx - 0.5;
              const dy = s.ny - 0.5;
              const radialAngle = Math.atan2(dy, dx);
              const wobble = (Math.random() - 0.5) * 0.7;
              const pushAngle = radialAngle + wobble;
              const pushMag = 2.5 + Math.random() * 2.5;
              particle.velocity.x = Math.cos(pushAngle) * pushMag;
              particle.velocity.y = Math.sin(pushAngle) * pushMag;
              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };
          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      } else {
        const sorted = [...samples];
        sorted.sort((a, b) => a.nx + Math.random() * 0.05 - (b.nx + Math.random() * 0.05));
        const launchX = centerX;
        const launchY = originY + engineH;
        const numBatches = 40;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const speedVariance = 0.5 + Math.random() * 1;
              const particle = makeParticle(sorted[i], introScaleStep * speedVariance);
              particle.position.x = launchX;
              particle.position.y = launchY;
              particle.factoredSize = 0;
              particle.homeConfig.springDamping = 0.75;
              particle.homeConfig.springStrength = 0.08;
              particle.homeConfig.returnNoise = 0;
              const dx = particle.homePosition.x - launchX;
              const dy = particle.homePosition.y - launchY;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const aimAngle = Math.atan2(dy, dx);
              const wobble = (Math.random() - 0.5) * 0.3;
              const speed = dist * 0.03 * (0.9 + Math.random() * 0.2);
              particle.velocity.x = Math.cos(aimAngle + wobble) * speed;
              particle.velocity.y = Math.sin(aimAngle + wobble) * speed;
              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };
          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      }
    } else {
      for (const sample2 of samples) {
        const particle = makeParticle(sample2);
        collector.particles.push(particle);
      }
      engine.addEmitter(collector);
    }
    return collector;
  };
  const textToParticles = async (text, config) => {
    const { textConfig, ...imageConfig } = config ?? {};
    const textCanvas = createTextImage({ text, ...textConfig });
    return imageToParticles({
      ...imageConfig,
      image: canvasToDataURL(textCanvas)
    });
  };
  const setIdleEffect = (enabled) => {
    for (const particle of engine.getAllParticles()) {
      if (particle.homePosition) {
        particle.idleEnabled = enabled;
      }
    }
  };
  return { imageToParticles, textToParticles, setIdleEffect };
}

// src/particular/convenience/index.ts
function createParticles({
  canvas: userCanvas,
  preset = "magic",
  config,
  renderer = "webgl",
  autoResize = true,
  autoClick = false,
  clickTarget,
  container,
  mouseForce
} = {}) {
  let canvas;
  let canvasAutoCreated = false;
  if (userCanvas) {
    canvas = userCanvas;
  } else {
    canvas = document.createElement("canvas");
    canvasAutoCreated = true;
    const parent = container ?? document.body;
    parent.appendChild(canvas);
  }
  applyCanvasStyles(canvas, container, config?.zIndex);
  const engine = new Particular();
  const basePreset = getPreset(preset);
  const mergedConfig = configureParticular({ ...basePreset, ...config, container });
  engine.initialize(mergedConfig);
  if (renderer === "webgl") {
    engine.addRenderer(
      new WebGLRenderer(canvas, {
        maxInstances: mergedConfig.webglMaxInstances
      })
    );
  } else {
    engine.addRenderer(new CanvasRenderer(canvas));
  }
  engine.onResize();
  const cleanups = [];
  if (autoResize) {
    if (container) {
      const ro = new ResizeObserver(() => engine.onResize());
      ro.observe(container);
      cleanups.push(() => ro.disconnect());
    } else {
      const onResize = () => engine.onResize();
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));
    }
  }
  const toEngineCoords = (clientX, clientY) => {
    let x = clientX;
    let y = clientY;
    if (container) {
      const rect = container.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
    return { x: x / mergedConfig.pixelRatio, y: y / mergedConfig.pixelRatio };
  };
  const burst = (options) => {
    const { x, y, ...overrides } = options;
    const combinedSettings = configureParticle(overrides, mergedConfig);
    let icons = [];
    if (combinedSettings.icons) {
      icons = processImages(combinedSettings.icons);
    }
    const enginePos = toEngineCoords(x, y);
    const emitter = new Emitter({
      point: new Vector(enginePos.x, enginePos.y),
      ...combinedSettings,
      icons
    });
    engine.addEmitter(emitter);
    emitter.isEmitting = true;
    emitter.emit();
    return emitter;
  };
  const attachClickBurst = (target = clickTarget ?? document, overrides) => {
    const onClick = (event) => {
      const mouseEvent = event;
      burst({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        ...overrides ?? {}
      });
    };
    target.addEventListener("click", onClick);
    return () => target.removeEventListener("click", onClick);
  };
  if (autoClick) {
    const cleanupClick = attachClickBurst(clickTarget ?? document);
    cleanups.push(cleanupClick);
  }
  const forces = createForces(engine, container, cleanups);
  const boundary = createBoundaryHelper(engine, container, cleanups);
  const effects = createEffects(engine, mergedConfig);
  const imageApi = createImageParticles(engine, mergedConfig, container);
  if (mouseForce) {
    const mouseConfig = mouseForce === true ? { track: true } : { track: true, ...mouseForce };
    forces.addMouseForce(mouseConfig);
  }
  const destroy2 = () => {
    for (const cleanup of cleanups) cleanup();
    engine.destroy();
    if (canvasAutoCreated && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
  };
  return {
    engine,
    canvas,
    burst,
    attachClickBurst,
    ...forces,
    ...boundary,
    ...effects,
    ...imageApi,
    destroy: destroy2
  };
}

// src/particular/convenience/screensaver.ts
function startScreensaver({
  canvas,
  preset = "snow",
  config,
  renderer = "webgl",
  autoResize = true,
  mouseWind: mouseWindOption,
  container
}) {
  const basePreset = getPreset(preset);
  const mergedConfig = {
    ...basePreset,
    continuous: true,
    ...config
  };
  const controller = createParticles({
    canvas,
    preset,
    config: mergedConfig,
    renderer,
    autoResize,
    container
  });
  const pixelRatio = controller.engine.pixelRatio;
  const sourceW = container ? container.clientWidth : window.innerWidth;
  const spawnWidth = sourceW / pixelRatio;
  const emitter = new Emitter({
    point: new Vector(sourceW / 2 / pixelRatio, 0),
    ...configureParticle(mergedConfig),
    spawnWidth,
    spawnHeight: defaultParticle.spawnHeight,
    icons: []
  });
  controller.engine.addEmitter(emitter);
  emitter.isEmitting = true;
  emitter.emit();
  const cleanups = [];
  if (mouseWindOption !== false) {
    controller.addMouseForce({
      ...defaultMouseWind,
      track: true,
      ...mouseWindOption
    });
  }
  if (autoResize && !container) {
    const onResize = () => {
      const newSpawnWidth = window.innerWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = window.innerWidth / 2 / pixelRatio;
    };
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));
  }
  if (autoResize && container) {
    const ro = new ResizeObserver(() => {
      const newSpawnWidth = container.clientWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = container.clientWidth / 2 / pixelRatio;
    });
    ro.observe(container);
    cleanups.push(() => ro.disconnect());
  }
  const destroy2 = () => {
    for (const cleanup of cleanups) cleanup();
    controller.destroy();
  };
  return {
    engine: controller.engine,
    controller,
    destroy: destroy2
  };
}
function useParticles({
  preset = "magic",
  config,
  renderer = "webgl",
  autoResize = true,
  autoClick = false,
  clickTarget,
  backgroundLayer = true,
  container,
  mouseForce
} = {}) {
  const canvasRef = React.useRef(null);
  const controllerRef = React.useRef(null);
  const canvasStyle = container ? getParticlesContainerLayerStyle(config?.zIndex) : backgroundLayer ? getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = createParticles({
      canvas,
      preset,
      config,
      renderer,
      autoResize,
      autoClick,
      clickTarget,
      container,
      mouseForce
    });
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [preset, config, renderer, autoResize, autoClick, clickTarget, container, mouseForce]);
  const burst = React.useCallback((options) => {
    controllerRef.current?.burst(options);
  }, []);
  const burstFromEvent = React.useCallback(
    (event, overrides) => {
      const { clientX, clientY } = event;
      controllerRef.current?.burst({
        x: clientX,
        y: clientY,
        ...overrides ?? {}
      });
    },
    []
  );
  const explode = React.useCallback((options) => {
    controllerRef.current?.explode(options);
  }, []);
  const scatter = React.useCallback((options) => {
    controllerRef.current?.scatter(options);
  }, []);
  const imageToParticles = React.useCallback((config2) => {
    controllerRef.current?.imageToParticles(config2);
  }, []);
  const textToParticles = React.useCallback(
    (text, config2) => {
      controllerRef.current?.textToParticles(text, config2);
    },
    []
  );
  return {
    canvasRef,
    canvasStyle,
    controller: controllerRef.current,
    burst,
    burstFromEvent,
    explode,
    scatter,
    imageToParticles,
    textToParticles
  };
}
function useScreensaver({
  preset = "snow",
  config,
  renderer = "webgl",
  autoResize = true,
  backgroundLayer = true,
  mouseWind,
  container
} = {}) {
  const canvasRef = React.useRef(null);
  const screensaverRef = React.useRef(null);
  const canvasStyle = container ? getParticlesContainerLayerStyle(config?.zIndex) : backgroundLayer ? getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const screensaver = startScreensaver({
      canvas,
      preset,
      config,
      renderer,
      autoResize,
      mouseWind,
      container
    });
    screensaverRef.current = screensaver;
    return () => {
      screensaver.destroy();
      screensaverRef.current = null;
    };
  }, [preset, config, renderer, autoResize, mouseWind, container]);
  const destroy2 = React.useCallback(() => {
    screensaverRef.current?.destroy();
    screensaverRef.current = null;
  }, []);
  return {
    canvasRef,
    canvasStyle,
    destroy: destroy2
  };
}

// src/particular/devFPSOverlay.ts
var SMOOTHING_SAMPLES = 20;
var DEFAULT_STYLE = {
  position: "fixed",
  top: "8px",
  right: "8px",
  padding: "6px 10px",
  fontFamily: "ui-monospace, monospace",
  fontSize: "12px",
  lineHeight: "1.4",
  color: "#e0e0e0",
  backgroundColor: "rgba(0,0,0,0.75)",
  borderRadius: "6px",
  pointerEvents: "none",
  zIndex: "2147483647",
  userSelect: "none"
};
function showFPSOverlay(options = {}) {
  const {
    container = document.body,
    getParticleCount,
    smoothing = SMOOTHING_SAMPLES
  } = options;
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, DEFAULT_STYLE);
  container.appendChild(el);
  const samples = [];
  let lastTime = performance.now();
  let rafId = null;
  const tick = () => {
    rafId = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = now - lastTime;
    lastTime = now;
    if (dt > 0) {
      samples.push(dt);
      if (samples.length > smoothing) samples.shift();
    }
    const avgMs = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
    const fps = avgMs > 0 ? Math.round(1e3 / avgMs) : 0;
    const parts = [`FPS: ${fps}`];
    if (getParticleCount) {
      try {
        const count = getParticleCount();
        parts.push(`Particles: ${count}`);
      } catch {
        parts.push("Particles: \u2014");
      }
    }
    el.textContent = parts.join("  \xB7  ");
  };
  rafId = requestAnimationFrame(tick);
  return {
    destroy() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.remove();
    }
  };
}

exports.Attractor = Attractor;
exports.CanvasRenderer = CanvasRenderer;
exports.Emitter = Emitter;
exports.MouseForce = MouseForce;
exports.Particle = Particle;
exports.Particular = Particular;
exports.ParticularWrapper = ParticularWrapper_default;
exports.Vector = Vector;
exports.WebGLRenderer = WebGLRenderer;
exports.applyCanvasStyles = applyCanvasStyles;
exports.canvasToDataURL = canvasToDataURL;
exports.configureParticle = configureParticle;
exports.createHeartImage = createHeartImage;
exports.createParticles = createParticles;
exports.createTextImage = createTextImage;
exports.getParticlesBackgroundLayerStyle = getParticlesBackgroundLayerStyle;
exports.getParticlesContainerLayerStyle = getParticlesContainerLayerStyle;
exports.particlesBackgroundLayerStyle = particlesBackgroundLayerStyle;
exports.particlesContainerLayerStyle = particlesContainerLayerStyle;
exports.particlesDefaultZIndex = DEFAULT_Z_INDEX;
exports.presets = presets;
exports.showFPSOverlay = showFPSOverlay;
exports.startScreensaver = startScreensaver;
exports.useParticles = useParticles;
exports.useScreensaver = useScreensaver;
exports.withParticles = withParticles;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map