import React, { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createParticles } from './index';

const meta: Meta = {
  title: 'Particular/Boids',
};

export default meta;

// ── Basic Flock ─────────────────────────────────────────────────────────────
// Particles self-organize into organic swarm patterns via boids flocking rules.

const BasicFlockComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const controller = createParticles({
      container: ref.current,
      preset: 'flock',
      config: { autoStart: false },
    });

    controller.addFlockingForce();
    controller.burst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

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
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Boids flocking — particles self-organize into swarm patterns
      </div>
    </div>
  );
};

export const BasicFlock: StoryObj = {
  render: () => <BasicFlockComponent />,
};

// ── Predator Mouse ──────────────────────────────────────────────────────────
// Mouse scatters the flock with a repelling force, which regroups after.

const PredatorMouseComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const controller = createParticles({
      container: ref.current,
      preset: 'flock',
      config: { autoStart: false },
      mouseForce: { strength: -2, radius: 150, track: true },
    });

    controller.addFlockingForce();
    controller.burst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

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
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Move mouse to scatter the flock — they regroup after
      </div>
    </div>
  );
};

export const PredatorMouse: StoryObj = {
  render: () => <PredatorMouseComponent />,
};

// ── Flock + Attractor ───────────────────────────────────────────────────────
// Flock orbits around a center attractor in swarm patterns.

const FlockAttractorComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const controller = createParticles({
      container: ref.current,
      preset: 'flock',
      config: { autoStart: false },
    });

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    controller.addAttractor({ x: cx, y: cy, strength: 0.3, radius: 500, visible: true });
    controller.addFlockingForce();
    controller.burst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

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
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        Flock orbits center attractor in swarm patterns
      </div>
    </div>
  );
};

export const FlockAttractor: StoryObj = {
  render: () => <FlockAttractorComponent />,
};

// ── 3D Flock ────────────────────────────────────────────────────────────────
// 3D swarm with orbit controls.

const Flock3DComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const controller = createParticles({
      container: ref.current,
      renderer: 'webgl3d',
      preset: 'flock',
      config: {
        autoStart: false,
        spawnDepth: 300,
        spread3d: Math.PI,
        camera: {
          fov: 60,
          position: { x: 0, y: 100, z: 600 },
          target: { x: 0, y: 0, z: 0 },
        },
      },
    });

    controller.addFlockingForce();
    controller.burst({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
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
        background: '#0a0a1a',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#666', fontFamily: 'system-ui' }}>
        3D flock with orbit controls. Drag to rotate, scroll to zoom.
      </div>
    </div>
  );
};

export const Flock3D: StoryObj = {
  render: () => <Flock3DComponent />,
};
