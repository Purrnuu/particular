import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

import sad1 from 'icons/smiley_sad.png';
import sad2 from 'icons/smiley_cry.png';
import sad3 from 'icons/smiley_sad_2.png';

import { ParticularWrapper } from './index';

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

const PlaygroundWithoutClick = () => {
  return (
    <div>
      <h1
        style={{
          textAlign: 'center',
          paddingTop: '45vh',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        I AM CONTINUOUS. <br />I EXIST FOREVER.
      </h1>
    </div>
  );
};

const PlaygroundWithRandomParameters = ({ burst }) => {
  // eslint-disable-line
  const doBurst = e => {
    burst({
      ...e,
      sizeMin: Math.random() * 10,
      sizeMax: 10 + Math.random() * 10,
      velocityMultiplier: Math.random() * 15,
      gravity: Math.random() * 0.5,
    });
  };
  return (
    <div onClick={doBurst}>
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

const PlaygroundWrapped = ParticularWrapper()(Playground);
const PlaygroundCustomWrapped = ParticularWrapper({ icons: customIcons })(Playground);
const PlaygroundCustomControlsWrapped = ParticularWrapper({
  icons: customIcons,
  rate: 1,
  life: 200,
  maxCount: 1000,
})(Playground);
const PlaygroundAutomaticWrapped = ParticularWrapper({
  icons: customIcons,
  rate: 1,
  life: 200,
  maxCount: 1000,
  continuous: true,
  autoStart: true,
})(PlaygroundWithoutClick);
const PlaygroundMassive = ParticularWrapper({
  rate: 1000,
  life: 1000,
  maxCount: 1000,
})(Playground);

const PlaygroundParticleControls = ParticularWrapper({
  rate: 8,
  life: 30,
  sizeMin: 1,
  sizeMax: 5,
  maxCount: 300,
  velocityMultiplier: 110,
})(PlaygroundWithRandomParameters);

storiesOf('Particular', module).add('Burst', () => <PlaygroundWrapped />);
storiesOf('Particular', module).add('Burst with custom icons', () => <PlaygroundCustomWrapped />);
storiesOf('Particular', module).add('Burst with custom emitter controls', () => (
  <PlaygroundCustomControlsWrapped />
));
storiesOf('Particular', module).add('Performance beauty', () => <PlaygroundMassive />);
storiesOf('Particular', module).add('Particle sizing', () => <PlaygroundParticleControls />);
storiesOf('Particular', module).add('Automatic and continuous', () => (
  <PlaygroundAutomaticWrapped />
));
