import Vector from './vector';

/** Accumulates pointer events, then measures motion in engine units per 60 Hz tick. */
export default class PointerMotion {
  private initialized = false;
  private pending = false;
  private x = 0;
  private y = 0;
  private dx = 0;
  private dy = 0;
  private velocity = new Vector(0, 0);

  record(x: number, y: number): void {
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
  consume(dt: number): Vector | null {
    if (!this.pending || dt <= 0) return null;
    this.velocity.x = this.dx / dt;
    this.velocity.y = this.dy / dt;
    this.dx = 0;
    this.dy = 0;
    this.pending = false;
    return this.velocity;
  }

  reset(): void {
    this.initialized = false;
    this.pending = false;
    this.dx = 0;
    this.dy = 0;
  }
}
