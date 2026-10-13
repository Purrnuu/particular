'use strict';

var chunkJSFHD3FV_cjs = require('./chunk-JSFHD3FV.cjs');
var chunkELTIAHJF_cjs = require('./chunk-ELTIAHJF.cjs');
var chunkDSCJ6LNA_cjs = require('./chunk-DSCJ6LNA.cjs');
var chunk4IB6HY3F_cjs = require('./chunk-4IB6HY3F.cjs');
var chunkZMNMQZSP_cjs = require('./chunk-ZMNMQZSP.cjs');
var chunkBCADERZK_cjs = require('./chunk-BCADERZK.cjs');

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

// src/particular/components/attractor.ts
var _tempForce = new chunkDSCJ6LNA_cjs.Vector(0, 0);
var Attractor = class {
  constructor(config) {
    this._resolvedImage = null;
    const merged = { ...chunkDSCJ6LNA_cjs.defaultAttractor, ...config };
    this.position = new chunkDSCJ6LNA_cjs.Vector(merged.x, merged.y, config.z ?? 0);
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
    } else if (typeof HTMLImageElement !== "undefined" && this.icon instanceof HTMLImageElement) {
      this._resolvedImage = this.icon;
    }
  }
  getForce(particlePosition) {
    const dx = this.position.x - particlePosition.x;
    const dy = this.position.y - particlePosition.y;
    const dz = this.position.z - particlePosition.z;
    const dist = dz === 0 ? Math.sqrt(dx * dx + dy * dy) : Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist === 0 || dist > this.radius) {
      _tempForce.x = 0;
      _tempForce.y = 0;
      _tempForce.z = 0;
      return _tempForce;
    }
    const scale = this.strength * (1 - dist / this.radius) / dist;
    _tempForce.x = dx * scale;
    _tempForce.y = dy * scale;
    _tempForce.z = dz * scale;
    return _tempForce;
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
      getRoundedLocation: () => [(this.position.x * 10 << 0) * 0.1, (this.position.y * 10 << 0) * 0.1]
    };
  }
};

// src/particular/utils/pointerMotion.ts
var PointerMotion = class {
  constructor() {
    this.initialized = false;
    this.pending = false;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.velocity = new chunkDSCJ6LNA_cjs.Vector(0, 0);
  }
  record(x, y) {
    if (this.initialized) {
      this.dx += x - this.x;
      this.dy += y - this.y;
      this.pending = true;
    }
    this.x = x;
    this.y = y;
    this.initialized = true;
  }
  /** Reused result; a zero-time frame leaves pending movement untouched. */
  consume(dt) {
    if (!this.pending || dt <= 0) return null;
    this.velocity.x = this.dx / dt;
    this.velocity.y = this.dy / dt;
    this.dx = 0;
    this.dy = 0;
    this.pending = false;
    return this.velocity;
  }
  reset() {
    this.initialized = false;
    this.pending = false;
    this.dx = 0;
    this.dy = 0;
  }
};

// src/particular/components/mouseForce.ts
var _tempForce2 = new chunkDSCJ6LNA_cjs.Vector(0, 0);
var MouseForce = class {
  constructor(config = {}) {
    /** When set, particle positions are projected to screen space before computing distance.
     *  Used by the 3D renderer so the mouse affects particles based on visual proximity. */
    this.projectToScreen = null;
    this._trackListener = null;
    this._touchListener = null;
    this._trackTarget = null;
    this._pixelRatio = 1;
    this._container = null;
    this._cachedRect = null;
    this._rectDirty = true;
    this._rectInvalidator = null;
    this._resizeObserver = null;
    this.pointerMotion = new PointerMotion();
    this.hasTrackedPosition = false;
    const merged = { ...chunkDSCJ6LNA_cjs.defaultMouseForce, ...config };
    this.mode = merged.mode;
    this.position = new chunkDSCJ6LNA_cjs.Vector(merged.x, merged.y);
    this.velocity = new chunkDSCJ6LNA_cjs.Vector(0, 0);
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
    this._rectDirty = true;
    this._cachedRect = null;
    this.hasTrackedPosition = false;
    this.velocity.x = 0;
    this.velocity.y = 0;
    if (this._container) {
      this._rectInvalidator = () => {
        this._rectDirty = true;
      };
      this._resizeObserver = new ResizeObserver(this._rectInvalidator);
      this._resizeObserver.observe(this._container);
      window.addEventListener("scroll", this._rectInvalidator, { passive: true });
      this._container.addEventListener("scroll", this._rectInvalidator, { passive: true });
    }
    const handleCoords = (clientX, clientY) => {
      let x = clientX;
      let y = clientY;
      if (this._container) {
        if (this._rectDirty || !this._cachedRect) {
          const rect = this._container.getBoundingClientRect();
          this._cachedRect = { left: rect.left, top: rect.top };
          this._rectDirty = false;
        }
        x -= this._cachedRect.left;
        y -= this._cachedRect.top;
      }
      this.position.x = x / this._pixelRatio;
      this.position.y = y / this._pixelRatio;
      this.hasTrackedPosition = true;
      this.pointerMotion.record(this.position.x, this.position.y);
    };
    this._trackListener = (e) => {
      handleCoords(e.clientX, e.clientY);
    };
    this._touchListener = (e) => {
      const touch = e.touches[0];
      if (touch) {
        handleCoords(touch.clientX, touch.clientY);
      }
    };
    this._trackTarget = target;
    target.addEventListener("mousemove", this._trackListener);
    target.addEventListener("touchmove", this._touchListener, { passive: true });
    target.addEventListener("touchstart", this._touchListener, { passive: true });
  }
  stopTracking() {
    this.pointerMotion.reset();
    if (this._trackTarget) {
      if (this._trackListener) {
        this._trackTarget.removeEventListener("mousemove", this._trackListener);
      }
      if (this._touchListener) {
        this._trackTarget.removeEventListener("touchmove", this._touchListener);
        this._trackTarget.removeEventListener("touchstart", this._touchListener);
      }
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._rectInvalidator) {
      window.removeEventListener("scroll", this._rectInvalidator);
      if (this._container) {
        this._container.removeEventListener("scroll", this._rectInvalidator);
      }
      this._rectInvalidator = null;
    }
    this._cachedRect = null;
    this._rectDirty = true;
    this._trackTarget = null;
    this._trackListener = null;
    this._touchListener = null;
  }
  destroy() {
    this.stopTracking();
  }
  /** Programmatic movement in engine coordinates; dt is elapsed time in 60 Hz ticks. */
  updatePosition(x, y, dt = 1) {
    if (dt <= 0) return;
    this.velocity.x = (x - this.position.x) / dt;
    this.velocity.y = (y - this.position.y) / dt;
    this.position.x = x;
    this.position.y = y;
  }
  decay(dt = 1) {
    const factor = Math.pow(this.damping, dt);
    this.velocity.x *= factor;
    this.velocity.y *= factor;
  }
  update(frame) {
    const motion = this.pointerMotion.consume(frame.dt);
    if (motion) {
      this.velocity.x = motion.x;
      this.velocity.y = motion.y;
    } else {
      this.decay(frame.dt);
    }
  }
  getForce(particlePosition) {
    _tempForce2.z = 0;
    if (this.isTracking && !this.hasTrackedPosition) {
      _tempForce2.x = 0;
      _tempForce2.y = 0;
      return _tempForce2;
    }
    let px = particlePosition.x;
    let py = particlePosition.y;
    if (this.projectToScreen && particlePosition.z !== 0) {
      const projected = this.projectToScreen(
        particlePosition.x,
        particlePosition.y,
        particlePosition.z
      );
      if (!projected) {
        _tempForce2.x = 0;
        _tempForce2.y = 0;
        return _tempForce2;
      }
      px = projected.x;
      py = projected.y;
    }
    const dx = px - this.position.x;
    const dy = py - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0 || dist > this.radius) {
      _tempForce2.x = 0;
      _tempForce2.y = 0;
      return _tempForce2;
    }
    const linearFalloff = 1 - dist / this.radius;
    const distanceFalloff = this.falloff === 1 ? linearFalloff : Math.pow(linearFalloff, this.falloff);
    if (this.mode === "repel") {
      const scale2 = Math.abs(this.strength) * distanceFalloff / dist;
      _tempForce2.x = dx * scale2;
      _tempForce2.y = dy * scale2;
      return _tempForce2;
    }
    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed < 0.01) {
      _tempForce2.x = 0;
      _tempForce2.y = 0;
      return _tempForce2;
    }
    const speedFactor = Math.min(speed, this.maxSpeed) / this.maxSpeed;
    const scale = this.strength * distanceFalloff * speedFactor / speed;
    _tempForce2.x = this.velocity.x * scale;
    _tempForce2.y = this.velocity.y * scale;
    return _tempForce2;
  }
};

