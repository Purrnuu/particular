import Vector from '../utils/vector';
import Particle from './particle';
import { getRandomInt } from '../utils/math';

export default class Emitter {
  constructor(icons, point, velocity, spread) {
    this.position = point;
    this.velocity = velocity;
    this.spread = spread || Math.PI / 32;
    this.lifeCycle = 0;
    this.icons = icons;
  }

  emitParticle = () => {
    const angle = this.velocity.getAngle() + this.spread - Math.random() * this.spread * 2;
    const magnitude = this.velocity.getMagnitude();
    const position = new Vector(this.position.x, this.position.y);
    const velocity = Vector.fromAngle(angle, magnitude);

    const size = getRandomInt(5, 15);
    velocity.add({ x: 0, y: -((15 - size) / 15) * 6 });
    const friction = size / 2000;
    const acceleration = new Vector(0, size / 100);
    this.lifeCycle++;

    return new Particle(position, velocity, acceleration, friction, size);
  };
}
