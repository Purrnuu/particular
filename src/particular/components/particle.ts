import Vector from '../utils/vector';
import { getRandomInt } from '../utils/math';
import EventDispatcher from '../utils/eventDispatcher';
import { defaultHomeConfig } from '../core/defaults';
import type { ParticleConstructorParams, ParticleShape, BlendMode, ForceSource, HomePositionConfig } from '../types';
import type Particular from '../core/particular';

export interface TrailSegment {
  x: number;
  y: number;
  size: number;
  rotation: number;
  alpha: number;
  age: number;
}

export default class Particle {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  friction: number;
  rotation: number;
  rotationDirection: number;
  rotationVelocity: number;
  factoredSize: number;
  lifeTime: number;
  lifeTick: number;
  size: number;
  gravity: number;
  scaleStep: number;
  fadeTime: number;
  alpha: number;
  color: string;
  particular: Particular | null = null;
  image: string | HTMLImageElement | null = null;
  isDetonationChild = false;
  
  // Shape configuration
  shape: ParticleShape;
  blendMode: BlendMode;
  glow: boolean;
  glowSize: number;
  glowColor: string;
  glowAlpha: number;
  trail: boolean;
  trailLength: number;
  trailFade: number;
  trailShrink: number;
  imageTint: boolean;
  shadow: boolean;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  shadowAlpha: number;
  shadowLightOrigin: Vector;
  trailSegments: TrailSegment[] = [];

  // Home position — spring return + idle animation
  homePosition: Vector | null = null;
  homeConfig: Required<HomePositionConfig> | null = null;
  private breathingPhase: number = Math.random() * Math.PI * 2;
  /** Per-particle spring multiplier (0.6–1.4) — breaks sync so particles return at different rates. */
  private springMultiplier: number = 1;
  /** Monotonic tick counter for coordinated idle wave (never resets). */
  private idleTicks: number = 0;
  /** How many pulse cycles this particle has completed. */
  private pulseCycleCount: number = 0;
  /** Tick at which the next pulse wave starts (computed deterministically so all particles agree). */
  private nextPulseAt: number = 0;
  /** Distance from image center (set once in constructor, used for ripple delay). */
  private homeDistFromCenter: number = 0;
  /** Angle from image center to this particle's home (radians). Used for outward ripple direction. */
  private homeAngleFromCenter: number = 0;

  addEventListener!: EventDispatcher['addEventListener'];
  removeEventListener!: EventDispatcher['removeEventListener'];
  removeAllEventListeners!: EventDispatcher['removeAllEventListeners'];
  dispatchEvent!: EventDispatcher['dispatchEvent'];
  hasEventListener!: EventDispatcher['hasEventListener'];

  /** Permanent alpha multiplier from source image (anti-aliased edges). */
  baseAlpha: number;

