import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createParticles } from './index';

const meta: Meta = {
  title: 'Particular/3D',
};

export default meta;

// ── 3D Burst ─────────────────────────────────────────────────────────────
// Particles burst outward in 3D with z-spread. Camera looks at the origin.

const Burst3DComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'magic',
      config: {
        spawnDepth: 200,
        maxCount: 600,
        camera: {
          fov: 60,
          position: { x: 0, y: 0, z: 500 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
    });

    const onClick = (e: MouseEvent) => {
      controller.burst({ x: e.clientX, y: e.clientY });
    };
    ref.current.addEventListener('click', onClick);

    return () => {
      ref.current?.removeEventListener('click', onClick);
      controller.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100vh',
        background: '#0a0a1a',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Click to burst particles in 3D space
      </div>
    </div>
  );
};

export const Burst3D: StoryObj = {
  render: () => <Burst3DComponent />,
};

// ── 3D Orbit ─────────────────────────────────────────────────────────────
// Continuous spherical emission with orbit controls (drag to rotate, scroll to zoom).

const Orbit3DComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'magic',
      config: {
        continuous: true,
        autoStart: true,
        spawnDepth: 300,
        spread3d: Math.PI,
        rate: 3,
        maxCount: 500,
        particleLife: 200,
        gravity: 0,
        spread: Math.PI * 2,
        camera: {
          fov: 60,
          position: { x: 0, y: 100, z: 600 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
    });

    controller.enableAutoOrbit(0.2);
    controller.enableOrbitControls();

    return () => controller.destroy();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100vh',
        background: '#0a0a1a',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Drag to orbit, scroll to zoom
      </div>
    </div>
  );
};

export const Orbit3D: StoryObj = {
  render: () => <Orbit3DComponent />,
};

// ── 3D Snow ──────────────────────────────────────────────────────────────
// Snow particles falling from the top at different z-depths creating parallax perspective.

const Snow3DComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'snow',
      mouseForce: true,
      config: {
        autoStart: false,
        blendMode: 'additive' as const,
        glow: true,
        glowSize: 10,
        glowColor: '#aaccff',
        glowAlpha: 0.3,
        spawnDepth: 800,
        spawnWidth: rect.width,
        maxCount: 300,
        rate: 0.6,
        particleLife: 800,
        fadeTime: 120,
        camera: {
          fov: 50,
          position: { x: 0, y: 0, z: 500 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
    });

    // Continuous emitter well above the visible area so particles
    // are already falling when they enter view, even at extreme z-depths.
    controller.burst({
      x: rect.left + rect.width / 2,
      y: rect.top - rect.height * 0.5,
      spawnHeight: rect.height * 0.3,
    });

    return () => controller.destroy();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #0c1445 0%, #1a2980 50%, #26d0ce 100%)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffffff55', fontFamily: 'system-ui', fontSize: '2em', textAlign: 'center' }}>
        3D Snow with Depth
      </div>
    </div>
  );
};

export const Snow3D: StoryObj = {
  render: () => <Snow3DComponent />,
};

// ── Spherical Burst ─────────────────────────────────────────────────────
// Full spherical emission using spread3d + orbit controls.

const SphericalBurstComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'supernova',
      config: {
        camera: {
          fov: 60,
          position: { x: 0, y: 0, z: 600 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
    });

    controller.enableOrbitControls();

    const onClick = (e: MouseEvent) => {
      controller.burst({ x: e.clientX, y: e.clientY });
    };
    ref.current.addEventListener('click', onClick);

    return () => {
      ref.current?.removeEventListener('click', onClick);
      controller.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100vh',
        background: '#0a0a0a',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Click for spherical supernova burst. Drag to orbit.
      </div>
    </div>
  );
};

export const SphericalBurst: StoryObj = {
  render: () => <SphericalBurstComponent />,
};

// ── 3D Galaxy ────────────────────────────────────────────────────────────
// Continuous galaxy spin preset with orbit controls.

const GalaxyComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'galaxySpin',
      config: {
        camera: {
          fov: 60,
          position: { x: 200, y: 200, z: 500 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
    });

    controller.enableAutoOrbit(0.15);
    controller.enableOrbitControls();

    return () => controller.destroy();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100vh',
        background: '#050510',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Galaxy spin preset. Drag to orbit.
      </div>
    </div>
  );
};

export const Galaxy: StoryObj = {
  render: () => <GalaxyComponent />,
};

// ── 3D Attractor ─────────────────────────────────────────────────────────
// Particles pulled between three attractors in a 3D triangle, creating orbital streams.

const Attractor3DComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'galaxySpin',
      config: {
        blendMode: 'normal' as const,
        trail: true,
        trailLength: 8,
        trailFade: 0.4,
        trailShrink: 0.5,
        rate: 2,
        maxCount: 400,
        particleLife: 250,
        colors: ['#c0392b', '#d35400', '#e67e22', '#f39c12', '#d4a574', '#8b4513', '#a0522d', '#cd853f'],
        glowColor: '#e67e22',
        camera: {
          fov: 60,
          position: { x: 200, y: 250, z: 700 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
    });

    // Four attractors at N corners: streams trace left vertical, diagonal, right vertical
    const eng = controller.engine;
    const cx = eng.width / 2 / eng.pixelRatio;
    const cy = eng.height / 2 / eng.pixelRatio;

    // N shape: bottom-left, top-left, bottom-right, top-right
    controller.addAttractor({ x: cx - 180, y: cy + 120, z: -50, strength: 1.2, radius: 500 });
    controller.addAttractor({ x: cx - 180, y: cy - 120, z: 50, strength: 1.2, radius: 500 });
    controller.addAttractor({ x: cx + 180, y: cy + 120, z: 50, strength: 1.2, radius: 500 });
    controller.addAttractor({ x: cx + 180, y: cy - 120, z: -50, strength: 1.2, radius: 500 });

    controller.enableAutoOrbit(0.12);
    controller.enableOrbitControls();

    return () => controller.destroy();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100vh',
        background: '#0a0805',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Three 3D attractors with autumn palette. Drag to orbit.
      </div>
    </div>
  );
};

export const Attractor3D: StoryObj = {
  render: () => <Attractor3DComponent />,
};

// ── 3D Fireworks ──────────────────────────────────────────────────────────
// Rockets launch upward and detonate into spherical sub-bursts in 3D space.

const Fireworks3DComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'fireworks3d',
      config: {
        autoStart: false,
        camera: {
          fov: 60,
          position: { x: 0, y: -200, z: 600 },
          target: { x: 0, y: 100, z: 0 },
        },
      },
    });

    // Launch rockets from bottom center of the screen
    controller.burst({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height,
    });

    controller.enableAutoOrbit(0.08);
    controller.enableOrbitControls();

    return () => controller.destroy();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100vh',
        background: '#050510',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        3D Fireworks with spherical detonation. Drag to orbit.
      </div>
    </div>
  );
};

export const Fireworks3D: StoryObj = {
  render: () => <Fireworks3DComponent />,
};
