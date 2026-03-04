# LLM Context: Particular (Source of Truth)

This file is an implementation-focused guide for AI/code assistants working in this repo.

Use this as the primary context for architecture and behavior in `src/`.
If public docs differ, prefer code + this file.

## Project Philosophy (Prompt North Star)

When implementing features, fixes, and refactors, follow these principles:

- Performance first: keep the engine highly efficient and animation-safe under load.
- Architecture first: maintain a well-defined, understandable design with semantically clear file/folder structure.
- Quality by default: protect both library and embed flows with automated quality checks and reliable guardrails.
- Product craft over volume: presets are opinionated, beautiful, and intentionally crafted with care.
- Frictionless integration: implementing an effect on a site should feel smooth and effortless.
- Out-of-the-box goodness: default behavior should look premium even before customization.

## Project Purpose

Particular is a browser particle engine with:

- Canvas 2D renderer
- WebGL2 renderer
- React integrations (`useParticles`, `ParticularWrapper`)
- Vanilla convenience API (`createParticles`)

Current preset set is intentionally small and curated:

- `presets.Burst.confetti`
- `presets.Burst.magic`
- `presets.Burst.fireworks`
- `presets.Images.showcase` (for image/icon particles)

## Main Entry Points

- Public exports: `src/index.ts`
- Core engine loop: `src/particular/core/particular.ts`
- Defaults merge logic: `src/particular/core/defaults.ts`
- Convenience API: `src/particular/convenience.ts`
- React hook API: `src/particular/useParticles.ts`
- Presets: `src/particular/presets.ts`

## Config Model

Primary config types live in `src/particular/types.ts`:

- `ParticularConfig`: engine-level options (`pixelRatio`, `maxCount`, `continuous`, etc.)
- `ParticleConfig`: per-emitter/per-particle behavior (shape, physics, blend/effects)
- `FullParticularConfig`: merged full config surface

Important effect fields:

- Glow: `glow`, `glowSize`, `glowColor`, `glowAlpha`
- Shadow: `shadow`, `shadowBlur`, `shadowOffsetX`, `shadowOffsetY`, `shadowColor`, `shadowAlpha`
- WebGL image tint: `imageTint`
- WebGL batching safety: `webglMaxInstances`

Defaults (used when no presets/custom values provided):

- Engine defaults: `defaultParticular` in `core/defaults.ts`
- Particle/effect defaults: `defaultParticle` in `core/defaults.ts`
- Merge functions:
  - `configureParticular(...)`
  - `configureParticle(...)`

## Runtime Flow

1. `Particular.initialize(...)` sets core settings and starts RAF update loop.
2. Renderer(s) are added via `addRenderer(...)`.
3. Emitters are added via `addEmitter(...)`.
4. Each frame:

   - `UPDATE` event (renderers clear/setup)
   - emitters emit/update particles
   - `UPDATE_AFTER` event (renderers draw all particles)

## Renderer Behavior

## Canvas Renderer

File: `src/particular/renderers/canvasRenderer.ts`

- Uses Canvas 2D shadow system for both glow and shadow.
- Glow uses configurable `glowColor` + `glowAlpha`.
- Glow size scales with particle size (`factoredSize`) for larger halos on larger particles.
- Shadow supports:
  - directional offset from burst origin
  - fade tied to particle alpha
  - offset/blur retraction during fade

## WebGL Renderer

File: `src/particular/renderers/webglRenderer.ts`

Current design:

- WebGL2 only
- Instanced drawing
- Separate circle and image shader programs
- Batch grouping by compatible draw state
- Chunked draws via `maxInstances`/`webglMaxInstances`

Key features:

- Blend modes: `normal`, `additive`, `multiply`, `screen`
- Image support with optional tint (`imageTint`)
- Glow with configurable color/alpha
- Glow width scales with particle size
- Smoothed glow edge falloff in fragment shader
- Shadow pass for both circles and images
- Directional shadow vector based on burst origin
- Shadow blur/offset retract with eased alpha during fade

Implementation notes:

- Circle rendering uses a larger quad than image rendering to allow glow outside core radius.
- Shadow is drawn as a separate pass before main pass.
- Particle alpha is clamped to `[0, 1]` in `Particle.update()`.

## Particle/Emitter Details

Files:

- `src/particular/components/particle.ts`
- `src/particular/components/emitter.ts`

Important behavior:

- `Particle.shadowLightOrigin` stores spawn/burst origin for directional shadowing.
- `Emitter.createParticle()` forwards all glow/shadow fields from emitter config.
- Particle alpha decays over time and is clamped to valid range.

## Preset Philosophy (Current)

File: `src/particular/presets.ts`

Presets are intentionally limited and tuned for quality.
Do not add many presets casually; prefer polishing these first.

Current presets:

- `presets.Burst.confetti`: balanced readable celebration
- `presets.Burst.magic`: soft white magical stars (signature look)
- `presets.Burst.fireworks`: energetic additive circles with warm glow
- `presets.Images.showcase`: tuned for icon/image particles

## API Surface to Keep Stable

From `src/index.ts`:

- Core classes (`Particular`, `Emitter`, `Particle`)
- Renderers (`CanvasRenderer`, `WebGLRenderer`)
- React/utility APIs (`ParticularWrapper`, `useParticles`, `createParticles`)
- `presets`
- Public types

Avoid breaking these exports without explicit migration/update work.

## Known Guidance for Future Changes

- Default to WebGL for stories/examples and recommended integration paths.
- Keep Canvas available as an explicit fallback/choice when needed.
- Keep Canvas and WebGL feature parity whenever feasible.
- When changing visual behavior, validate both renderers.
- For WebGL effect tweaks, preserve batching compatibility.
- If adding new effect fields, wire them through all layers:
  - type defs
  - defaults
  - particle class
  - emitter pass-through
  - renderers
  - Storybook controls
  - presets (if relevant)

## Storybook

Story file: `src/Particular.stories.tsx`

- Stories are intentionally compact.
- Controls expose key renderer/effect settings.
- Use stories to verify parity between `canvas` and `webgl`.
