import React, { useEffect, useRef, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createParticles, startScreensaver, presets, colorPalettes } from './index';
import type { ParticlesController, ScreensaverController, BoundaryHandle } from './index';
import type Particular from './particular/core/particular';
import Emitter from './particular/components/emitter';
import { configureParticle } from './particular/core/defaults';
import Vector from './particular/utils/vector';
import { particlesContainerLayerStyle } from './particular/canvasStyles';
import vikingPng from './icons/viking.png';
import viking2Png from './icons/viking_2.png';
import woltLogoSvg from './icons/woltLogo.svg';

/* ─── Shared Styles ─── */

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  padding: '28px 24px',
  color: '#fff',
};

const headingStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 600,
  marginBottom: 8,
  letterSpacing: '0.02em',
};

const bodyStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  lineHeight: 1.5,
  color: 'rgba(255, 255, 255, 0.55)',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#fff',
  marginBottom: 12,
};

const sectionSubStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: 'rgba(255, 255, 255, 0.45)',
  maxWidth: 520,
};

/* ─── Named palettes from presets ─── */

const subtleSnowColors = colorPalettes.ash!;
const mutedRiverColors = colorPalettes.slate!;

/* ─── Responsive CSS (injected once) — inline styles can't do media queries ─── */

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

function useInjectStyles(css: string) {
  useEffect(() => {
    const id = 'showcase-responsive-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, [css]);
}

/* ─── Pause off-screen demos to save GPU/CPU ─── */

function usePauseOffscreen(
  containerRef: React.RefObject<HTMLElement | null>,
  engineRef: React.RefObject<Particular | null>,
): void {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const engine = engineRef.current;
        if (!engine) return;
        if (entry?.isIntersecting) {
          engine.start();
        } else {
          engine.stop();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

/* ─── Demo card shared styles ─── */

const demoCellStyle: React.CSSProperties = {
  position: 'relative',
  height: 280,
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: 16,
  cursor: 'pointer',
};

const DemoLabel: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px 16px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
    zIndex: 10001,
    pointerEvents: 'none',
  }}>
    <div style={{ ...headingStyle, fontSize: '0.85rem', marginBottom: 2 }}>{title}</div>
    <div style={{ ...bodyStyle, fontSize: '0.75rem' }}>{desc}</div>
  </div>
);

/* ─── Demo: Click Burst (rotating palettes) ─── */

const burstPalettes = [
  { colors: colorPalettes.orange!, glow: '#ff9500' },
  { colors: colorPalettes.magic!, glow: '#74c0fc' },
  { colors: colorPalettes.emerald!, glow: '#1edd80' },
  { colors: colorPalettes.rose!, glow: '#ff6b81' },
  { colors: colorPalettes.gold!, glow: '#ffcc66' },
  { colors: colorPalettes.violet!, glow: '#9775fa' },
];

const BurstDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const ctrlRef = useRef<ParticlesController | null>(null);
  const engineRef = useRef<Particular | null>(null);
  const paletteIdx = useRef(0);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      preset: 'magic',
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
      renderer: 'webgl3d',
      autoResize: true,
    });
    ctrlRef.current = ctrl;
    engineRef.current = ctrl.engine;
    return () => { ctrl.destroy(); ctrlRef.current = null; engineRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={demoCellStyle} onClick={(e) => {
      const palette = burstPalettes[paletteIdx.current % burstPalettes.length]!;
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
};

/* ─── Demo: Meteors ─── */

const MeteorDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Particular | null>(null);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const screensaver = startScreensaver({
      container: el,
      preset: 'meteors',
      config: {
        maxCount: 40,
        rate: 0.25,
        shape: 'star',
        sizeMin: 2,
        sizeMax: 5,
        particleLife: 200,
        velocity: Vector.fromAngle(95, 2),
        spread: Math.PI * 0.08,
        trailLength: 10,
        zIndex: 1,
      },
      renderer: 'webgl',
      autoResize: true,
      mouseWind: { strength: 0.3, radius: 80 },
    });
    engineRef.current = screensaver.engine;
    return () => { screensaver.destroy(); engineRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={demoCellStyle}>
      <DemoLabel title="Meteors" desc="Tiny shooting stars" />
    </div>
  );
};

/* ─── Demo: Image Shatter ─── */

const ShatterDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const ctrlRef = useRef<ParticlesController | null>(null);
  const engineRef = useRef<Particular | null>(null);
  const readyRef = useRef(false);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      config: { maxCount: 200, continuous: true, zIndex: 1 },
      renderer: 'webgl',
      autoResize: true,
    });
    ctrlRef.current = ctrl;
    engineRef.current = ctrl.engine;

    // Load image first to get natural aspect ratio
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
        homeConfig: {
          springStrength: 0.06,
          springDamping: 0.85,
          returnNoise: 0.2,
        },
      }).then(() => { readyRef.current = true; });
    };
    img.src = viking2Png;

    return () => { ctrl.destroy(); ctrlRef.current = null; engineRef.current = null; readyRef.current = false; };
  }, []);

  return (
    <div
      ref={ref}
      style={demoCellStyle}
      onMouseEnter={() => {
        if (!ctrlRef.current || !readyRef.current) return;
        ctrlRef.current.scatter({ velocity: 4, rotation: 2 });
        ctrlRef.current.startWobble({ track: ref.current! });
      }}
      onMouseLeave={() => ctrlRef.current?.stopWobble()}
    >
      <DemoLabel title="Image Shatter" desc="Hover to shatter" />
    </div>
  );
};

