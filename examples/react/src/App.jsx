import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useParticles,
  useScreensaver,
  createParticles,
  startScreensaver,
  configureParticle,
  Emitter,
  Vector,
  presets,
  particlesContainerLayerStyle,
} from "particular";
import vikingPng from "../../../src/icons/viking.png";

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

// ── Showcase Styles ──────────────────────────────────────────────────────────

const cardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: 16,
  padding: "28px 24px",
  color: "#fff",
};

const headingStyle = {
  fontSize: "0.95rem",
  fontWeight: 600,
  marginBottom: 8,
  letterSpacing: "0.02em",
};

const bodyTextStyle = {
  fontSize: "0.82rem",
  lineHeight: 1.5,
  color: "rgba(255, 255, 255, 0.55)",
};

const sectionHeadingStyle = {
  fontSize: "1.8rem",
  fontWeight: 700,
  color: "#fff",
  marginBottom: 12,
};

const sectionSubStyle = {
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "rgba(255, 255, 255, 0.45)",
  maxWidth: 520,
};

const subtleSnowColors = ["#555566", "#606070", "#6a6a7a", "#757585", "#808090"];
const mutedRiverColors = ["#3a4a4f", "#455558", "#4f6065", "#5a6b70", "#647578"];

// ── Demo: Showcase (full landing page) ───────────────────────────────────────

