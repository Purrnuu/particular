'use strict';

var lodashEs = require('lodash-es');
var React = require('react');
var reactDom = require('react-dom');
var randomcolor = require('randomcolor');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var randomcolor__default = /*#__PURE__*/_interopDefault(randomcolor);

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
  acceleration: 1,
  friction: 1,
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
  radius: 100,
  damping: 0.85,
  maxSpeed: 10,
  falloff: 1
};
var defaultMouseWind = {
  strength: 0.12,
  radius: 150,
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
    pixelRatio = defaultParticular.pixelRatio
  }) {
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.update();
  }
  start() {
    this.isOn = true;
  }
  stop() {
    this.isOn = false;
  }
  onResize() {
    const height = this.height = window.innerHeight;
    const width = this.width = window.innerWidth;
    this.dispatchEvent(_Particular.RESIZE, { width, height });
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
var Particle = class {
  constructor({
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
    colors
  }) {
    this.particular = null;
    this.image = null;
    this.trailSegments = [];
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
    this.color = colors && colors.length > 0 ? colors[Math.floor(Math.random() * colors.length)] : randomcolor__default.default();
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
    this.position.add(this.velocity, dt);
    this.rotation = this.rotation + this.rotationVelocity * dt;
    this.factoredSize = Math.min(this.factoredSize + this.scaleStep * dt, this.size);
    this.alpha = Math.min(1, Math.max((this.lifeTime - this.lifeTick) / this.fadeTime, 0));
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

// src/particular/components/emitter.ts
var Emitter = class {
  constructor(configuration) {
    this.particles = [];
    this.isEmitting = false;
    this.particular = null;
    this.lifeCycle = 0;
    this.emitAccumulator = 0;
    this.configuration = configuration;
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
    lodashEs.forEach(this.particles, (particle) => {
      const pos = particle.position;
      if (pos.x < 0 || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY) {
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
      const trailActive = particle.trail && particle.trailSegments.length > 0;
      const fadedOut = particle.alpha <= 0 && particle.lifeTick >= particle.lifeTime;
      if (!fadedOut || trailActive) {
        currentParticles.push(particle);
      } else {
        particle.destroy();
      }
    });
    this.particles = currentParticles;
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
      acceleration: accelerationScale,
      friction: frictionScale
    } = this.configuration;
    const angle = velocity.getAngle() + spread - Math.random() * spread * 2;
    const magnitude = velocity.getMagnitude();
    const offsetX = spawnWidth > 0 ? (Math.random() - 0.5) * spawnWidth : 0;
    const offsetY = spawnHeight > 0 ? (Math.random() - 0.5) * spawnHeight : 0;
    const newPoint = new Vector(point.x + offsetX, point.y + offsetY);
    const newVelocity = Vector.fromAngle(angle, magnitude);
    const size = getRandomInt(sizeMin, sizeMax);
    newVelocity.add({ x: 0, y: -((sizeMax - size) / 15) * velocityMultiplier });
    const friction = frictionScale * size / 2e3;
    const acceleration = new Vector(0, accelerationScale * size / 100);
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
    this.context.beginPath();
    this.context.moveTo(0, -size);
    this.context.lineTo(size, size);
    this.context.lineTo(-size, size);
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
var finlandPalette = ["#003580", "#002f6c", "#ffffff", "#f8f9fa"];
var usaPalette = ["#B22234", "#ffffff", "#3C3B6E"];
var Burst = {
  /** Polished confetti burst: playful, readable, and balanced */
  confetti: {
    shape: "square",
    blendMode: "normal",
    rate: 14,
    life: 34,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1,
    sizeMin: 3,
    sizeMax: 16,
    velocityMultiplier: 5,
    fadeTime: 28,
    gravity: 0.1,
    scaleStep: 0.85,
    maxCount: 420,
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
  /** Cinematic fireworks: energetic additive circles with bright bloom */
  fireworks: {
    shape: "circle",
    blendMode: "additive",
    glow: true,
    glowSize: 14,
    glowColor: "#fff7d6",
    glowAlpha: 0.5,
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
    colors: mutedPalette
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
    rate: 0.4,
    life: 999999,
    particleLife: 400,
    velocity: Vector.fromAngle(Math.PI / 2, 0.8),
    spread: Math.PI * 0.15,
    sizeMin: 2,
    sizeMax: 6,
    velocityMultiplier: 1.5,
    fadeTime: 60,
    gravity: 0.02,
    scaleStep: 1,
    maxCount: 200,
    continuous: true,
    autoStart: true,
    colors: snowPalette
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
  usa: { colors: usaPalette }
};
var presetRegistry = {
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  images: Images.showcase,
  snow: Ambient.snow
};
var presets = {
  Burst,
  Images,
  Ambient,
  Colors,
  // Backward-compatible aliases
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  images: Images.showcase,
  snow: Ambient.snow
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
  startTracking(target, pixelRatio) {
    this.stopTracking();
    this._pixelRatio = pixelRatio;
    this._trackListener = (e) => {
      this.updatePosition(e.clientX / this._pixelRatio, e.clientY / this._pixelRatio);
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

// src/particular/convenience.ts
function createParticles({
  canvas,
  preset = "magic",
  config,
  renderer = "canvas",
  autoResize = true,
  autoClick = false,
  clickTarget
}) {
  const engine = new Particular();
  const basePreset = getPreset(preset);
  const mergedConfig = configureParticular({ ...basePreset, ...config });
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
    const onResize = () => engine.onResize();
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));
  }
  const burst = (options) => {
    const { x, y, ...overrides } = options;
    const combinedSettings = configureParticle(overrides, mergedConfig);
    let icons = [];
    if (combinedSettings.icons) {
      icons = processImages(combinedSettings.icons);
    }
    const emitter = new Emitter({
      point: new Vector(x / mergedConfig.pixelRatio, y / mergedConfig.pixelRatio),
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
  const addAttractor = (config2) => {
    const attractor = new Attractor(config2);
    engine.addAttractor(attractor);
    return attractor;
  };
  const removeAttractor = (attractor) => {
    engine.removeAttractor(attractor);
  };
  const addRandomAttractors = (count, config2) => {
    const pixelRatio = engine.pixelRatio;
    const viewW = window.innerWidth / pixelRatio;
    const viewH = window.innerHeight / pixelRatio;
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
        ...config2
      });
      result.push(attractor);
    }
    return result;
  };
  const removeAllAttractors = () => {
    engine.attractors.splice(0);
  };
  const addMouseForce = (config2 = {}) => {
    const { track, ...forceConfig } = config2;
    const mouseForce = new MouseForce(forceConfig);
    engine.addMouseForce(mouseForce);
    if (track) {
      const target = track === true ? window : track;
      mouseForce.startTracking(target, engine.pixelRatio);
      cleanups.push(() => mouseForce.stopTracking());
    }
    return mouseForce;
  };
  const removeMouseForce = (mouseForce) => {
    mouseForce.stopTracking();
    engine.removeMouseForce(mouseForce);
  };
  const destroy2 = () => {
    for (const cleanup of cleanups) cleanup();
    engine.destroy();
  };
  return {
    engine,
    burst,
    addAttractor,
    removeAttractor,
    addRandomAttractors,
    removeAllAttractors,
    addMouseForce,
    removeMouseForce,
    attachClickBurst,
    destroy: destroy2
  };
}
function startScreensaver({
  canvas,
  preset = "snow",
  config,
  renderer = "canvas",
  autoResize = true,
  mouseWind: mouseWindOption
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
    autoResize
  });
  const pixelRatio = controller.engine.pixelRatio;
  const spawnWidth = window.innerWidth / pixelRatio;
  const emitter = new Emitter({
    point: new Vector(window.innerWidth / 2 / pixelRatio, 0),
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
  if (autoResize) {
    const onResize = () => {
      const newSpawnWidth = window.innerWidth / pixelRatio;
      emitter.configuration.spawnWidth = newSpawnWidth;
      emitter.configuration.point.x = window.innerWidth / 2 / pixelRatio;
    };
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));
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
  renderer = "canvas",
  autoResize = true,
  autoClick = false,
  clickTarget,
  backgroundLayer = true
} = {}) {
  const canvasRef = React.useRef(null);
  const controllerRef = React.useRef(null);
  const canvasStyle = backgroundLayer ? getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  const createOptions = React.useMemo(
    () => ({
      // canvas is injected in effect when ref is available
      canvas: null,
      preset,
      config,
      renderer,
      autoResize,
      autoClick,
      clickTarget
    }),
    [preset, config, renderer, autoResize, autoClick, clickTarget]
  );
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = createParticles({
      canvas,
      preset: createOptions.preset,
      config: createOptions.config,
      autoResize: createOptions.autoResize,
      autoClick: createOptions.autoClick,
      clickTarget: createOptions.clickTarget
    });
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [createOptions]);
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
  return {
    canvasRef,
    canvasStyle,
    controller: controllerRef.current,
    burst,
    burstFromEvent
  };
}
function useScreensaver({
  preset = "snow",
  config,
  renderer = "canvas",
  autoResize = true,
  backgroundLayer = true,
  mouseWind
} = {}) {
  const canvasRef = React.useRef(null);
  const screensaverRef = React.useRef(null);
  const canvasStyle = backgroundLayer ? getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const screensaver = startScreensaver({
      canvas,
      preset,
      config,
      renderer,
      autoResize,
      mouseWind
    });
    screensaverRef.current = screensaver;
    return () => {
      screensaver.destroy();
      screensaverRef.current = null;
    };
  }, [preset, config, renderer, autoResize, mouseWind]);
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
exports.createParticles = createParticles;
exports.getParticlesBackgroundLayerStyle = getParticlesBackgroundLayerStyle;
exports.particlesBackgroundLayerStyle = particlesBackgroundLayerStyle;
exports.particlesDefaultZIndex = DEFAULT_Z_INDEX;
exports.presets = presets;
exports.showFPSOverlay = showFPSOverlay;
exports.startScreensaver = startScreensaver;
exports.useParticles = useParticles;
exports.useScreensaver = useScreensaver;
exports.withParticles = withParticles;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map