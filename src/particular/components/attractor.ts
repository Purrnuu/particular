import Vector from '../utils/vector';

export default class Attractor {
  position: Vector;
  strength: number;
  radius: number;

  constructor(x: number, y: number, strength = 1, radius = 200) {
    this.position = new Vector(x, y);
    this.strength = strength;
    this.radius = radius;
  }

  getForce(particlePosition: Vector): Vector {
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
}
