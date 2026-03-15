# Particular — Engine Deep Reference

Deep implementation reference for AI agents working on engine internals.
For project overview, file map, commands, and modification checklists, see `CLAUDE.md` at the project root.

## Config Model

Types in `src/particular/types.ts`:

- `ShapeConfig`: visual effect fields (shape, blendMode, glow*, trail*, shadow*, imageTint)
- `ParticleConfig extends ShapeConfig`: per-particle behavior (rate, life, particleLife, velocity, spread, size, gravity, acceleration, friction, fadeTime, colors, spawnWidth/Height)
- `ParticularConfig`: engine-level (pixelRatio, maxCount, continuous, autoStart, webglMaxInstances)
- `FullParticularConfig extends ParticularConfig, ParticleConfig`: merged surface + icons + renderer

Config merge chain: `configureParticular({ ...preset, ...userConfig })` — user config always wins over preset.

Defaults in `src/particular/core/defaults.ts`: `defaultParticular`, `defaultParticle`, `defaultMouseForce` (base physics), `defaultMouseWind` (screensaver wind overrides). `MouseForce` constructor merges config with `defaultMouseForce`.

Key fields with non-obvious behavior:

- `spawnWidth`, `spawnHeight` — randomize particle spawn within a rectangle centered on emitter point. Default 0 (point spawn). Used internally by screensaver to spread across viewport.
- `acceleration` + `accelerationSize` — downward acceleration split into direct (size-independent) and size-coupled components. Formula: `acceleration + accelerationSize * size`. Defaults: `acceleration: 0, accelerationSize: 0.01`. To disable size-based acceleration, set `accelerationSize: 0`. To add constant downward pull, increase `acceleration`.
- `friction` + `frictionSize` — air resistance split into direct and size-coupled components. Formula: `friction + frictionSize * size`. Defaults: `friction: 0, frictionSize: 0.0005`. To apply uniform drag regardless of size, set `friction` directly and `frictionSize: 0`.
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

Visual fields on `AttractorConfig`: `visible`, `icon`, `size` (default 12), `color` (default `'#adb5bd'`), `shape`, `glow*`.

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

### Self-Tracking

MouseForce can own its own mouse event listener via `startTracking`/`stopTracking`:

- `startTracking(target, pixelRatio)` — attaches a `mousemove` listener on `target`, auto-converts coordinates via `pixelRatio`, calls `updatePosition` internally.
- `stopTracking()` — removes the listener. Idempotent (safe to call when not tracking).
- `destroy()` — calls `stopTracking()`. Called automatically by the engine's `destroy()` utility.
- `isTracking` (getter) — returns `true` when a listener is active.

### `track` Config Option

The `MouseForceConfig.track` field wires self-tracking through the convenience layer:

- `track: true` — track on `window`.
- `track: someElement` — track on a specific `EventTarget`.
- Omitted or `false` — manual mode (consumer calls `updatePosition` directly).

`controller.addMouseForce({ track: true, strength: 1, ... })` replaces the old pattern of adding a force + wiring a `mousemove` listener + dividing by `pixelRatio` manually.

## ForceSource Interface

Both `Attractor` and `MouseForce` implement `ForceSource { getForce(position: Vector): Vector }`. Engine merges `[...attractors, ...mouseForces]` each frame, passed to `Particle.update(forces)`.

### Interaction Model Guideline

Engine-level components that need DOM event wiring (e.g. mouse tracking, touch input) should own their event listeners internally via config options (like `MouseForceConfig.track`), not push wiring to consumers. This keeps consumer code minimal and eliminates boilerplate like manual `addEventListener`/`removeEventListener` + coordinate conversion.

## Color System

`colors` field (`string[]`): non-empty → random pick from array; empty → `generateHarmoniousPalette()` generates a cohesive 6-color analogous HSL palette once per emitter.

`generateHarmoniousPalette()` (in `src/particular/utils/color.ts`) picks a random base hue (0–360) and creates 6 colors within ±30° (analogous scheme), with saturation 60–85% and lightness 42–82%. All particles from the same emitter share the palette, ensuring visual harmony.

Chain: `ParticleConfig.colors?` → `Emitter` constructor (generates palette if empty) → `EmitterConfiguration.colors` → `Particle` constructor.

Built-in palettes: snow (white-offwhite), grayscale, coolBlue (cool blue range), muted (desaturated warm/cool), blue (bold saturated blue), orange (bold saturated orange), green (bold saturated green), meteor (white-hot to deep red), finland, usa.

The `colorPalettes` export from `presets.ts` provides a `Record<string, string[]>` lookup of all named palettes, used by Storybook's `colorPalette` select control.

Usage: `{ ...presets.Burst.confetti, ...presets.Colors.finland }` to override colors on any preset.

## Presets

Curated and intentionally limited. Polish over quantity.

