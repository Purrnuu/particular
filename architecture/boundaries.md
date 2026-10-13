# Architecture Boundaries

The existing `createParticles()` facade stays available. Its helpers share a
`FeatureContext`, and smaller package entries allow explicit composition.

## Resource Ownership

`Particular.resources` is the engine's `ResourceScope`. Convenience helpers use
the same scope, so either controller.destroy() or engine.destroy() tears down
their resources. Register cleanups with resources.add(); its returned function
is an idempotent manual disposer that removes its registration.

Use resources.timeout() for scheduled effect work, loadImage(source, signal)
for image loading, and resources.waitFor() for asynchronous work that cannot
itself be cancelled. waitFor cancels the result/attachment, not the underlying
operation. Check assertActive after awaiting before mutating the engine.

Teardown aborts asynchronous work, executes cleanups in reverse registration
order, then releases renderer/particle/force state. Cleanup failures do not
prevent the remaining resources from being released.

## Shared Feature Context

Factories receive engine, resolved config, container, resources, and coordinates.
clientToEngine subtracts the current container offset, then divides by pixelRatio.
localToEngine divides local CSS pixels without subtracting an offset. The 3D
facade also adjusts bursts to its renderer's reference frame after resizing.

The context is exported from `/core` for explicit compositions. Its resource
scope is tied to the supplied engine; factories do not create another RAF loop.

## Force Hooks and Timing

ForceSource.getForce supplies velocity change per 60 Hz tick, not a pre-scaled
impulse. Particle integration applies dt exactly once to x, y, and z. Optional hooks:

- setBounds(width, height): receives logical engine bounds each step.
- update(frame): updates force-local state such as mouse velocity decay.
- preCompute(particles, dt): computes neighbor-dependent forces before integration.
- constrain(particle): applies positional safety constraints after integration,
  before PARTICLE_UPDATE and rendering. Normal forces need not implement it.
- destroy(): releases force-owned resources on engine destruction.

addForce/removeForce manage custom forces. Existing attractor, mouse, and flocking
methods/arrays remain compatible; all forces use the common hook pipeline.
Removing a force detaches it; callers own its cleanup afterward.

UPDATE and UPDATE_AFTER receive the same reused FrameContext. dt is clamped to
[0, 3] in 60 Hz ticks; deltaSeconds = dt / 60. elapsedSeconds accumulates this
simulation time rather than time spent in background tabs. Copy the context if
you keep it beyond the current callback. Random wobble noise uses sqrt(dt) to
preserve variance per simulated second; directional pushes use dt.

Emission rates are particles per 60 Hz tick, not per display frame. Trail
sampling uses a fractional tick accumulator with one sample per tick; slower
frames reconstruct intermediate positions using pre-integration velocity.
Mouse-trail speed divides cursor displacement by dt before applying minSpeed.
Tracked mouse wind and wobble drag use PointerMotion to aggregate events and
divide displacement by the simulation delta. The first pointer event anchors
position without inventing a movement impulse. Active mouse wind uses measured
speed; damping applies to residual velocity when no new pointer input arrives.
Programmatic MouseForce.updatePosition(x, y, dt = 1) accepts normalized elapsed
ticks; existing two-argument calls represent a single 60 Hz tick.
Spring-return noise, like wobble noise, uses sqrt(dt) to preserve variance.
The simulation remains variable-step, not fixed-step: normalization preserves
time-based rates but does not guarantee identical spring/force trajectories.

Intentional per-particle adjustments are not display-FPS multipliers:
velocityMultiplier adds an upward size-based bias once at spawn;
accelerationSize and frictionSize add size-scaled terms to acceleration and
friction; springMultiplier varies spring strength from 0.6 to 1.4 per particle.
Flocking weights and mouse proximity/falloff coefficients are effect tuning.
Flocking's speed-cap correction divides by dt because integration multiplies
the correction by dt afterward; its normal steering force is not pre-scaled.
Flocking also maintains a minSpeed cruise floor (default 1.5, capped by maxSpeed).
This speed correction preserves heading and is separate from the steering cap;
minSpeed: 0 opts into passive swarms. A fully resting particle without steering
stays at rest. The flock preset uses a shared launch heading rather than
opposing full-circle velocities that cancel under alignment.

Flocking edge avoidance rotates velocity toward inward/tangential headings with
a separate boundary steering budget, bypassing neighbor-force smoothing. It
preserves speed so the cruise floor cannot cancel avoidance. Edge zones are
capped independently to avoid overlapping on small canvases. A force-owned
containment fallback repairs positions before emitter kill-zone checks and
after integration, reversing only outward velocity components when necessary.
It uses logical viewport dimensions, not the wider legacy emitter kill zone.
The 3D example uses a centered, depth-limited flight volume; these bounds are in
engine space, not a camera-frustum constraint for arbitrary orbit/zoom settings.
Depth-limited regions use a square xy footprint based on the shorter logical
viewport side. This avoids long, shallow volumes that disappear during orbit.

## Package Boundaries

- Root: compatible facade including legacy React exports.
- /vanilla: complete browser facade without React.
- /react: hooks and legacy wrappers.
- /core: engine, particle, emitter, vector, config merging, resource scope/context.
- /renderers/canvas, /renderers/webgl, /renderers/webgl3d: optional backends.
- /effects/images: image and shatter factories for explicit compositions.

The build shares ESM/CJS chunks. IIFE remains one standalone browser bundle.
Distributables in dist are rebuilt and committed with feature-branch source
changes. Package tests build under .build/lib; the dist guard builds an isolated
project mirror under .build/ with the same dist layout, compares the full output
tree with dist, and tests the committed package entries. Source-map
paths and checkout line endings are normalized for cross-platform comparison;
source content, mappings, code, declarations, and file names must still match.
Generated Storybook docs remains release-only.

React hooks return canvasKey alongside canvasRef/canvasStyle. Consumers that
change rendering backends use `<canvas key={canvasKey} ref={canvasRef}
style={canvasStyle} />`; browser canvas context types are locked on first use.
Storybook examples key their supplied canvases by renderer for the same reason.

Further boundaries can be introduced incrementally: more independent effect
entries, shared renderer batching/texture ownership, and browser visual tests.
