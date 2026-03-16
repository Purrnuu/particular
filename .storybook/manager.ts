import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Particular',
  brandUrl: 'https://github.com/Purrnuu/particular',

  // UI
  appBg: '#0a0a1a',
  appContentBg: '#0d0d1e',
  appPreviewBg: '#0a0a1a',
  appBorderColor: 'rgba(255, 255, 255, 0.08)',
  appBorderRadius: 8,

  // Text
  textColor: '#e0e0e0',
  textMutedColor: '#888',

  // Toolbar
  barTextColor: '#aaa',
  barSelectedColor: '#74c0fc',
  barHoverColor: '#a5d8ff',
  barBg: '#0d0d1e',

  // Form
  inputBg: '#151525',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  inputTextColor: '#e0e0e0',
  inputBorderRadius: 6,

  // Accent
  colorPrimary: '#74c0fc',
  colorSecondary: '#4dabf7',
});

addons.setConfig({
  theme,
});
