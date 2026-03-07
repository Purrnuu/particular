# Particular — Engine Deep Reference

Deep implementation reference for AI agents working on engine internals.
For project overview, file map, commands, and modification checklists, see `CLAUDE.md` at the project root.

## Config Model

Types in `src/particular/types.ts`:

- `ShapeConfig`: visual effect fields (shape, blendMode, glow*, trail*, shadow*, imageTint)
- `ParticleConfig extends ShapeConfig`: per-particle behavior (rate, life, particleLife, velocity, spread, size, gravity, fadeTime, colors, spawnWidth/Height)
- `ParticularConfig`: engine-level (pixelRatio, maxCount, continuous, autoStart, webglMaxInstances)
- `FullParticularConfig extends ParticularConfig, ParticleConfig`: merged surface + icons + renderer

Config merge chain: `configureParticular({ ...preset, ...userConfig })` — user config always wins over preset.

Key fields with non-obvious behavior:

- `spawnWidth`, `spawnHeight` — randomize particle spawn within a rectangle centered on emitter point. Default 0 (point spawn). Used internally by screensaver to spread across viewport.
- `webglMaxInstances` — max particles per WebGL draw call (default 4096). Increase for fewer draw calls with many particles.

## Runtime Flow

1. `Particular.initialize(...)` sets core settings and starts RAF update loop.
2. Renderer(s) added via `addRenderer(...)`.
3. Emitters added via `addEmitter(...)`.
4. Each frame: `UPDATE` event (renderers clear) → emitters emit/update → `UPDATE_AFTER` event (renderers draw).

## Delta-Time Normalization

Normalized dt for refresh-rate independence: 60fps → `dt = 1.0`; 120fps → `dt ≈ 0.5`; 30fps → `dt ≈ 2.0`.

```
dt = clamp((timestamp - lastTimestamp) * 60 / 1000, 0, 3)
```

Upper clamp of 3 (~20fps floor) prevents teleportation after tab-backgrounding.

Update flow: `Particular.update(timestamp)` → `updateEmitters(dt)` → `emitter.emit(dt)` / `mouseForce.decay(dt)` / `emitter.update(..., dt)` → `particle.update(forces, dt)`.

Scaling rules:
- Additive per-frame values (velocity, gravity, position, rotation, scale, lifetime): multiply by `dt`.
- Exponential decay (friction, mouse damping): use `Math.pow(base, dt)`.
- `Vector.add(v, scale)` accepts an optional scale parameter (default 1) for dt-scaled addition.
- Emitter `lifeCycle` counter is a particle count, not time — not scaled by dt.

## Canvas Renderer

File: `src/particular/renderers/canvasRenderer.ts`

- Uses Canvas 2D shadow system for both glow and shadow.
- Glow uses configurable `glowColor` + `glowAlpha`.
- Glow size scales with particle size (`factoredSize`).
- Shadow: directional offset from burst origin, fade tied to particle alpha, offset/blur retraction during fade.

## WebGL Renderer

File: `src/particular/renderers/webglRenderer.ts`

Design: WebGL2 only, instanced drawing, separate circle and image shader programs, batch grouping by compatible draw state, chunked draws via `maxInstances`.

Key features: blend modes (normal/additive/multiply/screen), image support with optional tint, glow with size-scaled width and smoothed edge falloff, shadow pass (directional vector from burst origin, blur/offset retract with eased alpha during fade).

Implementation notes:
- Circle rendering uses a larger quad than image rendering to accommodate glow outside core radius.
- Shadow drawn as separate pass before main pass.
- Particle alpha clamped to `[0, 1]` in `Particle.update()`.

## Particle/Emitter Details

- `Particle.shadowLightOrigin` stores spawn/burst origin for directional shadowing.
- `Emitter.createParticle()` forwards all glow/shadow fields from emitter config.
- Particle alpha decays over time, clamped to valid range.
- **`life` vs `particleLife`**: `life` (default 30) = emitter emission budget (burst only). `particleLife` (default 100) = individual particle lifetime in ticks. Each particle lives `[particleLife * 0.75, particleLife]` ticks. Fading begins at `lifeTime - fadeTime`.

