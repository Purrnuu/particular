# Particular

Browser particle engine (Canvas 2D + WebGL2) with React and vanilla APIs. ~3400 LOC.

## Git Workflow

- **`master` is the release branch.** It always reflects the latest published version. Do NOT commit directly to master during development.
- **Develop on feature branches.** Create a branch for each feature, fix, or group of changes: `git checkout -b feat/my-feature`
- **Branch naming**: `feat/description`, `fix/description`, `chore/description`, `docs/description`
- **Merge to master = release.** When a branch is ready, merge it to master, then bump version and publish.
- **Build dist/ and docs/ on master only.** Don't rebuild or commit `dist/` or `docs/` on feature branches — they create noisy diffs. Build them once when merging to master.

### Development flow
```
1. git checkout -b feat/my-feature        # branch from master
2. Develop, commit, iterate               # all work on the branch
3. npm run type-check && npm test          # verify before merge
4. git checkout master && git merge feat/my-feature
5. npm run build                           # rebuild dist/ + docs/
6. git add dist/ docs/ && git commit       # commit built artifacts
7. npm version patch|minor|major           # bump + tag
8. git push && git push --tags             # push to remote
9. npm publish --otp=CODE                  # publish to npm
10. gh release create vX.Y.Z --generate-notes  # GitHub release
```

### Release scripts (shorthand for steps 7–10)
```
npm run release:patch   # bug fixes
npm run release:minor   # new features
npm run release:major   # breaking changes
```
These run: build → test → type-check → version bump → push → npm publish → GitHub release.

## Commands

```
npm run build        # lib (tsup) + storybook
npm run build:lib    # lib only (rebuilds dist/)
npm test             # vitest
npm run storybook    # dev server on :6006
npm run type-check   # tsc --noEmit
npm run lint         # eslint
```

## Build Outputs

- `dist/` — built library (ESM, CJS, IIFE, type declarations, source maps). **Tracked in git** so GitHub-based installs work. Rebuilt and committed on master only, before publishing.
- `docs/` — static Storybook build for GitHub Pages. Also tracked in git. Rebuilt on master only, before publishing.

## File Map

### Core engine
```
src/particular/types.ts              # All config interfaces (ShapeConfig, ParticleConfig, FullParticularConfig, etc.)
src/particular/core/defaults.ts      # Default values (defaultParticular, defaultParticle) + merge functions
src/particular/core/particular.ts    # Engine loop: RAF, dt normalization, update cycle
src/particular/components/particle.ts    # Single particle: physics, lifetime, alpha decay, trail history
src/particular/components/emitter.ts     # Particle factory + emission logic (burst & continuous)
src/particular/components/attractor.ts   # Point force (attraction/repulsion), optional visible rendering
src/particular/components/mouseForce.ts  # Directional force from mouse velocity
src/particular/components/icons.ts       # Image loading/processing for image particles
```

### Renderers
```
src/particular/renderers/canvasRenderer.ts   # Canvas 2D pipeline: shapes, glow, shadow, trails (425 LOC)
src/particular/renderers/webglRenderer.ts    # WebGL2 instanced pipeline: shaders, batching, effects (826 LOC, largest file)
```

### Public APIs
```
src/index.ts                                # Public exports (npm package entry)
src/standalone.ts                           # IIFE/CDN entry (window.Particular)
src/particular/convenience/index.ts         # createParticles() — slim orchestrator, composes helpers
src/particular/convenience/types.ts         # Controller, options, and handle interfaces
src/particular/convenience/forces.ts        # Attractor + mouse force helpers
src/particular/convenience/boundary.ts      # DOM element boundary (tiled repulsion + resize/scroll sync)
src/particular/convenience/containerGlow.ts # addContainerGlow() — glowing particle halo around DOM elements
src/particular/convenience/mouseTrail.ts   # addMouseTrail() — particle trail following cursor
src/particular/convenience/effects.ts       # explode() + scatter() particle manipulation
src/particular/convenience/imageParticles.ts # imageToParticles() + textToParticles()
src/particular/convenience/imageShatter.ts  # shatterImage() + shatterText() — polygon-chunk glass-break + interactive mode
src/particular/convenience/screensaver.ts   # startScreensaver() — continuous ambient emission
src/particular/convenience/resize.ts        # Shared resize watcher: getViewportSize(), watchResize() — container/window detection, debounce, scale factors
src/particular/useParticles.ts              # useParticles(), useScreensaver() — React hooks
src/particular/ParticularWrapper.tsx        # HOC wrapper (legacy React API)
src/particular/presets.ts                   # Curated presets (Burst, Ambient, Images) + color palettes
src/particular/canvasStyles.ts              # Default canvas CSS (background layer, z-index)
src/particular/devFPSOverlay.ts             # Debug FPS counter overlay
```

