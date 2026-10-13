# Particular Development

Browser particle engine with Canvas 2D, WebGL2, 3D, React, and vanilla APIs.
Keep the default integration simple and preserve existing public exports.

## Workflow

- Develop on a feature branch. Codex branches use `codex/description`.
- `master` is the release branch. Merge reviewed source changes before releasing.
- `dist/` is tracked distributable code. Rebuild with `npm run build:lib` and
  commit it with source/API changes on feature branches so PRs are ready to merge.
- `docs/` is generated Storybook hosting output. Build/commit it on master at release.
- Validation builds reference outputs in ignored `.build/` and verifies dist;
  it does not regenerate tracked artifacts automatically.
- Keep source and dist line endings LF as defined by `.gitattributes`; chunk
  hashes include source maps. The dist checker uses an isolated project copy
  with canonical source lines and the same output-directory layout.
- Publishing, pushing releases, and creating release tags require a release request.

## Validation

- `npm ci`: install reproducible development dependencies.
- `npm run type-check`: check source types.
- `npm run lint`: lint source with `eslint.config.mjs`.
- `npm test`: source/unit/integration tests; physics runs in Node, DOM tests in jsdom.
- `npm run test:package`: build `.build/lib`, test IIFE/React, and import package subpaths without React.
- `npm run check:dist`: build a fresh reference and reject stale, missing, or extra dist files.
- `npm run test:dist`: check dist consistency and test the actual distributable entries.
- `npm run build:storybook:check`: build Storybook into `.build/storybook`.
- `npm run validate`: run all of the above checks except dependency installation.
- `npm run storybook`: interactive visual validation on port 6006.

Use relevant tests while iterating and `npm run validate` before completing a
change. Rebuild dist before final validation when source changes. Rendering
changes also need visual checks in the affected renderers;
canvas mocks and successful builds do not prove visual correctness.

## Architecture Rules

- Convenience factories receive `FeatureContext`, not separate shared arguments.
- Every listener, observer, timer, and pending operation belongs to the engine's
  `ResourceScope`. Manual disposers unregister themselves and are idempotent.
- Destruction is terminal. Async operations reject with `AbortError`; no work
  may attach particles or DOM resources after teardown.
- Initialization must roll back resources when a setup step fails.
- New forces implement `ForceSource` and register with `addForce()`. Use its
  optional update/preCompute/setBounds/destroy hooks, not a new engine array.
- UPDATE and UPDATE_AFTER carry `FrameContext`: dt is in 60 Hz ticks;
  deltaSeconds/elapsedSeconds are simulation time. Copy retained frame snapshots.
- Scale additive changes with dt and exponential decay with `Math.pow(base, dt)`.
- Bursts accept client coordinates. Image positions are local CSS pixels.
  Attractors accept engine coordinates. Use the shared coordinate mapper.
- Enforce maxCount for normal emission and explosions. Image/shatter helpers
  explicitly expose expandBudget (default true for compatibility).
- Keep hot paths allocation-conscious and retain Canvas/WebGL feature parity.

## API and Defaults

- Existing root exports remain compatible and include React. `/vanilla` and
  `/core` must import without React; `/react` owns React adapters.
- Optional renderers and image helpers have separate package entry points.
- React adapters preserve async results and readiness. Equivalent immutable
  inline configs keep the engine; changed values recreate it.
- Use canvasKey as the React canvas key when renderers can change. A browser
  canvas cannot switch context types after its first getContext call.
- Put tunable defaults in named objects in `core/defaults.ts`. Algorithm constants
  may stay beside the implementation. Stories demonstrate library behavior.
- New visual features need a Storybook example and appropriate regression tests.
- Update README/llms.txt for public API changes and architecture references for
  internal changes. Prefer links to contracts over duplicated API tables.

## Release

`npm run release:patch|minor|major` uses `scripts/release.mjs`. It requires clean
master, validates temporary builds, bumps the version, builds release artifacts,
commits them, tags, pushes, publishes, and creates the GitHub release. Do not run
these scripts as development validation.

## References

- [Architecture boundaries](architecture/boundaries.md)
- [Engine reference](architecture/engine-reference.md)
- [File map and checklists](architecture/development.md)
- [Public API](llms.txt)
