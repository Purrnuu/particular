# Particular — Engine Deep Reference

Deep implementation reference for AI agents working on engine internals.
For project overview, file map, commands, and modification checklists, see `CLAUDE.md` at the project root.

## Config Model

Types in `src/particular/types.ts`:

- `ShapeConfig`: visual effect fields (shape, blendMode, glow*, trail*, shadow*, imageTint)
- `ParticleConfig extends ShapeConfig`: per-particle behavior (rate, life, particleLife, velocity, spread, size, gravity, acceleration, friction, fadeTime, colors, spawnWidth/Height)
- `ParticularConfig`: engine-level (pixelRatio, maxCount, continuous, autoStart, webglMaxInstances, particlePoolSize)
- `FullParticularConfig extends ParticularConfig, ParticleConfig`: merged surface + icons + renderer

Config merge chain: `configureParticular({ ...preset, ...userConfig })` — user config always wins over preset.

Defaults in `src/particular/core/defaults.ts`: `defaultParticular`, `defaultParticle`, `defaultMouseForce` (base physics), `defaultMouseWind` (screensaver wind overrides), `defaultContainerGlow` (glow particle halo), `defaultMouseTrail` (cursor trail wisps), `defaultImageShatter` (glass-break explosion), `defaultWobble` (per-frame velocity/rotation nudges + mouse-reactive tracking config). `MouseForce` constructor merges config with `defaultMouseForce`.

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
- **`gravityJitter`**: Per-particle gravity randomness (0–1). Applied in `Emitter.createParticle()`: `gravity * (1 - jitter + Math.random() * jitter * 2)`. At `gravityJitter: 0.5`, each particle gets gravity between 50%–150% of the base value, breaking uniform fall speeds. Used by snow (0.5), confetti (0.2), magic (0.15), fireworks (0.2), meteors (0.3), fireworksShow (0.15). Default 0.
- **`life` vs `particleLife`**: `life` (default 30) = emitter emission budget (burst only). `particleLife` (default 100) = individual particle lifetime in ticks. Each particle lives `[particleLife * 0.75, particleLife]` ticks. Fading begins at `lifeTime - fadeTime`.
- **Permanent particles**: Particles with `homePosition` are truly permanent — they skip `lifeTick` increment entirely and alpha stays at `baseAlpha` (no fade). `particleLife: Infinity` is also supported: the constructor detects it and sets `lifeTime = Infinity` directly (skipping `getRandomInt`). The magic number `99999` has been replaced with `Infinity` in defaults and convenience methods.
- **`preventSettle` flag**: `Particle.preventSettle` (boolean, default `false`). When `true`, the `isSettled` check in `update()` always returns `false`, so the spring path always runs and particles never hard-snap to home. Used by `startWobble()` to keep particles in continuous motion under external nudges.

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

- `startTracking(target, pixelRatio)` — attaches `mousemove`, `touchmove`, and `touchstart` listeners on `target`, auto-converts coordinates via `pixelRatio`, calls `updatePosition` internally. Touch events use `e.touches[0]` coordinates with `{ passive: true }`.
- `stopTracking()` — removes all listeners (mouse + touch). Idempotent (safe to call when not tracking).
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

- `presets.Burst.confetti` — colorful rectangle confetti (muted colors, friction for flutter)
- `presets.Burst.magic` — glowing sparkles with soft trails, additive blending, blue/purple palette, gravityJitter 0.15
- `presets.Burst.fireworks` — glowing triangles with trailing streaks, additive blending, orange glow, gravityJitter 0.2
- `presets.Burst.fireworksDetonation` — narrow upward launch, triangle shape, additive blending, trailing rockets auto-detonate into triangle sub-bursts at 70% lifetime, gravityJitter 0.15
- `presets.Ambient.snow` — gentle snowfall (continuous, low rate, long life, gravityJitter 0.5 for natural drift)
- `presets.Ambient.meteors` — bright diagonal streaks with glowing trails, accelerating as they fall, gravityJitter 0.3
- `presets.Ambient.fireworksShow` — continuous fireworks screensaver: triangle rockets launch from bottom, auto-detonate into trailing triangle bursts (vivid palette), gravityJitter 0.15
- `presets.Ambient.river` — horizontal water stream with cyan glow and short trails, designed for use with attractors (water palette)
- `presets.Images.showcase` — tuned for icon/image particles
- `presets.ImageParticles.text` — high-fidelity text as tiny square particles
- `presets.ImageParticles.shape` — shape/icon as circle particles with soft glow

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