// src/particular/components/flockingForce.ts
var _tempForce3 = new chunkDSCJ6LNA_cjs.Vector(0, 0);
function szudzikPair(a, b) {
  const aa = a >= 0 ? 2 * a : -2 * a - 1;
  const bb = b >= 0 ? 2 * b : -2 * b - 1;
  return aa >= bb ? aa * aa + aa + bb : bb * bb + aa;
}
var SpatialHashGrid = class {
  constructor(cellSize) {
    this.cells = /* @__PURE__ */ new Map();
    this.cellPool = [];
    this.invCellSize = 1 / cellSize;
  }
  clear() {
    this.cells.forEach((arr) => {
      arr.length = 0;
      this.cellPool.push(arr);
    });
    this.cells.clear();
  }
  insert(particle) {
    const cx = Math.floor(particle.position.x * this.invCellSize);
    const cy = Math.floor(particle.position.y * this.invCellSize);
    const key = szudzikPair(cx, cy);
    let cell = this.cells.get(key);
    if (!cell) {
      cell = this.cellPool.pop() || [];
      this.cells.set(key, cell);
    }
    cell.push(particle);
  }
  queryNeighbors(particle, radius, has3D, callback) {
    const px = particle.position.x;
    const py = particle.position.y;
    const pz = particle.position.z;
    const cx = Math.floor(px * this.invCellSize);
    const cy = Math.floor(py * this.invCellSize);
    const radiusSq = radius * radius;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = szudzikPair(cx + dx, cy + dy);
        const cell = this.cells.get(key);
        if (!cell) continue;
        for (let i = 0; i < cell.length; i++) {
          const neighbor = cell[i];
          if (neighbor === particle) continue;
          const ddx = neighbor.position.x - px;
          const ddy = neighbor.position.y - py;
          let distSq = ddx * ddx + ddy * ddy;
          if (has3D) {
            const ddz = neighbor.position.z - pz;
            distSq += ddz * ddz;
          }
          if (distSq < radiusSq) {
            callback(neighbor, distSq);
          }
        }
      }
    }
  }
};
var FlockingForce = class {
  constructor(config) {
    /** Engine bounds — set automatically by the engine before preCompute. Used for edge avoidance. */
    this.boundsWidth = 0;
    this.boundsHeight = 0;
    this.forceMap = /* @__PURE__ */ new WeakMap();
    this.dt = 1;
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
    const merged = { ...chunkDSCJ6LNA_cjs.defaultFlockingForce, ...config };
    this.neighborRadius = merged.neighborRadius;
    this.separationWeight = merged.separationWeight;
    this.alignmentWeight = merged.alignmentWeight;
    this.cohesionWeight = merged.cohesionWeight;
    this.maxSteeringForce = merged.maxSteeringForce;
    this.boundarySteeringForce = merged.boundarySteeringForce;
    this.minSpeed = merged.minSpeed;
    this.containment = merged.containment;
    this.boundsScale = merged.boundsScale;
    this.boundsDepth = merged.boundsDepth;
    this.maxSpeed = merged.maxSpeed;
    this.separationDistance = merged.separationDistance;
    this.grid = new SpatialHashGrid(this.neighborRadius);
  }
  setBounds(width, height) {
    this.boundsWidth = width;
    this.boundsHeight = height;
    const scale = Math.max(0.01, Math.min(1, this.boundsScale));
    const footprintWidth = this.boundsDepth > 0 ? Math.min(width, height) : width;
    const footprintHeight = this.boundsDepth > 0 ? Math.min(width, height) : height;
    this.left = (width - footprintWidth * scale) / 2;
    this.right = width - this.left;
    this.top = (height - footprintHeight * scale) / 2;
    this.bottom = height - this.top;
  }
  constrain(particle) {
    if (!this.containment || this.boundsWidth <= 0 || this.boundsHeight <= 0) return;
    const padding = Math.max(0, particle.size, particle.factoredSize);
    const padX = Math.min(padding, (this.right - this.left) / 2);
    const padY = Math.min(padding, (this.bottom - this.top) / 2);
    const minX = this.left + padX;
    const maxX = this.right - padX;
    const minY = this.top + padY;
    const maxY = this.bottom - padY;
    if (particle.position.x < minX) {
      particle.position.x = minX;
      particle.velocity.x = Math.abs(particle.velocity.x);
    } else if (particle.position.x > maxX) {
      particle.position.x = maxX;
      particle.velocity.x = -Math.abs(particle.velocity.x);
    }
    if (particle.position.y < minY) {
      particle.position.y = minY;
      particle.velocity.y = Math.abs(particle.velocity.y);
    } else if (particle.position.y > maxY) {
      particle.position.y = maxY;
      particle.velocity.y = -Math.abs(particle.velocity.y);
    }
    if (this.boundsDepth > 0) {
      const limit = Math.max(0, this.boundsDepth / 2 - padding);
      if (particle.position.z < -limit) {
        particle.position.z = -limit;
        particle.velocity.z = Math.abs(particle.velocity.z);
      } else if (particle.position.z > limit) {
        particle.position.z = limit;
        particle.velocity.z = -Math.abs(particle.velocity.z);
      }
    }
  }
  preCompute(particles, dt) {
    this.dt = dt;
    this.setBounds(this.boundsWidth, this.boundsHeight);
    const grid = this.grid;
    grid.clear();
    let has3D = false;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].position.z !== 0) {
        has3D = true;
        break;
      }
    }
    for (let i = 0; i < particles.length; i++) {
      this.constrain(particles[i]);
      grid.insert(particles[i]);
    }
    const sepDistSq = this.separationDistance * this.separationDistance;
    const maxSteer = this.maxSteeringForce;
    const sepW = this.separationWeight;
    const aliW = this.alignmentWeight;
    const cohW = this.cohesionWeight;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      let sepX = 0, sepY = 0, sepZ = 0;
      let aliVX = 0, aliVY = 0, aliVZ = 0;
      let cohX = 0, cohY = 0, cohZ = 0;
      let neighborCount = 0;
      let sepCount = 0;
      grid.queryNeighbors(p, this.neighborRadius, has3D, (neighbor, distSq) => {
        neighborCount++;
        const nx = neighbor.position.x;
        const ny = neighbor.position.y;
        const nz = neighbor.position.z;
        cohX += nx;
        cohY += ny;
        cohZ += nz;
        aliVX += neighbor.velocity.x;
        aliVY += neighbor.velocity.y;
        aliVZ += neighbor.velocity.z;
        if (distSq < sepDistSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const invDist = 1 / dist;
          sepX += (p.position.x - nx) * invDist;
          sepY += (p.position.y - ny) * invDist;
          if (has3D) sepZ += (p.position.z - nz) * invDist;
          sepCount++;
        }
      });
      let fx = 0, fy = 0, fz = 0;
      if (neighborCount > 0) {
        if (sepCount > 0) {
          const invSep = 1 / sepCount;
          fx += sepX * invSep * sepW;
          fy += sepY * invSep * sepW;
          fz += sepZ * invSep * sepW;
        }
        const invN = 1 / neighborCount;
        const avgVX = aliVX * invN;
        const avgVY = aliVY * invN;
        const avgVZ = aliVZ * invN;
        fx += (avgVX - p.velocity.x) * aliW;
        fy += (avgVY - p.velocity.y) * aliW;
        fz += (avgVZ - p.velocity.z) * aliW;
        const avgPX = cohX * invN;
        const avgPY = cohY * invN;
        const avgPZ = cohZ * invN;
        fx += (avgPX - p.position.x) * 0.01 * cohW;
        fy += (avgPY - p.position.y) * 0.01 * cohW;
        fz += (avgPZ - p.position.z) * 0.01 * cohW;
      }
      const magSq = fx * fx + fy * fy + fz * fz;
      if (magSq > maxSteer * maxSteer) {
        const invMag = maxSteer / Math.sqrt(magSq);
        fx *= invMag;
        fy *= invMag;
        fz *= invMag;
      }
      const smooth = 1 - Math.pow(0.98, dt);
      let entry = this.forceMap.get(p);
      if (entry) {
        entry.x += (fx - entry.x) * smooth;
        entry.y += (fy - entry.y) * smooth;
        entry.z += (fz - entry.z) * smooth;
      } else {
        entry = { x: fx, y: fy, z: fz };
        this.forceMap.set(p, entry);
      }
    }
  }
  getForce(_particlePosition, particle) {
    if (!particle || this.dt <= 0) {
      _tempForce3.x = 0;
      _tempForce3.y = 0;
      _tempForce3.z = 0;
      return _tempForce3;
    }
    const entry = this.forceMap.get(particle);
    if (!entry) {
      _tempForce3.x = 0;
      _tempForce3.y = 0;
      _tempForce3.z = 0;
      return _tempForce3;
    }
    _tempForce3.x = entry.x;
    _tempForce3.y = entry.y;
    _tempForce3.z = entry.z;
    this.steerFromBounds(particle);
    const vx = particle.velocity.x + _tempForce3.x * this.dt;
    const vy = particle.velocity.y + _tempForce3.y * this.dt;
    const vz = particle.velocity.z + _tempForce3.z * this.dt;
    const speedSq = vx * vx + vy * vy + vz * vz;
    if (speedSq > this.maxSpeed * this.maxSpeed) {
      const speed = Math.sqrt(speedSq);
      const scale = this.maxSpeed / speed;
      _tempForce3.x = (vx * scale - particle.velocity.x) / this.dt;
      _tempForce3.y = (vy * scale - particle.velocity.y) / this.dt;
      _tempForce3.z = (vz * scale - particle.velocity.z) / this.dt;
    } else {
      const minSpeed = Math.max(0, Math.min(this.minSpeed, this.maxSpeed));
      if (minSpeed > 0 && speedSq < minSpeed * minSpeed) {
        const dx = speedSq > 1e-12 ? vx : particle.velocity.x;
        const dy = speedSq > 1e-12 ? vy : particle.velocity.y;
        const dz = speedSq > 1e-12 ? vz : particle.velocity.z;
        const directionSq = dx * dx + dy * dy + dz * dz;
        if (directionSq > 1e-12) {
          const scale = minSpeed / Math.sqrt(directionSq);
          _tempForce3.x = (dx * scale - particle.velocity.x) / this.dt;
          _tempForce3.y = (dy * scale - particle.velocity.y) / this.dt;
          _tempForce3.z = (dz * scale - particle.velocity.z) / this.dt;
        }
      }
    }
    return _tempForce3;
  }
  steerFromBounds(particle) {
    if (this.boundsWidth <= 0 || this.boundsHeight <= 0 || this.boundarySteeringForce <= 0) return;
    const vx = particle.velocity.x;
    const vy = particle.velocity.y;
    const vz = particle.velocity.z;
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const turnDistance = Math.max(this.neighborRadius, 2 * speed * speed / this.boundarySteeringForce);
    const marginX = Math.min(turnDistance, (this.right - this.left) * 0.45);
    const marginY = Math.min(turnDistance, (this.bottom - this.top) * 0.45);
    const px = particle.position.x + vx * this.dt;
    const py = particle.position.y + vy * this.dt;
    const nx = vx < 0 ? Math.max(0, 1 - (px - this.left) / marginX) : vx > 0 ? -Math.max(0, 1 - (this.right - px) / marginX) : 0;
    const ny = vy < 0 ? Math.max(0, 1 - (py - this.top) / marginY) : vy > 0 ? -Math.max(0, 1 - (this.bottom - py) / marginY) : 0;
    let nz = 0;
    if (this.boundsDepth > 0) {
      const marginZ = Math.min(turnDistance, this.boundsDepth * 0.45);
      const pz = particle.position.z + vz * this.dt;
      nz = vz < 0 ? Math.max(0, 1 - (pz + this.boundsDepth / 2) / marginZ) : vz > 0 ? -Math.max(0, 1 - (this.boundsDepth / 2 - pz) / marginZ) : 0;
    }
    const urgency = Math.max(Math.abs(nx), Math.abs(ny), Math.abs(nz));
    if (urgency <= 0) return;
    const dx = nx + ny + (nx === 0 && ny === 0 && nz !== 0 ? 1 : 0);
    const dy = ny - nx;
    const dz = nz;
    const scale = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
    const ux = vx / speed;
    const uy = vy / speed;
    const uz = vz / speed;
    const cosine = Math.max(-1, Math.min(1, ux * dx * scale + uy * dy * scale + uz * dz * scale));
    let tx = dx * scale - ux * cosine;
    let ty = dy * scale - uy * cosine;
    let tz = dz * scale - uz * cosine;
    let tangentLength = Math.sqrt(tx * tx + ty * ty + tz * tz);
    if (tangentLength < 1e-9) {
      if (cosine > 0) return;
      tx = -uy;
      ty = ux;
      tz = 0;
      tangentLength = Math.sqrt(tx * tx + ty * ty);
      if (tangentLength < 1e-9) {
        tx = 1;
        tangentLength = 1;
      }
    }
    const angle = Math.min(Math.acos(cosine), this.boundarySteeringForce * this.dt / speed);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle) / tangentLength;
    const ax = ((ux * cos + tx * sin) * speed - vx) / this.dt;
    const ay = ((uy * cos + ty * sin) * speed - vy) / this.dt;
    const az = ((uz * cos + tz * sin) * speed - vz) / this.dt;
    const blend = Math.min(1, urgency * 8);
    _tempForce3.x += (ax - _tempForce3.x) * blend;
    _tempForce3.y += (ay - _tempForce3.y) * blend;
    _tempForce3.z += (az - _tempForce3.z) * blend;
  }
};