- `presets.Burst.confetti` — balanced celebration (square, muted colors)
- `presets.Burst.magic` — signature look (circle, coolBlue, trails)
- `presets.Burst.fireworks` — energetic bloom (circle, additive, glow)
- `presets.Images.showcase` — tuned for icon/image particles
- `presets.Ambient.snow` — gentle snowfall (continuous, low rate, long life)
- `presets.Ambient.meteors` — bright diagonal streaks with glowing trails, accelerating as they fall
- `presets.Burst.fireworksDetonation` — narrow upward launch that auto-detonates into colorful sub-bursts at 70% lifetime

## Trail System

Config: `trail` (enable), `trailLength` (max age), `trailFade` (alpha multiplier), `trailShrink` (min size ratio).

Rendering math (identical in Canvas and WebGL):
```
life = 1 - segment.age / maxAge
sizeScale = trailShrink + life * (1 - trailShrink)
alphaScale = life * trailFade
```

## Screensaver Internals

`startScreensaver()` creates a `createParticles` instance with a single emitter at top-center, `spawnWidth` = viewport width, continuous mode. Adds a gentle `MouseForce` with `track: true` (strength 0.12) for drift — mouse tracking is config-driven, not manually wired. On resize, updates emitter `spawnWidth` and `point.x`.

The `mouseWind` option (`MouseForceConfig | false`) controls the mouse wind effect. Omit or pass a partial config to merge over defaults (`strength: 0.12, radius: 250, damping: 0.92, maxSpeed: 8, falloff: 0.3`). Pass `false` to disable mouse wind entirely (no listener, no force). The `useScreensaver` hook also accepts `mouseWind` and passes it through.

## Explosion & Detonation

Two ways to spawn sub-bursts from existing particles:

### Manual Explode: `controller.explode(options?)`

Snapshots all alive particles, optionally destroys parents (`destroyParents: true` by default), creates a collector emitter (`isEmitting: false, life: 0, rate: 0`) and pre-populates it with children via `createExplosionChild()`. The collector emitter lives in the engine and its children fade out naturally.

- `ExplodeOptions` extends `ChildExplosionConfig` with `destroyParents?: boolean`.
- React: `useParticles()` returns `explode: (options?) => void`.
- Colors: `inheritColor: true` (default) uses parent color. `inheritColor: false` generates a fresh harmonious palette.

### Timed Detonation: `detonate` config on emitter

Set `detonate: { at: 0.7, childCount: 12, velocity: 4 }` in particle config. In `Emitter.update()`, after `particle.update()`, checks if `particle.lifeTick >= particle.lifeTime * detonate.at`. When triggered:
1. Snapshots parent position/color/shape/blendMode
2. Creates children via `createExplosionChild()`
3. Marks children as `isDetonationChild = true`
4. Destroys parent (not pushed to `currentParticles`)
5. Children pushed into same emitter's `particles` array

### Infinite Recursion Guard

Children created by detonation have `particle.isDetonationChild = true`. The detonation check in `Emitter.update()` skips particles with this flag, preventing infinite recursion since children live in the same emitter and share its `detonate` config.

### Shared Utility: `createExplosionChild()`

File: `src/particular/utils/explosion.ts`. Pure factory function used by both manual `explode()` and emitter detonation. Takes a `ParentSnapshot` (position, color, shape, blendMode) + merged `ChildExplosionConfig` + engine ref + fallback colors. Returns a single initialized `Particle` with:
- Random outward direction: `Vector.fromAngle(Math.random() * Math.PI * 2, velocity)`
- `scaleStep: size` for instant full size
- No icon, engine ref set via `particle.init(null, engine)`

### Config Types

- `ChildExplosionConfig`: shared base (childCount, childLife, sizeMin/Max, velocity, gravity, fadeTime, inheritColor, shape/blendMode overrides, glow/shadow/trail)
- `ExplodeOptions extends ChildExplosionConfig`: adds `destroyParents`
- `DetonateConfig extends ChildExplosionConfig`: adds `at` (0-1 lifetime fraction)

## Boundary System

File: `src/particular/convenience/boundary.ts`

Creates repulsion boundaries around HTML elements by tiling negative-strength `Attractor` instances along the element perimeter.

### How it works

1. **Tiling**: `rebuild()` computes element rect relative to container (or viewport), insets by `radius * insetFraction`, then places attractors every `radius` pixels along all four edges. Corners are shared between horizontal and vertical edges.
2. **Inset**: The `inset` fraction (default 0.4) moves repulsors inside the element edge so the repulsion field aligns with the visible edge rather than extending beyond it.
3. **Resize**: `ResizeObserver` watches both the element and container. On resize, calls `rebuild()` (tiling count may change).
4. **Scroll**: rAF-throttled scroll listener calls `reposition()` — a lightweight path that just moves existing attractors without creating/destroying them. Uses pre-computed offsets relative to element top-left.
5. **Cleanup**: `handle.destroy()` disconnects observers, removes scroll listener, and removes all attractors from engine.

### Coordinate conversion

All positions are in engine coords (screen pixels / pixelRatio). Container mode subtracts container rect offset before dividing by pixelRatio.

## Home Position & Spring Physics

Used by image/text particles. When a particle has `homePosition` set, it experiences spring-return forces and idle animations.

### Spring return

