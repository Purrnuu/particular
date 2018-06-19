import Vector from '../utils/vector';
import { getRandomInt } from '../utils/math';

const TO_RADIANS = Math.PI / 180;
const SCALE_STEP = 1;
const GRAVITY = 0.15;
const FADE_TIME = 30;

export default class Particle {
  constructor(point, velocity, acceleration, friction, size) {
    this.position = point || new Vector(0, 0);
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
    this.friction = friction || 0;

    this.rotation = Math.random() * 360;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.rotationVelocity = this.rotationDirection * getRandomInt(1, 3);

    this.factoredSize = 1;

    this.lifeTime = getRandomInt(75, 100);
    this.lifeTick = 0;

    this.size = size || getRandomInt(5, 15);
  }

  init = image => {
    this.image = image;
  };

  move = () => {
    this.velocity.add(this.acceleration);
    this.velocity.addFriction(this.friction);
    this.velocity.addGravity(GRAVITY);
    this.position.add(this.velocity);
    this.rotation = this.rotation + this.rotationVelocity;
    this.factoredSize = Math.min(this.factoredSize + SCALE_STEP, this.size);
  };

  render = ctx => {
    ctx.save();

    const currentAlpha = (this.lifeTime - this.lifeTick) / FADE_TIME;
    ctx.globalAlpha = currentAlpha < 0 ? 0 : currentAlpha;
    const pixelRounded = [((this.position.x * 10) << 0) * 0.1, ((this.position.y * 10) << 0) * 0.1];
    ctx.translate(pixelRounded[0], pixelRounded[1]);
    ctx.rotate(this.rotation * TO_RADIANS);
    ctx.drawImage(
      this.image,
      -this.factoredSize,
      -this.factoredSize,
      this.factoredSize * 2,
      this.factoredSize * 2,
    );
    this.lifeTick++;

    ctx.restore();
  };
}
