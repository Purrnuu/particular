import React, { useEffect, useRef, useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { InputType } from '@storybook/core/types';

import { createParticles } from './index';
import type { ParticlesController, ImageShatterConfig } from './index';
import { defaultImageShatter } from './particular/core/defaults';
import viking2Png from './icons/viking_2.png';
import alpacaPng from './icons/alpaca.png';

/* ─── Story args ─── */

interface ShatterStoryArgs {
  renderer: 'canvas' | 'webgl';
  chunkCount: number;
  jitter: number;
  velocity: number;
  velocitySpread: number;
  gravity: number;
  rotationSpeed: number;
  particleLife: number;
  fadeTime: number;
  friction: number;
}

const shatterArgTypes: Record<string, InputType> = {
  renderer: {
    control: 'radio',
    options: ['canvas', 'webgl'],
    description: 'Rendering backend',
    table: { category: 'Rendering' },
  },
  chunkCount: {
    control: { type: 'number', min: 4, max: 200, step: 4 },
    description: 'Approximate number of chunks',
    table: { category: 'Shatter' },
  },
  jitter: {
    control: { type: 'number', min: 0, max: 1, step: 0.05 },
    description: 'Grid jitter (0 = regular grid, 1 = max randomness)',
    table: { category: 'Shatter' },
  },
  velocity: {
    control: { type: 'number', min: 0.5, max: 15, step: 0.5 },
    description: 'Outward explosion velocity',
    table: { category: 'Physics' },
  },
  velocitySpread: {
    control: { type: 'number', min: 0, max: 1, step: 0.05 },
    description: 'Velocity randomness',
    table: { category: 'Physics' },
  },
  gravity: {
    control: { type: 'number', min: 0, max: 0.5, step: 0.01 },
    description: 'Gravity on chunks',
    table: { category: 'Physics' },
  },
  rotationSpeed: {
    control: { type: 'number', min: 0, max: 10, step: 0.5 },
    description: 'Rotation speed (degrees/tick)',
    table: { category: 'Physics' },
  },
  particleLife: {
    control: { type: 'number', min: 30, max: 300, step: 10 },
    description: 'Chunk lifetime (ticks)',
    table: { category: 'Emission' },
  },
  fadeTime: {
    control: { type: 'number', min: 5, max: 100, step: 5 },
    description: 'Fade out duration (ticks)',
    table: { category: 'Emission' },
  },
  friction: {
    control: { type: 'number', min: 0, max: 0.05, step: 0.001 },
    description: 'Friction',
    table: { category: 'Physics' },
  },
};

const defaultShatterArgs: ShatterStoryArgs = {
  renderer: 'webgl',
  chunkCount: defaultImageShatter.chunkCount,
  jitter: defaultImageShatter.jitter,
  velocity: defaultImageShatter.velocity,
  velocitySpread: defaultImageShatter.velocitySpread,
  gravity: defaultImageShatter.gravity,
  rotationSpeed: defaultImageShatter.rotationSpeed,
  particleLife: defaultImageShatter.particleLife,
  fadeTime: defaultImageShatter.fadeTime,
  friction: defaultImageShatter.friction,
};

function argsToShatterConfig(args: ShatterStoryArgs): Partial<ImageShatterConfig> {
  return {
    chunkCount: args.chunkCount,
    jitter: args.jitter,
    velocity: args.velocity,
    velocitySpread: args.velocitySpread,
    gravity: args.gravity,
    rotationSpeed: args.rotationSpeed,
    particleLife: args.particleLife,
    fadeTime: args.fadeTime,
    friction: args.friction,
  };
}

/* ─── Click-to-shatter demo ─── */

const ClickToShatter: React.FC<ShatterStoryArgs & { imageSrc: string }> = (args) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const controller = createParticles({
      container,
      config: { maxCount: 500, continuous: true },
      renderer: args.renderer,
      autoResize: true,
    });
    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [args.renderer]);

  const handleClick = useCallback(() => {
    const controller = controllerRef.current;
    const img = imgRef.current;
    if (!controller || !img) return;

    img.style.opacity = '0';

    const rect = img.getBoundingClientRect();
    const containerRect = containerRef.current!.getBoundingClientRect();

    controller.shatterImage({
      image: args.imageSrc,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
      width: rect.width,
      height: rect.height,
      ...argsToShatterConfig(args),
    });

    setTimeout(() => {
      if (img) img.style.opacity = '1';
    }, args.particleLife * 16.67);
  }, [args]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <img
        ref={imgRef}
        src={args.imageSrc}
        alt="Click to shatter"
        style={{
          maxWidth: '60%',
          maxHeight: '60%',
          objectFit: 'contain',
          transition: 'opacity 0.15s',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <p
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '0.9rem',
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        Click to shatter
      </p>
    </div>
  );
};

/* ─── Interactive hover-to-shatter demo (image) ─── */

const HoverShatter: React.FC<{ renderer: 'canvas' | 'webgl'; imageSrc: string; chunkCount?: number }> = ({
  renderer,
  imageSrc,
  chunkCount = 48,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);
  const readyRef = useRef(false);
  const [hitSize, setHitSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const controller = createParticles({
      container,
      config: { maxCount: 500, continuous: true },
      renderer,
      autoResize: true,
    });
    controllerRef.current = controller;

    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight;
      const h = Math.min(container.clientHeight * 0.5, 500);
      const w = h * aspect;
      setHitSize({ w, h });

      controller.shatterImage({
        image: imageSrc,
        width: w,
        height: h,
        chunkCount,
        jitter: 0.35,
        homeConfig: {
          springStrength: 0.06,
          springDamping: 0.85,
          returnNoise: 0.2,
        },
      }).then(() => {
        readyRef.current = true;
      });
    };
    img.src = imageSrc;

    return () => {
      controller.destroy();
      controllerRef.current = null;
      readyRef.current = false;
      setHitSize(null);
    };
  }, [renderer, imageSrc, chunkCount]);

  const onEnter = () => {
    if (!controllerRef.current || !readyRef.current) return;
    controllerRef.current.scatter({ velocity: 5, rotation: 3 });
    controllerRef.current.startWobble({ track: containerRef.current! });
  };

  const onLeave = () => {
    controllerRef.current?.stopWobble();
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hitSize && (
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onTouchStart={onEnter}
          onTouchEnd={onLeave}
          style={{
            width: hitSize.w,
            height: hitSize.h,
            cursor: 'pointer',
            zIndex: 10001,
            position: 'relative',
          }}
        />
      )}
      <p
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '0.9rem',
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        Hover or tap to break apart, leave to reassemble
      </p>
    </div>
  );
};

