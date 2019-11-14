import React from 'react';

import Emitter from '../components/emitter';
import Vector from '../utils/vector';

import { processImages } from '../components/icons';
import { configure } from '../core/defaults';
import Particular from '../core/particular';
import CanvasRenderer from '../renderers/canvasRenderer';

export default class CanvasWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = { width: 100, height: 100 };
    this.canvas = null;
    this.particular = new Particular();
  }

  componentDidMount() {
    if (!this.particular) {
      this.particular = new Particular();
    }
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    this.particular.destroy();
  }

  onWindowResize = () => {
    this.particular.onResize();
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.setState({ width, height });
  };

  configure = configuration => {
    this.configuration = configure(configuration);
    this.particular.initialize(this.configuration);
    this.particular.addRenderer(new CanvasRenderer(this.canvas));
    if (this.configuration.autoStart) {
      this.create(window.innerWidth / 2, window.innerHeight / 2);
    }
  };

  // NOTE: These should be cleaned from here to actual particular
  create = ({ x, y, customIcons }) => {
    let icons = [];
    if (customIcons) {
      icons = processImages(customIcons);
    }

    this.particular.addEmitter(
      new Emitter(
        this.configuration.life,
        this.configuration.rate,
        icons,
        new Vector(x / this.configuration.pixelRatio, y / this.configuration.pixelRatio),
        Vector.fromAngle(-90, 5),
        Math.PI / 1.3,
      ),
    );
  };

  render() {
    return (
      <canvas
        ref={canvas => {
          this.canvas = canvas;
        }}
        className="particular"
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
          zIndex: this.configuration ? this.configuration.zIndex : 10000,
        }}
      />
    );
  }
}
