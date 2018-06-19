import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

import sad1 from 'icons/smiley_sad.png';
import sad2 from 'icons/smiley_cry.png';
import sad3 from 'icons/smiley_sad_2.png';

import Particular from './Particular';

const customIcons = [sad1, sad2, sad3];

const Playground = ({ burst }) => {
  return (
    <div onClick={burst}>
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          paddingBottom: '40vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        CLICK ME FOR PARTICLES
      </h1>
    </div>
  );
};

Playground.propTypes = {
  burst: PropTypes.func,
};

const PlaygroundWrapped = Particular()(Playground);
const PlaygroundCustomWrapped = Particular({ customIcons })(Playground);

storiesOf('Particular', module).add('Burst', () => <PlaygroundWrapped />);
storiesOf('Particular', module).add('Burst with custom icons', () => <PlaygroundCustomWrapped />);