/* ─── Demo: Wolt Logo Particles ─── */

const LogoDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Particular | null>(null);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      preset: 'imageText',
      config: { maxCount: 5000, continuous: true, zIndex: 1 },
      renderer: 'webgl',
      autoResize: true,
    });
    engineRef.current = ctrl.engine;

    ctrl.imageToParticles({
      image: woltLogoSvg,
      resolution: 200,
      shape: 'circle',
    });
    ctrl.addMouseForce({ track: true, strength: 2, radius: 50 });

    return () => { ctrl.destroy(); engineRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={demoCellStyle}>
      <DemoLabel title="Logo Particles" desc="Interactive mouse force" />
    </div>
  );
};

/* ─── Demo: Container Glow ─── */

const GlowDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Particular | null>(null);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const ctrl = createParticles({
      container: el,
      config: { maxCount: 100, continuous: true, zIndex: 1 },
      renderer: 'webgl',
      autoResize: true,
    });
    engineRef.current = ctrl.engine;
    ctrl.addContainerGlow({ element: inner });
    return () => { ctrl.destroy(); engineRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={demoCellStyle}>
      <div ref={innerRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '16px 28px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: 600,
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        Glowing
      </div>
      <DemoLabel title="Container Glow" desc="Particle halo" />
    </div>
  );
};

/* ─── Demo: Image Particles (scatter intro + mouse + triangles) ─── */

const ScatterDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const ctrlRef = useRef<ParticlesController | null>(null);
  const engineRef = useRef<Particular | null>(null);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = createParticles({
      container: el,
      preset: 'imageText',
      config: { maxCount: 4000, continuous: true, zIndex: 1 },
      renderer: 'webgl',
      autoResize: true,
    });
    ctrlRef.current = ctrl;
    engineRef.current = ctrl.engine;

    ctrl.imageToParticles({
      image: vikingPng,
      height: el.clientHeight * 0.6,
      resolution: 150,
      shape: 'triangle',
      intro: { mode: 'scatter', duration: 1000 },
    });
    ctrl.addMouseForce({ track: true, strength: 2, radius: 50 });

    return () => { ctrl.destroy(); ctrlRef.current = null; engineRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={demoCellStyle} onClick={() => {
      ctrlRef.current?.scatter({ velocity: 8, rotation: 3 });
    }}>
      <DemoLabel title="Image Particles" desc="Click to scatter" />
    </div>
  );
};