// src/particular/components/icons.ts
var images = [];
function processImages(icons) {
  images = [];
  for (const icon of icons) {
    if (typeof icon === "string") {
      const imageObject = new Image();
      imageObject.src = icon;
      images.push(imageObject);
    } else {
      images.push(icon);
    }
  }
  return images;
}

// src/particular/convenience/forces.ts
function createForces({ engine, container, resources }) {
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
    const vp = chunkJSFHD3FV_cjs.getViewportSize(container);
    const viewW = vp.w / pixelRatio;
    const viewH = vp.h / pixelRatio;
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
      resources.add(() => mouseForce.stopTracking());
    }
    return mouseForce;
  };
  const removeMouseForce = (mouseForce) => {
    mouseForce.stopTracking();
    engine.removeMouseForce(mouseForce);
  };
  const addFlockingForce = (config) => {
    const flockingForce = new FlockingForce(config);
    engine.addFlockingForce(flockingForce);
    return flockingForce;
  };
  const removeFlockingForce = (flockingForce) => {
    engine.removeFlockingForce(flockingForce);
  };
  const addForce = (force) => {
    engine.addForce(force);
    return force;
  };
  const removeForce = (force) => engine.removeForce(force);
  return {
    addForce,
    removeForce,
    addAttractor,
    removeAttractor,
    addRandomAttractors,
    removeAllAttractors,
    addMouseForce,
    removeMouseForce,
    addFlockingForce,
    removeFlockingForce
  };
}

