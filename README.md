# Particular

An opinionated particle engine: pretty defaults, performant, minimal setup. React and vanilla.

## Install

```bash
npm install particular
```

## Quick start

### React

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

The canvas is full-viewport and click-through by default. Use any preset: `"magic"`, `"confetti"`, or `"fireworks"`.

### Vanilla (no build)

```html
<canvas id="particles"></canvas>
<script src="https://unpkg.com/particular/dist/particular.global.js"></script>
<script>
  window.Particular.createParticles({
    canvas: document.getElementById("particles"),
    preset: "magic",
    renderer: "webgl",
    autoClick: true
  });
</script>
```

---

## More

- **[Embeds & API](docs/EMBEDS_AND_API.md)** — Script-tag options, HOC, direct API, presets list, custom icons, configuration.
- **[Debug & development](docs/DEBUG_AND_DEV.md)** — FPS overlay, Storybook, dev commands, examples.
- **Contributing:** [QUICKSTART.md](QUICKSTART.md) to run the repo; [SETUP.md](SETUP.md) for full dev environment.

---

## TypeScript & browsers

TypeScript types are included. Supports modern browsers with Canvas API (Chrome, Firefox, Safari, Edge).

## License

MIT © Niilo Säämänen
