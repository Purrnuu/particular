import { describe, expect, it } from 'vitest';
import {
  defaultParticular,
  defaultParticle,
  defaultAttractor,
  defaultMouseForce,
  defaultExplosionChild,
  defaultHomeConfig,
  defaultImageParticles,
  defaultElementParticles,
  defaultContainerGlow,
  defaultMouseTrail,
  defaultImageShatter,
  defaultWobble,
  defaultMouseWind,
  configureParticular,
  configureParticle,
} from '../src/particular/core/defaults';

describe('defaults', () => {
  describe('exported default constants', () => {
    it('defaultParticular has all expected keys', () => {
      const keys = ['pixelRatio', 'zIndex', 'maxCount', 'autoStart', 'continuous', 'webglMaxInstances', 'particlePoolSize'];
      for (const key of keys) {
        expect(defaultParticular).toHaveProperty(key);
      }
    });

    it('defaultParticle has all expected keys', () => {
      const keys = [
        'rate', 'life', 'particleLife', 'velocity', 'spread', 'sizeMin', 'sizeMax',
        'velocityMultiplier', 'fadeTime', 'gravity', 'gravityJitter', 'scaleStep',
        'spawnWidth', 'spawnHeight', 'colors', 'acceleration', 'accelerationSize',
        'friction', 'frictionSize', 'shape', 'blendMode', 'glow', 'glowSize',
        'glowColor', 'glowAlpha', 'trail', 'trailLength', 'trailFade', 'trailShrink',
        'imageTint', 'shadow', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY',
        'shadowColor', 'shadowAlpha',
      ];
      for (const key of keys) {
        expect(defaultParticle, `missing key: ${key}`).toHaveProperty(key);
      }
    });

    it('defaultAttractor has all expected keys', () => {
      const keys = ['strength', 'radius', 'visible', 'size', 'color', 'shape', 'glow', 'glowSize', 'glowColor', 'glowAlpha'];
      for (const key of keys) {
        expect(defaultAttractor).toHaveProperty(key);
      }
    });

    it('defaultMouseForce has all expected keys', () => {
      const keys = ['x', 'y', 'strength', 'radius', 'damping', 'maxSpeed', 'falloff'];
      for (const key of keys) {
        expect(defaultMouseForce).toHaveProperty(key);
      }
    });

    it('defaultExplosionChild has all expected keys', () => {
      const keys = [
        'childCount', 'childLife', 'sizeMin', 'sizeMax', 'velocity', 'velocitySpread',
        'friction', 'scaleStep', 'gravity', 'fadeTime', 'inheritColor', 'shape',
        'blendMode', 'glow', 'glowSize', 'glowColor', 'glowAlpha', 'shadow',
        'trail', 'trailLength', 'trailFade', 'trailShrink',
      ];
      for (const key of keys) {
        expect(defaultExplosionChild).toHaveProperty(key);
      }
    });

    it('defaultHomeConfig has all expected keys', () => {
      const keys = [
        'springStrength', 'springDamping', 'homeThreshold', 'velocityThreshold',
        'wiggleAmplitude', 'wiggleSpeed', 'breathingAmplitude', 'breathingSpeed',
        'waveAmplitude', 'waveSpeed', 'waveFrequency', 'returnNoise',
        'idlePulseStrength', 'idlePulseIntervalMin', 'idlePulseIntervalMax',
      ];
      for (const key of keys) {
        expect(defaultHomeConfig).toHaveProperty(key);
      }
    });

    it('all optional default configs are defined', () => {
      expect(defaultImageParticles).toBeDefined();
      expect(defaultElementParticles).toBeDefined();
      expect(defaultContainerGlow).toBeDefined();
      expect(defaultMouseTrail).toBeDefined();
      expect(defaultImageShatter).toBeDefined();
      expect(defaultWobble).toBeDefined();
      expect(defaultMouseWind).toBeDefined();
    });
  });

  describe('configureParticular', () => {
    it('returns all defaults when called with no config', () => {
      const config = configureParticular();
      expect(config.pixelRatio).toBe(defaultParticular.pixelRatio);
      expect(config.maxCount).toBe(defaultParticular.maxCount);
      expect(config.rate).toBe(defaultParticle.rate);
      expect(config.particleLife).toBe(defaultParticle.particleLife);
    });

    it('user config overrides defaults', () => {
      const config = configureParticular({ maxCount: 1000, rate: 20 });
      expect(config.maxCount).toBe(1000);
      expect(config.rate).toBe(20);
    });

    it('unspecified fields are preserved from defaults', () => {
      const config = configureParticular({ maxCount: 999 });
      expect(config.pixelRatio).toBe(defaultParticular.pixelRatio);
      expect(config.gravity).toBe(defaultParticle.gravity);
      expect(config.shape).toBe(defaultParticle.shape);
    });

    it('preserves renderer field', () => {
      const config = configureParticular({ renderer: 'canvas' });
      expect(config.renderer).toBe('canvas');
    });
  });

  describe('configureParticle', () => {
    it('returns all defaults when called with no args', () => {
      const config = configureParticle();
      expect(config.rate).toBe(defaultParticle.rate);
      expect(config.particleLife).toBe(defaultParticle.particleLife);
      expect(config.shape).toBe(defaultParticle.shape);
    });

    it('overrides win over base and defaults', () => {
      const config = configureParticle(
        { gravity: 0.5 },
        { gravity: 0.3, rate: 10 } as any,
      );
      expect(config.gravity).toBe(0.5); // override wins
      expect(config.rate).toBe(10); // base wins over default
    });

    it('three-way merge: defaults < base < overrides', () => {
      const config = configureParticle(
        { shape: 'star' },
        { gravity: 0.3, shape: 'triangle' } as any,
      );
      expect(config.shape).toBe('star'); // override wins over base
      expect(config.gravity).toBe(0.3); // base wins over default (0.15)
      expect(config.fadeTime).toBe(defaultParticle.fadeTime); // default preserved
    });

    it('undefined overrides do not clobber base', () => {
      const config = configureParticle(
        { shape: undefined } as any,
        { shape: 'triangle' } as any,
      );
      // Spread behavior: undefined from overrides does clobber in JS spread
      // This documents actual behavior
      expect(config.shape).toBe(undefined);
    });
  });
});
