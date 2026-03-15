import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useParticles,
  useScreensaver,
  createParticles,
  createHeartImage,
  canvasToDataURL,
} from "particular";

// ── Shared Styles ────────────────────────────────────────────────────────────

const pageStyle = {
  minHeight: "100vh",
  background: "#0b1020",
  color: "#fff",
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
};

const navStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 20000,
  display: "flex",
  gap: 4,
  padding: 12,
  background: "rgba(11,16,32,0.85)",
  backdropFilter: "blur(8px)",
  flexWrap: "wrap",
};

const btnStyle = (active) => ({
  fontSize: "0.85rem",
  padding: "6px 14px",
  borderRadius: 8,
  border: active ? "1px solid #4a6cc0" : "1px solid #2e3552",
  background: active ? "#2a4080" : "#121a33",
  color: "#fff",
  cursor: "pointer",
});

const hintStyle = {
  textAlign: "center",
  pointerEvents: "none",
  userSelect: "none",
  opacity: 0.5,
  color: "#fff",
  paddingTop: "85vh",
};

// ── Demo 1: Click Burst (useParticles hook) ──────────────────────────────────

function BurstDemo() {
  const { canvasRef, canvasStyle, burstFromEvent } = useParticles({
    preset: "magic",
    renderer: "webgl",
  });

  return (
    <>
      <canvas ref={canvasRef} style={canvasStyle} />
      <div style={{ ...pageStyle, display: "grid", placeItems: "center", paddingTop: 60 }}>
        <div style={{ textAlign: "center" }}>
          <h2>Click Burst</h2>
          <p style={{ opacity: 0.6, margin: "8px 0 24px" }}>Click anywhere for particle bursts</p>
          <button onClick={burstFromEvent} style={btnStyle(false)}>
            Or click this button
          </button>
        </div>
      </div>
    </>
  );
}

// ── Demo 2: Screensaver (useScreensaver hook) ───────────────────────────────

function ScreensaverDemo() {
  const { canvasRef, canvasStyle } = useScreensaver({
    preset: "snow",
    renderer: "webgl",
  });

  return (
    <>
      <canvas ref={canvasRef} style={canvasStyle} />
      <div style={{ ...pageStyle, display: "grid", placeItems: "center", paddingTop: 60 }}>
        <div style={{ textAlign: "center" }}>
          <h2>Snowfall Screensaver</h2>
          <p style={{ opacity: 0.6 }}>Move your mouse to push snowflakes</p>
        </div>
      </div>
    </>
  );
}

// ── Demo 3: Text → Particles (createParticles + textToParticles) ─────────────

function TextDemo() {
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: "imageText",
      renderer: "webgl",
      autoResize: true,
    });
    controllerRef.current = controller;

    controller.textToParticles("Particular", {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: Math.min(window.innerWidth * 0.8, 800),
    });

    controller.addMouseForce({ track: true, strength: 3, radius: 80 });

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "e" || e.key === "E") controllerRef.current?.scatter({ velocity: 12 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10000 }}
      />
      <div style={pageStyle}>
        <p style={hintStyle}>Move mouse to push particles &middot; Press E to scatter</p>
      </div>
    </>
  );
}

// ── Demo 4: Image → Particles (createParticles + imageToParticles) ───────────

function ImageDemo() {
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: "imageShape",
      renderer: "webgl",
      autoResize: true,
    });
    controllerRef.current = controller;

    const size = Math.min(window.innerWidth, window.innerHeight) * 0.6;
    controller.imageToParticles({
      image: canvasToDataURL(createHeartImage(400)),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size,
      shape: "circle",
    });

    controller.addMouseForce({ track: true, strength: 3, radius: 80 });

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "e" || e.key === "E") controllerRef.current?.scatter({ velocity: 12 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10000 }}
      />
      <div style={pageStyle}>
        <p style={hintStyle}>Move mouse to push particles &middot; Press E to scatter</p>
      </div>
    </>
  );
}

// ── App: Tab Navigation ──────────────────────────────────────────────────────

const demos = [
  { id: "burst", label: "Click Burst", component: BurstDemo },
  { id: "screensaver", label: "Screensaver", component: ScreensaverDemo },
  { id: "text", label: "Text \u2192 Particles", component: TextDemo },
  { id: "image", label: "Image \u2192 Particles", component: ImageDemo },
];

export default function App() {
  const [active, setActive] = useState("burst");
  const ActiveDemo = demos.find((d) => d.id === active)?.component || BurstDemo;

  return (
    <>
      <nav style={navStyle}>
        {demos.map((d) => (
          <button key={d.id} onClick={() => setActive(d.id)} style={btnStyle(d.id === active)}>
            {d.label}
          </button>
        ))}
      </nav>
      <ActiveDemo key={active} />
    </>
  );
}