The `mouseWind` option (`MouseForceConfig | false`) controls the mouse wind effect. Omit or pass a partial config to merge over defaults (`strength: 0.12, radius: 100, damping: 0.92, maxSpeed: 8, falloff: 0.3`). Pass `false` to disable mouse wind entirely (no listener, no force). The `useScreensaver` hook also accepts `mouseWind` and passes it through.

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

- `ChildExplosionConfig`: shared base (childCount, childLife, sizeMin/Max, velocity, velocitySpread, friction, scaleStep, gravity, fadeTime, inheritColor, shape/blendMode overrides, glow/shadow/trail)
- `ExplodeOptions extends ChildExplosionConfig`: adds `destroyParents`
- `DetonateConfig extends ChildExplosionConfig`: adds `at` (0-1 lifetime fraction)

## Wobble Effect

File: `src/particular/convenience/effects.ts`

Continuous per-frame nudges that keep home-position particles visually alive. The spring system fights back, creating organic jittering motion. Supports two modes: simple random wobble (no `track`) and mouse-reactive directional wobble (with `track`).

### How it works

1. **`startWobble(config?)`**: Stops any existing wobble, merges `config` over `defaultWobble` (`velocity: 0.8`, `rotation: 0.4`). Sets `preventSettle = true` on all current particles so the settle-snap doesn't zero them out. Registers an `UPDATE` event listener on the engine that runs every frame. If `track` is provided, attaches mouse/touch listeners and uses the mouse-reactive algorithm (see below). If `track` is omitted, falls back to simple random nudges (`±velocity` per axis, `±rotation` jitter) — fully backward compatible.
2. **`stopWobble()`**: Removes the `UPDATE` listener, detaches mouse/touch listeners (if any), and sets `preventSettle = false` on all particles, re-enabling the normal settle-snap behavior. Idempotent (safe to call when not wobbling).

### Mouse-reactive mode (when `track` is provided)

When a `track` element is given, wobble becomes directional and mouse-aware:

1. **Image center**: Computed automatically as the average of all particle home positions. This is the "outward push origin."
2. **Directional push**: Each particle's push direction is from the image center outward through its home position (not random). This creates a natural radial expansion from the center of the image.
3. **Angular jitter**: The push direction is perturbed by ±23° each frame, creating an organic wobble feel rather than a rigid radial push.
4. **Mouse proximity weighting**: Distance from each particle to the mouse cursor is computed. A proximity factor (0–1) is derived: `1 - clamp(dist / mouseRadius, 0, 1)`. Particles within `mouseRadius` (default 200px) of the cursor receive a stronger push, scaled by `mouseStrength` (default 3). Particles outside the radius still get the base wobble velocity.
5. **Mouse velocity influence**: When the mouse is moving, nearby particles are additionally dragged in the direction of mouse movement. This creates a sense of physical interaction — swiping across the image pushes particles along with the cursor.
6. **Organic noise**: A small random velocity perturbation is added on top of the directional push for visual richness.

The effective per-particle velocity is: `baseVelocity * (1 + proximity * mouseStrength)`, applied along the jittered outward direction, plus mouse-velocity drag on nearby particles.

### Simple mode (no `track`)

Falls back to the original behavior: each frame adds random velocity nudges (`±velocity` per axis) and rotational jitter (`±rotation`) to all particles. No mouse tracking, no directional push.