// src/particular/convenience/boundary.ts
function createBoundaryHelper({
  engine,
  container,
  resources,
  coordinates
}) {
  const addBoundary = (config) => {
    resources.assertActive();
    let disposed = false;
    const { element, strength = -1.5, radius = 10, inset: insetFraction = 0.4 } = config;
    const pr = engine.pixelRatio;
    let attractors = [];
    let offsets = [];
    const rebuild = () => {
      if (disposed || resources.disposed) return;
      for (const a of attractors) engine.removeAttractor(a);
      attractors = [];
      offsets = [];
      const elRect = element.getBoundingClientRect();
      const { x: elLeft, y: elTop } = coordinates.clientToEngine(elRect.left, elRect.top);
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
    let rebuildRafId = 0;
    const ro = new ResizeObserver(() => {
      if (rebuildRafId) return;
      rebuildRafId = requestAnimationFrame(() => {
        rebuildRafId = 0;
        rebuild();
      });
    });
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
      destroy: resources.add(() => {
        disposed = true;
        ro.disconnect();
        if (rebuildRafId) cancelAnimationFrame(rebuildRafId);
        scrollTarget.removeEventListener("scroll", onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const a of attractors) engine.removeAttractor(a);
        attractors = [];
        offsets = [];
      })
    };
    return handle;
  };
  return { addBoundary };
}

