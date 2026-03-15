# Particular

An opinionated particle engine: pretty defaults, performant, minimal setup. Canvas 2D + WebGL2, React and vanilla.

## Install

```bash
npm install particular
```

## Quick start

### React — Click Burst

```tsx
import { useParticles } from "particular";

function App() {
  const { canvasRef, canvasStyle, burstFromEvent } = useParticles({
    preset: "magic",
    renderer: "webgl",
  });

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
import { createParticles } from "particular";

function TextParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const controller = createParticles({
      canvas: canvasRef.current,
      preset: "imageText",
      renderer: "webgl",
      autoResize: true,
    });

    controller.textToParticles("Hello", {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: Math.min(window.innerWidth * 0.8, 800),
    });
    controller.addMouseForce({ track: true, strength: 3, radius: 80 });

    return () => controller.destroy();
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0 }} />;
}
```

### React — Image to Particles

```tsx
import { useRef, useEffect } from "react";
import { createParticles } from "particular";

function ImageParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const controller = createParticles({
      canvas: canvasRef.current,
      preset: "imageShape",
      renderer: "webgl",
      autoResize: true,
    });

    controller.imageToParticles({
      image: "/logo.png", // URL, imported asset, or data URI
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 500,
    });
    controller.addMouseForce({ track: true, strength: 3, radius: 80 });

    return () => controller.destroy();
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0 }} />;
}
```

### React — Screensaver

```tsx
import { useScreensaver } from "particular";

function Snow() {
  const { canvasRef, canvasStyle } = useScreensaver({
    preset: "snow",
    renderer: "webgl",
  });

  return <canvas ref={canvasRef} style={canvasStyle} />;
}
```

### Vanilla — Click Burst

```html
<canvas id="particles"></canvas>
<script src="https://unpkg.com/particular/dist/particular.global.js"></script>
<script>
  const { createParticles } = window.Particular;

  const particles = createParticles({
    canvas: document.getElementById("particles"),
    preset: "magic",
    renderer: "webgl",
    autoResize: true,
  });

  particles.attachClickBurst(document);
</script>
```

### Vanilla — Text to Particles

```html
<canvas id="particles" style="position:fixed;inset:0"></canvas>
<script src="https://unpkg.com/particular/dist/particular.global.js"></script>
<script>
  const { createParticles } = window.Particular;

  const controller = createParticles({
    canvas: document.getElementById("particles"),
    preset: "imageText",
    renderer: "webgl",
    autoResize: true,
  });

  controller.textToParticles("Hello", {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    width: Math.min(window.innerWidth * 0.8, 800),
  });

  controller.addMouseForce({ track: true, strength: 3, radius: 80 });
</script>
```

### Vanilla — Image to Particles

```html
<canvas id="particles" style="position:fixed;inset:0"></canvas>
<script src="https://unpkg.com/particular/dist/particular.global.js"></script>
<script>
  const { createParticles } = window.Particular;

  const controller = createParticles({
    canvas: document.getElementById("particles"),
    preset: "imageShape",
    renderer: "webgl",
    autoResize: true,
  });

  controller.imageToParticles({
    image: "/logo.png",
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    width: 500,
    shape: "circle", // or "square", "triangle"
  });

  controller.addMouseForce({ track: true, strength: 3, radius: 80 });
</script>
```

### Vanilla — Screensaver

```html
<canvas id="particles" style="position:fixed;inset:0"></canvas>
<script src="https://unpkg.com/particular/dist/particular.global.js"></script>
<script>
  const { startScreensaver } = window.Particular;

  startScreensaver({
    canvas: document.getElementById("particles"),
    preset: "snow",
    renderer: "webgl",
    autoResize: true,
  });
</script>
```

## Presets

| Name | Type | Description |
|------|------|-------------|
| `"magic"` | Burst | Soft trailing circles with cool blue palette |
| `"confetti"` | Burst | Playful square confetti with muted colors |
| `"fireworks"` | Burst | Energetic additive circles with bright bloom |
| `"fireworksDetonation"` | Burst | Narrow launch that auto-explodes into sub-bursts |
| `"snow"` | Ambient | Gentle snowfall drifting across the viewport |
| `"meteors"` | Ambient | Bright diagonal streaks with glowing trails |
| `"imageText"` | Image | Tuned for text rendered as particle grid |
| `"imageShape"` | Image | Tuned for images/icons rendered as particle grid |

## Controller API

`createParticles()` and `useParticles()` return a controller with:

| Method | Description |
|--------|-------------|
| `burst({ x, y })` | Emit a particle burst at screen coordinates |
| `scatter({ velocity })` | Scatter all particles with random impulse |
| `explode()` | Explode all particles into child fragments |
| `imageToParticles({ image, x, y, width })` | Convert an image to an interactive particle grid |
| `textToParticles(text, { x, y, width })` | Convert text to an interactive particle grid |
| `addMouseForce({ track, strength, radius })` | Add mouse-driven push force |
| `addAttractor({ x, y, strength, radius })` | Add a gravity attractor point |
| `attachClickBurst(target)` | Auto-burst on click events |
| `destroy()` | Clean up all resources and listeners |

Image/text particles have spring physics — they return to their home positions after being pushed. Press E (in the examples) to scatter them.

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