In `Particle.update()`, when `homePosition` is set:
- Force = `(home - position) * springStrength` — pulls particle toward home.
- Velocity *= `Math.pow(springDamping, dt)` — decays velocity during return.
- `returnNoise` adds small random velocity perturbations so particles wobble organically instead of traveling in straight lines.

### Runtime Toggle

`particle.idleEnabled` (boolean, default `true`) gates all idle animations: breathing, wiggle, wave, and idle pulse. Spring return is unaffected — particles still return home, they just stay still once there. The convenience API exposes `controller.setIdleEffect(enabled)` which toggles this on all particles with home positions.

The idle tick counter (`idleTicks`) keeps advancing even when disabled, so re-enabling doesn't fire a burst of missed pulses.

### Idle state

When distance to home < `homeThreshold` AND speed < `velocityThreshold`, particle enters idle mode:
- **Breathing**: sinusoidal scale oscillation at `breathingSpeed`.
- **Wiggle**: per-particle random scale pulsing at `wiggleSpeed` (uses per-particle random phase).
- **Wave**: coordinated scale wave that sweeps across the image based on particle position relative to `homeCenter`, at `waveSpeed` and `waveFrequency`.

### Idle pulse

Periodic random impulse waves keep settled particles alive. Every `idlePulseIntervalMin`–`idlePulseIntervalMax` ticks, particles receive a small velocity impulse (`idlePulseStrength`) with ripple delay based on distance from `homeCenter`.

## Image-to-Particles Pipeline

File: `src/particular/convenience/imageParticles.ts`

### Flow

1. **Load image**: `loadImage()` from `pixelSampler.ts` — handles URL strings, `HTMLImageElement`, and `HTMLCanvasElement`. Sets `crossOrigin: 'anonymous'` for URL strings.
2. **Smart defaults**: If `x`/`y` omitted, defaults to center of viewport/container. If `width`/`height` omitted, uses `min(80% viewport, 800px)`.
3. **Sample pixels**: `sampleImagePixels(image, resolution, alphaThreshold)` — draws image to offscreen canvas, reads pixel data, returns grid of `PixelSample` objects with normalized positions, hex colors, and alpha values.
4. **Grid sizing**: `resolution` = particles along longest axis. Squares use 400 (tighter packing), circles use 200. Particle size auto-calculated from grid spacing with shape-specific scale factors.
5. **Particle creation**: Each sample becomes a `Particle` with `homePosition` (spring return) and `homeCenter` (for wave/pulse ripple). Triangle particles alternate rotation for tessellation.
6. **Collector emitter**: A non-emitting `Emitter` (`rate: 0, life: 0`) holds all particles. Added to engine. No emission cycle — particles just exist and update.
7. **maxCount**: Auto-expanded if needed to hold all image particles.

### Text pipeline

`textToParticles(text, config?)` → `createTextImage({ text, ...textConfig })` → offscreen canvas → `canvasToDataURL()` → `imageToParticles({ image: dataURL, ...config })`. The text is rendered with configurable font, size, weight, and fill (solid color or gradient stops).

## Convenience API Architecture

The convenience layer lives in `src/particular/convenience/` as focused modules composed by the orchestrator (`index.ts`):

- `index.ts` — `createParticles()` orchestrator: auto-creates canvas, applies styles, composes helpers
- `types.ts` — All interfaces (`CreateParticlesOptions`, `ParticlesController`, etc.)
- `forces.ts` — `createForces()`: attractor + mouse force management
- `boundary.ts` — `createBoundaryHelper()`: DOM element repulsion boundaries with resize/scroll sync
- `effects.ts` — `createEffects()`: explode() + scatter()
- `imageParticles.ts` — `createImageParticles()`: image/text to particle grids with smart defaults
- `screensaver.ts` — `startScreensaver()`: continuous ambient emission

Each module exports a factory function that receives shared state (engine, config, container, cleanups) and returns an API slice. The orchestrator spreads them together into the `ParticlesController`.

### DX Defaults (Zero-Config)

- **Renderer**: WebGL by default (all of `createParticles`, `startScreensaver`, `useParticles`, `useScreensaver`)
- **Canvas**: Auto-created and appended to `container` or `document.body` when omitted. Auto-removed on `destroy()`.
- **Styles**: `applyCanvasStyles()` called automatically — sets positioning (`fixed` for viewport, `absolute` for container), `pointer-events: none`, z-index. No manual styles needed.
- **Image/text positioning**: `x`/`y` default to center of viewport/container. `width` defaults to `min(80% viewport, 800px)`.
- **mouseForce shorthand**: `createParticles({ mouseForce: true })` adds a tracking mouse force with sensible defaults.
- **textToParticles config**: Optional — `textToParticles('Hello')` works with zero config.

Minimal usage: `createParticles()` gives a fully working engine with WebGL, auto-canvas, and styles applied.

## Stable Public API

From `src/index.ts`: `Particular`, `Emitter`, `Particle`, `Attractor`, `MouseForce`, `CanvasRenderer`, `WebGLRenderer`, `ParticularWrapper`, `useParticles`, `useScreensaver`, `createParticles`, `startScreensaver`, `presets`, `applyCanvasStyles`, and all public types. Avoid breaking these exports.
