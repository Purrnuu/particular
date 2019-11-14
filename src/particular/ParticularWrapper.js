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
  const { customIcons } = configuration;
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
    // Constant emittering with certain coordinates
    // A click by click spawning
    // A good default version but with complete control over particle base physics
    // NOTE: This is an opinionated particle experience. Not a full library.

    burst = ({ clientX, clientY, icons }) => {
      if (this.particles && clientX !== undefined && clientY !== undefined) {
        this.particles.create({ x: clientX, y: clientY, customIcons: icons || customIcons });
      } else {
        console.warn(
          'ParticularWrapper || Burst called without parameters: clientX and/or clientY ',
        );
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