### Storybook
```
src/storyArgs.ts                         # Shared particle controls (type, argTypes, defaults, converter)
src/Particular.stories.tsx               # Burst presets, shapes, effects, performance
src/Explosion.stories.tsx                # Manual explode + timed firework detonation demos
src/Attractors.stories.tsx               # Attractor physics demos
src/MouseForce.stories.tsx               # Mouse-velocity directional force demos
src/Screensaver.stories.tsx              # Ambient screensaver demos (snow, etc.)
src/PageLayout.stories.tsx               # Page layout demos (boundaries, scrolling, container mode)
src/ImageParticles.stories.tsx           # Image/text to particles demos (resolution, shapes, intro anims)
src/ElementToParticles.stories.tsx       # HTML element dissolve into particles demos
src/ImageShatter.stories.tsx            # Image shatter demos (click-to-shatter, hover interactive, text shatter)
src/ContainerGlow.stories.tsx           # Container glow demos (continuous, hover text, multiple cards)
src/MouseTrail.stories.tsx              # Mouse trail demos (wisps, warm, snow dust)
src/Showcase.stories.tsx                 # Combined showcase demos
```

### Utils
```
src/particular/utils/vector.ts           # 2D vector class (angle, magnitude, add, scale)
src/particular/utils/math.ts             # Clamp, lerp, etc.
src/particular/utils/genericUtils.ts     # Misc helpers
src/particular/utils/eventDispatcher.ts  # Simple pub/sub for engine events
src/particular/utils/color.ts            # HSL palette generation (generateHarmoniousPalette)
src/particular/utils/pixelSampler.ts     # Image loading + pixel grid sampling for image-to-particles
src/particular/utils/imageSource.ts      # Text/shape rendering to offscreen canvas (createTextImage, etc.)
src/particular/utils/explosion.ts        # Shared child particle factory (used by explode + detonate)
src/particular/utils/elementCapture.ts   # Manual Canvas 2D element capture for elementToParticles (reads computed styles)
src/particular/utils/imageChunker.ts    # Jittered-grid polygon chunker for image shatter (buildJitteredGrid, clipPolygon, generateImageChunks)
```

### Tests
```
tests/embed.test.ts                      # Smoke tests: IIFE global + React hook mount
tests/vector.test.ts                     # Vector math: magnitude, add, friction (pow), gravity, normalize, angle
tests/attractor.test.ts                  # Attractor force: falloff, attract/repel, direction, radius boundary
tests/mouseForce.test.ts                 # MouseForce: velocity tracking, decay, force falloff, speed capping
tests/defaults.test.ts                   # Config merge: configureParticular, configureParticle, default key existence
tests/particle.test.ts                   # Particle physics: pool lifecycle, velocity integration, friction, gravity, forces, alpha fade, home spring, size, trail
tests/emitter.test.ts                    # Emission: rate accumulation, lifecycle budget, bounds, continuous mode
```

## Modification Checklists

### Adding a new particle effect field
```
1. types.ts        — add to ShapeConfig (visual) or ParticleConfig (behavioral)
2. defaults.ts     — add default value to defaultParticle
3. emitter.ts      — forward field in createParticle()
4. particle.ts     — store in constructor, use in update() if behavioral
5. canvasRenderer.ts — implement rendering (keep parity with WebGL)
6. webglRenderer.ts  — implement rendering (preserve batching compatibility)
7. storyArgs.ts    — add to ParticleStoryArgs, particleArgTypes, defaultParticleStoryArgs, particleStoryArgsToConfig()
8. presets.ts      — set in relevant presets (if applicable)
9. Verify          — npm run build && npm test, then check BOTH renderers in Storybook
```

### Adding a new preset
```
1. presets.ts      — add config object to appropriate group (Burst/Ambient/Images)
2. presets.ts      — add alias in presetRegistry if addressable by name string
3. Story file      — add a story using the new preset
4. AGENTS.md       — document the preset in the presets section
5. Verify          — check it looks good in both canvas and webgl renderers
```

### Adding a new force type (like Attractor or MouseForce)
```
1. types.ts        — add config interface, implement ForceSource interface
2. components/     — create component file with getForce(position): Vector
3. particular.ts   — add array + add/remove methods, merge into forces array in updateEmitters()
4. convenience/forces.ts (or new helper) — add controller methods (addX, removeX)
5. index.ts        — export class + config type
6. standalone.ts   — export if needed for CDN
7. Story file      — create dedicated story file to demo the feature
8. AGENTS.md       — document behavior, config, coordinate system
```

### Adding a new shape
```
1. types.ts        — add to ParticleShape union type
2. canvasRenderer.ts — add drawing case in shape switch
3. webglRenderer.ts  — add drawing case (or map to existing geometry)
4. storyArgs.ts    — add to shape options array in particleArgTypes
5. Verify          — check rendering in both canvas and webgl
```

