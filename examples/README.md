# Examples

## 1) Vanilla (standalone global bundle)

Single-page showcase using `dist/particular.global.js` directly — no build step. Includes hero text particles, snow screensaver, mouse trail, interactive gallery (click burst, meteors, shatter, text, glow, scatter, river), CTA glow, scroll-triggered fireworks, and an easter egg.

```bash
npm run example:vanilla
```

Open: `http://localhost:8080/examples/vanilla/index.html`

## 2) React app (library import)

Same showcase as the vanilla example, built as a Vite + React app that imports `particular` via `file:../..`. Demonstrates all the same effects using React refs and useEffect hooks.

```bash
npm run example:react
```

Open the Vite URL shown in terminal (usually `http://localhost:5173`).
