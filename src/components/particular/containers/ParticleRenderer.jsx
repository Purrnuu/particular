import React from 'react';
import _ from 'lodash';

import Emitter from '../components/emitter';
import Vector from '../utils/vector';

import { ICONS_HAPPY, ICONS_ALPACA } from '../utils/icons';
import { processImages } from '../components/icons';

const MAX_COUNT = 300;
const EMITTER_RATE = 8;
const EMITTER_LIFE = 30;
const PIXEL_RATIO = 2;
const Z_INDEX = 10000;

export default class ParticleRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { width: 100, height: 100, animating: false };

    this.emitters = [];
    this.particles = [];
    this.canvas = null;

    this.maxCount = MAX_COUNT;
    this.emitterRate = EMITTER_RATE;
    this.emitterLife = EMITTER_LIFE;
    this.pixelRatio = PIXEL_RATIO;
    this.zIndex = Z_INDEX;
    this.continuous = false;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.clearInterval(this.animateRequest);
  }

  onWindowResize = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.setState({ width, height });
  };

  startEngine = () => {
    this.setState({ animating: true });
  };

  stopEngine = () => {
    this.setState({ animating: false });
  };

  configure = ({ maxCount, rate, life, pixelRatio, zIndex, autoStart, continuous }) => {
    this.maxCount = maxCount || MAX_COUNT;
    this.emitterRate = rate || EMITTER_RATE;
    this.emitterLife = life || EMITTER_LIFE;
    this.pixelRatio = pixelRatio || PIXEL_RATIO;
    this.zIndex = zIndex || Z_INDEX;
    this.continuous = continuous;
    if (autoStart) {
      this.create(this.state.width / 2, this.state.height / 2);
    }
  };

  create = ({ x, y, customIcons }) => {
    let icons = ICONS_HAPPY;
    if (customIcons) {
      icons = customIcons;
    }

    if (Math.random() > 0.99) {
      icons = ICONS_ALPACA;
    }

    icons = processImages(icons);

    this.emitters.push(
      new Emitter(
        icons,
        new Vector(x / this.pixelRatio, y / this.pixelRatio),
        Vector.fromAngle(-90, 5),
        Math.PI / 1.3,
      ),
    );
    this.startEngine();
  };

  addNewParticles = () => {
    if (this.particles.length > this.maxCount) return;

    _.each(this.emitters, emitter => {
      if (emitter) {
        for (let j = 0; j < this.emitterRate; j++) {
          const particle = emitter.emitParticle();
          const icon = _.sample(emitter.icons, 1);
          particle.init(icon);
          this.particles.push(particle);
        }
      }
    });

    this.emitters = _.filter(this.emitters, emitter => {
      if (this.continuous || emitter.lifeCycle < this.emitterLife) {
        return emitter;
      }
      return null;
    });
  };

  plotParticles = (boundsX, boundsY) => {
    const currentParticles = [];

    _.each(this.particles, particle => {
      const pos = particle.position;
      if (!(pos.x < 0 || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY)) {
        particle.move();
        currentParticles.push(particle);
      }
    });
    this.particles = currentParticles;

    if (!this.particles.length && !this.emitters.length) {
      this.stopEngine();
    }
  };

  redraw = () => {
    const { width, height } = this.state;
    const pixelRatio = this.pixelRatio;
    if (!this.canvas) {
      return;
    }

    this.addNewParticles();
    this.plotParticles(width, height);

    const ctx = this.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.save();
    ctx.scale(pixelRatio, pixelRatio);
    ctx.clearRect(0, 0, width, height);

    _.each(this.particles, particle => {
      particle.render(ctx);
    });

    ctx.restore();
  };

  animate = () => {
    this.animateRequest = window.requestAnimationFrame(this.animate);
    if (this.state.animating) {
      this.redraw();
    }
  };

  render() {
    return (
      <canvas
        ref={canvas => {
          this.canvas = canvas;
        }}
        id="particular"
        width={this.state.width}
        height={this.state.height}
        style={{
          width: `${this.state.width}px`,
          height: `${this.state.height}px`,
          position: 'absolute',
          pointerEvents: 'none',
          cursor: 'auto',
          opacity: 1,
          left: 0,
          top: 0,
          zIndex: this.zIndex,
        }}
      />
    );
  }
}
