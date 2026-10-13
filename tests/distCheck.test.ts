import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { compareArtifactSets, normalizeArtifact } from '../scripts/check-dist.mjs';

describe('committed distributable checks', () => {
  it('detects stale, missing, and unexpected outputs', () => {
    expect(compareArtifactSets(new Map([['index.js', 'new'], ['core.js', 'core']]), new Map([['index.js', 'old'], ['stale.js', 'extra']]))).toEqual([
      'Missing: dist/core.js', 'Outdated: dist/index.js', 'Unexpected: dist/stale.js',
    ]);
  });

  it('accepts identical output sets', () => {
    expect(compareArtifactSets(new Map([['index.js', 'same']]), new Map([['index.js', 'same']]))).toEqual([]);
  });

  it('normalizes source-map paths and checkout line endings without masking changed source', () => {
    const root = process.cwd();
    const normalize = (directory: string, sources: string[], source: string) => normalizeArtifact(
      JSON.stringify({ version: 3, sources, sourcesContent: [source], mappings: 'AAAA' }),
      'index.js.map', path.join(root, directory), root,
    );
    const fresh = normalize('.build/lib', ['../../src/index.ts'], 'export const x = 1;\n');
    expect(normalize('dist', ['../src/index.ts'], 'export const x = 1;\r\n')).toBe(fresh);
    expect(normalize('dist', ['../src/index.ts'], 'export const x = 2;\n')).not.toBe(fresh);
  });

  it('does not normalize away a changed source-map mapping', () => {
    const first = { version: 3, sources: [], mappings: 'AAAA' };
    expect(normalizeArtifact(JSON.stringify(first), 'index.js.map', process.cwd())).not.toBe(
      normalizeArtifact(JSON.stringify({ ...first, mappings: 'AAAC' }), 'index.js.map', process.cwd()),
    );
  });
});