/* ─── Demo: River (full-width, particles flow around inner card) ─── */

const RiverDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Particular | null>(null);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const ctrl = createParticles({
      container: el,
      preset: 'river',
      config: { maxCount: 200, continuous: true, autoStart: false, zIndex: 1 },
      renderer: 'webgl',
      autoResize: true,
    });
    engineRef.current = ctrl.engine;

    const pr = ctrl.engine.pixelRatio;

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

    const w = el.clientWidth / pr;
    const h = el.clientHeight / pr;

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

    // Attractors guide the flow in an S-curve across the box
    const curveFracs = [
      { x: 0.20, y: 0.35 },
      { x: 0.45, y: 0.65 },
      { x: 0.70, y: 0.35 },
      { x: 0.90, y: 0.55 },
    ];
    const attractors = curveFracs.map(pt =>
      ctrl.addAttractor({ x: w * pt.x, y: h * pt.y, strength: 0.15, radius: w * 0.3 }),
    );

    // Reposition emitter + attractors on container resize
    const ro = new ResizeObserver(() => {
      const nw = el.clientWidth / pr;
      const nh = el.clientHeight / pr;
      emitter.configuration.point.y = nh / 2;
      emitter.configuration.spawnHeight = nh * 0.6;
      for (let i = 0; i < attractors.length; i++) {
        const frac = curveFracs[i]!;
        attractors[i]!.position.x = nw * frac.x;
        attractors[i]!.position.y = nh * frac.y;
        attractors[i]!.radius = nw * 0.3;
      }
    });
    ro.observe(el);

    // Boundary around the inner card so particles flow around it
    const boundary = ctrl.addBoundary({ element: inner, strength: -2, radius: 15 });

    // Mouse push
    ctrl.addMouseForce({ track: true, strength: 1.5, radius: 60 });

    return () => { ro.disconnect(); boundary.destroy(); ctrl.destroy(); engineRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={{
      position: 'relative',
      height: 240,
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: 16,
    }}>
      <div ref={innerRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '14px 24px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.85rem',
        fontWeight: 600,
        pointerEvents: 'none',
        zIndex: 1,
        whiteSpace: 'nowrap',
      }}>
        Particles flow around elements
      </div>
    </div>
  );
};

/* ─── Demo: Boids Flock (full-width, mouse scatters the swarm) ─── */

const BoidsDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Particular | null>(null);

  usePauseOffscreen(ref, engineRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctrl = createParticles({
      container: el,
      preset: 'flock',
      config: {
        maxCount: 80,
        zIndex: 1,
        sizeMin: 1.5,
        sizeMax: 3,
        velocity: Vector.fromAngle(0, 1),
        velocityMultiplier: 1.5,
        glowSize: 6,
        trailLength: 6,
      },
      renderer: 'webgl',
      autoResize: true,
      mouseForce: { strength: -2, radius: 80 },
    });
    engineRef.current = ctrl.engine;

    ctrl.addFlockingForce({ maxSpeed: 2, neighborRadius: 60, separationDistance: 15 });

    return () => { ctrl.destroy(); engineRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={{
      position: 'relative',
      height: 240,
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: 16,
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.85rem',
        fontWeight: 600,
        pointerEvents: 'none',
        zIndex: 1,
        whiteSpace: 'nowrap',
      }}>
        Boids flocking — move mouse to scatter
      </div>
    </div>
  );
};

/* ─── Welcome: text particles hero + snow + scroll fireworks ─── */

