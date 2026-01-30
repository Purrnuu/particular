# Particular

An opinionated Particle Engine for React, built with TypeScript.

## Features

- 🎨 **Canvas-based rendering** - Smooth, performant particle effects
- ⚡ **TypeScript** - Full type safety and modern development experience
- ⚛️ **React Integration** - Easy-to-use HOC wrapper for React components
- 🎯 **Customizable** - Control emission rate, particle count, physics, and more
- 🖼️ **Custom Icons** - Use your own images as particles
- 🔄 **Multiple Modes** - Burst, continuous, or automatic particle emission

## Installation

### Prerequisites

- Node.js 18+ (we recommend Node 22 LTS)
- npm 9+ or yarn

If using NVM (recommended):
```bash
nvm use  # Uses version specified in .nvmrc
```

### Install Package

```bash
npm install particular
# or
yarn add particular
```

## Usage

### With React (Recommended)

Use the `ParticularWrapper` HOC to add particle effects to any React component:

```tsx
import { ParticularWrapper } from 'particular';
import type { BurstSettings } from 'particular';

interface MyComponentProps {
  burst: (settings: BurstSettings) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ burst }) => {
  return (
    <div onClick={burst}>
      <h1>Click me for particles!</h1>
    </div>
  );
};

// Wrap your component with particle effects
export default ParticularWrapper({
  rate: 8,            // Particles per emission
  life: 30,           // Number of emissions
  maxCount: 300,      // Maximum concurrent particles
})(MyComponent);
```

### With Custom Icons

```tsx
import { ParticularWrapper } from 'particular';
import icon1 from './icons/star.png';
import icon2 from './icons/heart.png';

const customIcons = [icon1, icon2];

export default ParticularWrapper({
  icons: customIcons,
  rate: 8,
  life: 30,
  maxCount: 300,
})(MyComponent);
```

### Advanced Configuration

```tsx
ParticularWrapper({
  // Particle emission
  rate: 8,                  // Particles per burst
  life: 30,                 // Number of bursts
  maxCount: 300,            // Max concurrent particles
  
  // Particle appearance
  sizeMin: 5,               // Minimum particle size
  sizeMax: 15,              // Maximum particle size
  scaleStep: 1,             // Scale growth per frame
  fadeTime: 30,             // Fade out duration
  
  // Physics
  gravity: 0.15,            // Gravity strength
  velocityMultiplier: 6,    // Initial velocity multiplier
  spread: Math.PI / 1.3,    // Emission spread angle
  
  // Behavior
  continuous: false,        // Keep emitting particles
  autoStart: false,         // Start automatically
  pixelRatio: 2,           // Display pixel ratio
  zIndex: 10000,           // Canvas z-index
})(MyComponent);
```

## Direct API Usage

For more control, use the core API directly:

```tsx
import { Particular, Emitter, CanvasRenderer, Vector } from 'particular';

const particular = new Particular();
particular.initialize({
  maxCount: 300,
  continuous: false,
  pixelRatio: 2,
});

const canvas = document.querySelector('canvas');
particular.addRenderer(new CanvasRenderer(canvas));

particular.addEmitter(new Emitter({
  point: new Vector(100, 100),
  rate: 8,
  life: 30,
  // ... other configuration
}));
```

## Development

**🚀 Quick Start:** See [QUICKSTART.md](./QUICKSTART.md) for the fastest way to run the project.

For detailed development environment setup including NVM configuration, see [SETUP.md](./SETUP.md).

Common commands:
```bash
# Use correct Node version (if using NVM)
nvm use

# Install dependencies
npm install

# Start Storybook for development
npm run storybook

# Build library
npm run build:lib

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions out of the box. All configuration options, component props, and API methods are fully typed.

## Browser Support

Modern browsers with Canvas API support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT © Niilo Säämänen

## Tips

There are various ways to create particle effects. This is one opinionated approach focused on ease of use and React integration. Perfect for adding celebratory effects, interactive feedback, or ambient motion to your React applications.
