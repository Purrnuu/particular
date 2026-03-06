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
- `presets.Ambient.snow` (continuous snowfall)

## Main Entry Points

- Public exports: `src/index.ts`
- Core engine loop: `src/particular/core/particular.ts`
- Defaults merge logic: `src/particular/core/defaults.ts`
- Convenience API: `src/particular/convenience.ts` (`createParticles`, `startScreensaver`)
- React hook API: `src/particular/useParticles.ts` (`useParticles`, `useScreensaver`)
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
- Spawn area: `spawnWidth`, `spawnHeight` — randomize particle spawn position within a rectangle centered on the emitter point. Default 0 (point spawn). Used by the screensaver API to spread particles across the viewport width.

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

## Delta-Time Normalization

The engine uses normalized delta-time (`dt`) for refresh-rate independence. At 60fps `dt = 1.0`; at 120fps `dt ≈ 0.5`; at 30fps `dt ≈ 2.0`. This keeps particle speed, gravity, emission rate, and lifetime consistent across display refresh rates.

Computation in the RAF loop (`particular.ts`):
```
dt = clamp((timestamp - lastTimestamp) * 60 / 1000, 0, 3)
```
The upper clamp of 3 (~20fps floor) prevents teleportation after tab-backgrounding.

Flow: `Particular.update(timestamp)` → `updateEmitters(dt)` → `emitter.emit(dt)` / `mouseForce.decay(dt)` / `emitter.update(..., dt)` → `particle.update(forces, dt)`.

Scaling rules:
- Additive per-frame values (velocity, gravity, position, rotation, scale, lifetime): multiply by `dt`.
- Exponential decay (friction, mouse damping): use `Math.pow(base, dt)`.
- `Vector.add(v, scale)` accepts an optional scale parameter (default 1) for dt-scaled addition.
- Emitter `lifeCycle` counter is a particle count, not time — not scaled by dt.

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
- **`life` vs `particleLife`**: These are two distinct config fields:
  - `life` (default 30): emitter emission budget — total number of particles the emitter creates before it stops emitting (burst mode only; ignored in continuous mode).
  - `particleLife` (default 100): individual particle lifetime in ticks (~frames at 60fps). Each particle lives for a randomized duration in the range `[particleLife × 0.75, particleLife]`. Fading begins at `lifeTime - fadeTime` ticks. To make particles live longer, increase `particleLife`.

## Attractors

File: `src/particular/components/attractor.ts`

Attractors are engine-level point forces that affect all particles regardless of emitter. They apply force during each particle's update step (after gravity, before position integration).

- `Attractor(config: AttractorConfig)` — constructed from a config object. Position in engine coordinates, strength default 1, radius default 200.
- `getForce(particlePosition)` — returns a force Vector with linear falloff (`1 - dist/radius`), zero outside radius.
- Negative strength = repulsion.
- Engine manages attractors via `addAttractor()` / `removeAttractor()`, same pattern as emitters.
- Convenience API: `controller.addAttractor(config)` / `controller.removeAttractor(attractor)`.
- Coordinates: attractors work in engine space (screen coords / pixelRatio). The convenience `addAttractor` takes engine coordinates directly (unlike `burst` which divides by pixelRatio internally).
- Config type: `AttractorConfig` in `types.ts` (`x`, `y`, `strength?`, `radius?`, plus visual fields).
- Exported from both `index.ts` and `standalone.ts`.

Force flow: `Particular.updateEmitters()` → `Emitter.update(bounds, forces)` → `Particle.update(forces)`.

### Visible Attractors

Attractors can optionally render as visual markers via `AttractorConfig` visual fields:

- `visible?: boolean` — when `true`, renderers draw the attractor as a particle-like element. Default `false`.
- `icon?: string | HTMLImageElement` — image URL or element to render. String URLs are auto-converted to `HTMLImageElement`.
- `size?: number` — visual size (like particle `factoredSize`). Default 12.
- `color?: string` — fill color. Default `'#74c0fc'` (monochrome blue).
- `shape?: ParticleShape` — shape to render (`'circle'`, `'star'`, etc.). Default `'circle'`.
- `glow?: boolean`, `glowSize?`, `glowColor?`, `glowAlpha?` — glow effect, same as particle glow.

`Attractor.toDrawable()` returns a lightweight `Particle`-compatible object that both Canvas and WebGL renderers can draw using existing shape/image drawing code:
- Canvas renderer: draws visible attractors in `onUpdateAfter` before restoring context, on top of particles.
- WebGL renderer: appends visible attractor drawables after particles in the draw pipeline, so they render on top.

### Random Attractor Placement

Convenience methods for quick attractor setup:

- `controller.addRandomAttractors(count, config?)` — places `count` attractors at random positions within the viewport (10% margin from edges). Defaults: `strength: 1`, `radius: 200`, `visible: true`. Returns the created `Attractor[]`.
- `controller.removeAllAttractors()` — removes all attractors from the engine.

## MouseForce

File: `src/particular/components/mouseForce.ts`

MouseForce applies directional force based on mouse velocity, creating a brushing/sweeping effect on nearby particles. Unlike attractors (which pull/push radially toward a point), MouseForce pushes particles in the direction of mouse movement.

