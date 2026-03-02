import React from 'react';

import Emitter from '../components/emitter';
import Vector from '../utils/vector';
import { processImages } from '../components/icons';
import { configureParticular, configureParticle } from '../core/defaults';
import Particular from '../core/particular';
import CanvasRenderer from '../renderers/canvasRenderer';
import WebGLRenderer from '../renderers/webglRenderer';
import { particlesBackgroundLayerStyle } from '../canvasStyles';
import type { FullParticularConfig, ParticleConfig } from '../types';

interface CanvasWrapperState {
  width: number;
  height: number;
}

interface CreateSettings extends Partial<ParticleConfig> {
  x?: number;
  y?: number;
  icons?: (string | HTMLImageElement)[];
  [key: string]: unknown;
}

export default class CanvasWrapper extends React.Component<unknown, CanvasWrapperState> {
  canvas: HTMLCanvasElement | null = null;
  particular: Particular;
  configuration?: ReturnType<typeof configureParticular>;

  constructor(props: unknown) {
    super(props);

    this.state = { width: 100, height: 100 };
    this.particular = new Particular();
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.onWindowResize);
    this.particular.destroy();
  }

  onWindowResize = (): void => {
    this.particular.onResize();
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.setState({ width, height });
  };

  configure = (configuration?: FullParticularConfig): void => {
    this.configuration = configureParticular(configuration);
    this.particular.initialize(this.configuration);
    
    if (this.canvas) {
      const RendererClass =
        this.configuration?.renderer === 'webgl' ? WebGLRenderer : CanvasRenderer;
      this.particular.addRenderer(new RendererClass(this.canvas));
    }
    
    if (this.configuration.autoStart) {
      this.create({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  };

  create = (settings?: CreateSettings): void => {
    if (!this.configuration) return;

    const combinedSettings = configureParticle(settings, this.configuration);

    let icons: (string | HTMLImageElement)[] = [];
    if (combinedSettings.icons) {
      icons = processImages(combinedSettings.icons);
    }

    const x = (settings?.x ?? 0) / this.configuration.pixelRatio;
    const y = (settings?.y ?? 0) / this.configuration.pixelRatio;

    this.particular.addEmitter(
      new Emitter({
        point: new Vector(x, y),
        ...combinedSettings,
        icons,
      })
    );
  };

  render(): React.ReactNode {
    return (
      <canvas
        ref={(canvas) => {
          this.canvas = canvas;
        }}
        className="particular"
        width={this.state.width}
        height={this.state.height}
        style={{
          ...particlesBackgroundLayerStyle,
          position: 'absolute',
          width: this.state.width,
          height: this.state.height,
          cursor: 'auto',
          opacity: 1,
          zIndex: this.configuration?.zIndex ?? particlesBackgroundLayerStyle.zIndex,
        }}
      />
    );
  }
}
