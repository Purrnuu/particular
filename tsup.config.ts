import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/standalone.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
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
