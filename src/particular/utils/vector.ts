export default class Vector {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(vector: { x: number; y: number }, scale = 1): void {
    this.x += vector.x * scale;
    this.y += vector.y * scale;
  }

  addFriction(friction: number, dt = 1): void {
    if (friction <= 0) return;
    const factor = Math.pow(1 - friction, dt);
    this.x *= factor;
    this.y *= factor;
  }

  addGravity(gravity: number, dt = 1): void {
    if (gravity === 0) return;
    this.y += gravity * dt;
  }

  subtract(vector: { x: number; y: number }): void {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  normalize(): void {
    const mag = this.getMagnitude();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
    }
  }

  scale(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
  }

  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  static fromAngle(angle: number, magnitude: number): Vector {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }
}
