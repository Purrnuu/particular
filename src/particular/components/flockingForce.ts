import Vector from '../utils/vector';
import type { ForceSource, FlockingForceConfig } from '../types';
import { defaultFlockingForce } from '../core/defaults';
import type Particle from './particle';

// Reusable force vector — safe because getForce result is consumed immediately
const _tempForce = new Vector(0, 0);

// ── Spatial Hash Grid ───────────────────────────────────────────────────────
// 2D hash for fast neighbor lookups. Distance checks include z when any
// particle has z !== 0. Cell arrays are pooled to avoid GC pressure.

/** Szudzik pairing function — maps two integers to a unique non-negative integer. */
function szudzikPair(a: number, b: number): number {
  const aa = a >= 0 ? 2 * a : -2 * a - 1;
  const bb = b >= 0 ? 2 * b : -2 * b - 1;
  return aa >= bb ? aa * aa + aa + bb : bb * bb + aa;
}

class SpatialHashGrid {
  private invCellSize: number;
  private cells = new Map<number, Particle[]>();
  private cellPool: Particle[][] = [];

  constructor(cellSize: number) {
    this.invCellSize = 1 / cellSize;
  }

  clear(): void {
    // Return cell arrays to pool for reuse
    this.cells.forEach((arr) => {
      arr.length = 0;
      this.cellPool.push(arr);
    });
    this.cells.clear();
  }