### Adding a new convenience helper module
```
1. convenience/     — create new module file with factory function: createXxx(engine, mergedConfig, ...) => { methods }
2. convenience/types.ts — add method signatures to ParticlesController interface
3. convenience/index.ts — import factory, call it, spread result into returned controller
4. index.ts        — export any new public types
5. standalone.ts   — export if needed for CDN
6. AGENTS.md       — document the new module and its behavior
7. Verify          — npm run type-check && npm run build:lib
```

### Modifying Storybook controls
```
- Read storyArgs.ts header comment for which fields are shared vs story-specific
- Shared particle fields: add to storyArgs.ts (type + argTypes + defaults + toConfig)
- Story-specific fields: add to the individual story file's local type + argTypes
- After changes: npm run build (includes storybook build) to verify
```

## Documentation

- **`llms.txt`** — LLM-friendly API reference at the project root. Structured for machine consumption: function signatures, all options with types and defaults, config interfaces, copy-paste recipes.
- **Keep `llms.txt` up to date.** When you add, remove, or change any public API surface (new controller methods, new config fields, new presets, changed defaults, new functions exported from `index.ts`), update `llms.txt` to reflect the change. This is the primary reference external LLMs use to help users integrate the library.
- `AGENTS.md` covers engine internals. Update when changing internal architecture or adding subsystems.
- `README.md` is for humans. Update examples when the API changes. Keep examples minimal — they should showcase the zero-config DX.

## Conventions

- **Never commit directly to master.** Always work on a feature branch. See Git Workflow above.
- Default to WebGL for stories/examples and recommended integration paths.
- Keep Canvas/WebGL feature parity when feasible.
- Presets are curated, not abundant. Polish over quantity.
- New features get a dedicated Storybook story before they're considered complete.
- Storybooks contain only the necessary information to setup the effect. The effect details should be contained in the library, in helpers, components, and internals.
- The interface to the library should be simple, human readable, amazing for agents like Claude to modify, and easy without configuration.
- Validate both renderers when changing visual behavior.
- **Defaults must be beautiful.** Presets and defaults are the primary way library users experience effects. All tuning (colors, physics, timing, child config) belongs in presets and `defaults.ts`, not in story files. Stories should demonstrate features using presets with minimal or no inline config overrides. If a story needs many tweaks to look good, those tweaks should be promoted into a preset or default. This ensures `createParticles({ preset: 'fireworksDetonation' })` gives users a polished result without requiring them to hand-tune parameters.
- **All defaults live in `defaults.ts`.** Every feature must define its default values in `src/particular/core/defaults.ts` as a named exported constant (e.g. `defaultElementParticles`, `defaultImageParticles`). Convenience methods merge user config over these defaults. Never hardcode magic numbers in convenience methods, stories, or examples. If you find yourself writing `?? someValue` inline, that value belongs in a defaults object.
- **The engine does the heavy lifting, not the stories.** Stories exist only to showcase features with minimal setup. All behavior, smart defaults, physics tuning, and config merging must live in the library (defaults.ts, convenience modules, components). If a story has more than trivial config, ask: "Should this logic be in the library instead?"

## Pre-Commit Checklist

Before committing to git, always verify:

```
1. npm run type-check     # No type errors
2. npm test               # All tests pass
3. npm run build          # Both lib and storybook build successfully
4. Documentation check:
   - llms.txt       — Does it reflect any new/changed public API, config fields, or defaults?
   - CLAUDE.md      — Is the file map current? Any new files or checklists needed?
   - src/AGENTS.md  — Does it cover any new internals, pipelines, or architecture changes?
5. defaults.ts            — Are all new defaults defined here (not inline in convenience methods or stories)?
```

## Key Pitfalls

- **`life` vs `particleLife`**: `life` = emitter emission budget (burst only, default 30). `particleLife` = individual particle lifetime in ticks (default 100). Easy to confuse.
- **Coordinate systems**: Attractors use engine coords (screen / pixelRatio). `burst()` divides by pixelRatio internally. Don't double-divide.
- **dt normalization**: Multiply additive values by dt. Use `Math.pow(base, dt)` for exponential decay. Never skip dt or animations break at non-60fps refresh rates.
- **WebGL batching**: Effect changes (blend mode, glow, shadow) create batch breaks. Don't add per-particle state that fragments batches.
- **Config merge order**: `configureParticular({ ...preset, ...userConfig })` — user config wins. Presets are base defaults, not overrides.
- **Default values in stories**: Use defaults.ts and add features as helpers and components in the main engine, use stories only to highlight the use cases, not set default values or behaviours

## Deep Reference

For engine internals (dt math, renderer pipelines, particle lifecycle, config merge chains), see `src/AGENTS.md`.
