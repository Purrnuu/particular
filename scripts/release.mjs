import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const bump = process.argv[2];
if (bump === '--help') {
  console.log(
    'Usage: node scripts/release.mjs patch|minor|major\nRun on clean master. Validates, versions, builds, commits, tags, pushes, and publishes.'
  );
  process.exit(0);
}
if (!['patch', 'minor', 'major'].includes(bump))
  throw new Error('Expected patch, minor, or major.');

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    shell: process.platform === 'win32' && command === 'npm',
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} failed (${result.status}).`);
  return result.stdout?.trim();
}

if (run('git', ['branch', '--show-current'], true) !== 'master') {
  throw new Error('Releases must run on master after merging the development branch.');
}
if (run('git', ['status', '--porcelain'], true)) {
  throw new Error('Commit changes and handle untracked files before releasing.');
}
run('npm', ['run', 'validate']);
run('npm', ['version', bump, '--no-git-tag-version']);
run('npm', ['run', 'build']);
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const tag = `v${version}`;
run('git', ['add', 'package.json', 'package-lock.json', 'dist', 'docs']);
run('git', ['commit', '-m', `chore: release ${tag}`]);
run('git', ['tag', tag]);
run('git', ['push', 'origin', 'master']);
run('git', ['push', 'origin', tag]);
run('npm', ['publish']);
run('gh', ['release', 'create', tag, '--generate-notes']);