  constructor({
    color,
    baseAlpha = 1,
    point,
    velocity,
    acceleration,
    friction,
    size,
    particleLife,
    gravity,
    scaleStep,
    fadeTime,
    shape = 'circle',
    blendMode = 'normal',
    glow = false,
    glowSize = 10,
    glowColor = '#ffffff',
    glowAlpha = 0.35,
    trail = false,
    trailLength = 3,
    trailFade = 0.75,
    trailShrink = 0.55,
    imageTint = false,
    shadow = false,
    shadowBlur = 8,
    shadowOffsetX = 3,
    shadowOffsetY = 3,
    shadowColor = '#000000',
    shadowAlpha = 0.3,
    colors,
    homePosition,
    homeCenter,
    homeConfig,
  }: ParticleConstructorParams) {
    this.position = point ?? new Vector(0, 0);
    this.shadowLightOrigin = new Vector(this.position.x, this.position.y);
    this.velocity = velocity ?? new Vector(0, 0);
    this.acceleration = acceleration ?? new Vector(0, 0);
    this.friction = friction ?? 0;

    this.rotation = Math.random() * 360;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.rotationVelocity = this.rotationDirection * getRandomInt(1, 3);

    this.factoredSize = 1;

    this.lifeTime = getRandomInt(Math.round(particleLife * 0.75), particleLife);
    this.lifeTick = 0;
    this.size = size ?? getRandomInt(5, 15);

    this.gravity = gravity;
    this.scaleStep = scaleStep;
    this.fadeTime = fadeTime;

    this.alpha = 1;
    this.baseAlpha = baseAlpha;
    this.color = color
      ?? (colors && colors.length > 0
        ? colors[Math.floor(Math.random() * colors.length)]!
        : '#888888');
    
    // Shape configuration
    this.shape = shape;
    this.blendMode = blendMode;
    this.glow = glow;
    this.glowSize = glowSize;
    this.glowColor = glowColor;
    this.glowAlpha = glowAlpha;
    this.trail = trail;
    this.trailLength = trailLength;
    this.trailFade = trailFade;
    this.trailShrink = trailShrink;
    this.imageTint = imageTint;
    this.shadow = shadow;
    this.shadowBlur = shadowBlur;
    this.shadowOffsetX = shadowOffsetX;
    this.shadowOffsetY = shadowOffsetY;
    this.shadowColor = shadowColor;
    this.shadowAlpha = shadowAlpha;

    // Home position (spring return + idle animation)
    if (homePosition) {
      this.homePosition = new Vector(homePosition.x, homePosition.y);
      this.homeConfig = { ...defaultHomeConfig, ...homeConfig };
      // Image particles should not spin or have random rotation — they represent fixed pixels
      this.rotation = 0;
      this.rotationVelocity = 0;
      // Per-particle spring variation (0.6–1.4) so particles return at different rates
      this.springMultiplier = 0.6 + Math.random() * 0.8;
      // First pulse wave: deterministic random interval so all particles agree
      this.nextPulseAt = Particle.deterministicInterval(
        0, this.homeConfig.idlePulseIntervalMin, this.homeConfig.idlePulseIntervalMax,
      );
      // Distance + angle from image center for ripple wave
      if (homeCenter) {
        const cdx = homePosition.x - homeCenter.x;
        const cdy = homePosition.y - homeCenter.y;
        this.homeDistFromCenter = Math.sqrt(cdx * cdx + cdy * cdy);
        this.homeAngleFromCenter = Math.atan2(cdy, cdx);
      }
    }
  }

  init(image: string | HTMLImageElement | null, particular: Particular): void {
    this.image = image;
    this.particular = particular;
    this.dispatch('PARTICLE_CREATED', this);
  }

