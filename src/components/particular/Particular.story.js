import React from 'react';
import PropTypes from 'prop-types';

import { storiesOf } from '@storybook/react';
import Particular from './Particular';

const Playground = ({ burst }) => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }} onClick={burst}>
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
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

storiesOf('Particular', module).add('default', () => <PlaygroundWrapped />);
