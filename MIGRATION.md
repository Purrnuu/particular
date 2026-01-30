# Migration Guide: Particular v0.1 → v0.2

This document outlines the changes made during the modernization of the Particular library.

## Overview

The Particular library has been fully modernized with:
- ✅ Complete TypeScript migration
- ✅ Modern build tooling (tsup replacing webpack)
- ✅ Updated to latest dependencies (2026)
- ✅ Modern Storybook 8 with Vite
- ✅ ESLint flat config
- ✅ Vitest replacing Jest
- ✅ Full type safety and IntelliSense support

## Breaking Changes

### Module System

The library now uses modern ESM with CJS fallback:

**Before:**
```javascript
const { Particular } = require('particular');
```

**After:**
```typescript
import { Particular } from 'particular';
```

### Dependencies

**Removed:**
- `react-portal` - Now using React 18's native `createPortal`
- `prop-types` - Replaced with TypeScript types
- `lodash` - Replaced with `lodash-es` (ES modules)
- `styled-components` - No longer a peer dependency

**Updated:**
- React 16.8 → React 18.3+
- TypeScript 3.3 → TypeScript 5.7

### API Changes

The core API remains largely compatible, but now with full TypeScript support:

```typescript
// Old (JavaScript)
ParticularWrapper({ icons: customIcons })(MyComponent)

// New (TypeScript) - Same API, but with types!
ParticularWrapper({ icons: customIcons })(MyComponent)
```

### Type Safety

All components now have proper TypeScript types:

```typescript
import type { BurstSettings, FullParticularConfig } from 'particular';

interface MyComponentProps {
  burst: (settings: BurstSettings) => void;
}

const config: FullParticularConfig = {
  rate: 8,
  life: 30,
  maxCount: 300,
};
```

## File Structure Changes

### Source Files
- All `.js` → `.ts`
- All `.jsx` → `.tsx`
- New type definitions in `src/particular/types.ts`
- Image type declarations in `src/types/images.d.ts`

### Build Output
- `lib/` → `dist/`
- Now outputs both ESM and CJS formats
- Includes `.d.ts` type definition files

### Configuration Files

**Removed:**
- `webpack.config.js` → Replaced with `tsup.config.ts`
- `jest.config.js` → Replaced with `vitest.config.ts`
- `tslint.json` → Replaced with `eslint.config.mjs`
- `postcss.config.js` → No longer needed
- `.storybook/*.js` → Replaced with `.storybook/*.ts`

**Updated:**
- `tsconfig.json` - Modern TypeScript 5.7 configuration
- `package.json` - Updated scripts and dependencies

## Development Workflow

### Before
```bash
npm run build-lib        # Build with webpack
npm run test             # Jest tests
npm run storybook        # Storybook on webpack
```

### After
```bash
npm run build:lib        # Build with tsup (much faster!)
npm run test             # Vitest tests
npm run test:watch       # Watch mode
npm run storybook        # Storybook on Vite
npm run type-check       # TypeScript checking
npm run lint             # ESLint
npm run lint:fix         # Auto-fix linting issues
```

## Benefits

1. **Faster Builds**: tsup is significantly faster than webpack
2. **Better DX**: Full TypeScript support with IntelliSense
3. **Modern Standards**: ESM-first with CJS compatibility
4. **Smaller Bundle**: Better tree-shaking with modern tooling
5. **Type Safety**: Catch errors at compile time
6. **Future-Proof**: Using 2026 best practices

## Migration Steps for Users

If you're upgrading from v0.1 to v0.2:

1. **Update your import statements** (if using CommonJS):
   ```typescript
   // Change from:
   const { Particular } = require('particular');
   
   // To:
   import { Particular } from 'particular';
   ```

2. **Update React version** (if needed):
   ```bash
   npm install react@^18 react-dom@^18
   ```

3. **Add TypeScript types** (optional but recommended):
   ```typescript
   import type { BurstSettings } from 'particular';
   ```

4. **Remove old peer dependencies**:
   - No longer need `styled-components`
   - No longer need `classnames`

## Next Steps

To get started with the modernized version:

```bash
# Install dependencies
npm install

# Start development
npm run storybook

# Build the library
npm run build:lib

# Run type checking
npm run type-check
```

## Support

For issues or questions, please open an issue on GitHub.