### Interaction with spring

The wobble listener fires on the engine's `UPDATE` event (before `particle.update()`), so nudges are applied before the spring force is calculated. The spring pulls particles back toward home each frame while the wobble pushes them away — the balance creates a jittery orbit around the home position. In mouse-reactive mode, particles near the cursor orbit wider due to the amplified push. `preventSettle` ensures particles stay on the spring path and never hard-snap to home.

### Config

`WobbleConfig { velocity?: number, rotation?: number, track?: HTMLElement, mouseRadius?: number, mouseStrength?: number }`. Defaults in `defaultWobble` (`defaults.ts`): `velocity: 0.8`, `rotation: 0.4`, `mouseRadius: 200`, `mouseStrength: 3`.

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

## Container Glow System

File: `src/particular/convenience/containerGlow.ts`

Creates a glowing particle halo around any HTML element by placing 4 continuous emitters along its edges (top, bottom, left, right). Each emitter's velocity points outward (perpendicular to edge), with `spawnWidth`/`spawnHeight` matching the edge length.

### How it works

1. **Emitter placement**: `rebuild()` reads element rect relative to container (or viewport), divides by pixelRatio to get engine coords. Creates 4 emitters at edge centers with edge-length spawn bands.
2. **Particle config**: Built via `configureParticle()` with glow-specific overrides (low velocity, short life, additive blend, sparkle shape by default). All defaults from `defaultContainerGlow` in `defaults.ts`.
3. **Pulse**: Listens to engine `UPDATE` event and modulates emitter `rate` with `1 + amplitude * sin(tick * speed)`.
4. **Pause/resume**: A `paused` flag is enforced every frame in the `UPDATE` handler (sets `isEmitting = false`), overriding the engine's continuous-mode reset. `stop()` sets the flag; `start()` clears it. Existing particles fade naturally.
5. **Resize**: `ResizeObserver` watches element (and container), calls `rebuild()`.
6. **Scroll**: rAF-throttled scroll listener calls `reposition()` — lightweight path that moves existing emitter `point` positions.
7. **Cleanup**: `handle.destroy()` removes event listener, disconnects observers, removes emitters from engine.

### Coordinate conversion

Same as boundary system: container mode subtracts container rect before dividing by pixelRatio.

## Mouse Trail System

File: `src/particular/convenience/mouseTrail.ts`

Emits particles that follow the mouse cursor, creating a magic wisp trail. Particles fly out behind the cursor direction with configurable trails/streaks.

### How it works

1. **Emitter**: A single continuous emitter (`life: 999999`) positioned at the cursor.
2. **Tracking**: Listens to `mousemove`, `touchmove`, and `touchstart` on the target (default `window`). Converts coordinates via container offset and pixelRatio, same pattern as `MouseForce`.
3. **Per-frame update**: On engine `UPDATE`, computes cursor velocity from position delta. If speed > `minSpeed`, sets emitter velocity to reverse cursor direction (particles fly out behind) and enables emission. If below threshold, disables emission.
4. **Pause/resume**: `paused` flag enforced in the UPDATE handler, same pattern as container glow.
5. **Cleanup**: `handle.destroy()` removes event listeners and emitter from engine.

### Defaults

Sparkle shape, additive blend, trail streaks enabled, glow enabled. Designed for a magical wisp aesthetic out of the box.

## Home Position & Spring Physics

Used by image/text particles. When a particle has `homePosition` set, it experiences spring-return forces and idle animations.

### Spring return

In `Particle.update()`, when `homePosition` is set:
- Force = `(home - position) * springStrength` — pulls particle toward home.
- Velocity *= `Math.pow(springDamping, dt)` — decays velocity during return.
- `returnNoise` adds small random velocity perturbations so particles wobble organically instead of traveling in straight lines.
- **Settle check**: `isSettled = !preventSettle && dist < homeThreshold && speed < velocityThreshold`. When settled, particle snaps to home and zeroes velocity/rotation. When `preventSettle` is `true`, the spring path always runs instead — particles orbit home without snapping.
- **Permanent lifetime**: Particles with `homePosition` skip `lifeTick` increment entirely and hold `alpha = baseAlpha`. They never fade or die.

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