  update(forces?: ForceSource[], dt = 1): void {
    this.updateTrail(true, dt);
    this.velocity.add(this.acceleration, dt);
    this.velocity.addFriction(this.friction, dt);
    this.velocity.addGravity(this.gravity, dt);

    // External forces (attractors, mouse)
    if (forces) {
      for (const force of forces) {
        this.velocity.add(force.getForce(this.position), dt);
      }
    }

    // Home position spring force + idle animation
    if (this.homePosition && this.homeConfig) {
      const dx = this.homePosition.x - this.position.x;
      const dy = this.homePosition.y - this.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
      const isSettled = dist < this.homeConfig.homeThreshold && speed < this.homeConfig.velocityThreshold;

      // Idle pulse timer always ticks (monotonic, never resets) — mouse/scatter don't affect wave timing
      if (this.homeConfig.idlePulseStrength > 0 && this.homeConfig.idlePulseIntervalMin > 0) {
        this.idleTicks += dt;
      }

      if (isSettled) {
        // Idle: snap to home, zero velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.position.x = this.homePosition.x;
        this.position.y = this.homePosition.y;
        // Coordinated idle ripple — fire pulse AFTER zeroing velocity so impulse isn't overwritten.
        // nextPulseAt is computed deterministically from cycle count, so all particles agree on timing.
        // idleTicks is monotonic — never resets — so nextPulseAt accumulates across cycles.
        if (this.homeConfig.idlePulseStrength > 0 && this.homeConfig.idlePulseIntervalMin > 0) {
          const waveDelay = this.homeDistFromCenter * 0.3;
          if (this.idleTicks >= this.nextPulseAt + waveDelay) {
            const angle = this.homeAngleFromCenter + (Math.random() - 0.5) * 1.0;
            const mag = this.homeConfig.idlePulseStrength * (0.6 + Math.random() * 0.4);
            this.velocity.x = Math.cos(angle) * mag;
            this.velocity.y = Math.sin(angle) * mag;
            // Schedule next wave — deterministic so all particles compute the same nextPulseAt
            this.pulseCycleCount++;
            this.nextPulseAt += Particle.deterministicInterval(
              this.pulseCycleCount, this.homeConfig.idlePulseIntervalMin, this.homeConfig.idlePulseIntervalMax,
            );
          }
        }
      } else {
        // Spring: pull toward home with per-particle variation
        const k = this.homeConfig.springStrength * this.springMultiplier;
        this.velocity.x += dx * k * dt;
        this.velocity.y += dy * k * dt;
        // Damping: exponential decay (same dt pattern as Vector.addFriction)
        const dampFactor = Math.pow(this.homeConfig.springDamping, dt);
        this.velocity.x *= dampFactor;
        this.velocity.y *= dampFactor;
        // Return turbulence — small random perturbation for organic paths
        if (this.homeConfig.returnNoise > 0) {
          const noise = this.homeConfig.returnNoise * dt;
          this.velocity.x += (Math.random() - 0.5) * noise;
          this.velocity.y += (Math.random() - 0.5) * noise;
        }
      }
    }

    this.position.add(this.velocity, dt);
    this.rotation = this.rotation + this.rotationVelocity * dt;

    // Size: grow toward target, apply breathing if configured
    const baseSize = Math.min(this.factoredSize + this.scaleStep * dt, this.size);
    if (this.homePosition && this.homeConfig && this.homeConfig.breathingAmplitude > 0) {
      this.breathingPhase += this.homeConfig.breathingSpeed * dt;
      this.factoredSize = baseSize * (1 + Math.sin(this.breathingPhase) * this.homeConfig.breathingAmplitude);
    } else {
      this.factoredSize = baseSize;
    }

    this.alpha = Math.min(1, Math.max((this.lifeTime - this.lifeTick) / this.fadeTime, 0)) * this.baseAlpha;
    this.lifeTick += dt;
    this.dispatch('PARTICLE_UPDATE', this);
  }

  advanceTrail(dt = 1): void {
    this.updateTrail(false, dt);
  }

  private updateTrail(addCurrentPoint: boolean, dt = 1): void {
    if (!this.trail || this.trailLength <= 0) {
      if (this.trailSegments.length) this.trailSegments = [];
      return;
    }

    const maxAge = Math.max(1, Math.floor(this.trailLength));
    this.trailSegments = this.trailSegments
      .map((segment) => ({ ...segment, age: segment.age + dt }))
      .filter((segment) => segment.age < maxAge);

    if (!addCurrentPoint) return;

    // Do not add new trail points once particle is fully transparent.
    if (this.alpha <= 0) return;

    this.trailSegments.push({
      x: this.position.x,
      y: this.position.y,
      size: this.factoredSize,
      rotation: this.rotation,
      alpha: this.alpha,
      age: 0,
    });
  }

  resetImage(): void {
    this.image = null;
  }

  getRoundedLocation(): [number, number] {
    return [((this.position.x * 10) << 0) * 0.1, ((this.position.y * 10) << 0) * 0.1];
  }

  /** Deterministic pseudo-random interval from cycle number — same output for all particles in the same cycle. */
  private static deterministicInterval(cycle: number, min: number, max: number): number {
    const hash = Math.sin(cycle * 12.9898 + 78.233) * 43758.5453;
    const t = hash - Math.floor(hash);
    return min + t * (max - min);
  }

  private dispatch<T>(event: string, target: T): void {
    if (this.particular) {
      this.particular.dispatchEvent(event, target);
    }
  }

  destroy(): void {
    this.dispatch('PARTICLE_DEAD', this);
  }
}

EventDispatcher.bind(Particle);
