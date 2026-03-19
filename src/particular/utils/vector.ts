export default class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x?: number, y?: number, z?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  getMagnitude(): number {
    if (this.z === 0) {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  add(vector: { x: number; y: number; z?: number }, scale = 1): void {
    this.x += vector.x * scale;
    this.y += vector.y * scale;
    if (vector.z) this.z += vector.z * scale;
  }

  addFriction(friction: number, dt = 1): void {
    if (friction <= 0) return;
    const factor = Math.pow(1 - friction, dt);
    this.x *= factor;
    this.y *= factor;
    if (this.z !== 0) this.z *= factor;
  }

  addGravity(gravity: number, dt = 1): void {
    if (gravity === 0) return;
    this.y += gravity * dt;
  }

  subtract(vector: { x: number; y: number; z?: number }): void {
    this.x -= vector.x;
    this.y -= vector.y;
    if (vector.z) this.z -= vector.z;
  }

  normalize(): void {
    const mag = this.getMagnitude();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
      this.z /= mag;
    }
  }

  scale(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
  }

  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  /** Elevation angle from the XY plane (radians). 0 = in-plane, +PI/2 = up z-axis. */
  getElevation(): number {
    const xyMag = Math.sqrt(this.x * this.x + this.y * this.y);
    return Math.atan2(this.z, xyMag);
  }

  static fromAngle(angle: number, magnitude: number): Vector {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }

  /** Create a Vector from spherical coordinates (azimuth in XY plane, elevation from XY, magnitude). */
  static fromSpherical(azimuth: number, elevation: number, magnitude: number): Vector {
    const cosElev = Math.cos(elevation);
    return new Vector(
      magnitude * cosElev * Math.cos(azimuth),
      magnitude * cosElev * Math.sin(azimuth),
      magnitude * Math.sin(elevation),
    );
  }
}