// src/particular/convenience/containerGlow.ts
var EDGE_ANGLES = {
  top: -Math.PI / 2,
  bottom: Math.PI / 2,
  left: Math.PI,
  right: 0
};
function createContainerGlowHelper({
  engine,
  container,
  resources,
  coordinates
}) {
  const addContainerGlow = (config) => {
    resources.assertActive();
    let disposed = false;
    const { element, ...userConfig } = config;
    const resolved = { ...chunkDSCJ6LNA_cjs.defaultContainerGlow, ...userConfig };
    const pr = engine.pixelRatio;
    let emitters = [];
    let edgeData = [];
    let pulseTick = 0;
    let paused = false;
    const baseRate = resolved.rate;
    const buildParticleConfig = (angle) => chunkDSCJ6LNA_cjs.configureParticle({
      rate: resolved.rate,
      life: 999999,
      particleLife: resolved.particleLife,
      velocity: chunkDSCJ6LNA_cjs.Vector.fromAngle(angle, resolved.velocity),
      spread: resolved.spread,
      sizeMin: resolved.sizeMin,
      sizeMax: resolved.sizeMax,
      velocityMultiplier: 0,
      fadeTime: resolved.fadeTime,
      gravity: 0,
      scaleStep: 1,
      friction: resolved.friction,
      frictionSize: 0,
      acceleration: 0,
      accelerationSize: 0,
      colors: resolved.colors,
      shape: resolved.shape,
      blendMode: resolved.blendMode,
      glow: resolved.glow,
      glowSize: resolved.glowSize,
      glowColor: resolved.glowColor,
      glowAlpha: resolved.glowAlpha,
      shadow: false,
      trail: false
    });
    const rebuild = () => {
      if (disposed || resources.disposed) return;
      for (const em of emitters) {
        const index = engine.emitters.indexOf(em);
        if (index !== -1) engine.emitters.splice(index, 1);
        em.destroy();
      }
      emitters = [];
      edgeData = [];
      const elRect = element.getBoundingClientRect();
      const { x: elLeft, y: elTop } = coordinates.clientToEngine(elRect.left, elRect.top);
      const elW = elRect.width / pr;
      const elH = elRect.height / pr;
      const edges = [
        { edge: "top", offsetX: elW / 2, offsetY: 0, spawnW: elW, spawnH: 0 },
        { edge: "bottom", offsetX: elW / 2, offsetY: elH, spawnW: elW, spawnH: 0 },
        { edge: "left", offsetX: 0, offsetY: elH / 2, spawnW: 0, spawnH: elH },
        { edge: "right", offsetX: elW, offsetY: elH / 2, spawnW: 0, spawnH: elH }
      ];
      for (const { edge, offsetX, offsetY, spawnW, spawnH } of edges) {
        const particleConfig = buildParticleConfig(EDGE_ANGLES[edge]);
        const emitter = new chunkDSCJ6LNA_cjs.Emitter({
          point: new chunkDSCJ6LNA_cjs.Vector(elLeft + offsetX, elTop + offsetY),
          ...particleConfig,
          spawnWidth: spawnW,
          spawnHeight: spawnH,
          icons: []
        });
        engine.addEmitter(emitter);
        emitter.isEmitting = true;
        emitter.emit();
        emitters.push(emitter);
        edgeData.push({ edge, offsetX, offsetY });
      }
    };
    const reposition = () => {
      if (emitters.length === 0) return;
      const refRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      for (let i = 0; i < emitters.length; i++) {
        const em = emitters[i];
        const data = edgeData[i];
        em.configuration.point.x = elLeft + data.offsetX;
        em.configuration.point.y = elTop + data.offsetY;
      }
    };
    const onUpdate = (frame) => {
      if (paused) {
        for (const em of emitters) em.isEmitting = false;
        return;
      }
      if (resolved.pulseAmplitude > 0 && resolved.pulseSpeed > 0) {
        pulseTick += frame?.dt ?? 1;
        const pulse = 1 + resolved.pulseAmplitude * Math.sin(pulseTick * resolved.pulseSpeed);
        for (const em of emitters) {
          em.configuration.rate = baseRate * pulse;
        }
      }
    };
    rebuild();
    engine.addEventListener(chunkELTIAHJF_cjs.Particular.UPDATE, onUpdate);
    let rebuildRafId = 0;
    const ro = new ResizeObserver(() => {
      if (rebuildRafId) return;
      rebuildRafId = requestAnimationFrame(() => {
        rebuildRafId = 0;
        rebuild();
      });
    });
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
    const stop = () => {
      paused = true;
      for (const em of emitters) em.isEmitting = false;
    };
    const start = () => {
      if (disposed || resources.disposed) return;
      paused = false;
      for (const em of emitters) em.isEmitting = true;
    };
    const handle = {
      update: rebuild,
      stop,
      start,
      destroy: resources.add(() => {
        disposed = true;
        engine.removeEventListener(chunkELTIAHJF_cjs.Particular.UPDATE, onUpdate);
        ro.disconnect();
        if (rebuildRafId) cancelAnimationFrame(rebuildRafId);
        scrollTarget.removeEventListener("scroll", onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const em of emitters) {
          const idx = engine.emitters.indexOf(em);
          if (idx !== -1) engine.emitters.splice(idx, 1);
          em.destroy();
        }
        emitters = [];
        edgeData = [];
      })
    };
    return handle;
  };
  return { addContainerGlow };
}

// src/particular/convenience/mouseTrail.ts
function createMouseTrailHelper({ engine, container, resources }) {
  const addMouseTrail = (config = {}) => {
    resources.assertActive();
    let disposed = false;
    const { target: userTarget, ...userConfig } = config;
    const resolved = { ...chunkDSCJ6LNA_cjs.defaultMouseTrail, ...userConfig };
    const pr = engine.pixelRatio;
    const target = userTarget ?? window;
    let paused = false;
    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;
    let mouseSpeed = 0;
    let hasMoved = false;
    const particleConfig = chunkDSCJ6LNA_cjs.configureParticle({
      rate: resolved.rate,
      life: 999999,
      particleLife: resolved.particleLife,
      velocity: new chunkDSCJ6LNA_cjs.Vector(0, 0),
      spread: resolved.spread,
      sizeMin: resolved.sizeMin,
      sizeMax: resolved.sizeMax,
      velocityMultiplier: 0,
      fadeTime: resolved.fadeTime,
      gravity: 0,
      scaleStep: 1,
      friction: resolved.friction,
      frictionSize: 0,
      acceleration: 0,
      accelerationSize: 0,
      colors: resolved.colors,
      shape: resolved.shape,
      blendMode: resolved.blendMode,
      glow: resolved.glow,
      glowSize: resolved.glowSize,
      glowColor: resolved.glowColor,
      glowAlpha: resolved.glowAlpha,
      shadow: false,
      trail: resolved.trail,
      trailLength: resolved.trailLength,
      trailFade: resolved.trailFade,
      trailShrink: resolved.trailShrink
    });
    const emitter = new chunkDSCJ6LNA_cjs.Emitter({
      point: new chunkDSCJ6LNA_cjs.Vector(0, 0),
      ...particleConfig,
      spawnWidth: 0,
      spawnHeight: 0,
      icons: []
    });
    engine.addEmitter(emitter);
    emitter.isEmitting = false;
    let cachedRect = null;
    let rectDirty = true;
    const invalidateRect = () => {
      rectDirty = true;
    };
    let trailRo = null;
    if (container) {
      trailRo = new ResizeObserver(invalidateRect);
      trailRo.observe(container);
      window.addEventListener("scroll", invalidateRect, { passive: true });
      container.addEventListener("scroll", invalidateRect, { passive: true });
    }
    const handleCoords = (clientX, clientY) => {
      let x = clientX;
      let y = clientY;
      if (container) {
        if (rectDirty || !cachedRect) {
          const rect = container.getBoundingClientRect();
          cachedRect = { left: rect.left, top: rect.top };
          rectDirty = false;
        }
        x -= cachedRect.left;
        y -= cachedRect.top;
      }
      mouseX = x / pr;
      mouseY = y / pr;
      hasMoved = true;
    };
    const onMouseMove = (e) => {
      const me = e;
      handleCoords(me.clientX, me.clientY);
    };
    const onTouchMove = (e) => {
      const te = e;
      const touch = te.touches[0];
      if (touch) handleCoords(touch.clientX, touch.clientY);
    };
    target.addEventListener("mousemove", onMouseMove);
    target.addEventListener("touchmove", onTouchMove, { passive: true });
    target.addEventListener("touchstart", onTouchMove, { passive: true });
    const onUpdate = (frame) => {
      const dt = frame?.dt ?? 1;
      if (dt <= 0) return;
      if (paused) {
        emitter.isEmitting = false;
        return;
      }
      if (!hasMoved) {
        emitter.isEmitting = false;
        return;
      }
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy) / dt;
      prevX = mouseX;
      prevY = mouseY;
      emitter.configuration.point.x = mouseX;
      emitter.configuration.point.y = mouseY;
      if (mouseSpeed < resolved.minSpeed) {
        emitter.isEmitting = false;
        return;
      }
      const angle = Math.atan2(dy, dx);
      emitter.configuration.velocity = chunkDSCJ6LNA_cjs.Vector.fromAngle(angle + Math.PI, resolved.velocity);
      emitter.isEmitting = true;
    };
    engine.addEventListener(chunkELTIAHJF_cjs.Particular.UPDATE, onUpdate);
    const handle = {
      stop: () => {
        paused = true;
        emitter.isEmitting = false;
      },
      start: () => {
        if (disposed || resources.disposed) return;
        paused = false;
      },
      destroy: resources.add(() => {
        disposed = true;
        engine.removeEventListener(chunkELTIAHJF_cjs.Particular.UPDATE, onUpdate);
        target.removeEventListener("mousemove", onMouseMove);
        target.removeEventListener("touchmove", onTouchMove);
        target.removeEventListener("touchstart", onTouchMove);
        if (trailRo) trailRo.disconnect();
        if (container) {
          window.removeEventListener("scroll", invalidateRect);
          container.removeEventListener("scroll", invalidateRect);
        }
        const idx = engine.emitters.indexOf(emitter);
        if (idx !== -1) engine.emitters.splice(idx, 1);
        emitter.destroy();
      })
    };
    return handle;
  };
  return { addMouseTrail };
}