- `MouseForce(x, y, strength?, radius?, damping?, maxSpeed?, falloff?)` — defaults: strength 1, radius 200, damping 0.85, maxSpeed 10, falloff 1.
- `updatePosition(x, y)` — call on mousemove; computes velocity from position delta.
- `decay()` — called once per frame by engine; multiplies velocity by damping so force fades after mouse stops.
- `getForce(particlePosition)` — returns directional force Vector: `strength × (1 - dist/radius)^falloff × min(speed, maxSpeed)/maxSpeed`, in the direction of mouse velocity. Zero outside radius.
- `falloff` controls the force locality curve:
  - `< 1` (e.g. 0.3): broad, wind-like — force stays strong far from mouse, big radius + low falloff = global wind.
  - `= 1`: linear falloff (default) — balanced sweep.
  - `> 1` (e.g. 3): sharp, localized turbulence — force concentrated near mouse cursor.
- Engine manages via `addMouseForce()` / `removeMouseForce()`, same pattern as attractors.
- Convenience API: `controller.addMouseForce(config?)` / `controller.removeMouseForce(mouseForce)`.
- Config type: `MouseForceConfig` in `types.ts` (`x?`, `y?`, `strength?`, `radius?`, `damping?`, `maxSpeed?`, `falloff?`).

## ForceSource Interface

Both `Attractor` and `MouseForce` implement the `ForceSource` interface from `types.ts`:

```typescript
interface ForceSource {
  getForce(particlePosition: Vector): Vector;
}
```

`Particle.update()` and `Emitter.update()` accept `ForceSource[]`, allowing attractors and mouse forces to be combined transparently. The engine merges `[...attractors, ...mouseForces]` each frame.

## Color System

File: `src/particular/presets.ts` (palette definitions), wired through `types.ts` → `defaults.ts` → `emitter.ts` → `particle.ts`.

The `colors` field (`string[]`) controls particle color. When provided with a non-empty array, particles pick a random color from the array. When absent or empty, falls back to `randomcolor()` (legacy behavior).

Config chain: `ParticleConfig.colors?` → `EmitterConfiguration.colors` → `ParticleConstructorParams.colors?` → `Particle` constructor.

Default: `colors: []` (empty = randomcolor fallback).

Built-in palettes assigned to presets:
- `confetti` → muted (desaturated warm/cool)
- `magic` → monochrome (cool blue-grey)
- `fireworks` → muted
- `showcase` → no colors (image particles don't use particle color)
- `snow` → snow (white to offwhite)

Spreadable color presets in `presets.Colors`:
- `presets.Colors.snow` — white to offwhite
- `presets.Colors.grayscale` — full black-to-white
- `presets.Colors.monochrome` — cool blue-grey
- `presets.Colors.muted` — desaturated warm/cool mix
- `presets.Colors.finland` — Finnish flag blue and white
- `presets.Colors.usa` — American flag red, white, blue

Usage: `{ ...presets.Burst.confetti, ...presets.Colors.finland }` to override colors on any preset.

## Preset Philosophy (Current)

File: `src/particular/presets.ts`

Presets are intentionally limited and tuned for quality.
Do not add many presets casually; prefer polishing these first.

Current presets:

- `presets.Burst.confetti`: balanced readable celebration
- `presets.Burst.magic`: soft white magical stars (signature look)
- `presets.Burst.fireworks`: energetic additive circles with warm glow
- `presets.Images.showcase`: tuned for icon/image particles
- `presets.Ambient.snow`: gentle snowfall — soft white circles drifting downward, low rate, long life, near-zero gravity

## API Surface to Keep Stable

From `src/index.ts`:

- Core classes (`Particular`, `Emitter`, `Particle`)
- Renderers (`CanvasRenderer`, `WebGLRenderer`)
- React/utility APIs (`ParticularWrapper`, `useParticles`, `useScreensaver`, `createParticles`, `startScreensaver`)
- `presets`
- Public types

Avoid breaking these exports without explicit migration/update work.

## Screensaver API

`startScreensaver()` (vanilla) and `useScreensaver()` (React) provide a one-call setup for ambient full-viewport particle effects (e.g. snowfall).

- `startScreensaver({ canvas, preset?, config?, renderer?, autoResize? })` — creates a `createParticles` instance with a single emitter at top-center, `spawnWidth` set to viewport width, continuous mode. Returns `{ engine, controller, destroy }`.
- `useScreensaver({ preset?, config?, renderer?, autoResize?, backgroundLayer? })` — React hook wrapping `startScreensaver`. Returns `{ canvasRef, canvasStyle, destroy }`.
- On resize, the emitter's `spawnWidth` and `point.x` are updated to match the new viewport.
- Default preset: `snow`.

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
- When building a fundamentally new feature (e.g. attractors, new physics, new visual effects), also build a dedicated Storybook story to showcase and verify it interactively. New features should be demonstrable in Storybook before they're considered complete.

## Storybook

Story files:

- `src/Particular.stories.tsx` — Burst presets, shapes, effects, performance.
- `src/Attractors.stories.tsx` — Attractor physics (mouse-following attraction/repulsion).
- `src/MouseForce.stories.tsx` — Mouse-velocity directional force (sweep/brush effect).
- `src/Screensaver.stories.tsx` — Screensaver mode (Snow, HeavySnow, GentleAmbient).

Conventions:

- Stories are intentionally compact.
- Controls expose key renderer/effect settings.
- Use stories to verify parity between `canvas` and `webgl`.
- New fundamental features get their own story file to showcase behavior interactively.
