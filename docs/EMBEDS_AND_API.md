# Embeds & API reference

Legacy script-tag embeds, HOC, direct API, presets, and configuration details. For the simplest setup see the main [README](../README.md).

---

## Script-tag embed (no build)

Load the global bundle and use the convenience API:

```html
<script src="https://unpkg.com/particular/dist/particular.global.js"></script>
<canvas id="particles"></canvas>
<script>
  const { createParticles } = window.Particular;
  createParticles({
    canvas: document.getElementById("particles"),
    preset: "magic",
    autoClick: true
  });
</script>
```

For a full-viewport click-through canvas, apply the shared style:

```html
<script>
  const { createParticles, particlesBackgroundLayerStyle } = window.Particular;
  const canvas = document.getElementById("particles");
  Object.assign(canvas.style, particlesBackgroundLayerStyle);
  createParticles({ canvas, preset: "magic", autoClick: true });
</script>
```

### WebGL renderer (higher performance)

Use `renderer: 'webgl'` for GPU-accelerated rendering. Requires WebGL2 support. Custom images are not supported yet (particles with icons fall back to invisible in WebGL).

```ts
createParticles({ canvas, preset: "magic", renderer: "webgl" });
```

```tsx
useParticles({ preset: "magic", renderer: "webgl" });
```

### Raw API via script tag

If you prefer the core classes instead of `createParticles`:

```html
<script src="https://unpkg.com/particular/dist/particular.global.js"></script>
<script>
  const { Particular, Emitter, CanvasRenderer, Vector, presets } = window.Particular;

  const canvas = document.getElementById('particles');
  const engine = new Particular();
  engine.initialize({ ...presets.sparkles, pixelRatio: 1 });
  engine.addRenderer(new CanvasRenderer(canvas));

  document.addEventListener('click', (e) => {
    engine.addEmitter(
      new Emitter({
        ...presets.sparkles,
        point: new Vector(e.clientX, e.clientY),
        icons: [],
      })
    );
  });
</script>
```

---

## React: HOC (ParticularWrapper / withParticles)

The hook (`useParticles`) is the recommended React API. The HOC is still supported:

```tsx
import { ParticularWrapper } from 'particular';
import type { BurstSettings } from 'particular';

const MyComponent = ({ burst }: { burst: (s: BurstSettings) => void }) => (
  <div onClick={(e) => burst({ clientX: e.clientX, clientY: e.clientY })}>
    Click for particles
  </div>
);

export default ParticularWrapper({ rate: 8, life: 30, maxCount: 300 })(MyComponent);
```

With preset and defaults only:

```tsx
import { withParticles } from 'particular';
export default withParticles()(MyComponent);
```

The HOC renders the canvas in a portal; it is already full-viewport and click-through (configurable `zIndex` in config).

---

## Direct API (no convenience layer)

For full control without `createParticles` or the hook:

```tsx
import { Particular, Emitter, CanvasRenderer, Vector } from 'particular';

const engine = new Particular();
engine.initialize({ maxCount: 300, continuous: false, pixelRatio: 2 });

const canvas = document.querySelector('canvas');
engine.addRenderer(new CanvasRenderer(canvas));

engine.addEmitter(new Emitter({
  point: new Vector(100, 100),
  rate: 8,
  life: 30,
  // ... see types for full config
}));
```

---

## Presets

Built-in presets for one-line aesthetics:

| Preset          | Style                |
|-----------------|----------------------|
| `confetti`      | Celebration          |
| `sparkles`      | Crisp sparkles       |
| `stardust`      | Soft glowing stars   |
| `fireworks`     | Bold additive burst  |
| `bubbles`       | Delicate rings       |
| `magic`         | Stars + glow         |
| `snow`          | Gentle falling       |
| `embers`        | Warm glow            |
| `confettiSharp` | Triangle confetti    |

Use with the hook: `useParticles({ preset: "stardust" })`. With HOC: `ParticularWrapper(presets.stardust)(Component)`. Override options: `{ ...presets.magic, rate: 25, maxCount: 500 }`.

---

## Background canvas (click-through)

All modes support a full-viewport canvas that doesn’t block clicks:

- **Hook**: Use the returned `canvasStyle` on `<canvas>` (default when `backgroundLayer: true`). Set `backgroundLayer: false` to position the canvas yourself.
- **Vanilla**: `Object.assign(canvas.style, particlesBackgroundLayerStyle)` or `getParticlesBackgroundLayerStyle(zIndex)` from the package.
- **HOC**: Canvas is already a click-through overlay; `zIndex` in config.

---

## Custom icons

```tsx
import { ParticularWrapper } from 'particular';
import icon1 from './icons/star.png';

export default ParticularWrapper({
  icons: [icon1],
  rate: 8,
  life: 30,
  maxCount: 300,
})(MyComponent);
```

---

## Advanced configuration

Options you can pass to presets, HOC, or `createParticles` config:

| Area    | Options |
|---------|---------|
| Emission | `rate`, `life`, `maxCount` |
| Appearance | `sizeMin`, `sizeMax`, `scaleStep`, `fadeTime`, `shape`, `blendMode`, `glow`, `glowSize` |
| Physics | `gravity`, `velocityMultiplier`, `spread` |
| Behavior | `continuous`, `autoStart`, `pixelRatio`, `zIndex` |

See TypeScript types (`ParticularConfig`, `ParticleConfig`, `FullParticularConfig`) for the full list and defaults.