  insert(particle: Particle): void {
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

  queryNeighbors(
    particle: Particle,
    radius: number,
    has3D: boolean,
    callback: (neighbor: Particle, distSq: number) => void
  ): void {
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
          const neighbor = cell[i]!;
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
}

// ── Flocking Force ──────────────────────────────────────────────────────────

export default class FlockingForce implements ForceSource {
  neighborRadius: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  maxSteeringForce: number;
  boundarySteeringForce: number;
  minSpeed: number;
  containment: boolean;
  boundsScale: number;
  boundsDepth: number;
  maxSpeed: number;
  separationDistance: number;

  /** Engine bounds — set automatically by the engine before preCompute. Used for edge avoidance. */
  boundsWidth = 0;
  boundsHeight = 0;

  private grid: SpatialHashGrid;
  private forceMap = new WeakMap<Particle, { x: number; y: number; z: number }>();
  private dt = 1;
  private left = 0;
  private right = 0;
  private top = 0;
  private bottom = 0;

  constructor(config?: FlockingForceConfig) {
    const merged = { ...defaultFlockingForce, ...config };
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

  setBounds(width: number, height: number): void {
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

  constrain(particle: Particle): void {
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

  preCompute(particles: Particle[], dt: number): void {
    this.dt = dt;
    // Preserve direct writes to the legacy public bounds fields and runtime scale changes.
    this.setBounds(this.boundsWidth, this.boundsHeight);
    const grid = this.grid;
    grid.clear();

    // Detect 3D mode: check if any particle has z !== 0
    let has3D = false;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i]!.position.z !== 0) {
        has3D = true;
        break;
      }
    }

    // Insert all particles into spatial hash
    for (let i = 0; i < particles.length; i++) {
      // Repair resized/out-of-range positions before the emitter's kill-zone check.
      this.constrain(particles[i]!);
      grid.insert(particles[i]!);
    }

    const sepDistSq = this.separationDistance * this.separationDistance;
    const maxSteer = this.maxSteeringForce;
    const sepW = this.separationWeight;
    const aliW = this.alignmentWeight;
    const cohW = this.cohesionWeight;

    // Per-particle: accumulate separation, alignment, cohesion
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;

      // Accumulators
      let sepX = 0,
        sepY = 0,
        sepZ = 0;
      let aliVX = 0,
        aliVY = 0,
        aliVZ = 0;
      let cohX = 0,
        cohY = 0,
        cohZ = 0;
      let neighborCount = 0;
      let sepCount = 0;

      grid.queryNeighbors(p, this.neighborRadius, has3D, (neighbor, distSq) => {
        neighborCount++;
        const nx = neighbor.position.x;
        const ny = neighbor.position.y;
        const nz = neighbor.position.z;

        // Cohesion: accumulate neighbor positions
        cohX += nx;
        cohY += ny;
        cohZ += nz;

        // Alignment: accumulate neighbor velocities
        aliVX += neighbor.velocity.x;
        aliVY += neighbor.velocity.y;
        aliVZ += neighbor.velocity.z;

        // Separation: push away from too-close neighbors
        if (distSq < sepDistSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const invDist = 1 / dist;
          sepX += (p.position.x - nx) * invDist;
          sepY += (p.position.y - ny) * invDist;
          if (has3D) sepZ += (p.position.z - nz) * invDist;
          sepCount++;
        }
      });

      let fx = 0,
        fy = 0,
        fz = 0;

      if (neighborCount > 0) {
        // Separation steering
        if (sepCount > 0) {
          const invSep = 1 / sepCount;
          fx += sepX * invSep * sepW;
          fy += sepY * invSep * sepW;
          fz += sepZ * invSep * sepW;
        }

        const invN = 1 / neighborCount;

        // Alignment steering: steer toward average neighbor velocity
        const avgVX = aliVX * invN;
        const avgVY = aliVY * invN;
        const avgVZ = aliVZ * invN;
        fx += (avgVX - p.velocity.x) * aliW;
        fy += (avgVY - p.velocity.y) * aliW;
        fz += (avgVZ - p.velocity.z) * aliW;

        // Cohesion steering: steer toward average neighbor position
        const avgPX = cohX * invN;
        const avgPY = cohY * invN;
        const avgPZ = cohZ * invN;
        fx += (avgPX - p.position.x) * 0.01 * cohW;
        fy += (avgPY - p.position.y) * 0.01 * cohW;
        fz += (avgPZ - p.position.z) * 0.01 * cohW;
      }

      // Clamp to maxSteeringForce
      const magSq = fx * fx + fy * fy + fz * fz;
      if (magSq > maxSteer * maxSteer) {
        const invMag = maxSteer / Math.sqrt(magSq);
        fx *= invMag;
        fy *= invMag;
        fz *= invMag;
      }

      // Store pre-computed force with exponential smoothing to reduce jitter
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

  getForce(_particlePosition: Vector, particle?: Particle): Vector {
    if (!particle || this.dt <= 0) {
      _tempForce.x = 0;
      _tempForce.y = 0;
      _tempForce.z = 0;
      return _tempForce;
    }

    const entry = this.forceMap.get(particle);
    if (!entry) {
      _tempForce.x = 0;
      _tempForce.y = 0;
      _tempForce.z = 0;
      return _tempForce;
    }

    _tempForce.x = entry.x;
    _tempForce.y = entry.y;
    _tempForce.z = entry.z;

    this.steerFromBounds(particle);

    // Bound flight speed separately from steering so alignment cannot stall birds.
    const vx = particle.velocity.x + _tempForce.x * this.dt;
    const vy = particle.velocity.y + _tempForce.y * this.dt;
    const vz = particle.velocity.z + _tempForce.z * this.dt;
    const speedSq = vx * vx + vy * vy + vz * vz;
    if (speedSq > this.maxSpeed * this.maxSpeed) {
      const speed = Math.sqrt(speedSq);
      const scale = this.maxSpeed / speed;
      // Return force that brings velocity to maxSpeed in the desired direction
      _tempForce.x = (vx * scale - particle.velocity.x) / this.dt;
      _tempForce.y = (vy * scale - particle.velocity.y) / this.dt;
      _tempForce.z = (vz * scale - particle.velocity.z) / this.dt;
    } else {
      const minSpeed = Math.max(0, Math.min(this.minSpeed, this.maxSpeed));
      if (minSpeed > 0 && speedSq < minSpeed * minSpeed) {
        // If braking cancels velocity exactly, retain the existing heading.
        // A particle already at rest with no steering remains at rest.
        const dx = speedSq > 1e-12 ? vx : particle.velocity.x;
        const dy = speedSq > 1e-12 ? vy : particle.velocity.y;
        const dz = speedSq > 1e-12 ? vz : particle.velocity.z;
        const directionSq = dx * dx + dy * dy + dz * dz;
        if (directionSq > 1e-12) {
          const scale = minSpeed / Math.sqrt(directionSq);
          _tempForce.x = (dx * scale - particle.velocity.x) / this.dt;
          _tempForce.y = (dy * scale - particle.velocity.y) / this.dt;
          _tempForce.z = (dz * scale - particle.velocity.z) / this.dt;
        }
      }
    }

    return _tempForce;
  }

  private steerFromBounds(particle: Particle): void {
    if (this.boundsWidth <= 0 || this.boundsHeight <= 0 || this.boundarySteeringForce <= 0) return;
    const vx = particle.velocity.x;
    const vy = particle.velocity.y;
    const vz = particle.velocity.z;
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const turnDistance = Math.max(this.neighborRadius, 2 * speed * speed / this.boundarySteeringForce);
    // Cap margins independently so opposite edge zones cannot overlap on small canvases.
    const marginX = Math.min(turnDistance, (this.right - this.left) * 0.45);
    const marginY = Math.min(turnDistance, (this.bottom - this.top) * 0.45);
    const px = particle.position.x + vx * this.dt;
    const py = particle.position.y + vy * this.dt;
    const nx = vx < 0 ? Math.max(0, 1 - (px - this.left) / marginX)
      : vx > 0 ? -Math.max(0, 1 - (this.right - px) / marginX) : 0;
    const ny = vy < 0 ? Math.max(0, 1 - (py - this.top) / marginY)
      : vy > 0 ? -Math.max(0, 1 - (this.bottom - py) / marginY) : 0;
    let nz = 0;
    if (this.boundsDepth > 0) {
      const marginZ = Math.min(turnDistance, this.boundsDepth * 0.45);
      const pz = particle.position.z + vz * this.dt;
      nz = vz < 0 ? Math.max(0, 1 - (pz + this.boundsDepth / 2) / marginZ)
        : vz > 0 ? -Math.max(0, 1 - (this.boundsDepth / 2 - pz) / marginZ) : 0;
    }
    const urgency = Math.max(Math.abs(nx), Math.abs(ny), Math.abs(nz));
    if (urgency <= 0) return;

    // Inward plus a consistent tangent creates a turn even on a head-on approach.
    // Boundary steering bypasses neighbor-force smoothing to avoid delayed reactions.
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
      if (tangentLength < 1e-9) { tx = 1; tangentLength = 1; }
    }
    // Rotate velocity without braking, so the cruise floor cannot cancel avoidance.
    const angle = Math.min(Math.acos(cosine), this.boundarySteeringForce * this.dt / speed);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle) / tangentLength;
    const ax = ((ux * cos + tx * sin) * speed - vx) / this.dt;
    const ay = ((uy * cos + ty * sin) * speed - vy) / this.dt;
    const az = ((uz * cos + tz * sin) * speed - vz) / this.dt;
    const blend = Math.min(1, urgency * 8);
    _tempForce.x += (ax - _tempForce.x) * blend;
    _tempForce.y += (ay - _tempForce.y) * blend;
    _tempForce.z += (az - _tempForce.z) * blend;
  }
}