const WelcomeDemo: React.FC = () => {
  useInjectStyles(RESPONSIVE_CSS);
  const containerRef = useRef<HTMLDivElement>(null);
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const ctaBadgeRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const galleryHeadingRef = useRef<HTMLHeadingElement>(null);
  const galleryCtrlRef = useRef<ParticlesController | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const snowControllerRef = useRef<ParticlesController | null>(null);
  const textControllerRef = useRef<ParticlesController | null>(null);
  const fireworksControllerRef = useRef<ParticlesController | null>(null);
  const boundariesRef = useRef<BoundaryHandle[]>([]);
  const firedFireworksRef = useRef(false);
  let cardIndex = 0;

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  // Snow screensaver — container-aware, flows through the scrolling page
  useEffect(() => {
    const canvas = snowCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const screensaver: ScreensaverController = startScreensaver({
      canvas,
      container,
      preset: 'snow',
      config: {
        rate: 0.4,
        maxCount: 500,
        particleLife: 1200,
        colors: subtleSnowColors,
        glow: false,
        sizeMin: 1,
        sizeMax: 3,
      },
      renderer: 'webgl',
      autoResize: true,
    });

    snowControllerRef.current = screensaver.controller;

    // Mouse trail — soft wisps following cursor across the page
    screensaver.controller.addMouseTrail({
      target: container,
      rate: 1,
      sizeMin: 0.8,
      sizeMax: 2.5,
      particleLife: 35,
      fadeTime: 20,
      velocity: 0.8,
      spread: 0.5,
      colors: colorPalettes.fairy!,
      glow: true,
      glowSize: 6,
      glowAlpha: 0.25,
      glowColor: '#b197fc',
      blendMode: 'normal',
      trail: false,
      minSpeed: 0.8,
    });

    return () => {
      screensaver.destroy();
      snowControllerRef.current = null;
    };
  }, []);

  // Boundaries — snow flows around all cards
  useEffect(() => {
    const ctrl = snowControllerRef.current;
    if (!ctrl) return;

    const timer = setTimeout(() => {
      for (const b of boundariesRef.current) b.destroy();
      boundariesRef.current = [];

      // Only add boundaries around the feature cards (upper section where snow lands)
      const featureCount = 6;
      for (let i = 0; i < featureCount; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        boundariesRef.current.push(
          ctrl.addBoundary({ element: card, strength: -1.5, radius: 10 }),
        );
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      for (const b of boundariesRef.current) b.destroy();
      boundariesRef.current = [];
    };
  }, []);

  // Text particles — container-aware, scrolls with page
  useEffect(() => {
    const canvas = textCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = createParticles({
      canvas,
      container,
      preset: 'imageText',
      renderer: 'webgl',
      autoResize: true,
    });

    textControllerRef.current = controller;

    const w = container.clientWidth;
    const heroH = window.innerHeight;

    controller.textToParticles('Particular', {
      x: w / 2,
      y: heroH * 0.38,
      width: Math.min(w * 0.75, 800),
      resolution: 400,
      intro: { mode: 'scatter', duration: 1200 },
    });

    controller.addMouseForce({
      track: true,
      strength: 3,
      radius: 80,
    });

    return () => {
      controller.destroy();
      textControllerRef.current = null;
    };
  }, []);

  // Fireworks — separate non-continuous controller, triggered by scroll
  // Uses a viewport-fixed canvas (not container-aware) because the 3D camera
  // has a fixed frustum that can't account for scroll offset like the 2D renderer.
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;

    const controller = createParticles({
      canvas,
      preset: 'fireworks3d',
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
      // Note: no container — 3D camera can't handle scroll offset.
      // applyCanvasStyles will set position:fixed, so we restore our
      // desired absolute positioning after createParticles returns.
      renderer: 'webgl3d',
      autoResize: true,
    });

    // Restore absolute positioning — createParticles sets position:fixed for non-container canvases
    canvas.style.position = 'absolute';
    canvas.style.inset = 'auto';
    canvas.style.bottom = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '0';

    fireworksControllerRef.current = controller;

    const onScroll = () => {
      if (firedFireworksRef.current) return;

      const scrollBottom = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= totalHeight - 150) {
        firedFireworksRef.current = true;

        const pr = controller.engine.pixelRatio;
        const w = window.innerWidth / pr;
        const h = window.innerHeight / pr;

        // Fireworks barrage — three waves of rockets from center-bottom
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

        // Allow re-triggering after cooldown
        setTimeout(() => {
          firedFireworksRef.current = false;
        }, 10000);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      controller.destroy();
      fireworksControllerRef.current = null;
    };
  }, []);

  // CTA container glow — magical sparkles around the install badge
  useEffect(() => {
    const container = ctaContainerRef.current;
    const badge = ctaBadgeRef.current;
    if (!container || !badge) return;

    const ctrl = createParticles({
      container,
      config: { maxCount: 80, continuous: true, zIndex: 1 },
      renderer: 'webgl',
      autoResize: true,
    });
    ctrl.addContainerGlow({
      element: badge,
      colors: colorPalettes.amber!,
      rate: 0.6,
      sizeMin: 0.5,
      sizeMax: 2,
      particleLife: 50,
      fadeTime: 25,
      velocity: 0.5,
      spread: 0.4,
      shape: 'sparkle',
      glow: true,
      glowColor: '#ff9500',
      glowAlpha: 0.35,
      glowSize: 8,
      blendMode: 'additive',
    });
    return () => ctrl.destroy();
  }, []);

  // Gallery section particle controller — for easter egg heading dissolve
  useEffect(() => {
    const section = gallerySectionRef.current;
    if (!section) return;
    const ctrl = createParticles({
      container: section,
      config: { maxCount: 3000, continuous: true, zIndex: 2 },
      renderer: 'webgl',
      autoResize: true,
    });
    galleryCtrlRef.current = ctrl;
    return () => { ctrl.destroy(); galleryCtrlRef.current = null; };
  }, []);

  const handleGalleryHeadingClick = useCallback(() => {
    const ctrl = galleryCtrlRef.current;
    const heading = galleryHeadingRef.current;
    if (!ctrl || !heading || heading.style.visibility === 'hidden') return;
    ctrl.elementToParticles(heading, {
      shape: 'triangle',
      resolution: 400,
      intro: { mode: 'ripple', duration: 600 },
    }).then(() => {
      ctrl.addMouseForce({ track: true, strength: 2, radius: 60 });
    });
  }, []);

  const handleTitleClick = useCallback(() => {
    textControllerRef.current?.scatter({ velocity: 15, rotation: 8 });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'e' || e.key === 'E') {
      textControllerRef.current?.scatter({ velocity: 12 });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const features = [
    { icon: '\uD83C\uDFA8', title: 'Beautiful by Default', body: 'Curated presets and smart defaults that look stunning out of the box. Zero config required.' },
    { icon: '\u26A1', title: 'Lightning Fast', body: 'WebGL2 instanced rendering pushes thousands of particles at 60fps with minimal overhead.' },
    { icon: '\uD83D\uDDE8\uFE0F', title: 'Text & Image to Particles', body: 'Dissolve any text or image into thousands of particles that spring back together.' },
    { icon: '\uD83E\uDDE9', title: 'Shatter & Scatter', body: 'Break images into polygon chunks or scatter particles outward, then reassemble.' },
    { icon: '\uD83D\uDCE6', title: 'Container Aware', body: 'Turn any DOM element into an effect container. Particles flow around and inside elements automatically.' },
    { icon: '\uD83D\uDD2E', title: 'Interactive Effects', body: 'Mouse forces, hover reactions, click bursts, and wobble physics respond to user input.' },
  ];

  const steps = [
    { num: '01', title: 'Install', body: 'npm install particular \u2014 zero dependencies, tree-shakeable.' },
    { num: '02', title: 'Create', body: 'One call to createParticles() or useParticles() to get started.' },
    { num: '03', title: 'Customize', body: 'Choose a preset, add forces, boundaries, and interactions.' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #070b14 0%, #0a1628 30%, #0d1b2a 60%, #0a0a1a 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Snow canvas — container-aware, scrolls with page */}
      <canvas ref={snowCanvasRef} style={particlesContainerLayerStyle} />

      {/* Text particles canvas — container-aware, scrolls with page */}
      <canvas ref={textCanvasRef} style={particlesContainerLayerStyle} />


      {/* Hero — text particles render at ~38% viewport height, subtitle sits below */}
      <section
        className="showcase-hero-section"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Clickable area over the "Particular" text particles — click to explode */}
        <div
          onClick={handleTitleClick}
          style={{
            position: 'absolute',
            top: '28vh',
            left: '10%',
            right: '10%',
            height: '20vh',
            pointerEvents: 'auto',
            cursor: 'pointer',
            zIndex: 2,
          }}
        />
        <div style={{ paddingTop: '58vh' }}>
          <p
            style={{
              ...sectionSubStyle,
              fontSize: '1.1rem',
              margin: '0 auto 20px',
            }}
          >
            Beautiful by default. Lightning fast. Zero config.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
            Turn text, images, and DOM elements into interactive particles.
            <br />
            Advanced mode: 3D support, Boids Flocking and more.
            </p>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="showcase-section-heading" style={sectionHeadingStyle}>What it does</h2>
          <p style={{ ...sectionSubStyle, margin: '0 auto' }}>
            Everything you need to bring interfaces to life with particles.
          </p>
        </div>
        <div className="showcase-features-grid">
          {features.map((feat, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{feat.icon}</div>
              <div style={headingStyle}>{feat.title}</div>
              <div style={bodyStyle}>{feat.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Gallery */}
      <section ref={gallerySectionRef} style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2
            ref={galleryHeadingRef}
            className="showcase-section-heading"
            style={{ ...sectionHeadingStyle, cursor: 'pointer' }}
            onClick={handleGalleryHeadingClick}
          >
            Interactive Gallery
          </h2>
          <p style={{ ...sectionSubStyle, margin: '0 auto' }}>
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
        <div style={{ marginTop: 20 }}>
          <BoidsDemo />
        </div>
      </section>

      {/* CTA Banner — with container glow on the install badge */}
      <section
        ref={ctaContainerRef}
        style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}
      >
        <div
          ref={setCardRef(cardIndex++)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '48px 32px',
            textAlign: 'center',
            margin: '0 auto',
            maxWidth: 700,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h2 className="showcase-section-heading" style={{ ...sectionHeadingStyle, fontSize: '1.5rem' }}>
            Ready to add particles to your project?
          </h2>
          <p style={{ ...sectionSubStyle, margin: '0 auto 24px' }}>
            Get started in under a minute with our React hooks or vanilla API.
          </p>
          <div
            ref={ctaBadgeRef}
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'rgba(116, 192, 252, 0.12)',
              border: '1px solid rgba(116, 192, 252, 0.25)',
              borderRadius: 10,
              color: '#74c0fc',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            npm install particular
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="showcase-section-heading" style={sectionHeadingStyle}>Three Steps</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, pointerEvents: 'none' }}>
          {steps.map((step, i) => (
            <div key={i} ref={setCardRef(cardIndex++)} style={{ ...cardStyle, display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(116, 192, 252, 0.35)', flexShrink: 0, width: 56, textAlign: 'center' }}>
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
      <section
        ref={footerRef}
        style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.85rem' }}>
          Particles flow around every element on this page.
        </p>
      </section>

      {/* Fireworks canvas — pinned to bottom of page, behind content, viewport-height for 3D camera */}
      <canvas ref={fireworksCanvasRef} style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
    </div>
  );
};

/* ─── Meta ─── */

const meta: Meta = {
  title: 'Showcase',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const Showcase: Story = {
  render: () => <WelcomeDemo />,
};
