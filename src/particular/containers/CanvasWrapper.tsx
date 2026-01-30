import React from 'react';

import Emitter from '../components/emitter';
import Vector from '../utils/vector';
import { processImages } from '../components/icons';
import { configureParticular, configureParticle } from '../core/defaults';
import Particular from '../core/particular';
import CanvasRenderer from '../renderers/canvasRenderer';
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

export default class CanvasWrapper extends React.Component<Record<string, never>, CanvasWrapperState> {
  canvas: HTMLCanvasElement | null = null;
  particular: Particular;
  configuration?: ReturnType<typeof configureParticular>;

  constructor(props: Record<string, never>) {
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
      this.particular.addRenderer(new CanvasRenderer(this.canvas));
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
          width: `${this.state.width}px`,
          height: `${this.state.height}px`,
          position: 'absolute',
          pointerEvents: 'none',
          cursor: 'auto',
          opacity: 1,
          left: 0,
          top: 0,
          zIndex: this.configuration?.zIndex ?? 10000,
        }}
      />
    );
  }
}
