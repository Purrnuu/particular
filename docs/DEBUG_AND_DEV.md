# Debug & development

FPS overlay, Storybook, and development workflow. For setup and API see the main [README](../README.md) and [Embeds & API](EMBEDS_AND_API.md).

---

## FPS overlay (performance)

Shows live FPS and optionally particle count to tune effect density.

**Vanilla / `createParticles`:**

```ts
import { createParticles, showFPSOverlay } from "particular";

const controller = createParticles({ canvas, preset: "magic" });
const fps = showFPSOverlay({
  getParticleCount: () => controller.engine.getCount(),
});
// When done: fps.destroy();
```

**React / `useParticles`:**

```tsx
const { controller } = useParticles({ preset: "magic" });
useEffect(() => {
  if (!controller?.engine) return;
  const { destroy } = showFPSOverlay({
    getParticleCount: () => controller.engine.getCount(),
  });
  return destroy;
}, [controller]);
```

Options: `container` (parent element), `getParticleCount`, `smoothing` (frame samples). Overlay is fixed top-right and can be removed with the returned `destroy()`.

---

## Storybook

- **Run:** `npm run storybook`
- **FPS toggle:** Bottom-left “FPS” button in the preview to show/hide the FPS overlay.
- Stories: `src/Particular.stories.tsx`, `src/Presets.stories.tsx`.

---

## Development commands

| Command           | Description        |
|-------------------|--------------------|
| `nvm use`         | Use Node from `.nvmrc` |
| `npm install`     | Install dependencies   |
| `npm run storybook` | Start Storybook     |
| `npm run build:lib` | Build library (ESM, CJS, IIFE, types) |
| `npm run build`   | Library + Storybook static build |
| `npm test`        | Run Vitest          |
| `npm run type-check` | TypeScript check |
| `npm run lint`    | ESLint              |

**Quick start:** [QUICKSTART.md](../QUICKSTART.md)  
**Full setup (NVM, etc.):** [SETUP.md](../SETUP.md)

---

## Examples

Runnable apps under `examples/`:

- **examples/vanilla** — Global script + `createParticles` + optional click burst
- **examples/react** — Vite app with `useParticles`

See `examples/README.md` for run commands.