### Intro animation

When `intro` config is provided, particles animate in rather than appearing instantly. Four modes are available:

1. **`scatter`** (default): All particles are created at once at random positions (scattered within 30% of image size from home). Each starts at `factoredSize = 0` with a small random velocity. The existing spring physics pulls them to home while `scaleStep` grows them from invisible to full size over ~250ms. Most dramatic — every particle takes a unique path.

2. **`scaleIn`**: Particles fly outward from the image center to their home positions. Sorted **farthest-first** so outer edges form first, filling inward to center. Created in 30 distance-ordered batches over `duration` ms. Each particle gets distance-proportional outward velocity (`dist * 0.03`) with speed variance (0.8×–1.2×). Spring with heavy damping (`springDamping: 0.75`, `springStrength: 0.08`) ensures smooth settle without bounce.

3. **`ripple`**: Shockwave from center. Particles are created at home in distance-ordered batches (nearest-first, 40 batches over `duration`). Each particle gets an outward velocity impulse (2.5–5.0 magnitude) with ±20° angular wobble. They overshoot their home position, then spring back with a bouncy settle. Scale from 0 with 0.4×–1.6× speed variance.

4. **`paint`**: Particles spray from bottom center of the image, staggered left-to-right (sorted by x-position). Created in 40 batches over `duration`. Each particle starts at `(centerX, bottomY)` with velocity aimed at home (distance-proportional speed `dist * 0.03`, ±8° wobble). Spring with heavy damping (`springDamping: 0.75`, `springStrength: 0.08`) ensures smooth settle. Creates a spray-painting effect.

Key implementation details:
- All modes create the **final permanent particles** (with home positions, full visual config). No temporary emitters.
- `factoredSize = 0` is set post-construction. The engine's existing `scaleStep` math (`factoredSize += scaleStep * dt`) smoothly grows particles via RAF — no setTimeout timing issues.
- For scatter: `scatterRadius = max(engineW, engineH) * 0.3`. Particles get small random initial velocity `(±1, ±1)`.
- For scaleIn: 30 batches via setTimeout over `duration` ms. For ripple/paint: 40 batches. First batch adds the collector to the engine. Subsequent batches push particles to the already-registered collector.
- scaleIn and paint override per-particle `homeConfig` for heavier damping and no return noise, giving smooth ease-out arrival.
- Intro `scaleStep = size / 15` (~250ms grow time), overriding the user's scaleStep only for the intro animation.

Config: `IntroConfig { mode?: 'scatter' | 'scaleIn' | 'ripple' | 'paint', duration?: number }`. Pass `intro: {}` for defaults.

### Text pipeline

`textToParticles(text, config?)` → `createTextImage({ text, ...textConfig })` → offscreen canvas → `canvasToDataURL()` → `imageToParticles({ image: dataURL, ...config })`. The text is rendered with configurable font, size, weight, and fill (solid color or gradient stops).

### Element capture pipeline

`elementToParticles(element, config?)` captures any HTML element's visual appearance and replaces it with particles:

1. **Capture**: `captureElement()` (in `utils/elementCapture.ts`) walks the element's DOM tree, reads `getComputedStyle()` for each node, and manually draws backgrounds, borders, and text onto an offscreen Canvas 2D at device pixel ratio. This avoids SVG foreignObject which taints the canvas and blocks pixel extraction.
2. **Position**: Derives `x`, `y`, `width`, `height` from the element's `getBoundingClientRect()`, subtracting the container rect in container mode.
3. **Render**: Converts the canvas to a data URL via `canvasToDataURL()` and passes it to `imageToParticles()`.
4. **Hide**: Sets `element.style.visibility = 'hidden'` (default). Registers a cleanup to restore visibility on `destroy()`.

