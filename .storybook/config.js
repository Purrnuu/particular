import { configure, addDecorator } from '@storybook/react';
import storiesDecorator from '../storiesDecorator';

const req = require.context('../', true, /\.story\.(js?|jsx?|tsx?)$/);

function loadStories() {
  req.keys().forEach(req);
}

addDecorator(storiesDecorator);

configure(loadStories, module);