/* ─── Interactive hover-to-shatter demo (text) ─── */

const HoverTextShatter: React.FC<{ renderer: 'canvas' | 'webgl'; text: string; chunkCount?: number }> = ({
  renderer,
  text,
  chunkCount = 64,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ParticlesController | null>(null);
  const readyRef = useRef(false);
  const [hitSize, setHitSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const controller = createParticles({
      container,
      config: { maxCount: 500, continuous: true },
      renderer,
      autoResize: true,
    });
    controllerRef.current = controller;

    const fontSize = 180;

    const textAspect = (() => {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d')!;
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      const tw = ctx.measureText(text).width + 4;
      const th = fontSize * 1.3;
      return tw / th;
    })();
    const displayW = Math.min(container.clientWidth * 0.8, 800);
    const displayH = displayW / textAspect;
    setHitSize({ w: displayW, h: displayH });

    controller.shatterText(text, {
      chunkCount,
      jitter: 0.35,
      homeConfig: {
        springStrength: 0.06,
        springDamping: 0.85,
        returnNoise: 0.2,
      },
      textConfig: {
        fontSize,
        fontWeight: 'bold',
      },
    }).then(() => {
      readyRef.current = true;
    });

    return () => {
      controller.destroy();
      controllerRef.current = null;
      readyRef.current = false;
      setHitSize(null);
    };
  }, [renderer, text, chunkCount]);

  const onEnter = () => {
    if (!controllerRef.current || !readyRef.current) return;
    controllerRef.current.scatter({ velocity: 5, rotation: 3 });
    controllerRef.current.startWobble({ track: containerRef.current! });
  };

  const onLeave = () => {
    controllerRef.current?.stopWobble();
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hitSize && (
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onTouchStart={onEnter}
          onTouchEnd={onLeave}
          style={{
            width: hitSize.w,
            height: hitSize.h,
            cursor: 'pointer',
            zIndex: 10001,
            position: 'relative',
          }}
        />
      )}
      <p
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '0.9rem',
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        Hover or tap to break apart, leave to reassemble
      </p>
    </div>
  );
};

/* ─── Meta ─── */

const meta: Meta<ShatterStoryArgs> = {
  title: 'Particular/Image Shatter',
  argTypes: shatterArgTypes,
  args: defaultShatterArgs,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ─── Destructive explosion stories ─── */

export const Viking: Story = {
  render: (args) => <ClickToShatter {...(args as ShatterStoryArgs)} imageSrc={viking2Png} />,
};

export const Alpaca: Story = {
  render: (args) => <ClickToShatter {...(args as ShatterStoryArgs)} imageSrc={alpacaPng} />,
};

export const FinePieces: Story = {
  args: {
    chunkCount: 120,
    jitter: 0.5,
    velocity: 6,
    gravity: 0.15,
    rotationSpeed: 6,
  },
  render: (args) => <ClickToShatter {...(args as ShatterStoryArgs)} imageSrc={viking2Png} />,
};

export const BigChunks: Story = {
  args: {
    chunkCount: 9,
    jitter: 0.3,
    velocity: 3,
    gravity: 0.06,
    rotationSpeed: 2,
    particleLife: 180,
  },
  render: (args) => <ClickToShatter {...(args as ShatterStoryArgs)} imageSrc={alpacaPng} />,
};

/* ─── Interactive hover stories ─── */

export const HoverImage: Story = {
  render: (args) => (
    <HoverShatter renderer={(args as ShatterStoryArgs).renderer} imageSrc={viking2Png} chunkCount={48} />
  ),
};

export const HoverText: Story = {
  render: (args) => (
    <HoverTextShatter renderer={(args as ShatterStoryArgs).renderer} text="SHATTER" chunkCount={64} />
  ),
};