Config type: `ElementParticlesConfig extends Omit<ImageParticlesConfig, 'image'>` with `hideElement` (default true) and `restoreElement` (default true).

**Supported CSS properties in capture**:
- Background colors (solid and linear-gradient)
- Gradient text (`-webkit-background-clip: text`)
- Text rendering with computed font, weight, size, color
- Borders (all four sides, colors)
- Border radius (per-corner)
- Box shadow (first shadow, basic parsing)
- Opacity

**Known limitations**:
- External/inline images (e.g. `<img>` tags, `background-image: url(...)`) are not rendered.
- CSS pseudo-elements (`::before`, `::after`) don't appear (no DOM nodes to read).
- Complex layouts (flexbox alignment, transforms, clip-path) may not position perfectly.
- Multi-line text draws as a single fillText call at the first line rect position.

## Image Shatter Pipeline

File: `src/particular/convenience/imageShatter.ts`
Chunker: `src/particular/utils/imageChunker.ts`

Shatters an image into irregular polygon chunks that explode outward like broken glass. Each chunk is a particle with its own piece of the source image as a texture.

### Flow

1. **Load image**: `loadImage()` from `pixelSampler.ts` — same loader used by imageToParticles.
2. **Smart defaults**: Position defaults to center of viewport/container, width defaults to `min(80% viewport, 800px)`. Config merged over `defaultImageShatter` from `defaults.ts`.
3. **Draw to offscreen canvas**: Source image is drawn to an offscreen canvas at display resolution. This canvas becomes the source for polygon clipping.
4. **Generate chunks**: `generateImageChunks(sourceCanvas, chunkCount, jitter)` produces polygon pieces:
   - **Jittered grid**: `buildJitteredGrid()` creates a `(cols+1) x (rows+1)` grid of points over the image. Edge points stay on the boundary; interior points jitter randomly within their cell by `jitter` fraction. `cols` and `rows` are derived from `chunkCount` preserving image aspect ratio.
   - **Polygon clipping**: For each grid cell, the four corner points form an irregular quadrilateral. `clipPolygon()` creates a canvas for each quad, uses Canvas 2D `clip()` to mask the polygon region, draws the source image through the mask, and pads the result to a square.
   - **Image conversion**: Each clipped canvas is converted to an `HTMLImageElement` via `canvas.toDataURL()` + `new Image()`, resolved with `Promise.all`.
   - **Output**: Array of `ChunkResult { image, cx, cy, size }` where `cx`/`cy` are normalized (0-1) center positions and `size` is the square canvas side length in source pixels.
5. **Particle creation**: Each chunk becomes a `Particle`:
   - Position: chunk center mapped to engine coordinates (screen pixels / pixelRatio).
   - Velocity: outward from image center, scaled by distance (edge pieces fly further). Angle has `±0.3 rad` random spread, speed has `velocitySpread` randomness. `distFactor = 0.5 + (dist / max(w,h)) * 1.5` ensures natural explosion.
   - Size: proportional to chunk canvas size relative to image width, in engine coords.
   - Rotation: `rotationVelocity` set to random `±rotationSpeed` for spinning glass shards.
   - Image: `particle.init(chunk.image, engine)` so renderers pick up the chunk as a texture.
6. **Collector emitter**: Non-emitting `Emitter` (`rate: 0, life: 0`) holds all chunk particles. Same pattern as imageToParticles.
7. **maxCount**: Auto-expanded if needed to hold all chunks.

### Interactive mode (homeConfig)

