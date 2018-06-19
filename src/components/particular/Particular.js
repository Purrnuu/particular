import React, { Component } from 'react';
import getDisplayName from 'react-display-name';
import { Portal } from 'react-portal';

import ParticleRenderer from './containers/ParticleRenderer';

/*
  Configuration
  {
    customIcons: [] Array containing image resource links for use in icon graphics
  }
*/
const particular = (configuration = {}) => Wrapped => {
  const { customIcons, zIndex, rate, life, pixelRatio, maxCount } = configuration;
  class Particular extends Component {
    static displayName = `Particular(${getDisplayName(Wrapped)})`;

    constructor() {
      super();
      this.particles = null;
    }

    componentDidMount() {
      console.log(configuration);
      this.particles.configure({ maxCount, rate, life, pixelRatio, zIndex });
    }

    //  TODO: Make cases for burst, spawn and permanence
    // So that basic case is done, but we can do the other cool ones
    // Constant emittering with certain coordinates
    // A click by click spawning
    // A good default version but with complete control over particle base physics
    // NOTE: This is an opinionated particle experience. Not a full library.

    // Add feature to do timed burst or constant burst

    // Give location coordinates as a parameter
    // Automatically configure it to use clientX and clientY
    // if they are included in the configuration so you can use e as onclick default
    burst = ({ clientX, clientY, icons }) => {
      if (this.particles && clientX !== undefined && clientY !== undefined) {
        this.particles.create({ x: clientX, y: clientY, customIcons: icons || customIcons });
      }
    };

    render() {
      return (
        <div>
          <Portal isOpened>
            <ParticleRenderer
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
  return Particular;
};

export default particular;
