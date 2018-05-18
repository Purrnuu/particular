import React, { createElement } from 'react';

import styles from './storiesDecorator.css';

const storiesDecorator = story => <div className={styles.root}>{createElement(story)}</div>;

export default storiesDecorator;