When `homeConfig` is provided in the config, chunks are created in **interactive mode**:
- Chunks start assembled at their home positions with zero velocity
- `particleLife` is set to `Infinity` (truly permanent — no lifetime decrement)
- `gravity` is 0 (would fight the spring)
- `fadeTime` is `Infinity` (no fade)
- Each chunk gets a `homePosition` at its grid center
- Use `scatter({ velocity, rotation })` to push chunks outward
- The spring system (from `particle.ts`) automatically pulls them back
- **Rotation dampening**: The spring return section in `particle.ts` also dampens `rotationVelocity` and springs the rotation angle back to 0 — chunks de-spin and re-orient as they return home

This enables hover-to-break/reassemble effects. The `shatterText()` method renders text via `createTextImage()` then passes it through `shatterImage()`.

### Key differences from imageToParticles

- No pixel sampling — works with polygon clipping instead of per-pixel grid.
- Home positions only when `homeConfig` is provided (interactive mode). Without it, chunks fly outward and fade.
- Chunk count is much smaller (default 36 vs hundreds/thousands of pixel particles).
- Each particle has a unique image texture (its polygon piece) rather than a solid color.
- Rotation is a key visual element — spinning shards sell the glass-break effect. Rotation dampening added to spring return so chunks smoothly de-rotate.

### Defaults

All defaults in `defaultImageShatter` (`defaults.ts`): chunkCount 36, jitter 0.4, velocity 5, velocitySpread 0.5, gravity 0.12, rotationSpeed 5, particleLife 120, fadeTime 40, friction 0.005, scaleStep 100 (instant).

## Convenience API Architecture

The convenience layer lives in `src/particular/convenience/` as focused modules composed by the orchestrator (`index.ts`):

- `index.ts` — `createParticles()` orchestrator: auto-creates canvas, applies styles, composes helpers
- `types.ts` — All interfaces (`CreateParticlesOptions`, `ParticlesController`, etc.)
- `resize.ts` — Shared resize watcher: `getViewportSize()`, `watchResize()` — see Resize Utility below
- `forces.ts` — `createForces()`: attractor + mouse force management
- `boundary.ts` — `createBoundaryHelper()`: DOM element repulsion boundaries with resize/scroll sync
- `containerGlow.ts` — `createContainerGlowHelper()`: glowing particle halo around DOM elements
- `mouseTrail.ts` — `createMouseTrailHelper()`: particle trail following mouse cursor
- `effects.ts` — `createEffects()`: explode() + scatter() + startWobble()/stopWobble() (scatter supports optional rotation impulse)
- `imageParticles.ts` — `createImageParticles()`: image/text/element to particle grids with smart defaults
- `imageShatter.ts` — `createImageShatterHelper()`: image/text-to-polygon-chunks glass-break explosion + interactive mode
- `screensaver.ts` — `startScreensaver()`: continuous ambient emission

Each module exports a factory function that receives shared state (engine, config, container, cleanups) and returns an API slice. The orchestrator spreads them together into the `ParticlesController`.

## Resize Utility

File: `src/particular/convenience/resize.ts`

Shared resize watcher used by convenience modules that need to respond to viewport/container size changes. Abstracts container-vs-window detection, debouncing, scale factor calculation, and cleanup registration.

### `getViewportSize(container?)`

Returns `{ w, h }` — uses `container.clientWidth/Height` in container mode, `window.innerWidth/Height` otherwise. Single source of truth for viewport measurement. Used by `imageParticles.ts`, `imageShatter.ts`, `forces.ts`, and `screensaver.ts`.

### `watchResize(callback, options?)`

Watches for resize on the container (via `ResizeObserver`) or window (via `resize` event). Returns the initial size snapshot `{ w, h }`.

Callback signature: `(scaleX, scaleY, current) => void` — scale factors are relative to the size at call time.

Options:
- `container?: HTMLElement` — uses `ResizeObserver` when present, `window.addEventListener('resize')` otherwise
- `debounceMs?: number` — default 200. Set to 0 for immediate (no debounce)
- `cleanups?: Array<() => void>` — teardown is automatically registered
- `skipSmallChanges?: boolean` — skip when scale change < 1%. Default `true` when debounced, `false` when immediate

