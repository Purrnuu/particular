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
    this.cells.forEach(arr => {
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
    callback: (neighbor: Particle, distSq: number) => void,
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
  maxSpeed: number;
  separationDistance: number;

  private grid: SpatialHashGrid;
  private forceMap = new WeakMap<Particle, { x: number; y: number; z: number }>();

  constructor(config?: FlockingForceConfig) {
    const merged = { ...defaultFlockingForce, ...config };
    this.neighborRadius = merged.neighborRadius;
    this.separationWeight = merged.separationWeight;
    this.alignmentWeight = merged.alignmentWeight;
    this.cohesionWeight = merged.cohesionWeight;
    this.maxSteeringForce = merged.maxSteeringForce;
    this.maxSpeed = merged.maxSpeed;
    this.separationDistance = merged.separationDistance;
    this.grid = new SpatialHashGrid(this.neighborRadius);
  }

  preCompute(particles: Particle[], _dt: number): void {
    const grid = this.grid;
    grid.clear();

    // Detect 3D mode: check if any particle has z !== 0
    let has3D = false;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i]!.position.z !== 0) { has3D = true; break; }
    }

    // Insert all particles into spatial hash
    for (let i = 0; i < particles.length; i++) {
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

      let fx = 0, fy = 0, fz = 0;

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

      // Store pre-computed force
      let entry = this.forceMap.get(p);
      if (entry) {
        entry.x = fx;
        entry.y = fy;
        entry.z = fz;
      } else {
        entry = { x: fx, y: fy, z: fz };
        this.forceMap.set(p, entry);
      }
    }
  }

  getForce(particlePosition: Vector, particle?: Particle): Vector {
    if (!particle) {
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

    // Clamp particle speed to maxSpeed
    const vx = particlePosition.x !== 0 ? particle.velocity.x + entry.x : particle.velocity.x + entry.x;
    const vy = particle.velocity.y + entry.y;
    const vz = particle.velocity.z + entry.z;
    const speedSq = vx * vx + vy * vy + vz * vz;
    if (speedSq > this.maxSpeed * this.maxSpeed) {
      const speed = Math.sqrt(speedSq);
      const scale = this.maxSpeed / speed;
      // Return force that brings velocity to maxSpeed in the desired direction
      _tempForce.x = vx * scale - particle.velocity.x;
      _tempForce.y = vy * scale - particle.velocity.y;
      _tempForce.z = vz * scale - particle.velocity.z;
    }

    return _tempForce;
  }
}
