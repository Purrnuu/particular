# Particular — LLM / Cursor context

Use this file to stay aligned with the project when making changes. Keep edits **tight**, **understandable**, and **performance-conscious**.

---

## What this project is

- **Opinionated particle engine**: pretty defaults, high performance, minimal setup.
- **Entry points**: React (HOC + hook), standalone (vanilla), global script (IIFE).
- **Principles**: One-liner setup where possible; presets over config soup; dev experience must stay clear and predictable.

---

## Architecture (where to look)

| Concern | Location | Notes |
|--------|----------|--------|
| **Engine loop** | `src/particular/core/particular.ts` | `requestAnimationFrame` → UPDATE → emitters/particles → UPDATE_AFTER. `getCount()`, `getAllParticles()`. |
| **Defaults** | `src/particular/core/defaults.ts` | `defaultParticular`, `defaultParticle`, `configureParticular`, `configureParticle`. |
| **Particle lifecycle** | `src/particular/components/particle.ts` | Position, alpha, shape, blend, glow. No allocation in hot path. |
| **Emission** | `src/particular/components/emitter.ts` | Creates particles, passes config (shape, blend, glow). Presets applied here. |
| **Rendering** | `src/particular/renderers/canvasRenderer.ts` | Subscribes to UPDATE (clear), PARTICLE_UPDATE (draw), UPDATE_AFTER (restore). **Batch by (blendMode, glow)**; set composite/shadow once per group. |
| **Presets** | `src/particular/presets.ts` | Named presets (confetti, sparkles, magic, …). Add new ones here; keep them visually distinct. |
| **Types** | `src/particular/types.ts` | `ParticularConfig`, `ParticleConfig`, `FullParticularConfig`, shapes, blend modes. |
| **React** | `ParticularWrapper.tsx`, `useParticles.ts`, `containers/CanvasWrapper.tsx` | HOC uses portal + CanvasWrapper; hook uses `createParticles` + ref. |
| **Standalone API** | `src/particular/convenience.ts` | `createParticles({ canvas, preset, config, autoResize, autoClick })` → `{ engine, burst, attachClickBurst, destroy }`. |
| **Background canvas** | `src/particular/canvasStyles.ts` | `particlesBackgroundLayerStyle`, `getParticlesBackgroundLayerStyle`. Used by hook + CanvasWrapper. |
| **Dev aid** | `src/particular/devFPSOverlay.ts` | `showFPSOverlay({ getParticleCount? })` for FPS (+ optional particle count). |
| **Public API** | `src/index.ts` | Main entry (React + full API). `src/standalone.ts` = no React; IIFE build from standalone. |

---

## Conventions

- **TypeScript**: Strict. No `any` in public API or core; minimal in stories.
- **Naming**: Clear, consistent. Presets = lowercase (e.g. `stardust`). Export names match usage (e.g. `showFPSOverlay`).
- **Files**: One main concern per file. New features: add in `src/particular/` under the right folder (core, components, renderers, etc.); export from `index.ts` or `standalone.ts` as needed.
- **Defaults**: Change in `core/defaults.ts`. Preset overrides in `presets.ts`. Avoid scattering magic numbers.
- **React**: Prefer hook (`useParticles`) in docs/examples; HOC still supported. Any new React API should work with the background canvas pattern (click-through, full viewport).

---

## Performance rules

- **Canvas**: Batch draws by blend mode (and glow) in the renderer; avoid per-particle composite/shadow changes.
- **Hot path**: No new object/array allocation inside the per-frame update or per-particle draw. Reuse vectors/objects where possible.
- **Presets**: Tune for “pretty and smooth” on mid-range devices; document heavy presets if needed (e.g. in README).

---

## Common tasks

- **Add a preset**: Add entry in `presets.ts` (object + preset name type). Optionally add a story in `Presets.stories.tsx` and mention in README.
- **Add a particle shape**: Extend shape type in `types.ts`, add branch in `canvasRenderer.ts` draw logic, optionally add preset using it.
- **Change default config**: Edit `core/defaults.ts`. If it’s preset-specific, change only that preset in `presets.ts`.
- **New public API**: Implement in `src/particular/`, export from `src/index.ts`; if no React, export from `standalone.ts` only. Update README and types.
- **Storybook**: Stories under `src/*.stories.tsx`. Preview/decorators in `.storybook/preview.tsx` (use `.tsx` if file contains JSX). FPS overlay is optional via decorator.

---

## What to avoid

- **Over-abstracting**: Prefer one clear path (e.g. one convenience API, one hook) over many overlapping options.
- **Options without payoff**: Don’t add config flags “just in case.” Prefer a good preset or a single recommended pattern.
- **Breaking one-liners**: `createParticles({ canvas, preset })` and `useParticles({ preset })` should stay enough for default use.
- **Leaking React into standalone**: Keep `standalone.ts` and the IIFE build free of React imports.
- **Docs drift**: README = minimal setup only. Legacy embeds, HOC, direct API, presets list, config → `docs/EMBEDS_AND_API.md`. FPS overlay, Storybook, dev commands → `docs/DEBUG_AND_DEV.md`. Update the relevant doc and keep README short.

---

## Build, test, run

- **Build**: `npm run build` (library + Storybook static). `npm run build:lib` = tsup only (ESM, CJS, IIFE, types).
- **Test**: Vitest. Embed tests in `tests/embed.test.ts` (standalone + React hook).
- **Examples**: `examples/vanilla`, `examples/react`; see `examples/README.md`.
- **Storybook**: `npm run storybook`. FPS overlay toggle in preview decorator (bottom-left “FPS” button).

---

## Quick file map

```
src/
├── index.ts              # Main entry (React + full API)
├── standalone.ts        # No React (vanilla + IIFE)
├── Particular.stories.tsx
├── Presets.stories.tsx
└── particular/
    ├── core/             # particular.ts, defaults.ts
    ├── components/       # emitter, particle, icons
    ├── renderers/        # canvasRenderer
    ├── containers/       # CanvasWrapper (React)
    ├── presets.ts
    ├── types.ts
    ├── convenience.ts    # createParticles
    ├── useParticles.ts
    ├── ParticularWrapper.tsx
    ├── canvasStyles.ts
    └── devFPSOverlay.ts
```

Refer to this map when navigating or suggesting edits; keep the structure predictable so the next change stays fast and consistent.
