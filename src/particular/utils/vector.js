export default class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  getMagnitude = () => Math.sqrt(this.x * this.x + this.y * this.y);

  add = vector => {
    this.x += vector.x;
    this.y += vector.y;
  };

  addFriction = friction => {
    this.x -= friction * this.x;
    this.y -= friction * this.y;
  };

  addGravity = gravity => {
    this.y += gravity;
  };

  getAngle = () => Math.atan2(this.y, this.x);

  static fromAngle = (angle, magnitude) =>
    new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
}
