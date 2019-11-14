import React, { Component } from 'react';
import getDisplayName from 'react-display-name';
import { Portal } from 'react-portal';

import CanvasWrapper from './containers/CanvasWrapper';

/*
  Configuration
  {
    customIcons: [] Array containing image resource links for use in icon graphics
  }
*/
const particularWrapper = (configuration = {}) => Wrapped => {
  const { icons } = configuration;
  class ParticularWrapper extends Component {
    static displayName = `Particular(${getDisplayName(Wrapped)})`;

    constructor() {
      super();
      this.particles = null;
    }

    componentDidMount() {
      this.particles.configure(configuration);
    }

    //  TODO: Make cases for burst, spawn and permanence
    // So that basic case is done, but we can do the other cool ones
    // NOTE: This is an opinionated particle experience. Not a full library.

    burst = settings => {
      if (this.particles && settings.clientX !== undefined && settings.clientY !== undefined) {
        this.particles.create({
          x: settings.clientX,
          y: settings.clientY,
          ...settings,
          icons: icons || settings.icons,
        });
      }
    };

    render() {
      return (
        <div>
          <Portal isOpened>
            <CanvasWrapper
              ref={particles => {
                this.particles = particles;
              }}
            />
          </Portal>
          <Wrapped {...this.props} burst={this.burst} />
        </div>
      );
    }
  }
  return ParticularWrapper;
};

export default particularWrapper;
