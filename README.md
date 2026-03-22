# Particular

An opinionated particle engine: pretty defaults, performant, minimal setup. Canvas 2D + WebGL2, React and vanilla.

## Install

```bash
npm install @purrnuu/particular
```

## Quick start

### React — Click Burst

```tsx
import { useParticles } from "@purrnuu/particular";

function App() {
  const { canvasRef, canvasStyle, burstFromEvent } = useParticles();

  return (
    <>
      <canvas ref={canvasRef} style={canvasStyle} />
      <button onClick={burstFromEvent}>Click for particles</button>
    </>
  );
}
```

### React — Text to Particles

```tsx
import { useRef, useEffect } from "react";
import { createParticles } from "@purrnuu/particular";

function TextParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = createParticles({
      container: containerRef.current!,
      preset: "imageText",
      mouseForce: { strength: 3, radius: 80 },
    });

    controller.textToParticles("Hello");

    return () => controller.destroy();
  }, []);

  return <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh" }} />;
}
```

### React — Image to Particles

```tsx
import { useRef, useEffect } from "react";
import { createParticles } from "@purrnuu/particular";

function ImageParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = createParticles({
      container: containerRef.current!,
      preset: "imageShape",
      mouseForce: { strength: 3, radius: 80 },
    });

    controller.imageToParticles({
      image: "/viking.png", // URL, imported asset, or data URI
      width: 500,
    });

    return () => controller.destroy();
  }, []);

  return <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh" }} />;
}
```

### React — Screensaver

```tsx
import { useScreensaver } from "@purrnuu/particular";

function Snow() {
  const { canvasRef, canvasStyle } = useScreensaver({ preset: "snow" });

  return <canvas ref={canvasRef} style={canvasStyle} />;
}
```

### Vanilla — Click Burst

```html
<script src="https://unpkg.com/@purrnuu/particular/dist/particular.global.js"></script>
<script>
  const { createParticles } = window.Particular;

  const particles = createParticles({ preset: "magic" });
  particles.attachClickBurst(document);
</script>
```

### Vanilla — Text to Particles

```html
<div id="container" style="position:relative;width:100%;height:100vh"></div>
<script src="https://unpkg.com/@purrnuu/particular/dist/particular.global.js"></script>
<script>
  const { createParticles } = window.Particular;

  const controller = createParticles({
    container: document.getElementById("container"),
    preset: "imageText",
    mouseForce: { strength: 3, radius: 80 },
  });

  controller.textToParticles("Hello");
</script>
```

### Vanilla — Image to Particles

```html
<div id="container" style="position:relative;width:100%;height:100vh"></div>
<script src="https://unpkg.com/@purrnuu/particular/dist/particular.global.js"></script>
<script>
  const { createParticles } = window.Particular;

  const controller = createParticles({
    container: document.getElementById("container"),
    preset: "imageShape",
    mouseForce: { strength: 3, radius: 80 },
  });

  controller.imageToParticles({
    image: "/viking.png", // URL or data URI
    width: 500,
  });
</script>
```

### Vanilla — Screensaver

```html
<script src="https://unpkg.com/@purrnuu/particular/dist/particular.global.js"></script>
<script>
  const { startScreensaver } = window.Particular;

  startScreensaver({ preset: "snow" });
</script>
```

## Renderers

| Renderer | Description |
|----------|-------------|
| `"webgl"` | WebGL2 instanced rendering (default). Fast 2D particle pipeline |
| `"canvas"` | Canvas 2D fallback. Supports all shapes and effects |
| `"webgl3d"` | WebGL2 3D perspective rendering. Billboarded quads with depth sorting, camera controls, and spherical emission |

## Presets

| Name | Type | Description |
|------|------|-------------|
| `"magic"` | Burst | Glowing sparkles with soft trails, cool blue palette |
| `"confetti"` | Burst | Colorful rectangle confetti with muted colors |
| `"fireworks"` | Burst | Energetic triangles with trailing streaks |
| `"fireworksDetonation"` | Burst | Trailing triangle rockets that auto-explode into sub-bursts |
| `"images"` | Burst | Icon/image burst particles |
| `"snow"` | Ambient | Gentle snowfall drifting across the viewport |
| `"meteors"` | Ambient | Fast diagonal ring streaks with icy blue-violet trails |
| `"fireworksShow"` | Ambient | Continuous fireworks — rockets launch and auto-detonate |
| `"flock"` | Ambient | Self-organizing boids swarm, use with `addFlockingForce()` |
| `"river"` | Ambient | Horizontal water stream, designed for use with attractors |
| `"imageText"` | Image | Tuned for text rendered as particle grid |
| `"imageShape"` | Image | Tuned for images/icons rendered as particle grid |
| `"galaxySpin"` | Burst3D | Full spherical emission, continuous orbit, long trails, additive |
| `"depthField"` | Burst3D | Z-spread parallax field, gentle continuous emission |
| `"supernova"` | Burst3D | Spherical burst with dramatic detonation |
| `"fireworks3d"` | Burst3D | 3D fireworks with spherical detonation |

## Controller API

`createParticles()` and `useParticles()` return a controller with:

| Method | Description |
|--------|-------------|
| `burst({ x, y })` | Emit a particle burst at screen coordinates |
| `scatter({ velocity })` | Scatter all particles with random impulse |
| `explode()` | Explode all particles into child fragments |
| `imageToParticles({ image })` | Convert an image to an interactive particle grid |
| `textToParticles(text)` | Convert text to an interactive particle grid |
| `setIdleEffect(enabled)` | Toggle idle animations on image/text particles |
| `addMouseForce({ track, strength, radius })` | Add mouse-driven push force |
| `addFlockingForce(config?)` | Add boids flocking behavior (separation, alignment, cohesion) |
| `addAttractor({ x, y, strength, radius })` | Add a gravity attractor point |
| `addBoundary({ element })` | Create repulsion boundary around a DOM element |
| `attachClickBurst(target)` | Auto-burst on click events |
| `destroy()` | Clean up all resources and listeners |
| `camera` | Camera instance (null if not webgl3d) |
| `setCameraPosition(position, target?)` | Update camera position and optional target |
| `orbitCamera(azimuth, elevation, distance?)` | Orbit camera around target point |
| `enableOrbitControls()` | Mouse-drag orbit + scroll zoom on canvas |
| `enableAutoOrbit(speed?)` | Continuous camera orbit around target |

Image/text particles have spring physics — they return to their home positions after being pushed. Press E (in the examples) to scatter them.

### Intro Animation

Add `intro` to `imageToParticles()` or `textToParticles()` for animated particle reveals:

```js
controller.imageToParticles({ image: "/photo.png", intro: {} }); // scatter (default)
controller.imageToParticles({ image: "/photo.png", intro: { mode: "scaleIn" } }); // edges first, fills inward
controller.imageToParticles({ image: "/photo.png", intro: { mode: "ripple" } }); // center-out shockwave
```

Modes: `scatter` (particles fly in from random positions), `scaleIn` (outer edges form first from center, filling inward), `ripple` (shockwave — pushed outward, overshoot, spring back), `paint` (spray from bottom center, left-to-right).

## Smart Defaults

The library is designed for zero-config usage:

- **Renderer**: WebGL by default
- **Canvas**: Auto-created and styled when omitted — no `<canvas>` element or CSS needed
- **Image/text**: Auto-centered with sensible dimensions when `x`/`y`/`width` are omitted
- **Mouse force**: `mouseForce: true` shorthand adds tracking with sensible defaults
- **Styles**: Positioning and `pointer-events: none` applied automatically

## 3D Rendering

Use `renderer: 'webgl3d'` for 3D perspective rendering with depth, camera controls, and spherical emission. All 2D shapes work automatically as billboarded quads.

```js
import { createParticles } from "@purrnuu/particular";

const p = createParticles({
  container: document.getElementById("hero"),
  preset: "galaxySpin",
  renderer: "webgl3d",
  config: {
    camera: { fov: 60, position: { x: 0, y: 0, z: 500 } },
  },
});
p.enableOrbitControls(); // drag to orbit, scroll to zoom
```

### 3D Config Fields

| Field | Description |
|-------|-------------|
| `camera` | Camera settings: `{ fov, position, target, up, near, far }` |
| `spawnDepth` | Randomize particle z within `[-spawnDepth/2, +spawnDepth/2]` |
| `spread3d` | Spherical emission full cone angle in radians. `Math.PI` = full sphere. Uniform distribution |
| `emitDirection` | Base direction for spherical emission: `{ x, y, z }` |

## Container Mode

By default, particles render as a full-viewport overlay (`position: fixed`). To render particles inside a specific element (e.g. a scrollable section, a card, or a hero area), pass a `container`:

### React — Container-Aware

```tsx
import { useRef } from "react";
import { useParticles } from "@purrnuu/particular";

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvasRef, canvasStyle, burstFromEvent } = useParticles({
    preset: "magic",
    container: containerRef.current!,
  });

  return (
    <div ref={containerRef} style={{ position: "relative", height: 400 }}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <button onClick={burstFromEvent}>Click for particles</button>
    </div>
  );
}
```

### Vanilla — Container-Aware

```html
<div id="hero" style="position:relative;height:400px;overflow:hidden"></div>
<script src="https://unpkg.com/@purrnuu/particular/dist/particular.global.js"></script>
<script>
  const { createParticles } = window.Particular;
  const container = document.getElementById("hero");

  const particles = createParticles({
    container: container,
    preset: "magic",
  });

  particles.attachClickBurst(container);
</script>
```

The container must have `position: relative` (or `absolute`/`fixed`). The canvas auto-sizes to the container via `ResizeObserver`, and all coordinates (burst, mouse force, attractors) become container-relative.

---

## Examples

```bash
npm run example:vanilla   # Vanilla HTML — localhost:8080
npm run example:react     # React + Vite — localhost:5173
```

## More

- **[Storybook](https://purrnuu.github.io/particular/)** — Interactive demos for all effects and presets.
- **[Development setup](SETUP.md)** — NVM, Storybook, build commands, testing, IDE config.

## TypeScript & browsers

TypeScript types are included. Supports modern browsers with Canvas API (Chrome, Firefox, Safari, Edge).

## License

MIT
