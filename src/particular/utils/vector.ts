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

  add(vector: { x: number; y: number }): void {
    this.x += vector.x;
    this.y += vector.y;
  }

  addFriction(friction: number): void {
    this.x -= friction * this.x;
    this.y -= friction * this.y;
  }

  addGravity(gravity: number): void {
    this.y += gravity;
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
