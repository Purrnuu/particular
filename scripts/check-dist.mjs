import { readdirSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const normalizeLines = (text) => text.replace(/\r\n/g, '\n');

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
}

export function normalizeArtifact(contents, name, directory, projectRoot = root) {
  if (name.endsWith('.map')) {
    const map = JSON.parse(contents.toString());
    map.sources = (map.sources ?? []).map((source) =>
      path.relative(projectRoot, path.resolve(directory, path.dirname(name), map.sourceRoot ?? '', source)).split(path.sep).join('/')
    );
    map.sourceRoot = '';
    if (map.sourcesContent) map.sourcesContent = map.sourcesContent.map((source) => typeof source === 'string' ? normalizeLines(source) : source);
    return JSON.stringify(canonical(map));
  }
  if (/\.(?:js|cjs|mjs|ts|cts|mts)$/.test(name)) return normalizeLines(contents.toString());
  return Buffer.from(contents).toString('base64');
}

function readArtifacts(directory, projectRoot = root) {
  const artifacts = new Map();
  function visit(relative = '') {
    for (const entry of readdirSync(path.join(directory, relative), { withFileTypes: true })) {
      const name = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) visit(name);
      else if (entry.isFile()) artifacts.set(name, normalizeArtifact(readFileSync(path.join(directory, name)), name, directory, projectRoot));
      else throw new Error(`Unsupported artifact: ${name}`);
    }
  }
  visit();
  return artifacts;
}

export function compareArtifactSets(expected, actual) {
  const differences = [];
  for (const [name, contents] of expected) {
    if (!actual.has(name)) differences.push(`Missing: dist/${name}`);
    else if (actual.get(name) !== contents) differences.push(`Outdated: dist/${name}`);
  }
  for (const name of actual.keys()) if (!expected.has(name)) differences.push(`Unexpected: dist/${name}`);
  return differences.sort();
}

function canonicalizeSourceLines(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) canonicalizeSourceLines(file);
    else if (entry.isFile() && /\.[jt]sx?$/.test(file)) {
      const text = readFileSync(file, 'utf8');
      const normalized = normalizeLines(text);
      if (text !== normalized) writeFileSync(file, normalized);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const buildRoot = path.resolve(root, '.build');
  let scratch;
  try {
    mkdirSync(buildRoot, { recursive: true });
    scratch = mkdtempSync(path.join(buildRoot, 'dist-reference-'));
    // Chunk hashes include source-map paths: mirror the real project/outdir layout.
    cpSync(path.join(root, 'src'), path.join(scratch, 'src'), { recursive: true });
    canonicalizeSourceLines(path.join(scratch, 'src'));
    for (const name of ['package.json', 'tsconfig.json', 'tsup.config.ts']) cpSync(path.join(root, name), path.join(scratch, name));
    const build = spawnSync(process.execPath, [path.join(root, 'node_modules/tsup/dist/cli-default.js')], {
      cwd: scratch, stdio: 'inherit',
    });
    if (build.error) throw build.error;
    if (build.status !== 0) throw new Error('Reference build failed.');
    const expected = readArtifacts(path.join(scratch, 'dist'), scratch);
    if (!expected.size) throw new Error('Fresh reference build is empty.');
    const differences = compareArtifactSets(expected, readArtifacts(path.join(root, 'dist')));
    if (differences.length) throw new Error(`${differences.join('\n')}\nRun npm run build:lib and commit dist with the source.`);
    console.log(`dist matches the fresh source build (${expected.size} files).`);
    if (process.argv.includes('--test')) {
      const result = spawnSync(process.execPath, [path.join(root, 'node_modules/vitest/vitest.mjs'), 'run', 'tests/embed.test.ts'], {
        cwd: root, stdio: 'inherit', env: { ...process.env, PARTICULAR_TEST_DIST: 'dist' },
      });
      if (result.error) throw result.error;
      process.exitCode = result.status ?? 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    if (scratch) {
      const resolved = path.resolve(scratch);
      if (!resolved.startsWith(buildRoot + path.sep)) throw new Error('Refusing to clean an unexpected reference path.');
      rmSync(resolved, { recursive: true, force: true });
    }
  }
}