### Consumers

- **imageParticles.ts (autoCenter)**: `debounceMs: 200`, scales explicit x/y/width/height proportionally. When dimensions are omitted, smart defaults recalculate from the new viewport
- **imageParticles.ts (elementToParticles)**: `skipSmallChanges: false`, re-reads element `getBoundingClientRect()` on resize. Uses `autoCenter: false` on inner `imageToParticles` call to avoid double handling
- **screensaver.ts**: `debounceMs: 0` (immediate), updates emitter spawn width and center position
- **imageShatter.ts / forces.ts**: Use `getViewportSize(container)` directly for initial smart defaults (no ongoing resize watch)

### DX Defaults (Zero-Config)

- **Renderer**: WebGL by default (all of `createParticles`, `startScreensaver`, `useParticles`, `useScreensaver`)
- **Canvas**: Auto-created and appended to `container` or `document.body` when omitted. Auto-removed on `destroy()`.
- **Styles**: `applyCanvasStyles()` called automatically — sets positioning (`fixed` for viewport, `absolute` for container), `pointer-events: none`, z-index. No manual styles needed.
- **Image/text positioning**: `x`/`y` default to center of viewport/container. `width` defaults to `min(80% viewport, 800px)`.
- **mouseForce shorthand**: `createParticles({ mouseForce: true })` adds a tracking mouse force with sensible defaults.
- **textToParticles config**: Optional — `textToParticles('Hello')` works with zero config.
- **elementToParticles**: `elementToParticles(el)` works with zero config — position, size, and image derived from the element automatically.
- **shatterImage**: `shatterImage({ image: url })` works with minimal config — position and size default to centered/auto-sized, all physics defaults produce a polished glass-break effect.

**Defaults pattern**: Every feature's defaults live in `src/particular/core/defaults.ts` as named exports (`defaultImageParticles`, `defaultElementParticles`, `defaultMouseWind`, etc.). Convenience methods merge user config over these: `{ ...defaultXxx, ...userConfig }`. Never hardcode default values inline in convenience methods or stories.

Minimal usage: `createParticles()` gives a fully working engine with WebGL, auto-canvas, and styles applied.

## Performance Optimizations

The library has zero runtime dependencies (lodash-es removed). Key hot-path optimizations:

### Cached hex color parsing
`Particle` parses its hex color to normalized RGB (`colorR`, `colorG`, `colorB`, 0–1 range) once in the constructor via the static `parseHexNorm()` method. The WebGL renderer reads these cached fields in `fillInstanceData` instead of calling `hexToRgba()` per particle per frame.

### In-place trail segment aging
`Particle.update()` ages and compacts trail segments using a write-index pattern instead of `.map(spread).filter()`. This eliminates per-frame array allocation (~250 objects/frame at typical trail counts).

### Minimal trail ghost objects
Both renderers expand trail segments into drawable "ghost" objects for the render pipeline. Instead of `{ ...particle }` (spreading all 50+ Particle fields), ghosts are constructed with only the ~15-17 fields needed by the draw methods (`position`, `factoredSize`, `rotation`, `alpha`, `color`, `colorR/G/B`, `shape`, `blendMode`, `image`, `imageTint`, `glow`, `shadow`, `trail`, `trailSegments`, `shadowLightOrigin`).

### Cached WebGL attribute locations
`WebGLRenderer` caches all `getAttribLocation()` and `getUniformLocation()` results as class fields during `init()`. The hot-path draw methods (`drawCircleInstances`, `drawImageInstances`, `drawImageBatch`, `onUpdateAfter`) use cached locations instead of querying the GL context each frame.

### Native iteration
All `lodash-es` utilities (`forEach`, `filter`, `sample`) replaced with native `for...of` loops, `Array.prototype.filter()`, and `Math.random()` indexing. `Particular.getCount()` sums emitter particle counts in a for-loop instead of allocating `getAllParticles()`.

