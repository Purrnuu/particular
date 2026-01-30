import React, { Component, type ComponentType } from 'react';
import { createPortal } from 'react-dom';

import CanvasWrapper from './containers/CanvasWrapper';
import type { BurstSettings, FullParticularConfig } from './types';

interface ParticularWrapperProps {
  burst: (settings: BurstSettings) => void;
}

function getDisplayName<P>(WrappedComponent: ComponentType<P>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const particularWrapper = (configuration: FullParticularConfig = {}) => 
  <P extends object = object>(WrappedComponent: ComponentType<P>) => {
    const { icons } = configuration;

    class ParticularWrapper extends Component<P> {
      static displayName = `Particular(${getDisplayName(WrappedComponent)})`;
      
      particles: CanvasWrapper | null = null;
      portalContainer: HTMLDivElement;

      constructor(props: P) {
        super(props);
        this.portalContainer = document.createElement('div');
        document.body.appendChild(this.portalContainer);
      }

      componentDidMount(): void {

        if (this.particles) {
          this.particles.configure(configuration);
        }
      }

      componentWillUnmount(): void {
        // Clean up portal container
        if (this.portalContainer.parentNode) {
          this.portalContainer.parentNode.removeChild(this.portalContainer);
        }
      }

      burst = (settings: BurstSettings): void => {
        if (
          this.particles &&
          settings.clientX !== undefined &&
          settings.clientY !== undefined
        ) {
          this.particles.create({
            x: settings.clientX,
            y: settings.clientY,
            ...settings,
            icons: icons ?? settings.icons,
          });
        }
      };

      render(): React.ReactNode {
        const wrappedProps = {
          ...this.props,
          burst: this.burst,
        } as P & ParticularWrapperProps;

        return (
          <div>
            {createPortal(
              <CanvasWrapper
                ref={(particles) => {
                  this.particles = particles;
                }}
              />,
              this.portalContainer
            )}
            <WrappedComponent {...wrappedProps} />
          </div>
        );
      }
    }

    return ParticularWrapper;
  };

export default particularWrapper;
