import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      standalone: 'src/standalone.ts',
      vanilla: 'src/vanilla.ts',
      react: 'src/react.ts',
      core: 'src/core.ts',
      'renderers/canvas': 'src/entries/canvas.ts',
      'renderers/webgl': 'src/entries/webgl.ts',
      'renderers/webgl3d': 'src/entries/webgl3d.ts',
      'effects/images': 'src/entries/images.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    external: ['react', 'react-dom'],
  },
  {
    entry: {
      'particular.global': 'src/standalone.ts',
    },
    format: ['iife'],
    globalName: 'Particular',
    platform: 'browser',
    splitting: false,
    sourcemap: true,
    minify: true,
    clean: false,
    dts: false,
    outExtension() {
      return {
        js: '.js',
      };
    },
  },
]);