### Object pooling (render + update hot paths)
Per-frame allocations eliminated via index-based pools and array reuse:
- **Trail ghost pools** (canvasRenderer, webglRenderer): Both renderers maintain pre-allocated pools of ghost objects for trail segment rendering. A pool index resets each frame; ghosts are acquired by index and field-overwritten, never allocated after warm-up.
- **DrawBatch pool** (webglRenderer): Batch objects and their `particles` arrays are pooled and reused. The result array is also reused.
- **TrailSegment recycling** (particle.ts): A module-level `freeSegments` free list collects expired segments during in-place compaction. New segments pop from the free list before falling back to allocation.
- **Engine array reuse** (particular.ts): `getAllParticles()` fills a cached array instead of `concat()`. Combined forces array is cached. Dead emitter cleanup uses in-place compaction instead of `filter()`.
- **Force vector reuse** (attractor.ts, mouseForce.ts): `getForce()` returns a module-level reusable `_tempForce` vector instead of `new Vector()` per call. Safe because `velocity.add()` consumes the result immediately. On scroll-heavy pages with ~390 attractors × 600 particles, this eliminates ~234K+ Vector allocations per frame. Math is also inlined (normalize + scale combined into a single division).
- **Emitter in-place compaction** (emitter.ts): `update()` uses write-index compaction on `this.particles` instead of allocating a new `currentParticles` array each frame. Detonation children use a cached `_newChildren` array.
- **ContainerGlow resize debounce** (containerGlow.ts): `ResizeObserver` callback is rAF-debounced to coalesce multiple resize events per frame, matching boundary.ts behavior.
- **Trail ghost glow/shadow reset** (canvasRenderer.ts, webglRenderer.ts): Trail ghost objects explicitly set `glow = false` and `shadow = false` on every reuse, preventing expensive canvas `shadowBlur` or WebGL batch breaks on trail segments.
- **Particle object pool** (particle.ts): Dead particles are returned to a module-level `_particlePool` (max 2000) via `destroy()`. New particles are acquired via `Particle.create(params)` which pops from the pool and calls `_reinit()` — reusing existing Vector objects (position, velocity, acceleration, shadowLightOrigin) instead of allocating new ones. This eliminates the Particle object + 4 Vector allocations per particle lifecycle. All `new Particle()` call sites (emitter.ts, explosion.ts, imageParticles.ts, imageShatter.ts) use `Particle.create()`.
- **Event dispatch fast path** (particle.ts, eventDispatcher.ts): `Particle.dispatch()` guards with `hasEventListener()` before calling `dispatchEvent()`, skipping the entire event system when no listeners are registered (the common case). `EventDispatcher.dispatchEvent()` no longer calls `arr.slice()` to copy the listener array — it iterates the live array directly (backwards iteration is safe for in-dispatch removals). These two changes eliminate 500+ array allocations per frame in typical scenes.
- **Vector early-outs** (vector.ts): `addFriction()` returns immediately when friction ≤ 0 (skips `Math.pow`), `addGravity()` returns when gravity === 0 (skips addition). Saves per-particle-per-frame math for particles with zero friction/gravity.
- **Squared-distance home threshold** (particle.ts): Home spring settle check uses `distSq < thresholdSq` and `speedSq < thresholdSq` instead of `Math.sqrt(distSq) < threshold`, eliminating 2× `Math.sqrt` per home-particle per frame. Squared thresholds are cached once in `_reinit()` (`homeThresholdSq`, `velocityThresholdSq`).

## Stable Public API

From `src/index.ts`: `Particular`, `Emitter`, `Particle`, `Attractor`, `MouseForce`, `CanvasRenderer`, `WebGLRenderer`, `ParticularWrapper`, `useParticles`, `useScreensaver`, `createParticles`, `startScreensaver`, `presets`, `applyCanvasStyles`, and all public types (including `ImageShatterConfig`). Avoid breaking these exports.