function ShowcaseDemo() {
  const containerRef = useRef(null);
  const snowCanvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const riverCanvasRef = useRef(null);
  const fireworksCanvasRef = useRef(null);
  const riverDividerRef = useRef(null);
  const cardRefs = useRef([]);
  const snowControllerRef = useRef(null);
  const textControllerRef = useRef(null);
  const firedFireworksRef = useRef(false);
  let cardIndex = 0;

  const setCardRef = useCallback(
    (index) => (el) => {
      if (el) cardRefs.current[index] = el;
    },
    [],
  );

  // Snow screensaver
  useEffect(() => {
    const canvas = snowCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const screensaver = startScreensaver({
      canvas,
      container,
      preset: "snow",
      config: {
        rate: 0.6,
        maxCount: 300,
        particleLife: 1200,
        colors: subtleSnowColors,
        glow: false,
        sizeMin: 1,
        sizeMax: 3,
      },
      renderer: "webgl",
      autoResize: true,
    });

    snowControllerRef.current = screensaver.controller;

    return () => {
      screensaver.destroy();
      snowControllerRef.current = null;
    };
  }, []);

  // Boundaries — snow flows around cards
  useEffect(() => {
    const ctrl = snowControllerRef.current;
    if (!ctrl) return;

    const handles = [];
    const timer = setTimeout(() => {
      for (const card of cardRefs.current) {
        if (!card) continue;
        handles.push(ctrl.addBoundary({ element: card, strength: -1.5, radius: 10 }));
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      for (const h of handles) h.destroy();
    };
  }, []);

  // Text particles
  useEffect(() => {
    const canvas = textCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: "imageText",
      renderer: "webgl",
      autoResize: true,
    });

    textControllerRef.current = controller;

    const w = container.clientWidth;
    const heroH = window.innerHeight;

    controller.textToParticles("Particular", {
      x: w / 2,
      y: heroH * 0.38,
      width: Math.min(w * 0.75, 800),
      intro: { mode: "scatter", duration: 1200 },
    });

    controller.addMouseForce({ track: true, strength: 3, radius: 80 });

    return () => {
      controller.destroy();
      textControllerRef.current = null;
    };
  }, []);

  // River
  useEffect(() => {
    const canvas = riverCanvasRef.current;
    const container = containerRef.current;
    const divider = riverDividerRef.current;
    if (!canvas || !container || !divider) return;

    const controller = createParticles({
      canvas,
      container,
      preset: "river",
      config: { maxCount: 300 },
      renderer: "webgl",
      autoResize: true,
    });

    const pr = controller.engine.pixelRatio;
    const w = container.clientWidth / pr;
    const dividerY = divider.offsetTop / pr;

    const riverConfig = configureParticle({
      ...presets.Ambient.river,
      rate: 1.5,
      velocity: Vector.fromAngle(0, 0.8),
      sizeMin: 0.5,
      sizeMax: 2,
      particleLife: 300,
      fadeTime: 100,
      glow: false,
      trail: true,
      trailLength: 4,
      trailFade: 0.6,
      trailShrink: 0.5,
      colors: mutedRiverColors,
    });
    const riverEmitter = new Emitter({
      point: new Vector(0, dividerY),
      ...riverConfig,
      spawnWidth: 0,
      spawnHeight: 20 / pr,
      icons: [],
    });
    controller.engine.addEmitter(riverEmitter);
    riverEmitter.isEmitting = true;
    riverEmitter.emit();

    // S-curve attractors
    const curve = [
      { x: 0.2, y: dividerY - 12 / pr },
      { x: 0.4, y: dividerY + 12 / pr },
      { x: 0.6, y: dividerY - 12 / pr },
      { x: 0.8, y: dividerY + 12 / pr },
    ];
    for (const pt of curve) {
      controller.addAttractor({ x: w * pt.x, y: pt.y, strength: 0.2, radius: w * 0.35 });
    }

    // Edge repulsors
    for (let fx = 0.1; fx <= 0.9; fx += 0.2) {
      controller.addAttractor({ x: w * fx, y: dividerY - 45 / pr, strength: -0.25, radius: 40 / pr });
      controller.addAttractor({ x: w * fx, y: dividerY + 45 / pr, strength: -0.25, radius: 40 / pr });
    }

    controller.addMouseForce({ track: true, strength: 1.5, radius: 60 });

    return () => controller.destroy();
  }, []);

  // Fireworks — scroll triggered
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: "fireworksShow",
      config: { maxCount: 500, continuous: false },
      renderer: "webgl",
      autoResize: true,
    });

    const onScroll = () => {
      if (firedFireworksRef.current) return;
      const scrollBottom = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= totalHeight - 150) {
        firedFireworksRef.current = true;

        const pr = controller.engine.pixelRatio;
        const w = container.clientWidth / pr;
        const h = container.clientHeight / pr;

        const fwConfig = configureParticle({
          ...presets.Ambient.fireworksShow,
          rate: 1,
          life: 2,
        });

        [0.35, 0.55, 0.7].forEach((xFrac, i) => {
          setTimeout(() => {
            const emitter = new Emitter({
              point: new Vector(w * xFrac, h),
              ...fwConfig,
              spawnWidth: w * 0.08,
              spawnHeight: 0,
              icons: [],
            });
            controller.engine.addEmitter(emitter);
            emitter.isEmitting = true;
            emitter.emit();
          }, i * 800);
        });

        setTimeout(() => {
          firedFireworksRef.current = false;
        }, 8000);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      controller.destroy();
    };
  }, []);

  // E to scatter
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "e" || e.key === "E") textControllerRef.current?.scatter({ velocity: 12 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const features = [
    { icon: "⚡", title: "Lightning Fast", body: "WebGL2 instanced rendering pushes thousands of particles at 60fps." },
    { icon: "🎨", title: "Beautiful Defaults", body: "Curated presets that look stunning out of the box." },
    { icon: "🔧", title: "Fully Configurable", body: "Every parameter is tunable. Physics, visuals, timing." },
    { icon: "📦", title: "Tiny Bundle", body: "Tree-shakeable ESM with zero runtime dependencies." },
    { icon: "🌐", title: "Container Aware", body: "Fill the viewport or live inside any HTML element." },
    { icon: "🧲", title: "Force Fields", body: "Attractors, mouse forces, and element boundaries." },
  ];

  const steps = [
    { num: "01", title: "Install", body: "npm install particular — zero dependencies, tree-shakeable." },
    { num: "02", title: "Create", body: "One call to createParticles() or useParticles() to get started." },
    { num: "03", title: "Customize", body: "Choose a preset, add forces, boundaries, and interactions." },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #070b14 0%, #0a1628 30%, #0d1b2a 60%, #0a0a1a 100%)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      <canvas ref={snowCanvasRef} style={particlesContainerLayerStyle} />
      <canvas ref={textCanvasRef} style={particlesContainerLayerStyle} />
      <canvas ref={riverCanvasRef} style={particlesContainerLayerStyle} />
      <canvas ref={fireworksCanvasRef} style={particlesContainerLayerStyle} />

      {/* Hero */}
      <section style={{ height: "100vh", position: "relative", zIndex: 1, textAlign: "center", pointerEvents: "none", userSelect: "none" }}>
        <div style={{ paddingTop: "58vh" }}>
          <p style={{ ...sectionSubStyle, fontSize: "1.1rem", margin: "0 auto 20px" }}>
            A particle engine for the modern web.
            <br />
            Beautiful defaults, zero config, endless possibilities.
          </p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>Move mouse to push &middot; Press E to scatter</p>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>Scroll down</div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>Why Particular?</h2>
          <p style={{ ...sectionSubStyle, margin: "0 auto" }}>Everything you need for production-quality particle effects.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, pointerEvents: "none" }}>
          {features.map((feat, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>{feat.icon}</div>
              <div style={headingStyle}>{feat.title}</div>
              <div style={bodyTextStyle}>{feat.body}</div>
            </div>
          ))}
        </div>
      </section>

      <div ref={riverDividerRef} style={{ height: 1 }} />

      {/* CTA */}
      <section style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <div
          ref={setCardRef(cardIndex++)}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "48px 32px",
            textAlign: "center",
            margin: "0 auto",
            maxWidth: 700,
          }}
        >
          <h2 style={{ ...sectionHeadingStyle, fontSize: "1.5rem" }}>Ready to add particles to your project?</h2>
          <p style={{ ...sectionSubStyle, margin: "0 auto 24px" }}>Get started in under a minute with our React hooks or vanilla API.</p>
          <div
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "rgba(116, 192, 252, 0.12)",
              border: "1px solid rgba(116, 192, 252, 0.25)",
              borderRadius: 10,
              color: "#74c0fc",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            npm install particular
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: "80px 24px", maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>Three Steps</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, pointerEvents: "none" }}>
          {steps.map((step, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "rgba(116, 192, 252, 0.35)", flexShrink: 0, width: 56, textAlign: "center" }}>
                {step.num}
              </div>
              <div>
                <div style={headingStyle}>{step.title}</div>
                <div style={bodyTextStyle}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.85rem" }}>Particles flow around every element on this page.</p>
      </section>
    </div>
  );
}

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

    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    controller.imageToParticles({
      image: vikingPng,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size,
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
  { id: "showcase", label: "Showcase", component: ShowcaseDemo },
  { id: "burst", label: "Click Burst", component: BurstDemo },
  { id: "screensaver", label: "Screensaver", component: ScreensaverDemo },
  { id: "text", label: "Text \u2192 Particles", component: TextDemo },
  { id: "image", label: "Image \u2192 Particles", component: ImageDemo },
];

export default function App() {
  const [active, setActive] = useState("showcase");
  const ActiveDemo = demos.find((d) => d.id === active)?.component || ShowcaseDemo;

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
