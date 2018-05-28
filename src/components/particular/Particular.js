import React, { Component } from 'react';
import getDisplayName from 'react-display-name';
import { Portal } from 'react-portal';

import ParticleRenderer from './containers/ParticleRenderer';

// TODO: Configuration optons as parameter object with set types
const particular = () => Wrapped => {
  class Particular extends Component {
    static displayName = `Particular(${getDisplayName(Wrapped)})`;

    constructor() {
      super();
      this.particles = null;
    }

    //  TODO: Make cases for burst, spawn and permanence
    // So that basic case is done, but we can do the other cool ones
    // Constant emittering with certain coordinates
    // A click by click spawning
    // A good default version but with complete control over particle base physics
    // NOTE: This is an opinionated particle experience. Not a full library.

    // Add feature to do timed burst or constant burst

    // Give location coordinates as a parameter
    // Automatically configure it to use clientX and clientY if they are included in the configuration so you can use e as onclick default
    burst = ({ clientX, clientY, custom }) => {
      if (this.particles && clientX !== undefined && clientY !== undefined) {
        const type = Math.random() > 0.6 ? 'SAD' : 'HAPPY';
        this.particles.create({ x: clientX, y: clientY, type });
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
