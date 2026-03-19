import React, { useEffect, useRef, useCallback } from "react";
import {
  createParticles,
  startScreensaver,
  createHeartImage,
  canvasToDataURL,
  configureParticle,
  Emitter,
  Vector,
  presets,
  colorPalettes,
  particlesContainerLayerStyle,
} from "particular";
import vikingPng from "../../../src/icons/viking.png";
import viking2Png from "../../../src/icons/viking_2.png";
import woltLogoSvg from "../../../src/icons/woltLogo.svg";

/* ─── Shared Styles ─── */

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

const bodyStyle = {
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

/* ─── Palettes ─── */

const subtleSnowColors = colorPalettes.ash;
const mutedRiverColors = colorPalettes.slate;

/* ─── Responsive CSS (injected once) ─── */

const RESPONSIVE_CSS = `
.showcase-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  pointer-events: none;
}
.showcase-hero-section {
  height: 100vh;
  height: 100dvh;
}
.showcase-section-heading {
  font-size: 1.8rem;
}
@media (max-width: 768px) {
  .showcase-features-grid { grid-template-columns: repeat(2, 1fr); }
  .showcase-section-heading { font-size: 1.4rem; }
}
@media (max-width: 480px) {
  .showcase-features-grid { grid-template-columns: 1fr; }
  .showcase-section-heading { font-size: 1.2rem; }
}
.showcase-demos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 900px) {
  .showcase-demos-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .showcase-demos-grid { grid-template-columns: 1fr; }
}
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "showcase-responsive-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, [css]);
}

/* ─── Demo card shared styles ─── */

const demoCellStyle = {
  position: "relative",
  height: 280,
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 16,
  cursor: "pointer",
};

const DemoLabel = ({ title, desc }) => (
  <div style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "12px 16px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
    zIndex: 10001,
    pointerEvents: "none",
  }}>
    <div style={{ ...headingStyle, fontSize: "0.85rem", marginBottom: 2 }}>{title}</div>
    <div style={{ ...bodyStyle, fontSize: "0.75rem" }}>{desc}</div>
  </div>
);

/* ─── Demo: Click Burst (rotating palettes) ─── */

const burstPalettes = [
  { colors: colorPalettes.orange, glow: "#ff9500" },
  { colors: colorPalettes.magic, glow: "#74c0fc" },
  { colors: colorPalettes.emerald, glow: "#1edd80" },
  { colors: colorPalettes.rose, glow: "#ff6b81" },
  { colors: colorPalettes.gold, glow: "#ffcc66" },
  { colors: colorPalettes.violet, glow: "#9775fa" },
];

function BurstDemo() {
  const ref = useRef(null);
  const ctrlRef = useRef(null);
  const paletteIdx = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      preset: "magic",
      config: {
        maxCount: 200,
        zIndex: 1,
        sizeMin: 2,
        sizeMax: 7,
        spawnDepth: 100,
        camera: {
          fov: 50,
          position: { x: 0, y: 0, z: 300 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
      renderer: "webgl3d",
      autoResize: true,
    });
    ctrlRef.current = ctrl;
    return () => { ctrl.destroy(); ctrlRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={demoCellStyle} onClick={(e) => {
      const palette = burstPalettes[paletteIdx.current % burstPalettes.length];
      paletteIdx.current++;
      ctrlRef.current?.burst({
        x: e.clientX,
        y: e.clientY,
        colors: palette.colors,
        glowColor: palette.glow,
      });
    }}>
      <DemoLabel title="Click Burst" desc="Click for magic" />
    </div>
  );
}

/* ─── Demo: Meteors ─── */

function MeteorDemo() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const screensaver = startScreensaver({
      container: el,
      preset: "meteors",
      config: {
        maxCount: 40,
        rate: 0.25,
        shape: "star",
        sizeMin: 2,
        sizeMax: 5,
        particleLife: 200,
        velocity: Vector.fromAngle(95, 2),
        spread: Math.PI * 0.08,
        trailLength: 10,
        zIndex: 1,
      },
      renderer: "webgl",
      autoResize: true,
      mouseWind: { strength: 0.3, radius: 80 },
    });
    return () => screensaver.destroy();
  }, []);

  return (
    <div ref={ref} style={demoCellStyle}>
      <DemoLabel title="Meteors" desc="Tiny shooting stars" />
    </div>
  );
}

/* ─── Demo: Image Shatter ─── */

function ShatterDemo() {
  const ref = useRef(null);
  const ctrlRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      config: { maxCount: 200, continuous: true, zIndex: 1 },
      renderer: "webgl",
      autoResize: true,
    });
    ctrlRef.current = ctrl;

    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight;
      const maxW = el.clientWidth * 0.55;
      const maxH = el.clientHeight * 0.55;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) { h = maxH; w = h * aspect; }

      ctrl.shatterImage({
        image: viking2Png,
        width: w,
        height: h,
        chunkCount: 20,
        jitter: 0.35,
        homeConfig: { springStrength: 0.06, springDamping: 0.85, returnNoise: 0.2 },
      }).then(() => { readyRef.current = true; });
    };
    img.src = viking2Png;

    return () => { ctrl.destroy(); ctrlRef.current = null; readyRef.current = false; };
  }, []);

  return (
    <div
      ref={ref}
      style={demoCellStyle}
      onMouseEnter={() => {
        if (!ctrlRef.current || !readyRef.current) return;
        ctrlRef.current.scatter({ velocity: 4, rotation: 2 });
        ctrlRef.current.startWobble({ track: ref.current });
      }}
      onMouseLeave={() => ctrlRef.current?.stopWobble()}
    >
      <DemoLabel title="Image Shatter" desc="Hover to shatter" />
    </div>
  );
}

/* ─── Demo: Logo Particles ─── */

function LogoDemo() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      preset: "imageText",
      config: { maxCount: 5000, continuous: true, zIndex: 1 },
      renderer: "webgl",
      autoResize: true,
    });
    ctrl.imageToParticles({
      image: woltLogoSvg,
      resolution: 200,
      shape: "circle",
    });
    ctrl.addMouseForce({ track: true, strength: 2, radius: 50 });
    return () => ctrl.destroy();
  }, []);

  return (
    <div ref={ref} style={demoCellStyle}>
      <DemoLabel title="Logo Particles" desc="Interactive mouse force" />
    </div>
  );
}

/* ─── Demo: Container Glow ─── */

function GlowDemo() {
  const ref = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const ctrl = createParticles({
      container: el,
      config: { maxCount: 100, continuous: true, zIndex: 1 },
      renderer: "webgl",
      autoResize: true,
    });
    ctrl.addContainerGlow({ element: inner });
    return () => ctrl.destroy();
  }, []);

  return (
    <div ref={ref} style={demoCellStyle}>
      <div ref={innerRef} style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "16px 28px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        color: "#fff",
        fontSize: "0.9rem",
        fontWeight: 600,
        pointerEvents: "none",
        zIndex: 1,
      }}>
        Glowing
      </div>
      <DemoLabel title="Container Glow" desc="Particle halo" />
    </div>
  );
}

/* ─── Demo: Image Particles (scatter intro + mouse + triangles) ─── */

function ScatterDemo() {
  const ref = useRef(null);
  const ctrlRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      preset: "imageText",
      config: { maxCount: 4000, continuous: true, zIndex: 1 },
      renderer: "webgl",
      autoResize: true,
    });
    ctrlRef.current = ctrl;

    ctrl.imageToParticles({
      image: vikingPng,
      height: el.clientHeight * 0.6,
      resolution: 150,
      shape: "triangle",
      intro: { mode: "scatter", duration: 1000 },
    });
    ctrl.addMouseForce({ track: true, strength: 2, radius: 50 });

    return () => { ctrl.destroy(); ctrlRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={demoCellStyle} onClick={() => {
      ctrlRef.current?.scatter({ velocity: 8, rotation: 3 });
    }}>
      <DemoLabel title="Image Particles" desc="Click to scatter" />
    </div>
  );
}

/* ─── Demo: River (full-width, particles flow around inner card) ─── */

function RiverDemo() {
  const ref = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const ctrl = createParticles({
      container: el,
      preset: "river",
      config: { maxCount: 200, continuous: true, zIndex: 1 },
      renderer: "webgl",
      autoResize: true,
    });

    const pr = ctrl.engine.pixelRatio;
    const w = el.clientWidth / pr;
    const h = el.clientHeight / pr;

    const riverConfig = configureParticle({
      ...presets.Ambient.river,
      rate: 2,
      velocity: Vector.fromAngle(0, 1.2),
      sizeMin: 0.5,
      sizeMax: 2.5,
      particleLife: 250,
      fadeTime: 80,
      glow: true,
      glowSize: 6,
      glowAlpha: 0.2,
      trail: true,
      trailLength: 5,
      trailFade: 0.5,
      trailShrink: 0.45,
      colors: mutedRiverColors,
    });
    const emitter = new Emitter({
      point: new Vector(0, h / 2),
      ...riverConfig,
      spawnWidth: 0,
      spawnHeight: h * 0.6,
      icons: [],
    });
    ctrl.engine.addEmitter(emitter);
    emitter.isEmitting = true;
    emitter.emit();

    const curve = [
      { x: 0.20, y: h * 0.35 },
      { x: 0.45, y: h * 0.65 },
      { x: 0.70, y: h * 0.35 },
      { x: 0.90, y: h * 0.55 },
    ];
    for (const pt of curve) {
      ctrl.addAttractor({ x: w * pt.x, y: pt.y, strength: 0.15, radius: w * 0.3 });
    }

    const boundary = ctrl.addBoundary({ element: inner, strength: -2, radius: 15 });
    ctrl.addMouseForce({ track: true, strength: 1.5, radius: 60 });

    return () => { boundary.destroy(); ctrl.destroy(); };
  }, []);

  return (
    <div ref={ref} style={{
      position: "relative",
      height: 200,
      background: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: 16,
    }}>
      <div ref={innerRef} style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "14px 24px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        color: "rgba(255,255,255,0.5)",
        fontSize: "0.85rem",
        fontWeight: 600,
        pointerEvents: "none",
        zIndex: 1,
        whiteSpace: "nowrap",
      }}>
        Particles flow around elements
      </div>
    </div>
  );
}

/* ─── Main Showcase ─── */

export default function App() {
  useInjectStyles(RESPONSIVE_CSS);
  const containerRef = useRef(null);
  const snowCanvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const fireworksCanvasRef = useRef(null);
  const ctaContainerRef = useRef(null);
  const ctaBadgeRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const galleryHeadingRef = useRef(null);
  const galleryCtrlRef = useRef(null);
  const cardRefs = useRef([]);
  const snowControllerRef = useRef(null);
  const textControllerRef = useRef(null);
  const firedFireworksRef = useRef(false);
  let cardIndex = 0;

  const setCardRef = useCallback((index) => (el) => {
    if (el) cardRefs.current[index] = el;
  }, []);

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
        maxCount: 800,
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

    // Mouse trail
    screensaver.controller.addMouseTrail({
      target: container,
      rate: 1,
      sizeMin: 0.8,
      sizeMax: 2.5,
      particleLife: 35,
      fadeTime: 20,
      velocity: 0.8,
      spread: 0.5,
      colors: colorPalettes.fairy,
      glow: true,
      glowSize: 6,
      glowAlpha: 0.25,
      glowColor: "#b197fc",
      blendMode: "normal",
      trail: false,
      minSpeed: 0.8,
    });

    return () => {
      screensaver.destroy();
      snowControllerRef.current = null;
    };
  }, []);

  // Boundaries — snow flows around feature cards only (first 6)
  useEffect(() => {
    const ctrl = snowControllerRef.current;
    if (!ctrl) return;

    const featureCount = 6;
    const timer = setTimeout(() => {
      for (let i = 0; i < featureCount; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        ctrl.addBoundary({ element: card, strength: -1.5, radius: 10 });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Text particles — hero
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

  // Fireworks — scroll to bottom (3D)
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: "fireworks3d",
      config: {
        maxCount: 2000,
        continuous: false,
        autoStart: false,
        camera: {
          fov: 60,
          position: { x: 0, y: -200, z: 600 },
          target: { x: 0, y: 100, z: 0 },
        },
      },
      renderer: "webgl3d",
      autoResize: true,
    });

    // Restore absolute positioning — createParticles sets position:fixed for non-container canvases
    canvas.style.position = "absolute";
    canvas.style.inset = "auto";
    canvas.style.bottom = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "0";

    const onScroll = () => {
      if (firedFireworksRef.current) return;
      const scrollBottom = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= totalHeight - 150) {
        firedFireworksRef.current = true;
        const pr = controller.engine.pixelRatio;
        const w = window.innerWidth / pr;
        const h = window.innerHeight / pr;

        const fwConfig = configureParticle({
          ...presets.Burst3D.fireworks3d,
          rate: 1,
          life: 5,
        });

        const wave1 = [0.3, 0.42, 0.5, 0.58, 0.7];
        const wave2 = [0.35, 0.45, 0.55, 0.65];
        const wave3 = [0.38, 0.5, 0.62];

        wave1.forEach((xFrac, i) => {
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
          }, i * 300);
        });

        wave2.forEach((xFrac, i) => {
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
          }, 1800 + i * 350);
        });

        wave3.forEach((xFrac, i) => {
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
          }, 3400 + i * 400);
        });

        setTimeout(() => { firedFireworksRef.current = false; }, 10000);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      controller.destroy();
    };
  }, []);

  // CTA container glow
  useEffect(() => {
    const container = ctaContainerRef.current;
    const badge = ctaBadgeRef.current;
    if (!container || !badge) return;

    const ctrl = createParticles({
      container,
      config: { maxCount: 80, continuous: true, zIndex: 1 },
      renderer: "webgl",
      autoResize: true,
    });
    ctrl.addContainerGlow({
      element: badge,
      colors: colorPalettes.amber,
      rate: 0.6,
      sizeMin: 0.5,
      sizeMax: 2,
      particleLife: 50,
      fadeTime: 25,
      velocity: 0.5,
      spread: 0.4,
      shape: "sparkle",
      glow: true,
      glowColor: "#ff9500",
      glowAlpha: 0.35,
      glowSize: 8,
      blendMode: "additive",
    });
    return () => ctrl.destroy();
  }, []);

  // Gallery section controller — for easter egg
  useEffect(() => {
    const section = gallerySectionRef.current;
    if (!section) return;
    const ctrl = createParticles({
      container: section,
      config: { maxCount: 3000, continuous: true, zIndex: 2 },
      renderer: "webgl",
      autoResize: true,
    });
    galleryCtrlRef.current = ctrl;
    return () => { ctrl.destroy(); galleryCtrlRef.current = null; };
  }, []);

  const handleGalleryHeadingClick = useCallback(() => {
    const ctrl = galleryCtrlRef.current;
    const heading = galleryHeadingRef.current;
    if (!ctrl || !heading || heading.style.visibility === "hidden") return;
    ctrl.elementToParticles(heading, {
      shape: "triangle",
      resolution: 400,
      intro: { mode: "ripple", duration: 600 },
    }).then(() => {
      ctrl.addMouseForce({ track: true, strength: 2, radius: 60 });
    });
  }, []);

  // Click title to scatter hero text
  const handleTitleClick = useCallback(() => {
    textControllerRef.current?.scatter({ velocity: 15, rotation: 8 });
  }, []);

  // E to scatter hero text
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "e" || e.key === "E") textControllerRef.current?.scatter({ velocity: 12 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const features = [
    { icon: "\uD83C\uDFA8", title: "Beautiful by Default", body: "Curated presets and smart defaults that look stunning out of the box. Zero config required." },
    { icon: "\u26A1", title: "Lightning Fast", body: "WebGL2 instanced rendering pushes thousands of particles at 60fps with minimal overhead." },
    { icon: "\uD83D\uDDE8\uFE0F", title: "Text & Image to Particles", body: "Dissolve any text or image into thousands of particles that spring back together." },
    { icon: "\uD83E\uDDE9", title: "Shatter & Scatter", body: "Break images into polygon chunks or scatter particles outward, then reassemble." },
    { icon: "\uD83D\uDCE6", title: "Container Aware", body: "Turn any DOM element into an effect container. Particles flow around and inside elements automatically." },
    { icon: "\uD83D\uDD2E", title: "Interactive Effects", body: "Mouse forces, hover reactions, click bursts, and wobble physics respond to user input." },
  ];

  const steps = [
    { num: "01", title: "Install", body: "npm install particular \u2014 zero dependencies, tree-shakeable." },
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

      {/* Hero */}
      <section
        className="showcase-hero-section"
        style={{ position: "relative", zIndex: 1, textAlign: "center", pointerEvents: "none", userSelect: "none" }}
      >
        {/* Clickable area over the "Particular" text particles — click to explode */}
        <div
          onClick={handleTitleClick}
          style={{
            position: "absolute",
            top: "28vh",
            left: "10%",
            right: "10%",
            height: "20vh",
            pointerEvents: "auto",
            cursor: "pointer",
            zIndex: 2,
          }}
        />
        <div style={{ paddingTop: "58vh" }}>
          <p style={{ ...sectionSubStyle, fontSize: "1.1rem", margin: "0 auto 20px" }}>
            Turn text, images, and DOM elements into interactive particles.
            <br />
            Beautiful by default. Lightning fast. Zero config.
          </p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>
            Click the title or move mouse to push particles
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>
          Scroll down
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="showcase-section-heading" style={sectionHeadingStyle}>What it does</h2>
          <p style={{ ...sectionSubStyle, margin: "0 auto" }}>
            Everything you need to bring interfaces to life with particles.
          </p>
        </div>
        <div className="showcase-features-grid">
          {features.map((feat, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>{feat.icon}</div>
              <div style={headingStyle}>{feat.title}</div>
              <div style={bodyStyle}>{feat.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Gallery */}
      <section ref={gallerySectionRef} style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            ref={galleryHeadingRef}
            className="showcase-section-heading"
            style={{ ...sectionHeadingStyle, cursor: "pointer" }}
            onClick={handleGalleryHeadingClick}
          >
            Interactive Gallery
          </h2>
          <p style={{ ...sectionSubStyle, margin: "0 auto" }}>
            Click, hover, and play with every effect.
          </p>
        </div>
        <div className="showcase-demos-grid">
          <BurstDemo />
          <MeteorDemo />
          <ShatterDemo />
          <LogoDemo />
          <GlowDemo />
          <ScatterDemo />
        </div>
        <div style={{ marginTop: 20 }}>
          <RiverDemo />
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaContainerRef} style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
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
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2 className="showcase-section-heading" style={{ ...sectionHeadingStyle, fontSize: "1.5rem" }}>
            Ready to add particles to your project?
          </h2>
          <p style={{ ...sectionSubStyle, margin: "0 auto 24px" }}>
            Get started in under a minute with our React hooks or vanilla API.
          </p>
          <div
            ref={ctaBadgeRef}
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
          <h2 className="showcase-section-heading" style={sectionHeadingStyle}>Three Steps</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, pointerEvents: "none" }}>
          {steps.map((step, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "rgba(116, 192, 252, 0.35)", flexShrink: 0, width: 56, textAlign: "center" }}>
                {step.num}
              </div>
              <div>
                <div style={headingStyle}>{step.title}</div>
                <div style={bodyStyle}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.85rem" }}>
          Particles flow around every element on this page.
        </p>
      </section>

      {/* Fireworks canvas — pinned to bottom of page, behind content, viewport-height for 3D camera */}
      <canvas ref={fireworksCanvasRef} style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }} />
    </div>
  );
}