// src/particular/convenience/effects.ts
function createEffects({ engine, config: mergedConfig, resources }) {
  const explode = (options = {}) => {
    resources.assertActive();
    const destroyParents = options.destroyParents ?? true;
    const allParticles = engine.getAllParticles();
    if (allParticles.length === 0) return;
    const snapshots = allParticles.map((p) => ({
      x: p.position.x,
      y: p.position.y,
      z: p.position.z,
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
    const fallbackColors = chunkDSCJ6LNA_cjs.generateHarmoniousPalette();
    const collectorConfig = chunkDSCJ6LNA_cjs.configureParticle({}, mergedConfig);
    const collector = new chunkDSCJ6LNA_cjs.Emitter({
      point: new chunkDSCJ6LNA_cjs.Vector(0, 0),
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
        const child = chunkDSCJ6LNA_cjs.createExplosionChild(parent, options, engine, fallbackColors);
        collector.particles.push(child);
        spawned++;
      }
      if (spawned >= budget) break;
    }
    engine.addEmitter(collector);
  };
  const scatter = (options = {}) => {
    resources.assertActive();
    const baseVelocity = options.velocity ?? 10;
    const rotationImpulse = options.rotation ?? 0;
    const allParticles = engine.getAllParticles();
    for (const particle of allParticles) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = baseVelocity * (0.3 + Math.random() * 1.4);
      particle.velocity.x += Math.cos(angle) * magnitude;
      particle.velocity.y += Math.sin(angle) * magnitude;
      if (particle.position.z !== 0 || particle.homePosition && particle.homePosition.z !== 0) {
        particle.velocity.z += (Math.random() - 0.5) * magnitude;
      }
      if (rotationImpulse > 0) {
        particle.rotationVelocity += (Math.random() - 0.5) * 2 * rotationImpulse;
      }
    }
  };
  let wobbleCleanup = null;
  const startWobble = (config) => {
    resources.assertActive();
    stopWobble();
    const { track, ...rest } = config ?? {};
    const resolved = { ...chunkDSCJ6LNA_cjs.defaultWobble, ...rest };
    for (const p of engine.getAllParticles()) {
      p.preventSettle = true;
    }
    const allParticles = engine.getAllParticles();
    let cx = 0, cy = 0, homeCount = 0;
    for (const p of allParticles) {
      if (p.homePosition) {
        cx += p.homePosition.x;
        cy += p.homePosition.y;
        homeCount++;
      }
    }
    if (homeCount > 0) {
      cx /= homeCount;
      cy /= homeCount;
    }
    const center = { x: cx, y: cy };
    let mouseX = center.x;
    let mouseY = center.y;
    let mouseVelX = 0;
    let mouseVelY = 0;
    const pointerMotion = new PointerMotion();
    const eventCleanups = [];
    if (track) {
      const pr = mergedConfig.pixelRatio;
      const container = engine.container;
      let cachedRect = null;
      let rectDirty = true;
      const invalidateRect = () => {
        rectDirty = true;
      };
      let wobbleRo = null;
      if (container) {
        wobbleRo = new ResizeObserver(invalidateRect);
        wobbleRo.observe(container);
        window.addEventListener("scroll", invalidateRect, { passive: true });
        container.addEventListener("scroll", invalidateRect, { passive: true });
      }
      const updateMouse = (clientX, clientY) => {
        let x = clientX;
        let y = clientY;
        if (container) {
          if (rectDirty || !cachedRect) {
            const rect = container.getBoundingClientRect();
            cachedRect = { left: rect.left, top: rect.top };
            rectDirty = false;
          }
          x -= cachedRect.left;
          y -= cachedRect.top;
        }
        const newX = x / pr;
        const newY = y / pr;
        pointerMotion.record(newX, newY);
        mouseX = newX;
        mouseY = newY;
      };
      const onMouseMove = (e) => updateMouse(e.clientX, e.clientY);
      const onTouchMove = (e) => {
        if (e.touches.length > 0) {
          updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      track.addEventListener("mousemove", onMouseMove);
      track.addEventListener("touchmove", onTouchMove);
      eventCleanups.push(
        () => track.removeEventListener("mousemove", onMouseMove),
        () => track.removeEventListener("touchmove", onTouchMove),
        () => {
          if (wobbleRo) wobbleRo.disconnect();
        },
        () => {
          if (container) {
            window.removeEventListener("scroll", invalidateRect);
            container.removeEventListener("scroll", invalidateRect);
          }
        }
      );
    }
    const wobble = (frame) => {
      const dt = frame?.dt ?? 1;
      if (dt <= 0) return;
      const motion = pointerMotion.consume(dt);
      if (motion) {
        mouseVelX = motion.x;
        mouseVelY = motion.y;
      }
      const noiseScale = Math.sqrt(dt);
      const particles = engine.getAllParticles();
      const pr = mergedConfig.pixelRatio;
      const engineRadius = resolved.mouseRadius / pr;
      for (const p of particles) {
        if (track && p.homePosition) {
          const outDx = p.homePosition.x - center.x;
          const outDy = p.homePosition.y - center.y;
          const outAngle = Math.atan2(outDy, outDx);
          const mDx = p.position.x - mouseX;
          const mDy = p.position.y - mouseY;
          const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
          const proximity = Math.max(0, 1 - mDist / engineRadius);
          const angleJitter = (Math.random() - 0.5) * 0.8;
          const pushAngle = outAngle + angleJitter;
          const pushStrength = resolved.velocity * (0.3 + proximity * resolved.mouseStrength) * (0.3 + Math.random() * 1.4);
          p.velocity.x += Math.cos(pushAngle) * pushStrength * dt;
          p.velocity.y += Math.sin(pushAngle) * pushStrength * dt;
          if (proximity > 0.1) {
            p.velocity.x += mouseVelX * proximity * 0.3 * dt;
            p.velocity.y += mouseVelY * proximity * 0.3 * dt;
          }
          p.rotationVelocity += (Math.random() - 0.5) * resolved.rotation * 2 * (0.3 + proximity * 2) * noiseScale;
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 0.3 * noiseScale;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 0.3 * noiseScale;
        } else {
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 2 * noiseScale;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 2 * noiseScale;
          p.rotationVelocity += (Math.random() - 0.5) * resolved.rotation * 2 * noiseScale;
        }
      }
      mouseVelX *= Math.pow(0.85, dt);
      mouseVelY *= Math.pow(0.85, dt);
    };
    engine.addEventListener("UPDATE", wobble);
    wobbleCleanup = () => {
      engine.removeEventListener("UPDATE", wobble);
      for (const cleanup of eventCleanups) cleanup();
      for (const p of engine.getAllParticles()) {
        p.preventSettle = false;
      }
    };
  };
  const stopWobble = () => {
    if (wobbleCleanup) {
      wobbleCleanup();
      wobbleCleanup = null;
    }
  };
  resources.add(stopWobble);
  return { explode, scatter, startWobble, stopWobble };
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
  if (typeof document === "undefined") {
    throw new Error(
      "Particular: createParticles() requires a browser environment (document is not defined). Wrap the call in a useEffect or check for window before calling."
    );
  }
  if (container) {
    const position = getComputedStyle(container).position;
    if (position === "static") {
      console.warn(
        'Particular: container element has position: static. The canvas will be positioned with position: absolute inside it, which requires a positioned parent (relative, absolute, or fixed). Add "position: relative" to your container.'
      );
    }
  }
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
  const engine = new chunkELTIAHJF_cjs.Particular();
  const basePreset = chunkDSCJ6LNA_cjs.getPreset(preset);
  const mergedConfig = chunkDSCJ6LNA_cjs.configureParticular({ ...basePreset, ...config, container });
  const context = chunkELTIAHJF_cjs.createFeatureContext(engine, mergedConfig);
  const { resources, coordinates } = context;
  const originalStyles = canvas.style.cssText;
  resources.add(() => {
    if (canvasAutoCreated) canvas.remove();
    else canvas.style.cssText = originalStyles;
  });
  try {
    applyCanvasStyles(canvas, container, config?.zIndex);
    engine.initialize(mergedConfig);
    let camera3d = null;
    let renderer3d = null;
    if (renderer === "webgl3d") {
      renderer3d = new chunkBCADERZK_cjs.WebGL3DRenderer(canvas, {
        maxInstances: mergedConfig.webglMaxInstances,
        camera: config?.camera
      });
      camera3d = renderer3d.camera;
      engine.addRenderer(renderer3d);
    } else if (renderer === "webgl") {
      engine.addRenderer(
        new chunkZMNMQZSP_cjs.WebGLRenderer(canvas, {
          maxInstances: mergedConfig.webglMaxInstances
        })
      );
    } else {
      engine.addRenderer(new chunk4IB6HY3F_cjs.CanvasRenderer(canvas));
    }
    engine.onResize();
    if (autoResize) {
      const handleResize = () => {
        engine.onResize();
        if (autoStartEmitter) {
          const pr = mergedConfig.pixelRatio;
          if (renderer3d && renderer3d.referenceWorldScale > 0) {
            autoStartEmitter.configuration.point.x = renderer3d.referenceCenterX;
            autoStartEmitter.configuration.point.y = renderer3d.referenceCenterY;
          } else {
            const newSize = chunkJSFHD3FV_cjs.getViewportSize(container);
            autoStartEmitter.configuration.point.x = newSize.w / 2 / pr;
            autoStartEmitter.configuration.point.y = newSize.h / 2 / pr;
          }
        }
      };
      if (container) {
        const ro = new ResizeObserver(handleResize);
        ro.observe(container);
        resources.add(() => ro.disconnect());
      } else {
        window.addEventListener("resize", handleResize);
        resources.add(() => window.removeEventListener("resize", handleResize));
      }
    }
    const toEngineCoords = (clientX, clientY) => {
      const position = coordinates.clientToEngine(clientX, clientY);
      const pr = mergedConfig.pixelRatio;
      let engineX = position.x;
      let engineY = position.y;
      if (renderer3d && renderer3d.referenceWorldScale > 0) {
        const currentCenterX = engine.width / pr * 0.5;
        const currentCenterY = engine.height / pr * 0.5;
        engineX += renderer3d.referenceCenterX - currentCenterX;
        engineY += renderer3d.referenceCenterY - currentCenterY;
      }
      return { x: engineX, y: engineY };
    };
    const burst = (options) => {
      resources.assertActive();
      const { x, y, ...overrides } = options;
      const combinedSettings = chunkDSCJ6LNA_cjs.configureParticle(overrides, mergedConfig);
      let icons = [];
      if (combinedSettings.icons) {
        icons = processImages(combinedSettings.icons);
      }
      const enginePos = toEngineCoords(x, y);
      const emitter = new chunkDSCJ6LNA_cjs.Emitter({
        point: new chunkDSCJ6LNA_cjs.Vector(enginePos.x, enginePos.y),
        ...combinedSettings,
        icons
      });
      engine.addEmitter(emitter);
      emitter.isEmitting = true;
      emitter.emit();
      return emitter;
    };
    const attachClickBurst = (target = clickTarget ?? document, overrides) => {
      resources.assertActive();
      const onClick = (event) => {
        const mouseEvent = event;
        burst({
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
          ...overrides ?? {}
        });
      };
      target.addEventListener("click", onClick);
      return resources.add(() => target.removeEventListener("click", onClick));
    };
    if (autoClick) {
      attachClickBurst(clickTarget ?? document);
    }
    let autoStartEmitter = null;
    if (mergedConfig.autoStart) {
      const size = chunkJSFHD3FV_cjs.getViewportSize(container);
      const centerX = size.w / 2 / mergedConfig.pixelRatio;
      const centerY = size.h / 2 / mergedConfig.pixelRatio;
      const particleConfig = chunkDSCJ6LNA_cjs.configureParticle({}, mergedConfig);
      autoStartEmitter = new chunkDSCJ6LNA_cjs.Emitter({
        point: new chunkDSCJ6LNA_cjs.Vector(centerX, centerY),
        ...particleConfig,
        icons: []
      });
      engine.addEmitter(autoStartEmitter);
      autoStartEmitter.isEmitting = true;
      autoStartEmitter.emit();
    }
    const forces = createForces(context);
    const boundary = createBoundaryHelper(context);
    const containerGlow = createContainerGlowHelper(context);
    const mouseTrail = createMouseTrailHelper(context);
    const effects = createEffects(context);
    const imageApi = chunkJSFHD3FV_cjs.createImageParticles(context);
    const imageShatter = chunkJSFHD3FV_cjs.createImageShatterHelper(context);
    if (mouseForce) {
      const mouseConfig = mouseForce === true ? { track: true } : { track: true, ...mouseForce };
      const mf = forces.addMouseForce(mouseConfig);
      if (camera3d && renderer3d) {
        mf.projectToScreen = (px, py, pz) => {
          const cam = camera3d;
          const r3d = renderer3d;
          const w = engine.width;
          const h = engine.height;
          const pr = engine.pixelRatio;
          const logicalW = w / pr;
          const logicalH = h / pr;
          if (logicalW <= 0 || logicalH <= 0) return null;
          const refCX = r3d.referenceCenterX;
          const refCY = r3d.referenceCenterY;
          const ws = r3d.referenceWorldScale;
          if (ws === 0) return null;
          const wx = (px - refCX) * ws;
          const wy = -(py - refCY) * ws;
          const wz = pz * ws;
          const vp = cam.viewProjection;
          const clipW = vp[3] * wx + vp[7] * wy + vp[11] * wz + vp[15];
          if (clipW <= 0) return null;
          const clipX = vp[0] * wx + vp[4] * wy + vp[8] * wz + vp[12];
          const clipY = vp[1] * wx + vp[5] * wy + vp[9] * wz + vp[13];
          return {
            x: (clipX / clipW + 1) * 0.5 * logicalW,
            y: (1 - clipY / clipW) * 0.5 * logicalH
          };
        };
      }
    }
    const setCameraPosition = (x, y, z) => {
      resources.assertActive();
      if (!camera3d) return;
      camera3d.position.x = x;
      camera3d.position.y = y;
      camera3d.position.z = z;
    };
    const orbitCamera = (azimuth, elevation, distance) => {
      resources.assertActive();
      if (!camera3d) return;
      camera3d.orbit(azimuth, elevation, distance);
    };
    const enableOrbitControls = () => {
      resources.assertActive();
      if (!camera3d) return null;
      const cleanup = camera3d.enableOrbitControls(canvas);
      return resources.add(cleanup);
    };
    const enableAutoOrbit = (speed = 0.3) => {
      resources.assertActive();
      if (!camera3d) return null;
      const onUpdate = (frame) => {
        const dt = frame?.deltaSeconds ?? 1 / 60;
        const cam = camera3d;
        const azimuth = Math.atan2(cam.position.z - cam.target.z, cam.position.x - cam.target.x);
        const elevation = Math.asin(
          Math.min(1, Math.max(-1, (cam.position.y - cam.target.y) / cam.getDistance()))
        );
        cam.orbit(azimuth + speed * dt, elevation, cam.getDistance());
      };
      engine.addEventListener("UPDATE", onUpdate);
      const cleanup = () => engine.removeEventListener("UPDATE", onUpdate);
      return resources.add(cleanup);
    };
    const destroy = () => {
      engine.destroy();
    };
    return {
      engine,
      canvas,
      camera: camera3d,
      burst,
      attachClickBurst,
      ...forces,
      ...boundary,
      ...containerGlow,
      ...mouseTrail,
      ...effects,
      ...imageApi,
      ...imageShatter,
      setCameraPosition,
      orbitCamera,
      enableOrbitControls,
      enableAutoOrbit,
      destroy
    };
  } catch (error) {
    try {
      engine.destroy();
    } catch (cleanupError) {
      console.warn("Particular: initialization rollback failed.", cleanupError);
    }
    throw error;
  }
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
} = {}) {
  const basePreset = chunkDSCJ6LNA_cjs.getPreset(preset);
  const mergedConfig = {
    ...basePreset,
    continuous: true,
    ...config,
    autoStart: false
    // screensaver creates its own emitter — don't double-spawn
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
  const initialSize = chunkJSFHD3FV_cjs.getViewportSize(container);
  const spawnWidth = initialSize.w / pixelRatio;
  const emitter = new chunkDSCJ6LNA_cjs.Emitter({
    point: new chunkDSCJ6LNA_cjs.Vector(initialSize.w / 2 / pixelRatio, 0),
    ...chunkDSCJ6LNA_cjs.configureParticle(mergedConfig),
    spawnWidth,
    spawnHeight: chunkDSCJ6LNA_cjs.defaultParticle.spawnHeight,
    icons: []
  });
  controller.engine.addEmitter(emitter);
  emitter.isEmitting = true;
  emitter.emit();
  const resources = controller.engine.resources;
  if (mouseWindOption !== false) {
    controller.addMouseForce({
      ...chunkDSCJ6LNA_cjs.defaultMouseWind,
      track: true,
      ...mouseWindOption
    });
  }
  if (autoResize) {
    chunkJSFHD3FV_cjs.watchResize(
      (_sx, _sy, current) => {
        emitter.configuration.spawnWidth = current.w / pixelRatio;
        emitter.configuration.point.x = current.w / 2 / pixelRatio;
      },
      { container, debounceMs: 0, resources }
    );
  }
  const destroy = () => {
    controller.destroy();
  };
  return {
    engine: controller.engine,
    controller,
    destroy
  };
}

exports.Attractor = Attractor;
exports.DEFAULT_Z_INDEX = DEFAULT_Z_INDEX;
exports.FlockingForce = FlockingForce;
exports.MouseForce = MouseForce;
exports.applyCanvasStyles = applyCanvasStyles;
exports.createParticles = createParticles;
exports.getParticlesBackgroundLayerStyle = getParticlesBackgroundLayerStyle;
exports.getParticlesContainerLayerStyle = getParticlesContainerLayerStyle;
exports.particlesBackgroundLayerStyle = particlesBackgroundLayerStyle;
exports.particlesContainerLayerStyle = particlesContainerLayerStyle;
exports.processImages = processImages;
exports.startScreensaver = startScreensaver;
//# sourceMappingURL=chunk-DHMBMWD6.cjs.map
//# sourceMappingURL=chunk-DHMBMWD6.cjs.map