## Attractors

File: `src/particular/components/attractor.ts`

Engine-level point forces affecting all particles. Apply force after gravity, before position integration.

- `getForce(pos)` returns force with linear falloff (`1 - dist/radius`), zero outside radius.
- Negative strength = repulsion.
- Coordinates: engine space (screen coords / pixelRatio). `addAttractor` takes engine coords directly.
- Force flow: `Particular.updateEmitters()` → `Emitter.update(bounds, forces)` → `Particle.update(forces)`.

### Visible Attractors

Visual fields on `AttractorConfig`: `visible`, `icon`, `size` (default 12), `color` (default `'#74c0fc'`), `shape`, `glow*`.

`Attractor.toDrawable()` returns a `Particle`-compatible object. Canvas renderer draws in `onUpdateAfter` on top of particles. WebGL renderer appends after particles in draw pipeline.

### Random Placement

- `controller.addRandomAttractors(count, config?)` — random positions within viewport (10% margin).
- `controller.removeAllAttractors()` — clears all.

## MouseForce

File: `src/particular/components/mouseForce.ts`

Directional force from mouse velocity (brushing/sweeping), unlike attractors (radial pull/push).

- `updatePosition(x, y)` — call on mousemove, computes velocity from position delta.
- `decay()` — per-frame, velocity *= damping.
- `getForce(pos)` — `strength * (1 - dist/radius)^falloff * min(speed, maxSpeed)/maxSpeed`, in mouse velocity direction.
- Falloff curve: `< 1` = broad wind, `= 1` = linear (default), `> 1` = localized push.

## ForceSource Interface

Both `Attractor` and `MouseForce` implement `ForceSource { getForce(position: Vector): Vector }`. Engine merges `[...attractors, ...mouseForces]` each frame, passed to `Particle.update(forces)`.

## Color System

`colors` field (`string[]`): non-empty → random pick from array; empty → `randomcolor()` fallback.

Chain: `ParticleConfig.colors?` → `EmitterConfiguration.colors` → `Particle` constructor.

Built-in palettes: snow (white-offwhite), grayscale, monochrome (cool blue-grey), muted (desaturated warm/cool), finland, usa.

Usage: `{ ...presets.Burst.confetti, ...presets.Colors.finland }` to override colors on any preset.

## Presets

Curated and intentionally limited. Polish over quantity.

- `presets.Burst.confetti` — balanced celebration (square, muted colors)
- `presets.Burst.magic` — signature look (circle, monochrome, trails)
- `presets.Burst.fireworks` — energetic bloom (circle, additive, glow)
- `presets.Images.showcase` — tuned for icon/image particles
- `presets.Ambient.snow` — gentle snowfall (continuous, low rate, long life)

## Trail System

Config: `trail` (enable), `trailLength` (max age), `trailFade` (alpha multiplier), `trailShrink` (min size ratio).

Rendering math (identical in Canvas and WebGL):
```
life = 1 - segment.age / maxAge
sizeScale = trailShrink + life * (1 - trailShrink)
alphaScale = life * trailFade
```

## Screensaver Internals

`startScreensaver()` creates a `createParticles` instance with a single emitter at top-center, `spawnWidth` = viewport width, continuous mode. Adds a gentle `MouseForce` (strength 0.12) for drift. On resize, updates emitter `spawnWidth` and `point.x`.

The `mouseWind` option (`MouseForceConfig | false`) controls the mouse wind effect. Omit or pass a partial config to merge over defaults (`strength: 0.12, radius: 250, damping: 0.92, maxSpeed: 8, falloff: 0.3`). Pass `false` to disable mouse wind entirely (no listener, no force).

## Stable Public API

From `src/index.ts`: `Particular`, `Emitter`, `Particle`, `Attractor`, `MouseForce`, `CanvasRenderer`, `WebGLRenderer`, `ParticularWrapper`, `useParticles`, `useScreensaver`, `createParticles`, `startScreensaver`, `presets`, and all public types. Avoid breaking these exports.
