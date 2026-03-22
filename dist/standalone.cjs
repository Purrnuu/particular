'use strict';

// src/particular/utils/eventDispatcher.ts
var EventDispatcher = class _EventDispatcher {
  constructor() {
    this.listeners = null;
  }
  static bind(TargetClass) {
    TargetClass.prototype.dispatchEvent = _EventDispatcher.prototype.dispatchEvent;
    TargetClass.prototype.hasEventListener = _EventDispatcher.prototype.hasEventListener;
    TargetClass.prototype.addEventListener = _EventDispatcher.prototype.addEventListener;
    TargetClass.prototype.removeEventListener = _EventDispatcher.prototype.removeEventListener;
    TargetClass.prototype.removeAllEventListeners = _EventDispatcher.prototype.removeAllEventListeners;
  }
  addEventListener(type, listener) {
    if (!this.listeners) {
      this.listeners = {};
    } else {
      this.removeEventListener(type, listener);
    }
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
    return listener;
  }
  removeEventListener(type, listener) {
    if (!this.listeners) return;
    if (!this.listeners[type]) return;
    const arr = this.listeners[type];
    const { length } = arr;
    for (let i = 0; i < length; i++) {
      if (arr[i] === listener) {
        if (length === 1) {
          delete this.listeners[type];
        } else {
          arr.splice(i, 1);
        }
        break;
      }
    }
  }
  removeAllEventListeners(type) {
    if (!type) {
      this.listeners = null;
    } else if (this.listeners) {
      delete this.listeners[type];
    }
  }
  dispatchEvent(type, args) {
    let result = false;
    if (type && this.listeners) {
      const arr = this.listeners[type];
      if (!arr || arr.length === 0) return result;
      let i = arr.length;
      while (i--) {
        result = result || !!arr[i](args);
      }
    }
    return result;
  }
  hasEventListener(type) {
    return !!(this.listeners && this.listeners[type]);
  }
};

// src/particular/utils/vector.ts
var Vector = class _Vector {
  constructor(x, y, z) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }
  getMagnitude() {
    if (this.z === 0) {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  add(vector, scale = 1) {
    this.x += vector.x * scale;
    this.y += vector.y * scale;
    if (vector.z) this.z += vector.z * scale;
  }
  addFriction(friction, dt = 1) {
    if (friction <= 0) return;
    const factor = Math.pow(1 - friction, dt);
    this.x *= factor;
    this.y *= factor;
    if (this.z !== 0) this.z *= factor;
  }
  addGravity(gravity, dt = 1) {
    if (gravity === 0) return;
    this.y += gravity * dt;
  }
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    if (vector.z) this.z -= vector.z;
  }
  normalize() {
    const mag = this.getMagnitude();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
      this.z /= mag;
    }
  }
  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
  }
  getAngle() {
    return Math.atan2(this.y, this.x);
  }
  /** Elevation angle from the XY plane (radians). 0 = in-plane, +PI/2 = up z-axis. */
  getElevation() {
    const xyMag = Math.sqrt(this.x * this.x + this.y * this.y);
    return Math.atan2(this.z, xyMag);
  }
  static fromAngle(angle, magnitude) {
    return new _Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }
  /** Create a Vector from spherical coordinates (azimuth in XY plane, elevation from XY, magnitude). */
  static fromSpherical(azimuth, elevation, magnitude) {
    const cosElev = Math.cos(elevation);
    return new _Vector(
      magnitude * cosElev * Math.cos(azimuth),
      magnitude * cosElev * Math.sin(azimuth),
      magnitude * Math.sin(elevation)
    );
  }
};

// src/particular/presets.ts
var snowPalette = ["#ffffff", "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6"];
var grayscalePalette = ["#f8f9fa", "#dee2e6", "#adb5bd", "#868e96", "#495057", "#212529"];
var coolBluePalette = ["#d0ebff", "#a5d8ff", "#74c0fc", "#4dabf7", "#339af0", "#228be6"];
var bluePalette = ["#003d99", "#0057d9", "#0077ff", "#1a8cff", "#3da1ff", "#66b8ff"];
var orangePalette = ["#b33600", "#cc4a00", "#e86100", "#f57c00", "#ff9500", "#ffad33"];
var greenPalette = ["#006b3f", "#008c51", "#00a85e", "#00c46b", "#1edd80", "#4deda0"];
var mutedPalette = ["#d4a373", "#ccd5ae", "#e9edc9", "#a8dadc", "#b5838d", "#e5989b", "#8d99ae"];
var fireworksPalette = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#ff6b81", "#eccc68", "#7bed9f", "#70a1ff", "#ffffff"];
var meteorPalette = ["#ffffff", "#e0f0ff", "#80d0ff", "#40a0e0", "#2060c0", "#6040ff", "#a080ff"];
var waterPalette = ["#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da", "#00acc1", "#ffffff"];
var finlandPalette = ["#003580", "#002f6c", "#ffffff", "#f8f9fa"];
var usaPalette = ["#B22234", "#ffffff", "#3C3B6E"];
var magicPalette = ["#a5d8ff", "#74c0fc", "#4dabf7", "#d0bfff", "#b197fc", "#9775fa"];
var nebulaPalette = ["#a5d8ff", "#74c0fc", "#4dabf7", "#d0bfff", "#b197fc", "#9775fa", "#e599f7", "#f783ac"];
var solarPalette = ["#ff6b6b", "#ffa502", "#ff6348", "#ff4757", "#ffffff", "#ffd32a", "#ff9f1a"];
var autumnPalette = ["#c0392b", "#d35400", "#e67e22", "#f39c12", "#d4a574", "#8b4513", "#a0522d", "#cd853f"];
var ashPalette = ["#555566", "#606070", "#6a6a7a", "#757585", "#808090"];
var slatePalette = ["#3a4a4f", "#455558", "#4f6065", "#5a6b70", "#647578"];
var fairyPalette = ["#a5d8ff", "#74c0fc", "#d0bfff", "#b197fc", "#99e9f2", "#c3fae8"];
var amberPalette = ["#ffad33", "#ff9500", "#f57c00", "#e86100", "#ffcc66", "#ffd699"];
var rosePalette = ["#ff4757", "#ff6b81", "#ff8fa3", "#ffa8b8", "#ffc9d3", "#ffe0e6"];
var goldPalette = ["#ffd699", "#ffcc66", "#ffad33", "#ff9500", "#f57c00", "#e86100"];
var violetPalette = ["#d0bfff", "#b197fc", "#9775fa", "#845ef7", "#7048e8", "#5f3dc4"];
var emeraldPalette = ["#006b3f", "#00a85e", "#1edd80", "#4deda0", "#96f2c8", "#c3fae8"];
var birdsPalette = ["#2c2c2c", "#4a4a4a", "#6b5b4f", "#8b7355", "#a0926b", "#c4b8a0", "#d4cfc4", "#f5f0e8"];
var sunsetPalette = ["#ff6b35", "#e84545", "#c9184a", "#a4133c", "#ff8c42", "#d4a05a", "#845ec2", "#2c003e"];
var Burst = {
  /** Celebratory confetti burst: colorful rectangles fluttering outward and drifting down */
  confetti: {
    shape: "rectangle",
    blendMode: "normal",
    shadow: true,
    rate: 20,
    life: 28,
    velocity: Vector.fromAngle(-90, 7),
    spread: Math.PI * 0.85,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 6,
    fadeTime: 35,
    gravity: 0.14,
    gravityJitter: 0.2,
    scaleStep: 1.2,
    friction: 5e-3,
    maxCount: 500,
    colors: mutedPalette
  },
  /** Signature magical burst: glowing sparkles with soft trails */
  magic: {
    shape: "sparkle",
    blendMode: "additive",
    glow: true,
    glowSize: 10,
    glowColor: "#74c0fc",
    glowAlpha: 0.35,
    rate: 16,
    life: 34,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1.15,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 5,
    fadeTime: 35,
    gravity: 0.08,
    gravityJitter: 0.15,
    scaleStep: 0.9,
    friction: 5e-3,
    maxCount: 400,
    trail: true,
    trailLength: 8,
    trailFade: 0.35,
    trailShrink: 0.5,
    colors: magicPalette
  },
  /** Cinematic fireworks: glowing triangles with bright trailing bloom */
  fireworks: {
    shape: "triangle",
    blendMode: "additive",
    glow: true,
    glowSize: 8,
    glowColor: "#ff9500",
    glowAlpha: 0.3,
    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-90, 8.8),
    spread: Math.PI * 1.05,
    sizeMin: 3,
    sizeMax: 10,
    velocityMultiplier: 8,
    fadeTime: 22,
    gravity: 0.18,
    gravityJitter: 0.2,
    scaleStep: 1.15,
    friction: 3e-3,
    maxCount: 520,
    trail: true,
    trailLength: 10,
    trailFade: 0.3,
    trailShrink: 0.45,
    colors: mutedPalette
  },
  /** Fireworks with timed detonation: narrow upward launch that auto-explodes into colorful sub-bursts */
  fireworksDetonation: {
    shape: "triangle",
    blendMode: "additive",
    glow: true,
    glowSize: 8,
    glowColor: "#74c0fc",
    glowAlpha: 0.3,
    rate: 22,
    life: 24,
    velocity: Vector.fromAngle(-Math.PI / 2, 8.8),
    spread: Math.PI / 4,
    sizeMin: 3,
    sizeMax: 6,
    velocityMultiplier: 8,
    fadeTime: 20,
    gravity: 0.08,
    gravityJitter: 0.15,
    scaleStep: 1.15,
    maxCount: 3e3,
    particleLife: 80,
    trail: true,
    trailLength: 6,
    trailFade: 0.3,
    trailShrink: 0.5,
    detonate: {
      at: 0.7,
      childCount: 8,
      velocity: 5,
      velocitySpread: 0.6,
      friction: 0.015,
      scaleStep: 1,
      childLife: 45,
      sizeMin: 1,
      sizeMax: 4,
      fadeTime: 18,
      inheritColor: true,
      shape: "triangle",
      trail: true,
      trailLength: 4,
      trailFade: 0.5,
      trailShrink: 0.65
    }
  }
};
var Images = {
  /** Tuned for icon/image particles (no tint by default). */
  showcase: {
    shape: "roundedRectangle",
    blendMode: "normal",
    imageTint: false,
    glow: false,
    rate: 12,
    life: 36,
    velocity: Vector.fromAngle(-90, 5),
    spread: Math.PI * 1,
    sizeMin: 5,
    sizeMax: 22,
    velocityMultiplier: 4,
    fadeTime: 30,
    gravity: 0.2,
    scaleStep: 0.8,
    maxCount: 380
  }
};
var Ambient = {
  /** Gentle snowfall: soft white particles drifting downward across the viewport */
  snow: {
    shape: "circle",
    blendMode: "normal",
    glow: true,
    glowSize: 8,
    glowColor: "#ffffff",
    glowAlpha: 0.2,
    rate: 0.4,
    life: 999999,
    particleLife: 500,
    velocity: Vector.fromAngle(Math.PI / 2, 0.4),
    spread: Math.PI * 0.15,
    gravityJitter: 0.5,
    sizeMin: 1,
    sizeMax: 4,
    velocityMultiplier: 0.3,
    fadeTime: 60,
    gravity: 5e-3,
    acceleration: 0,
    accelerationSize: 1e-3,
    friction: 1e-3,
    frictionSize: 3e-3,
    scaleStep: 1,
    maxCount: 200,
    continuous: true,
    autoStart: true,
    colors: snowPalette
  },
  /** Meteors: fast diagonal streaks with long glowing trails, additive blending */
  meteors: {
    shape: "ring",
    blendMode: "additive",
    glow: true,
    glowSize: 14,
    glowColor: "#ff6d00",
    glowAlpha: 0.5,
    trail: true,
    trailLength: 12,
    trailFade: 0.25,
    trailShrink: 0.4,
    rate: 0.5,
    life: 999999,
    particleLife: 90,
    velocity: Vector.fromAngle(Math.PI * 0.65, 14),
    spread: Math.PI * 0.15,
    sizeMin: 2,
    sizeMax: 6,
    velocityMultiplier: 2,
    fadeTime: 20,
    gravity: 0.12,
    gravityJitter: 0.4,
    acceleration: 0.04,
    accelerationSize: 8e-3,
    friction: 0,
    frictionSize: 0,
    scaleStep: 1,
    maxCount: 100,
    continuous: true,
    autoStart: true,
    colors: meteorPalette
  },
  /** Fireworks show: gentle rockets launch from the bottom and auto-explode into colorful bursts */
  fireworksShow: {
    shape: "triangle",
    blendMode: "additive",
    glow: true,
    glowSize: 8,
    glowColor: "#ff9500",
    glowAlpha: 0.3,
    trail: true,
    trailLength: 6,
    trailFade: 0.3,
    trailShrink: 0.5,
    rate: 0.25,
    life: 999999,
    particleLife: 120,
    velocity: Vector.fromAngle(-Math.PI / 2, 7),
    spread: Math.PI / 6,
    sizeMin: 2,
    sizeMax: 4,
    velocityMultiplier: 3,
    fadeTime: 15,
    gravity: 0.05,
    gravityJitter: 0.15,
    scaleStep: 1,
    maxCount: 1200,
    continuous: true,
    autoStart: true,
    colors: fireworksPalette,
    detonate: {
      at: 0.65,
      childCount: 10,
      velocity: 4,
      velocitySpread: 0.6,
      friction: 0.02,
      scaleStep: 0.8,
      childLife: 50,
      sizeMin: 1,
      sizeMax: 3,
      fadeTime: 20,
      inheritColor: true,
      shape: "triangle",
      trail: true,
      trailLength: 4,
      trailFade: 0.5,
      trailShrink: 0.6
    }
  },
  /** Boids flock: self-organizing swarm of bird-like triangles. Use with addFlockingForce() for full effect. */
  flock: {
    shape: "triangle",
    blendMode: "additive",
    glow: true,
    glowSize: 12,
    glowColor: "#ffe0d0",
    glowAlpha: 0.5,
    trail: true,
    trailLength: 10,
    trailFade: 0.5,
    trailShrink: 0.8,
    rate: 1,
    life: 999999,
    particleLife: 600,
    velocity: Vector.fromAngle(0, 2),
    spread: Math.PI * 2,
    colors: sunsetPalette,
    sizeMin: 3,
    sizeMax: 6,
    velocityMultiplier: 3,
    fadeTime: 80,
    gravity: 0,
    acceleration: 0,
    accelerationSize: 0,
    friction: 0.01,
    frictionSize: 0,
    rotateToVelocity: true,
    scaleStep: 1,
    maxCount: 150,
    continuous: true,
    autoStart: true
  },
  /** River flow: horizontal stream of water particles, designed for use with attractors */
  river: {
    shape: "circle",
    blendMode: "normal",
    glow: true,
    glowSize: 6,
    glowColor: "#80deea",
    glowAlpha: 0.25,
    trail: true,
    trailLength: 6,
    trailFade: 0.5,
    trailShrink: 0.4,
    rate: 4,
    life: 999999,
    particleLife: 220,
    velocity: Vector.fromAngle(0, 1.8),
    spread: Math.PI / 10,
    sizeMin: 1,
    sizeMax: 4,
    velocityMultiplier: 0,
    fadeTime: 80,
    gravity: 0,
    friction: 0,
    scaleStep: 1,
    maxCount: 500,
    continuous: true,
    autoStart: true,
    colors: waterPalette
  }
};
var ImageParticles = {
  /** High-fidelity text rendered as tiny particles with spring return. */
  text: {
    shape: "square",
    blendMode: "normal",
    glow: false,
    maxCount: 1e4
  },
  /** Shape/icon rendered as particles with soft glow. */
  shape: {
    shape: "circle",
    blendMode: "normal",
    glow: true,
    glowSize: 8,
    glowAlpha: 0.3,
    maxCount: 1e4
  }
};
var Burst3D = {
  /** Spinning galaxy: spherical emission with slow orbit drift */
  galaxySpin: {
    shape: "ring",
    blendMode: "additive",
    glow: true,
    glowSize: 12,
    glowColor: "#b197fc",
    glowAlpha: 0.35,
    trail: true,
    trailLength: 14,
    trailFade: 0.35,
    trailShrink: 0.45,
    rate: 4,
    life: 999999,
    particleLife: 400,
    velocity: Vector.fromAngle(-90, 1),
    spread: Math.PI * 2,
    spread3d: Math.PI * 2,
    spawnDepth: 300,
    sizeMin: 2,
    sizeMax: 6,
    velocityMultiplier: 5,
    gravityJitter: 0.6,
    fadeTime: 80,
    gravity: 0,
    acceleration: 0,
    accelerationSize: 0,
    friction: 4e-3,
    scaleStep: 0.8,
    maxCount: 600,
    continuous: true,
    autoStart: true,
    colors: nebulaPalette
  },
  /** Depth field: particles spread along z-axis for parallax effect */
  depthField: {
    shape: "circle",
    blendMode: "normal",
    glow: true,
    glowSize: 8,
    glowColor: "#ffffff",
    glowAlpha: 0.2,
    rate: 0.5,
    life: 999999,
    particleLife: 400,
    velocity: Vector.fromAngle(Math.PI / 2, 0.3),
    spread: Math.PI * 0.2,
    spawnDepth: 600,
    spawnWidth: 400,
    sizeMin: 1,
    sizeMax: 5,
    velocityMultiplier: 0.3,
    fadeTime: 80,
    gravity: 2e-3,
    friction: 1e-3,
    scaleStep: 1,
    maxCount: 300,
    continuous: true,
    autoStart: true,
    colors: snowPalette
  },
  /** Supernova: explosive 3D burst with spherical emission */
  supernova: {
    shape: "star",
    blendMode: "additive",
    glow: true,
    glowSize: 14,
    glowColor: "#ff6b6b",
    glowAlpha: 0.4,
    trail: true,
    trailLength: 8,
    trailFade: 0.25,
    trailShrink: 0.4,
    rate: 30,
    life: 30,
    particleLife: 120,
    velocity: Vector.fromAngle(-90, 6),
    spread: Math.PI,
    spread3d: Math.PI,
    sizeMin: 2,
    sizeMax: 8,
    velocityMultiplier: 8,
    fadeTime: 40,
    gravity: 0,
    friction: 8e-3,
    scaleStep: 1.2,
    maxCount: 800,
    colors: solarPalette
  },
  /** 3D fireworks show: rockets launch upward and detonate into spherical sub-bursts */
  fireworks3d: {
    shape: "triangle",
    blendMode: "additive",
    glow: true,
    glowSize: 12,
    glowColor: "#ff9500",
    glowAlpha: 0.4,
    trail: true,
    trailLength: 6,
    trailFade: 0.3,
    trailShrink: 0.5,
    rate: 0.3,
    life: 999999,
    particleLife: 100,
    velocity: Vector.fromAngle(-Math.PI / 2, 7),
    spread: Math.PI / 8,
    spread3d: Math.PI / 8,
    spawnDepth: 150,
    spawnWidth: 0,
    sizeMin: 2,
    sizeMax: 4,
    velocityMultiplier: 2.5,
    fadeTime: 15,
    gravity: 0.05,
    acceleration: 0,
    accelerationSize: 0,
    friction: 3e-3,
    scaleStep: 1,
    maxCount: 2e3,
    continuous: true,
    autoStart: true,
    colors: fireworksPalette,
    detonate: {
      at: 0.65,
      childCount: 18,
      velocity: 4,
      velocitySpread: 0.5,
      friction: 0.012,
      scaleStep: 0.8,
      childLife: 60,
      sizeMin: 1,
      sizeMax: 3,
      fadeTime: 25,
      inheritColor: true,
      shape: "sparkle",
      spread3d: Math.PI,
      trail: true,
      trailLength: 5,
      trailFade: 0.4,
      trailShrink: 0.5,
      glow: true,
      glowSize: 10,
      glowColor: "#ffa502",
      glowAlpha: 0.45
    }
  }
};
var Colors = {
  /** White to offwhite range */
  snow: { colors: snowPalette },
  /** Full black-to-white range */
  grayscale: { colors: grayscalePalette },
  /** Single-hue cool blue range */
  coolBlue: { colors: coolBluePalette },
  /** Desaturated warm/cool mix */
  muted: { colors: mutedPalette },
  /** Bold saturated blue */
  blue: { colors: bluePalette },
  /** Bold saturated orange */
  orange: { colors: orangePalette },
  /** Bold saturated green */
  green: { colors: greenPalette },
  /** Finnish flag blue and white */
  finland: { colors: finlandPalette },
  /** American flag red, white, blue */
  usa: { colors: usaPalette },
  /** White-hot to deep red meteor palette */
  meteor: { colors: meteorPalette },
  /** Cyan-to-white water palette */
  water: { colors: waterPalette },
  /** Blue-purple sparkle (magic preset signature) */
  magic: { colors: magicPalette },
  /** Extended blue-purple-pink (galaxy/nebula effects) */
  nebula: { colors: nebulaPalette },
  /** Hot reds, oranges, whites (explosions/supernova) */
  solar: { colors: solarPalette },
  /** Earth tones: deep reds, burnt orange, sienna */
  autumn: { colors: autumnPalette },
  /** Dark greys for subtle/muted backgrounds */
  ash: { colors: ashPalette },
  /** Dark blue-grey tones */
  slate: { colors: slatePalette },
  /** Pastel blue, purple, teal, mint mix */
  fairy: { colors: fairyPalette },
  /** Warm glowing orange-gold */
  amber: { colors: amberPalette },
  /** Soft pink gradient from hot to pastel */
  rose: { colors: rosePalette },
  /** Warm yellow-orange gradient */
  gold: { colors: goldPalette },
  /** Deep violet-purple range */
  violet: { colors: violetPalette },
  /** Bright green to pastel mint */
  emerald: { colors: emeraldPalette },
  /** Natural bird flock: charcoals, browns, warm grays */
  birds: { colors: birdsPalette },
  /** Sunset murmuration: deep oranges, magentas, dusky purples */
  sunset: { colors: sunsetPalette },
  /** Multicolor vivid fireworks */
  fireworks: { colors: fireworksPalette }
};
var presetRegistry = {
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  imageText: ImageParticles.text,
  imageShape: ImageParticles.shape,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
  flock: Ambient.flock,
  river: Ambient.river,
  fireworksShow: Ambient.fireworksShow,
  galaxySpin: Burst3D.galaxySpin,
  depthField: Burst3D.depthField,
  supernova: Burst3D.supernova,
  fireworks3d: Burst3D.fireworks3d
};
var presets = {
  Burst,
  Burst3D,
  Images,
  ImageParticles,
  Ambient,
  Colors,
  // Backward-compatible aliases
  confetti: Burst.confetti,
  magic: Burst.magic,
  fireworks: Burst.fireworks,
  fireworksDetonation: Burst.fireworksDetonation,
  images: Images.showcase,
  imageText: ImageParticles.text,
  imageShape: ImageParticles.shape,
  snow: Ambient.snow,
  meteors: Ambient.meteors,
  flock: Ambient.flock,
  river: Ambient.river,
  fireworksShow: Ambient.fireworksShow,
  galaxySpin: Burst3D.galaxySpin,
  depthField: Burst3D.depthField,
  supernova: Burst3D.supernova,
  fireworks3d: Burst3D.fireworks3d
};
function getPreset(name) {
  return presetRegistry[name];
}
var colorPalettes = {
  snow: snowPalette,
  grayscale: grayscalePalette,
  coolBlue: coolBluePalette,
  muted: mutedPalette,
  finland: finlandPalette,
  usa: usaPalette,
  blue: bluePalette,
  orange: orangePalette,
  green: greenPalette,
  meteor: meteorPalette,
  water: waterPalette,
  magic: magicPalette,
  nebula: nebulaPalette,
  solar: solarPalette,
  autumn: autumnPalette,
  ash: ashPalette,
  slate: slatePalette,
  fairy: fairyPalette,
  amber: amberPalette,
  rose: rosePalette,
  gold: goldPalette,
  violet: violetPalette,
  emerald: emeraldPalette,
  birds: birdsPalette,
  sunset: sunsetPalette,
  fireworks: fireworksPalette
};

// src/particular/core/defaults.ts
var defaultParticular = {
  pixelRatio: 2,
  zIndex: 1e4,
  maxCount: 500,
  autoStart: false,
  continuous: false,
  webglMaxInstances: 4096,
  particlePoolSize: 2e3
};
var defaultParticle = {
  rate: 8,
  life: 30,
  particleLife: 100,
  velocity: Vector.fromAngle(-90, 5),
  spread: Math.PI / 1.3,
  sizeMin: 5,
  sizeMax: 15,
  velocityMultiplier: 6,
  fadeTime: 30,
  gravity: 0.15,
  gravityJitter: 0,
  scaleStep: 1,
  spawnWidth: 0,
  spawnHeight: 0,
  spawnDepth: 0,
  spread3d: 0,
  emitDirection: { x: 0, y: -1, z: 0 },
  colors: [],
  acceleration: 0,
  accelerationSize: 0.01,
  friction: 0,
  frictionSize: 5e-4,
  rotateToVelocity: false,
  shape: "circle",
  blendMode: "normal",
  glow: false,
  glowSize: 10,
  glowColor: "#ffffff",
  glowAlpha: 0.25,
  trail: false,
  trailLength: 3,
  trailFade: 0.75,
  trailShrink: 0.55,
  imageTint: false,
  shadow: false,
  shadowBlur: 9,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowColor: "#333333",
  shadowAlpha: 0.15
};
var defaultAttractor = {
  strength: 1,
  radius: 150,
  visible: false,
  size: 12,
  color: "#adb5bd",
  shape: "circle",
  glow: false,
  glowSize: 10,
  glowColor: "#adb5bd",
  glowAlpha: 0.35
};
var defaultMouseForce = {
  x: 0,
  y: 0,
  strength: 1,
  radius: 50,
  damping: 0.85,
  maxSpeed: 10,
  falloff: 1
};
var defaultFlockingForce = {
  neighborRadius: 100,
  separationWeight: 1.5,
  alignmentWeight: 1.5,
  cohesionWeight: 0.3,
  maxSteeringForce: 0.5,
  maxSpeed: 4,
  separationDistance: 25
};
var defaultExplosionChild = {
  childCount: 5,
  childLife: 40,
  sizeMin: 1,
  sizeMax: 3,
  velocity: 3,
  velocitySpread: 0.4,
  friction: 0.01,
  scaleStep: 1.5,
  gravity: 0.12,
  fadeTime: 15,
  inheritColor: true,
  shape: "circle",
  blendMode: "normal",
  glow: false,
  glowSize: 10,
  glowColor: "#ffffff",
  glowAlpha: 0.25,
  shadow: false,
  trail: true,
  trailLength: 3,
  trailFade: 0.6,
  trailShrink: 0.65,
  spread3d: 0
};
var defaultHomeConfig = {
  springStrength: 0.05,
  springDamping: 0.9,
  homeThreshold: 2,
  velocityThreshold: 0.5,
  wiggleAmplitude: 0,
  wiggleSpeed: 0.05,
  breathingAmplitude: 0,
  breathingSpeed: 0.03,
  waveAmplitude: 0,
  waveSpeed: 0.03,
  waveFrequency: 0.15,
  returnNoise: 0.3,
  idlePulseStrength: 2,
  idlePulseIntervalMin: 300,
  idlePulseIntervalMax: 1800
};
var defaultImageParticles = {
  alphaThreshold: 0.1,
  particleLife: Infinity,
  gravity: 0,
  fadeTime: 40,
  shape: "square",
  glow: false
};
var defaultElementParticles = {
  resolution: 300,
  shape: "triangle",
  hideElement: true,
  restoreElement: true
};
var defaultContainerGlow = {
  colors: magicPalette,
  rate: 0.5,
  sizeMin: 0.5,
  sizeMax: 2,
  particleLife: 60,
  fadeTime: 30,
  velocity: 0.4,
  spread: 0.3,
  friction: 0.01,
  shape: "sparkle",
  glow: true,
  glowColor: "#74c0fc",
  glowAlpha: 0.35,
  glowSize: 8,
  blendMode: "additive",
  pulseSpeed: 0.02,
  pulseAmplitude: 0.4
};
var defaultMouseTrail = {
  colors: magicPalette,
  rate: 1.5,
  sizeMin: 1,
  sizeMax: 3,
  particleLife: 40,
  fadeTime: 20,
  velocity: 1.5,
  spread: 0.8,
  friction: 0.02,
  shape: "sparkle",
  glow: true,
  glowColor: "#74c0fc",
  glowAlpha: 0.4,
  glowSize: 10,
  blendMode: "additive",
  trail: true,
  trailLength: 6,
  trailFade: 0.4,
  trailShrink: 0.5,
  minSpeed: 0.5
};
var defaultImageShatter = {
  chunkCount: 36,
  jitter: 0.4,
  velocity: 5,
  velocitySpread: 0.5,
  gravity: 0.12,
  rotationSpeed: 5,
  particleLife: 120,
  fadeTime: 40,
  friction: 5e-3,
  scaleStep: 100
};
var defaultWobble = {
  velocity: 0.8,
  rotation: 0.4,
  mouseRadius: 200,
  mouseStrength: 3
};
var defaultMouseWind = {
  strength: 0.12,
  radius: 100,
  damping: 0.92,
  maxSpeed: 8,
  falloff: 0.3
};
function configureParticular(configuration) {
  return { ...defaultParticular, ...defaultParticle, ...configuration };
}
function configureParticle(overrides, base) {
  return { ...defaultParticle, ...base, ...overrides };
}

// src/particular/utils/genericUtils.ts
function destroy(array, param) {
  let i = array.length;
  while (i--) {
    try {
      array[i]?.destroy(param);
    } catch (e) {
    }
  }
  array.splice(0, array.length);
}

// src/particular/utils/math.ts
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var TO_RADIANS = Math.PI / 180;
function degToRad(deg) {
  return deg * TO_RADIANS;
}

// src/particular/components/particle.ts
var freeSegments = [];
var _maxFreeSegments = 5e3;
var _particlePool = [];
var _maxPoolSize = 2e3;
function setParticlePoolSize(size) {
  _maxPoolSize = Math.max(0, size);
  if (_particlePool.length > _maxPoolSize) {
    _particlePool.length = _maxPoolSize;
  }
}
var Particle = class _Particle {
  constructor(params) {
    this.particular = null;
    this.image = null;
    this.isDetonationChild = false;
    this.rotateToVelocity = false;
    this.trailSegments = [];
    // Home position — spring return + idle animation
    this.homePosition = null;
    this.homeConfig = null;
    /** When false, idle animations (breathing, wiggle, wave, pulse) are suppressed. Spring return still works. */
    this.idleEnabled = true;
    /** When true, suppress the settle-snap behavior. Spring still runs but particles never hard-snap to home.
     *  Useful for interactive effects where external forces (wobble, drag) should keep particles in motion. */
    this.preventSettle = false;
    this.breathingPhase = Math.random() * Math.PI * 2;
    /** Per-particle spring multiplier (0.6–1.4) — breaks sync so particles return at different rates. */
    this.springMultiplier = 1;
    /** Monotonic tick counter for coordinated idle wave (never resets). */
    this.idleTicks = 0;
    /** How many pulse cycles this particle has completed. */
    this.pulseCycleCount = 0;
    /** Tick at which the next pulse wave starts (computed deterministically so all particles agree). */
    this.nextPulseAt = 0;
    /** Distance from image center (set once in constructor, used for ripple delay). */
    this.homeDistFromCenter = 0;
    /** Angle from image center to this particle's home (radians). Used for outward ripple direction. */
    this.homeAngleFromCenter = 0;
    // Cached squared thresholds — avoids 2× Math.sqrt per home-particle per frame
    this.homeThresholdSq = 0;
    this.velocityThresholdSq = 0;
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.shadowLightOrigin = new Vector(0, 0);
    this.friction = 0;
    this.rotation = 0;
    this.rotationDirection = 1;
    this.rotationVelocity = 0;
    this.factoredSize = 1;
    this.lifeTime = 100;
    this.lifeTick = 0;
    this.size = 5;
    this.gravity = 0;
    this.scaleStep = 1;
    this.fadeTime = 30;
    this.alpha = 1;
    this.baseAlpha = 1;
    this.color = "#888888";
    this.colorR = 0.533;
    this.colorG = 0.533;
    this.colorB = 0.533;
    this.shape = "circle";
    this.blendMode = "normal";
    this.glow = false;
    this.glowSize = 10;
    this.glowColor = "#ffffff";
    this.glowAlpha = 0.35;
    this.trail = false;
    this.trailLength = 3;
    this.trailFade = 0.75;
    this.trailShrink = 0.55;
    this.imageTint = false;
    this.shadow = false;
    this.shadowBlur = 8;
    this.shadowOffsetX = 3;
    this.shadowOffsetY = 3;
    this.shadowColor = "#000000";
    this.shadowAlpha = 0.3;
    this._reinit(params);
  }
  /** Acquire a particle from the pool or create a new one. */
  static create(params) {
    const p = _particlePool.pop();
    if (p) {
      p._reinit(params);
      return p;
    }
    return new _Particle(params);
  }
  /** Reinitialize all fields from params. Reuses existing Vector objects for pool efficiency. */
  _reinit({
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
    shape = "circle",
    blendMode = "normal",
    glow = false,
    glowSize = 10,
    glowColor = "#ffffff",
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
    shadowColor = "#000000",
    shadowAlpha = 0.3,
    rotateToVelocity = false,
    colors,
    homePosition,
    homeCenter,
    homeConfig
  }) {
    if (point) {
      this.position.x = point.x;
      this.position.y = point.y;
      this.position.z = point.z;
    } else {
      this.position.x = 0;
      this.position.y = 0;
      this.position.z = 0;
    }
    this.shadowLightOrigin.x = this.position.x;
    this.shadowLightOrigin.y = this.position.y;
    if (velocity) {
      this.velocity.x = velocity.x;
      this.velocity.y = velocity.y;
      this.velocity.z = velocity.z;
    } else {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.velocity.z = 0;
    }
    if (acceleration) {
      this.acceleration.x = acceleration.x;
      this.acceleration.y = acceleration.y;
      this.acceleration.z = acceleration.z;
    } else {
      this.acceleration.x = 0;
      this.acceleration.y = 0;
      this.acceleration.z = 0;
    }
    this.friction = friction ?? 0;
    this.rotateToVelocity = rotateToVelocity;
    if (rotateToVelocity && velocity) {
      this.rotation = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) - 90;
      this.rotationVelocity = 0;
    } else {
      this.rotation = Math.random() * 360;
      this.rotationVelocity = (Math.random() > 0.5 ? 1 : -1) * getRandomInt(1, 3);
    }
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.factoredSize = 1;
    this.lifeTime = particleLife === Infinity ? Infinity : getRandomInt(Math.round(particleLife * 0.75), particleLife);
    this.lifeTick = 0;
    this.size = size ?? getRandomInt(5, 15);
    this.gravity = gravity;
    this.scaleStep = scaleStep;
    this.fadeTime = fadeTime;
    this.alpha = 1;
    this.baseAlpha = baseAlpha;
    this.color = color ?? (colors && colors.length > 0 ? colors[Math.floor(Math.random() * colors.length)] : "#888888");
    const hex = this.color;
    this.colorR = parseInt(hex.slice(1, 3), 16) / 255;
    this.colorG = parseInt(hex.slice(3, 5), 16) / 255;
    this.colorB = parseInt(hex.slice(5, 7), 16) / 255;
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
    if (this.trailSegments.length > 0) {
      for (let i = 0; i < this.trailSegments.length; i++) {
        if (freeSegments.length < _maxFreeSegments) freeSegments.push(this.trailSegments[i]);
      }
      this.trailSegments.length = 0;
    }
    this.particular = null;
    this.image = null;
    this.isDetonationChild = false;
    this.idleEnabled = true;
    this.preventSettle = false;
    this.breathingPhase = Math.random() * Math.PI * 2;
    this.springMultiplier = 1;
    this.idleTicks = 0;
    this.pulseCycleCount = 0;
    this.nextPulseAt = 0;
    this.homeDistFromCenter = 0;
    this.homeAngleFromCenter = 0;
    this.homeThresholdSq = 0;
    this.velocityThresholdSq = 0;
    if (homePosition) {
      if (this.homePosition) {
        this.homePosition.x = homePosition.x;
        this.homePosition.y = homePosition.y;
        this.homePosition.z = homePosition.z;
      } else {
        this.homePosition = new Vector(homePosition.x, homePosition.y, homePosition.z);
      }
      this.homeConfig = { ...defaultHomeConfig, ...homeConfig };
      this.homeThresholdSq = this.homeConfig.homeThreshold * this.homeConfig.homeThreshold;
      this.velocityThresholdSq = this.homeConfig.velocityThreshold * this.homeConfig.velocityThreshold;
      this.rotation = 0;
      this.rotationVelocity = 0;
      this.springMultiplier = 0.6 + Math.random() * 0.8;
      this.nextPulseAt = _Particle.deterministicInterval(
        0,
        this.homeConfig.idlePulseIntervalMin,
        this.homeConfig.idlePulseIntervalMax
      );
      if (homeCenter) {
        const cdx = homePosition.x - homeCenter.x;
        const cdy = homePosition.y - homeCenter.y;
        this.homeDistFromCenter = Math.sqrt(cdx * cdx + cdy * cdy);
        this.homeAngleFromCenter = Math.atan2(cdy, cdx);
      }
    } else {
      this.homePosition = null;
      this.homeConfig = null;
    }
  }
  init(image, particular) {
    this.image = image;
    this.particular = particular;
    this.dispatch("PARTICLE_CREATED", this);
  }
  update(forces, dt = 1) {
    if (this.homePosition && this.homeConfig && !this.preventSettle && this.velocity.x === 0 && this.velocity.y === 0 && this.velocity.z === 0 && this.position.x === this.homePosition.x && this.position.y === this.homePosition.y && this.position.z === this.homePosition.z) {
      if (forces && forces.length > 0) {
        for (let i = 0; i < forces.length; i++) {
          const f = forces[i].getForce(this.position, this);
          this.velocity.x += f.x * dt;
          this.velocity.y += f.y * dt;
        }
      }
      if (this.homeConfig.idlePulseStrength > 0 && this.homeConfig.idlePulseIntervalMin > 0) {
        this.idleTicks += dt;
        if (this.idleEnabled) {
          const waveDelay = this.homeDistFromCenter * 0.3;
          if (this.idleTicks >= this.nextPulseAt + waveDelay) {
            const angle = this.homeAngleFromCenter + (Math.random() - 0.5) * 1;
            const mag = this.homeConfig.idlePulseStrength * (0.6 + Math.random() * 0.4);
            this.velocity.x = Math.cos(angle) * mag;
            this.velocity.y = Math.sin(angle) * mag;
            this.pulseCycleCount++;
            this.nextPulseAt += _Particle.deterministicInterval(
              this.pulseCycleCount,
              this.homeConfig.idlePulseIntervalMin,
              this.homeConfig.idlePulseIntervalMax
            );
          }
        }
      }
      if (this.factoredSize < this.size) {
        this.factoredSize = Math.min(this.factoredSize + this.scaleStep * dt, this.size);
      } else if (this.factoredSize > this.size) {
        this.factoredSize = this.size;
      } else if (this.idleEnabled && this.homeConfig.breathingAmplitude > 0) {
        this.breathingPhase += this.homeConfig.breathingSpeed * dt;
        this.factoredSize = this.size * (1 + Math.sin(this.breathingPhase) * this.homeConfig.breathingAmplitude);
      }
      if (this.velocity.x === 0 && this.velocity.y === 0) {
        if (this.particular && this.particular.hasEventListener("PARTICLE_UPDATE")) {
          this.particular.dispatchEvent("PARTICLE_UPDATE", this);
        }
        return;
      }
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
      if (this.particular && this.particular.hasEventListener("PARTICLE_UPDATE")) {
        this.particular.dispatchEvent("PARTICLE_UPDATE", this);
      }
      return;
    }
    if (this.trail) this.updateTrail(true, dt);
    this.velocity.x += this.acceleration.x * dt;
    this.velocity.y += this.acceleration.y * dt;
    this.velocity.z += this.acceleration.z * dt;
    if (this.friction > 0) {
      const frictionFactor = Math.pow(1 - this.friction, dt);
      this.velocity.x *= frictionFactor;
      this.velocity.y *= frictionFactor;
      if (this.velocity.z !== 0) this.velocity.z *= frictionFactor;
    }
    if (this.gravity !== 0) {
      this.velocity.y += this.gravity * dt;
    }
    if (forces && forces.length > 0) {
      for (let i = 0; i < forces.length; i++) {
        const f = forces[i].getForce(this.position, this);
        this.velocity.x += f.x * dt;
        this.velocity.y += f.y * dt;
      }
    }
    if (this.homePosition && this.homeConfig) {
      const dx = this.homePosition.x - this.position.x;
      const dy = this.homePosition.y - this.position.y;
      const dz = this.homePosition.z - this.position.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      const speedSq = this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y + this.velocity.z * this.velocity.z;
      const isSettled = !this.preventSettle && distSq < this.homeThresholdSq && speedSq < this.velocityThresholdSq;
      if (this.homeConfig.idlePulseStrength > 0 && this.homeConfig.idlePulseIntervalMin > 0) {
        this.idleTicks += dt;
      }
      if (isSettled) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.velocity.z = 0;
        this.position.x = this.homePosition.x;
        this.position.y = this.homePosition.y;
        this.position.z = this.homePosition.z;
        this.rotationVelocity = 0;
        this.rotation = 0;
        if (this.idleEnabled && this.homeConfig.idlePulseStrength > 0 && this.homeConfig.idlePulseIntervalMin > 0) {
          const waveDelay = this.homeDistFromCenter * 0.3;
          if (this.idleTicks >= this.nextPulseAt + waveDelay) {
            const angle = this.homeAngleFromCenter + (Math.random() - 0.5) * 1;
            const mag = this.homeConfig.idlePulseStrength * (0.6 + Math.random() * 0.4);
            this.velocity.x = Math.cos(angle) * mag;
            this.velocity.y = Math.sin(angle) * mag;
            this.pulseCycleCount++;
            this.nextPulseAt += _Particle.deterministicInterval(
              this.pulseCycleCount,
              this.homeConfig.idlePulseIntervalMin,
              this.homeConfig.idlePulseIntervalMax
            );
          }
        }
      } else {
        const k = this.homeConfig.springStrength * this.springMultiplier;
        this.velocity.x += dx * k * dt;
        this.velocity.y += dy * k * dt;
        if (dz !== 0) this.velocity.z += dz * k * dt;
        const dampFactor = Math.pow(this.homeConfig.springDamping, dt);
        this.velocity.x *= dampFactor;
        this.velocity.y *= dampFactor;
        if (this.velocity.z !== 0) this.velocity.z *= dampFactor;
        if (this.homeConfig.returnNoise > 0) {
          const noise = this.homeConfig.returnNoise * dt;
          this.velocity.x += (Math.random() - 0.5) * noise;
          this.velocity.y += (Math.random() - 0.5) * noise;
        }
        if (this.rotationVelocity !== 0 || this.rotation !== 0) {
          this.rotationVelocity *= dampFactor;
          let normRot = (this.rotation % 360 + 540) % 360 - 180;
          this.rotationVelocity -= normRot * k * dt;
        }
      }
    }
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    if (this.velocity.z !== 0) this.position.z += this.velocity.z * dt;
    if (this.rotateToVelocity) {
      this.rotation = Math.atan2(this.velocity.y, this.velocity.x) * (180 / Math.PI) - 90;
    } else {
      this.rotation = this.rotation + this.rotationVelocity * dt;
    }
    const baseSize = Math.min(this.factoredSize + this.scaleStep * dt, this.size);
    if (this.idleEnabled && this.homePosition && this.homeConfig && this.homeConfig.breathingAmplitude > 0) {
      this.breathingPhase += this.homeConfig.breathingSpeed * dt;
      this.factoredSize = baseSize * (1 + Math.sin(this.breathingPhase) * this.homeConfig.breathingAmplitude);
    } else {
      this.factoredSize = baseSize;
    }
    if (this.homePosition) {
      this.alpha = this.baseAlpha;
    } else {
      this.alpha = Math.min(1, Math.max((this.lifeTime - this.lifeTick) / this.fadeTime, 0)) * this.baseAlpha;
      this.lifeTick += dt;
    }
    if (this.particular && this.particular.hasEventListener("PARTICLE_UPDATE")) {
      this.particular.dispatchEvent("PARTICLE_UPDATE", this);
    }
  }
  advanceTrail(dt = 1) {
    this.updateTrail(false, dt);
  }
  updateTrail(addCurrentPoint, dt = 1) {
    if (!this.trail || this.trailLength <= 0) {
      if (this.trailSegments.length) {
        for (let i = 0; i < this.trailSegments.length; i++) {
          if (freeSegments.length < _maxFreeSegments) freeSegments.push(this.trailSegments[i]);
        }
        this.trailSegments.length = 0;
      }
      return;
    }
    const maxAge = Math.max(1, Math.floor(this.trailLength));
    let writeIdx = 0;
    for (let i = 0; i < this.trailSegments.length; i++) {
      const segment = this.trailSegments[i];
      segment.age += dt;
      if (segment.age < maxAge) {
        this.trailSegments[writeIdx++] = segment;
      } else {
        if (freeSegments.length < _maxFreeSegments) freeSegments.push(segment);
      }
    }
    this.trailSegments.length = writeIdx;
    if (!addCurrentPoint) return;
    if (this.alpha <= 0) return;
    const seg = freeSegments.pop();
    if (seg) {
      seg.x = this.position.x;
      seg.y = this.position.y;
      seg.z = this.position.z;
      seg.size = this.factoredSize;
      seg.rotation = this.rotation;
      seg.alpha = this.alpha;
      seg.age = 0;
      this.trailSegments.push(seg);
    } else {
      this.trailSegments.push({
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
        size: this.factoredSize,
        rotation: this.rotation,
        alpha: this.alpha,
        age: 0
      });
    }
  }
  resetImage() {
    this.image = null;
  }
  getRoundedLocation() {
    return [(this.position.x * 10 << 0) * 0.1, (this.position.y * 10 << 0) * 0.1];
  }
  /** Deterministic pseudo-random interval from cycle number — same output for all particles in the same cycle. */
  static deterministicInterval(cycle, min, max) {
    const hash = Math.sin(cycle * 12.9898 + 78.233) * 43758.5453;
    const t = hash - Math.floor(hash);
    return min + t * (max - min);
  }
  /** Fast-path dispatch: skip entirely when no listeners are registered (the common case). */
  dispatch(event, target) {
    if (this.particular && this.particular.hasEventListener(event)) {
      this.particular.dispatchEvent(event, target);
    }
  }
  /** Dispatch PARTICLE_DEAD event and return this particle to the pool for reuse. */
  destroy() {
    this.dispatch("PARTICLE_DEAD", this);
    for (let i = 0; i < this.trailSegments.length; i++) {
      if (freeSegments.length < _maxFreeSegments) freeSegments.push(this.trailSegments[i]);
    }
    this.trailSegments.length = 0;
    this.particular = null;
    this.image = null;
    this.homePosition = null;
    this.homeConfig = null;
    if (_particlePool.length < _maxPoolSize) {
      _particlePool.push(this);
    }
  }
};
EventDispatcher.bind(Particle);

// src/particular/core/particular.ts
var _Particular = class _Particular {
  constructor() {
    this.isOn = false;
    this.emitters = [];
    this.attractors = [];
    this.mouseForces = [];
    this.flockingForces = [];
    this.renderers = [];
    this.maxCount = defaultParticular.maxCount;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 2;
    /** Multiplier for kill-zone bounds. 3D renderers set this higher so perspective-visible particles aren't culled prematurely. */
    this.boundsPadding = 1;
    this.continuous = false;
    this.container = null;
    this.animateRequest = null;
    this.lastTimestamp = -1;
    this._combinedForces = [];
    this._allParticlesCache = [];
    this.update = (timestamp) => {
      this.animateRequest = window.requestAnimationFrame(this.update);
      if (this.isOn) {
        let dt = 1;
        if (timestamp !== void 0 && this.lastTimestamp >= 0) {
          dt = Math.min((timestamp - this.lastTimestamp) * 60 / 1e3, 3);
        }
        if (timestamp !== void 0) {
          this.lastTimestamp = timestamp;
        }
        this.dispatchEvent(_Particular.UPDATE);
        this.updateEmitters(dt);
        this.dispatchEvent(_Particular.UPDATE_AFTER);
      }
    };
  }
  initialize({
    maxCount = defaultParticular.maxCount,
    continuous = defaultParticular.continuous,
    pixelRatio = defaultParticular.pixelRatio,
    particlePoolSize = defaultParticular.particlePoolSize,
    container
  }) {
    this.maxCount = maxCount;
    this.continuous = continuous;
    this.pixelRatio = pixelRatio;
    this.container = container ?? null;
    setParticlePoolSize(particlePoolSize);
    this.update();
  }
  start() {
    this.isOn = true;
  }
  stop() {
    if (this.isOn) {
      this.isOn = false;
      this.dispatchEvent(_Particular.UPDATE_AFTER);
    }
  }
  onResize() {
    if (this.container) {
      const height = this.height = this.container.clientHeight;
      const width = this.width = this.container.clientWidth;
      this.dispatchEvent(_Particular.RESIZE, { width, height });
    } else {
      const height = this.height = window.innerHeight;
      const width = this.width = window.innerWidth;
      this.dispatchEvent(_Particular.RESIZE, { width, height });
    }
  }
  addRenderer(renderer) {
    this.renderers.push(renderer);
    renderer.init(this, this.pixelRatio);
    this.start();
    if (this.width > 0 && this.height > 0) {
      this.dispatchEvent(_Particular.RESIZE, { width: this.width, height: this.height });
    }
  }
  addEmitter(emitter) {
    this.emitters.push(emitter);
    emitter.assignParticular(this);
    this.start();
  }
  addAttractor(attractor) {
    this.attractors.push(attractor);
  }
  removeAttractor(attractor) {
    const index = this.attractors.indexOf(attractor);
    if (index !== -1) {
      this.attractors.splice(index, 1);
    }
  }
  addMouseForce(mouseForce) {
    this.mouseForces.push(mouseForce);
  }
  removeMouseForce(mouseForce) {
    const index = this.mouseForces.indexOf(mouseForce);
    if (index !== -1) {
      this.mouseForces.splice(index, 1);
    }
  }
  addFlockingForce(flockingForce) {
    this.flockingForces.push(flockingForce);
  }
  removeFlockingForce(flockingForce) {
    const index = this.flockingForces.indexOf(flockingForce);
    if (index !== -1) {
      this.flockingForces.splice(index, 1);
    }
  }
  updateEmitters(dt = 1) {
    if (this.getCount() <= this.maxCount) {
      for (const emitter of this.emitters) {
        emitter.emit(dt);
      }
    }
    for (const mf of this.mouseForces) {
      mf.decay(dt);
    }
    if (this.flockingForces.length > 0) {
      const allParticles = this.getAllParticles();
      for (const ff of this.flockingForces) {
        ff.boundsWidth = this.width / this.pixelRatio;
        ff.boundsHeight = this.height / this.pixelRatio;
        ff.preCompute(allParticles, dt);
      }
    }
    let forces;
    const hasExtra = this.mouseForces.length > 0 || this.flockingForces.length > 0;
    if (hasExtra) {
      const combined = this._combinedForces;
      combined.length = 0;
      for (const a of this.attractors) combined.push(a);
      for (const mf of this.mouseForces) combined.push(mf);
      for (const ff of this.flockingForces) combined.push(ff);
      forces = combined;
    } else {
      forces = this.attractors;
    }
    const margin = this.boundsPadding - 1;
    const bx = this.width * (1 + margin);
    const by = this.height * (1 + margin);
    const mx = this.width * margin;
    const my = this.height * margin;
    for (const emitter of this.emitters) {
      emitter.update(bx, by, mx, my, forces, dt);
    }
    let writeIdx = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i];
      if (this.continuous || emitter.isAlive()) {
        this.emitters[writeIdx++] = emitter;
      } else {
        emitter.destroy();
      }
    }
    this.emitters.length = writeIdx;
    if (!this.emitters.length) {
      this.stop();
    }
  }
  getCount() {
    let count = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      count += this.emitters[i].particles.length;
    }
    return count;
  }
  getAllParticles() {
    const particles = this._allParticlesCache;
    particles.length = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i];
      for (let j = 0; j < emitter.particles.length; j++) {
        particles.push(emitter.particles[j]);
      }
    }
    return particles;
  }
  destroy() {
    if (this.animateRequest !== null) {
      window.cancelAnimationFrame(this.animateRequest);
    }
    destroy(this.renderers);
    destroy(this.emitters);
    this.attractors = [];
    this.flockingForces = [];
    destroy(this.mouseForces);
  }
};
_Particular.UPDATE = "UPDATE";
_Particular.UPDATE_AFTER = "UPDATE_AFTER";
_Particular.RESIZE = "RESIZE";
var Particular = _Particular;
EventDispatcher.bind(Particular);

// src/particular/utils/color.ts
function hslToHex(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function generateHarmoniousPalette() {
  const baseHue = Math.random() * 360;
  const offsets = [-20, -8, 0, 10, 20, 30];
  const saturations = [65, 75, 85, 80, 70, 60];
  const lightnesses = [82, 68, 55, 48, 60, 42];
  const colors = [];
  for (let i = 0; i < 6; i++) {
    const h = (baseHue + offsets[i] + 360) % 360;
    colors.push(hslToHex(h, saturations[i], lightnesses[i]));
  }
  return colors;
}

// src/particular/utils/explosion.ts
function createExplosionChild(parent, config, engine, fallbackColors) {
  const merged = { ...defaultExplosionChild, ...config };
  const size = getRandomInt(merged.sizeMin, merged.sizeMax);
  const spread = merged.velocitySpread;
  const speed = merged.velocity * (1 - spread + Math.random() * spread * 2);
  let velocity;
  if (merged.spread3d && merged.spread3d > 0) {
    const azimuth = Math.random() * Math.PI * 2;
    const halfAngle = Math.min(merged.spread3d * 0.5, Math.PI / 2);
    const maxSin = Math.sin(halfAngle);
    const elevation = Math.asin(maxSin * (2 * Math.random() - 1));
    velocity = Vector.fromSpherical(azimuth, elevation, speed);
  } else {
    const angle = Math.random() * Math.PI * 2;
    velocity = Vector.fromAngle(angle, speed);
  }
  const colors = merged.inheritColor ? [parent.color] : fallbackColors.length > 0 ? fallbackColors : [parent.color];
  const particle = Particle.create({
    point: new Vector(parent.x, parent.y, parent.z ?? 0),
    velocity,
    acceleration: new Vector(0, 0),
    friction: merged.friction,
    size,
    particleLife: merged.childLife,
    gravity: merged.gravity,
    scaleStep: merged.scaleStep,
    fadeTime: merged.fadeTime,
    shape: merged.shape !== defaultExplosionChild.shape ? merged.shape : parent.shape,
    blendMode: merged.blendMode !== defaultExplosionChild.blendMode ? merged.blendMode : parent.blendMode,
    glow: merged.glow,
    glowSize: merged.glowSize,
    glowColor: merged.glowColor,
    glowAlpha: merged.glowAlpha,
    shadow: merged.shadow,
    trail: merged.trail,
    trailLength: merged.trailLength,
    trailFade: merged.trailFade,
    trailShrink: merged.trailShrink,
    colors
  });
  particle.init(null, engine);
  return particle;
}

// src/particular/components/emitter.ts
var Emitter = class {
  constructor(configuration) {
    this.particles = [];
    this.isEmitting = false;
    this.particular = null;
    this.lifeCycle = 0;
    this.emitAccumulator = 0;
    this._newChildren = [];
    if (!configuration.colors || configuration.colors.length === 0) {
      this.configuration = { ...configuration, colors: generateHarmoniousPalette() };
    } else {
      this.configuration = configuration;
    }
  }
  emit(dt = 1) {
    if (!this.isEmitting) return;
    if (!this.particular) return;
    this.emitAccumulator += this.configuration.rate * dt;
    const count = Math.floor(this.emitAccumulator);
    this.emitAccumulator -= count;
    for (let j = 0; j < count; j++) {
      const particle = this.createParticle();
      const icons = this.configuration.icons;
      const icon = icons.length > 0 ? icons[Math.floor(Math.random() * icons.length)] : null;
      particle.init(icon, this.particular);
      this.particles.push(particle);
    }
  }
  assignParticular(particular) {
    this.particular = particular;
  }
  update(boundsX, boundsY, marginX, marginY, forces, dt = 1) {
    let writeIdx = 0;
    const detonate = this.configuration.detonate;
    const newChildren = this._newChildren;
    newChildren.length = 0;
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const pos = particle.position;
      if (pos.x < -marginX || pos.x > boundsX || pos.y < -marginY || pos.y > boundsY) {
        if (particle.homePosition) {
          particle.update(forces, dt);
          this.particles[writeIdx++] = particle;
          continue;
        }
        const hasTrail = particle.trail && particle.trailSegments.length > 0;
        if (hasTrail) {
          particle.advanceTrail(dt);
          if (particle.trailSegments.length > 0) {
            this.particles[writeIdx++] = particle;
          } else {
            particle.destroy();
          }
        } else {
          particle.destroy();
        }
        continue;
      }
      particle.update(forces, dt);
      if (detonate && !particle.isDetonationChild && this.particular && particle.lifeTick >= particle.lifeTime * detonate.at) {
        const childCount = detonate.childCount ?? 5;
        const budget = Math.max(0, this.particular.maxCount - this.particular.getCount() - newChildren.length);
        const toSpawn = Math.min(childCount, budget);
        for (let j = 0; j < toSpawn; j++) {
          const child = createExplosionChild(
            {
              x: particle.position.x,
              y: particle.position.y,
              z: particle.position.z,
              color: particle.color,
              shape: particle.shape,
              blendMode: particle.blendMode
            },
            detonate,
            this.particular,
            this.configuration.colors
          );
          child.isDetonationChild = true;
          newChildren.push(child);
        }
        particle.destroy();
        continue;
      }
      const trailActive = particle.trail && particle.trailSegments.length > 0;
      const fadedOut = particle.alpha <= 0 && particle.lifeTick >= particle.lifeTime;
      if (!fadedOut || trailActive) {
        this.particles[writeIdx++] = particle;
      } else {
        particle.destroy();
      }
    }
    this.particles.length = writeIdx;
    for (let i = 0; i < newChildren.length; i++) {
      this.particles.push(newChildren[i]);
    }
    this.isEmitting = this.particular?.continuous ? true : this.lifeCycle < this.configuration.life;
  }
  isAlive() {
    return this.isEmitting || this.particles.length > 0;
  }
  createParticle() {
    const {
      velocity,
      spread,
      point,
      sizeMin,
      sizeMax,
      velocityMultiplier,
      particleLife,
      gravity,
      gravityJitter,
      scaleStep,
      fadeTime,
      spawnWidth,
      spawnHeight,
      spawnDepth,
      spread3d,
      emitDirection,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      rotateToVelocity,
      colors,
      acceleration: accelBase,
      accelerationSize,
      friction: frictionBase,
      frictionSize
    } = this.configuration;
    const magnitude = velocity.getMagnitude();
    const offsetX = spawnWidth > 0 ? (Math.random() - 0.5) * spawnWidth : 0;
    const offsetY = spawnHeight > 0 ? (Math.random() - 0.5) * spawnHeight : 0;
    const offsetZ = spawnDepth > 0 ? (Math.random() - 0.5) * spawnDepth : 0;
    const newPoint = new Vector(point.x + offsetX, point.y + offsetY, point.z + offsetZ);
    let newVelocity;
    if (spread3d > 0) {
      const baseAzimuth = Math.atan2(emitDirection.y, emitDirection.x);
      const baseElevation = Math.atan2(emitDirection.z, Math.sqrt(emitDirection.x * emitDirection.x + emitDirection.y * emitDirection.y));
      const azimuth = baseAzimuth + (Math.random() - 0.5) * 2 * Math.PI;
      const halfAngle = Math.min(spread3d * 0.5, Math.PI / 2);
      const maxSin = Math.sin(halfAngle);
      const elevation = baseElevation + Math.asin(maxSin * (2 * Math.random() - 1));
      newVelocity = Vector.fromSpherical(azimuth, elevation, magnitude);
    } else {
      const angle = velocity.getAngle() + spread - Math.random() * spread * 2;
      newVelocity = Vector.fromAngle(angle, magnitude);
    }
    const size = getRandomInt(sizeMin, sizeMax);
    newVelocity.add({ x: 0, y: -((sizeMax - size) / 15) * velocityMultiplier });
    const friction = frictionBase + frictionSize * size;
    const acceleration = new Vector(0, accelBase + accelerationSize * size);
    const jitter = gravityJitter ?? 0;
    const jitteredGravity = jitter > 0 ? gravity * (1 - jitter + Math.random() * jitter * 2) : gravity;
    this.lifeCycle++;
    return Particle.create({
      point: newPoint,
      velocity: newVelocity,
      acceleration,
      friction,
      size,
      particleLife,
      gravity: jitteredGravity,
      scaleStep,
      fadeTime,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      rotateToVelocity,
      colors
    });
  }
  destroy() {
    destroy(this.particles);
  }
};

// src/particular/components/attractor.ts
var _tempForce = new Vector(0, 0);
var Attractor = class {
  constructor(config) {
    this._resolvedImage = null;
    const merged = { ...defaultAttractor, ...config };
    this.position = new Vector(merged.x, merged.y, config.z ?? 0);
    this.strength = merged.strength;
    this.radius = merged.radius;
    this.visible = merged.visible;
    this.icon = config.icon ?? null;
    this.size = merged.size;
    this.color = merged.color;
    this.shape = merged.shape;
    this.glow = merged.glow;
    this.glowSize = merged.glowSize;
    this.glowColor = merged.glowColor;
    this.glowAlpha = merged.glowAlpha;
    if (typeof this.icon === "string") {
      const img = new Image();
      img.src = this.icon;
      this._resolvedImage = img;
    } else if (this.icon instanceof HTMLImageElement) {
      this._resolvedImage = this.icon;
    }
  }
  getForce(particlePosition) {
    const dx = this.position.x - particlePosition.x;
    const dy = this.position.y - particlePosition.y;
    const dz = this.position.z - particlePosition.z;
    const dist = dz === 0 ? Math.sqrt(dx * dx + dy * dy) : Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist === 0 || dist > this.radius) {
      _tempForce.x = 0;
      _tempForce.y = 0;
      _tempForce.z = 0;
      return _tempForce;
    }
    const scale = this.strength * (1 - dist / this.radius) / dist;
    _tempForce.x = dx * scale;
    _tempForce.y = dy * scale;
    _tempForce.z = dz * scale;
    return _tempForce;
  }
  /** Returns a lightweight Particle-compatible object for use by renderers. */
  toDrawable() {
    const image = this._resolvedImage;
    return {
      position: this.position,
      factoredSize: this.size,
      rotation: 0,
      alpha: 1,
      color: this.color,
      shape: this.shape,
      blendMode: "normal",
      glow: this.glow,
      glowSize: this.glowSize,
      glowColor: this.glowColor,
      glowAlpha: this.glowAlpha,
      shadow: false,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: "#000000",
      shadowAlpha: 0,
      shadowLightOrigin: this.position,
      image,
      imageTint: false,
      trail: false,
      trailSegments: [],
      trailLength: 0,
      getRoundedLocation: () => [
        (this.position.x * 10 << 0) * 0.1,
        (this.position.y * 10 << 0) * 0.1
      ]
    };
  }
};

// src/particular/components/mouseForce.ts
var _tempForce2 = new Vector(0, 0);
var MouseForce = class {
  constructor(config = {}) {
    /** When set, particle positions are projected to screen space before computing distance.
     *  Used by the 3D renderer so the mouse affects particles based on visual proximity. */
    this.projectToScreen = null;
    this._trackListener = null;
    this._touchListener = null;
    this._trackTarget = null;
    this._pixelRatio = 1;
    this._container = null;
    this._cachedRect = null;
    this._rectDirty = true;
    this._rectInvalidator = null;
    this._resizeObserver = null;
    const merged = { ...defaultMouseForce, ...config };
    this.position = new Vector(merged.x, merged.y);
    this.velocity = new Vector(0, 0);
    this.strength = merged.strength;
    this.radius = merged.radius;
    this.damping = merged.damping;
    this.maxSpeed = merged.maxSpeed;
    this.falloff = merged.falloff;
  }
  get isTracking() {
    return this._trackTarget !== null;
  }
  startTracking(target, pixelRatio, container) {
    this.stopTracking();
    this._pixelRatio = pixelRatio;
    this._container = container ?? null;
    this._rectDirty = true;
    this._cachedRect = null;
    if (this._container) {
      this._rectInvalidator = () => {
        this._rectDirty = true;
      };
      this._resizeObserver = new ResizeObserver(this._rectInvalidator);
      this._resizeObserver.observe(this._container);
      window.addEventListener("scroll", this._rectInvalidator, { passive: true });
      this._container.addEventListener("scroll", this._rectInvalidator, { passive: true });
    }
    const handleCoords = (clientX, clientY) => {
      let x = clientX;
      let y = clientY;
      if (this._container) {
        if (this._rectDirty || !this._cachedRect) {
          const rect = this._container.getBoundingClientRect();
          this._cachedRect = { left: rect.left, top: rect.top };
          this._rectDirty = false;
        }
        x -= this._cachedRect.left;
        y -= this._cachedRect.top;
      }
      this.updatePosition(x / this._pixelRatio, y / this._pixelRatio);
    };
    this._trackListener = (e) => {
      handleCoords(e.clientX, e.clientY);
    };
    this._touchListener = (e) => {
      const touch = e.touches[0];
      if (touch) {
        handleCoords(touch.clientX, touch.clientY);
      }
    };
    this._trackTarget = target;
    target.addEventListener("mousemove", this._trackListener);
    target.addEventListener("touchmove", this._touchListener, { passive: true });
    target.addEventListener("touchstart", this._touchListener, { passive: true });
  }
  stopTracking() {
    if (this._trackTarget) {
      if (this._trackListener) {
        this._trackTarget.removeEventListener("mousemove", this._trackListener);
      }
      if (this._touchListener) {
        this._trackTarget.removeEventListener("touchmove", this._touchListener);
        this._trackTarget.removeEventListener("touchstart", this._touchListener);
      }
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._rectInvalidator) {
      window.removeEventListener("scroll", this._rectInvalidator);
      if (this._container) {
        this._container.removeEventListener("scroll", this._rectInvalidator);
      }
      this._rectInvalidator = null;
    }
    this._cachedRect = null;
    this._rectDirty = true;
    this._trackTarget = null;
    this._trackListener = null;
    this._touchListener = null;
  }
  destroy() {
    this.stopTracking();
  }
  updatePosition(x, y) {
    this.velocity.x = x - this.position.x;
    this.velocity.y = y - this.position.y;
    this.position.x = x;
    this.position.y = y;
  }
  decay(dt = 1) {
    const factor = Math.pow(this.damping, dt);
    this.velocity.x *= factor;
    this.velocity.y *= factor;
  }
  getForce(particlePosition) {
    let px = particlePosition.x;
    let py = particlePosition.y;
    if (this.projectToScreen && particlePosition.z !== 0) {
      const projected = this.projectToScreen(particlePosition.x, particlePosition.y, particlePosition.z);
      if (!projected) {
        _tempForce2.x = 0;
        _tempForce2.y = 0;
        return _tempForce2;
      }
      px = projected.x;
      py = projected.y;
    }
    const dx = px - this.position.x;
    const dy = py - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0 || dist > this.radius) {
      _tempForce2.x = 0;
      _tempForce2.y = 0;
      return _tempForce2;
    }
    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed < 0.01) {
      _tempForce2.x = 0;
      _tempForce2.y = 0;
      return _tempForce2;
    }
    const linearFalloff = 1 - dist / this.radius;
    const distanceFalloff = this.falloff === 1 ? linearFalloff : Math.pow(linearFalloff, this.falloff);
    const speedFactor = Math.min(speed, this.maxSpeed) / this.maxSpeed;
    const scale = this.strength * distanceFalloff * speedFactor / speed;
    _tempForce2.x = this.velocity.x * scale;
    _tempForce2.y = this.velocity.y * scale;
    return _tempForce2;
  }
};

// src/particular/components/flockingForce.ts
var _tempForce3 = new Vector(0, 0);
function szudzikPair(a, b) {
  const aa = a >= 0 ? 2 * a : -2 * a - 1;
  const bb = b >= 0 ? 2 * b : -2 * b - 1;
  return aa >= bb ? aa * aa + aa + bb : bb * bb + aa;
}
var SpatialHashGrid = class {
  constructor(cellSize) {
    this.cells = /* @__PURE__ */ new Map();
    this.cellPool = [];
    this.invCellSize = 1 / cellSize;
  }
  clear() {
    this.cells.forEach((arr) => {
      arr.length = 0;
      this.cellPool.push(arr);
    });
    this.cells.clear();
  }
  insert(particle) {
    const cx = Math.floor(particle.position.x * this.invCellSize);
    const cy = Math.floor(particle.position.y * this.invCellSize);
    const key = szudzikPair(cx, cy);
    let cell = this.cells.get(key);
    if (!cell) {
      cell = this.cellPool.pop() || [];
      this.cells.set(key, cell);
    }
    cell.push(particle);
  }
  queryNeighbors(particle, radius, has3D, callback) {
    const px = particle.position.x;
    const py = particle.position.y;
    const pz = particle.position.z;
    const cx = Math.floor(px * this.invCellSize);
    const cy = Math.floor(py * this.invCellSize);
    const radiusSq = radius * radius;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = szudzikPair(cx + dx, cy + dy);
        const cell = this.cells.get(key);
        if (!cell) continue;
        for (let i = 0; i < cell.length; i++) {
          const neighbor = cell[i];
          if (neighbor === particle) continue;
          const ddx = neighbor.position.x - px;
          const ddy = neighbor.position.y - py;
          let distSq = ddx * ddx + ddy * ddy;
          if (has3D) {
            const ddz = neighbor.position.z - pz;
            distSq += ddz * ddz;
          }
          if (distSq < radiusSq) {
            callback(neighbor, distSq);
          }
        }
      }
    }
  }
};
var FlockingForce = class {
  constructor(config) {
    /** Engine bounds — set automatically by the engine before preCompute. Used for edge avoidance. */
    this.boundsWidth = 0;
    this.boundsHeight = 0;
    this.forceMap = /* @__PURE__ */ new WeakMap();
    const merged = { ...defaultFlockingForce, ...config };
    this.neighborRadius = merged.neighborRadius;
    this.separationWeight = merged.separationWeight;
    this.alignmentWeight = merged.alignmentWeight;
    this.cohesionWeight = merged.cohesionWeight;
    this.maxSteeringForce = merged.maxSteeringForce;
    this.maxSpeed = merged.maxSpeed;
    this.separationDistance = merged.separationDistance;
    this.grid = new SpatialHashGrid(this.neighborRadius);
  }
  preCompute(particles, _dt) {
    const grid = this.grid;
    grid.clear();
    let has3D = false;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].position.z !== 0) {
        has3D = true;
        break;
      }
    }
    for (let i = 0; i < particles.length; i++) {
      grid.insert(particles[i]);
    }
    const sepDistSq = this.separationDistance * this.separationDistance;
    const maxSteer = this.maxSteeringForce;
    const sepW = this.separationWeight;
    const aliW = this.alignmentWeight;
    const cohW = this.cohesionWeight;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      let sepX = 0, sepY = 0, sepZ = 0;
      let aliVX = 0, aliVY = 0, aliVZ = 0;
      let cohX = 0, cohY = 0, cohZ = 0;
      let neighborCount = 0;
      let sepCount = 0;
      grid.queryNeighbors(p, this.neighborRadius, has3D, (neighbor, distSq) => {
        neighborCount++;
        const nx = neighbor.position.x;
        const ny = neighbor.position.y;
        const nz = neighbor.position.z;
        cohX += nx;
        cohY += ny;
        cohZ += nz;
        aliVX += neighbor.velocity.x;
        aliVY += neighbor.velocity.y;
        aliVZ += neighbor.velocity.z;
        if (distSq < sepDistSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const invDist = 1 / dist;
          sepX += (p.position.x - nx) * invDist;
          sepY += (p.position.y - ny) * invDist;
          if (has3D) sepZ += (p.position.z - nz) * invDist;
          sepCount++;
        }
      });
      let fx = 0, fy = 0, fz = 0;
      if (neighborCount > 0) {
        if (sepCount > 0) {
          const invSep = 1 / sepCount;
          fx += sepX * invSep * sepW;
          fy += sepY * invSep * sepW;
          fz += sepZ * invSep * sepW;
        }
        const invN = 1 / neighborCount;
        const avgVX = aliVX * invN;
        const avgVY = aliVY * invN;
        const avgVZ = aliVZ * invN;
        fx += (avgVX - p.velocity.x) * aliW;
        fy += (avgVY - p.velocity.y) * aliW;
        fz += (avgVZ - p.velocity.z) * aliW;
        const avgPX = cohX * invN;
        const avgPY = cohY * invN;
        const avgPZ = cohZ * invN;
        fx += (avgPX - p.position.x) * 0.01 * cohW;
        fy += (avgPY - p.position.y) * 0.01 * cohW;
        fz += (avgPZ - p.position.z) * 0.01 * cohW;
      }
      const bw = this.boundsWidth;
      const bh = this.boundsHeight;
      if (bw > 0 && bh > 0) {
        const edgeMargin = this.neighborRadius;
        const px = p.position.x;
        const py = p.position.y;
        if (px < edgeMargin) fx += (edgeMargin - px) / edgeMargin * maxSteer;
        else if (px > bw - edgeMargin) fx -= (px - (bw - edgeMargin)) / edgeMargin * maxSteer;
        if (py < edgeMargin) fy += (edgeMargin - py) / edgeMargin * maxSteer;
        else if (py > bh - edgeMargin) fy -= (py - (bh - edgeMargin)) / edgeMargin * maxSteer;
      }
      const magSq = fx * fx + fy * fy + fz * fz;
      if (magSq > maxSteer * maxSteer) {
        const invMag = maxSteer / Math.sqrt(magSq);
        fx *= invMag;
        fy *= invMag;
        fz *= invMag;
      }
      const smooth = 0.02;
      let entry = this.forceMap.get(p);
      if (entry) {
        entry.x += (fx - entry.x) * smooth;
        entry.y += (fy - entry.y) * smooth;
        entry.z += (fz - entry.z) * smooth;
      } else {
        entry = { x: fx, y: fy, z: fz };
        this.forceMap.set(p, entry);
      }
    }
  }
  getForce(particlePosition, particle) {
    if (!particle) {
      _tempForce3.x = 0;
      _tempForce3.y = 0;
      _tempForce3.z = 0;
      return _tempForce3;
    }
    const entry = this.forceMap.get(particle);
    if (!entry) {
      _tempForce3.x = 0;
      _tempForce3.y = 0;
      _tempForce3.z = 0;
      return _tempForce3;
    }
    _tempForce3.x = entry.x;
    _tempForce3.y = entry.y;
    _tempForce3.z = entry.z;
    const vx = particlePosition.x !== 0 ? particle.velocity.x + entry.x : particle.velocity.x + entry.x;
    const vy = particle.velocity.y + entry.y;
    const vz = particle.velocity.z + entry.z;
    const speedSq = vx * vx + vy * vy + vz * vz;
    if (speedSq > this.maxSpeed * this.maxSpeed) {
      const speed = Math.sqrt(speedSq);
      const scale = this.maxSpeed / speed;
      _tempForce3.x = vx * scale - particle.velocity.x;
      _tempForce3.y = vy * scale - particle.velocity.y;
      _tempForce3.z = vz * scale - particle.velocity.z;
    }
    return _tempForce3;
  }
};

// src/particular/renderers/canvasRenderer.ts
var CanvasRenderer = class {
  constructor(target) {
    this.name = "CanvasRenderer";
    this.particular = null;
    this.pixelRatio = 2;
    // Ghost object pool to avoid per-frame allocations for trail rendering
    this.ghostPool = [];
    this.ghostPoolIdx = 0;
    this.resize = (args) => {
      if (!args) return;
      const { width, height } = args;
      this.target.width = width;
      this.target.height = height;
    };
    this.onUpdate = () => {
      this.ghostPoolIdx = 0;
      this.context.save();
      this.context.scale(this.pixelRatio, this.pixelRatio);
      this.context.clearRect(0, 0, this.target.width, this.target.height);
    };
    this.onUpdateAfter = () => {
      if (this.particular) {
        for (const attractor of this.particular.attractors) {
          if (!attractor.visible) continue;
          const drawable = attractor.toDrawable();
          if (drawable.image && drawable.image instanceof Image) {
            this.drawImage(drawable);
          } else {
            this.drawBasicElement(drawable);
          }
        }
      }
      this.context.restore();
    };
    this.onParticleCreated = () => {
    };
    this.onParticleUpdated = (particle) => {
      if (!particle) return;
      this.drawTrails(particle);
      if (particle.image) {
        if (particle.image instanceof Image) {
          this.drawImage(particle);
        }
      } else {
        this.drawBasicElement(particle);
      }
    };
    this.onParticleDead = (particle) => {
      if (particle) {
        particle.resetImage();
      }
    };
    this.target = target;
    const context = this.target.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.context = context;
  }
  init(particular, pixelRatio) {
    this.particular = particular;
    this.pixelRatio = pixelRatio;
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.context.imageSmoothingEnabled = true;
    particular.addEventListener("UPDATE", this.onUpdate);
    particular.addEventListener("UPDATE_AFTER", this.onUpdateAfter);
    particular.addEventListener("RESIZE", this.resize);
    particular.addEventListener("PARTICLE_CREATED", this.onParticleCreated);
    particular.addEventListener("PARTICLE_UPDATE", this.onParticleUpdated);
    particular.addEventListener("PARTICLE_DEAD", this.onParticleDead);
  }
  drawImage(particle) {
    if (!particle.image || !(particle.image instanceof Image)) return;
    this.context.save();
    this.context.globalAlpha = particle.alpha;
    this.applyShadow(particle);
    const pixelRounded = particle.getRoundedLocation();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.drawImage(
      particle.image,
      -particle.factoredSize,
      -particle.factoredSize,
      particle.factoredSize * 2,
      particle.factoredSize * 2
    );
    this.context.globalAlpha = 1;
    this.context.restore();
  }
  drawBasicElement(particle) {
    this.context.save();
    this.context.globalAlpha = particle.alpha;
    this.setBlendMode(particle.blendMode);
    this.applyShadow(particle);
    switch (particle.shape) {
      case "circle":
        this.drawCircle(particle);
        break;
      case "square":
      case "rectangle":
        this.drawSquare(particle);
        break;
      case "roundedRectangle":
        this.drawRoundedRectangle(particle);
        break;
      case "triangle":
        this.drawTriangle(particle);
        break;
      case "star":
        this.drawStar(particle);
        break;
      case "ring":
        this.drawRing(particle);
        break;
      case "sparkle":
        this.drawSparkle(particle);
        break;
      default:
        this.drawCircle(particle);
    }
    this.context.restore();
  }
  drawTrails(particle) {
    if (!particle.trail || particle.trailSegments.length === 0) return;
    const maxAge = Math.max(1, Math.floor(particle.trailLength));
    for (const segment of particle.trailSegments) {
      const life = 1 - segment.age / maxAge;
      if (life <= 0) continue;
      const ghost = this.makeTrailGhost(particle, segment, life);
      if (ghost.image) {
        this.drawImage(ghost);
      } else {
        this.drawBasicElement(ghost);
      }
    }
  }
  makeTrailGhost(particle, segment, life) {
    const sizeScale = particle.trailShrink + life * (1 - particle.trailShrink);
    const alphaScale = life * particle.trailFade;
    let ghost;
    if (this.ghostPoolIdx < this.ghostPool.length) {
      ghost = this.ghostPool[this.ghostPoolIdx++];
    } else {
      const roundedLoc = [0, 0];
      ghost = {
        position: { x: 0, y: 0 },
        factoredSize: 0,
        rotation: 0,
        alpha: 0,
        color: "",
        shape: "circle",
        blendMode: "normal",
        image: null,
        glow: false,
        shadow: false,
        glowColor: "#ffffff",
        glowAlpha: 0.25,
        glowSize: 10,
        trailSegments: [],
        _roundedLoc: roundedLoc,
        getRoundedLocation: () => roundedLoc
      };
      this.ghostPool.push(ghost);
      this.ghostPoolIdx++;
    }
    ghost.position.x = segment.x;
    ghost.position.y = segment.y;
    ghost.factoredSize = Math.max(0.1, segment.size * sizeScale);
    ghost.rotation = segment.rotation;
    ghost.alpha = segment.alpha * alphaScale;
    ghost.color = particle.color;
    ghost.shape = particle.shape;
    ghost.blendMode = particle.blendMode;
    ghost.image = particle.image;
    ghost.glow = false;
    ghost.shadow = false;
    const ghostAny = ghost;
    ghostAny._roundedLoc[0] = (segment.x * 10 << 0) * 0.1;
    ghostAny._roundedLoc[1] = (segment.y * 10 << 0) * 0.1;
    return ghost;
  }
  applyShadow(particle) {
    if (particle.glow) {
      const hex = particle.glowColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const glowAlpha = Math.max(0, Math.min(1, particle.glowAlpha));
      const glowScale = Math.max(0.75, Math.min(2.5, particle.factoredSize / 12));
      this.context.shadowColor = `rgba(${r},${g},${b},${glowAlpha})`;
      this.context.shadowBlur = particle.glowSize * glowScale;
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
    } else if (particle.shadow) {
      const hex = particle.shadowColor;
      const shadowScale = Math.max(0, Math.min(1, particle.alpha));
      const sizeScale = Math.max(0.45, Math.min(2.2, particle.factoredSize / 12));
      const earlyShadowFade = Math.max(0, Math.min(1, (particle.alpha - 0.1) / 0.95));
      const alpha = particle.shadowAlpha * earlyShadowFade;
      const baseDistance = Math.hypot(particle.shadowOffsetX, particle.shadowOffsetY);
      const lightDx = particle.position.x - particle.shadowLightOrigin.x;
      const lightDy = particle.position.y - particle.shadowLightOrigin.y;
      const lightDist = Math.hypot(lightDx, lightDy);
      let offsetX = particle.shadowOffsetX;
      let offsetY = particle.shadowOffsetY;
      if (baseDistance > 0 && lightDist > 1e-4) {
        offsetX = lightDx / lightDist * baseDistance;
        offsetY = lightDy / lightDist * baseDistance;
      }
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      this.context.shadowColor = `rgba(${r},${g},${b},${alpha})`;
      this.context.shadowBlur = particle.shadowBlur * shadowScale * sizeScale;
      this.context.shadowOffsetX = offsetX * shadowScale * sizeScale;
      this.context.shadowOffsetY = offsetY * shadowScale * sizeScale;
    } else {
      this.context.shadowColor = "transparent";
      this.context.shadowBlur = 0;
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
    }
  }
  setBlendMode(mode) {
    switch (mode) {
      case "additive":
        this.context.globalCompositeOperation = "lighter";
        break;
      case "multiply":
        this.context.globalCompositeOperation = "multiply";
        break;
      case "screen":
        this.context.globalCompositeOperation = "screen";
        break;
      default:
        this.context.globalCompositeOperation = "source-over";
    }
  }
  drawCircle(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    this.context.beginPath();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2);
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
  }
  drawSquare(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize * 2;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.fillRect(-particle.factoredSize, -particle.factoredSize, size, size);
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.strokeRect(-particle.factoredSize, -particle.factoredSize, size, size);
    }
    this.context.restore();
  }
  drawRoundedRectangle(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize * 2;
    const radius = Math.min(particle.factoredSize * 0.35, size / 2);
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.beginPath();
    this.context.roundRect(-particle.factoredSize, -particle.factoredSize, size, size, radius);
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  drawTriangle(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    const k = 0.5773502691896258;
    this.context.beginPath();
    this.context.moveTo(0, -size * 2 * k);
    this.context.lineTo(size, size * k);
    this.context.lineTo(-size, size * k);
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  drawStar(particle) {
    this.context.fillStyle = particle.color;
    const pixelRounded = particle.getRoundedLocation();
    const outerRadius = particle.factoredSize;
    const innerRadius = particle.factoredSize / 2;
    const spikes = 5;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = Math.PI / spikes * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }
    this.context.closePath();
    this.context.fill();
    if (this.stroke) {
      this.context.strokeStyle = this.stroke.color;
      this.context.lineWidth = this.stroke.thickness;
      this.context.stroke();
    }
    this.context.restore();
  }
  drawRing(particle) {
    this.context.strokeStyle = particle.color;
    this.context.lineWidth = Math.max(2, particle.factoredSize / 4);
    const pixelRounded = particle.getRoundedLocation();
    this.context.beginPath();
    this.context.arc(pixelRounded[0], pixelRounded[1], particle.factoredSize, 0, Math.PI * 2);
    this.context.stroke();
  }
  drawSparkle(particle) {
    this.context.strokeStyle = particle.color;
    this.context.lineWidth = 2;
    const pixelRounded = particle.getRoundedLocation();
    const size = particle.factoredSize;
    this.context.save();
    this.context.translate(pixelRounded[0], pixelRounded[1]);
    this.context.rotate(degToRad(particle.rotation));
    this.context.beginPath();
    this.context.moveTo(-size, 0);
    this.context.lineTo(size, 0);
    this.context.moveTo(0, -size);
    this.context.lineTo(0, size);
    const diag = size * 0.7;
    this.context.moveTo(-diag, -diag);
    this.context.lineTo(diag, diag);
    this.context.moveTo(-diag, diag);
    this.context.lineTo(diag, -diag);
    this.context.stroke();
    this.context.restore();
  }
  destroy() {
    this.remove();
  }
  remove() {
    if (!this.particular) return;
    this.particular.removeEventListener("UPDATE", this.onUpdate);
    this.particular.removeEventListener("UPDATE_AFTER", this.onUpdateAfter);
    this.particular.removeEventListener("RESIZE", this.resize);
    this.particular.removeEventListener("PARTICLE_CREATED", this.onParticleCreated);
    this.particular.removeEventListener("PARTICLE_UPDATE", this.onParticleUpdated);
    this.particular.removeEventListener("PARTICLE_DEAD", this.onParticleDead);
    this.particular = null;
  }
};

// src/particular/renderers/webglShared.ts
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error("Shader compile error: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}
function linkProgram(gl, vs, fs) {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("Shader link error: " + gl.getProgramInfoLog(program));
  }
  return program;
}
function hexToRgba(hex) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return [1, 1, 1, 1];
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
    1
  ];
}
function shapeToId(shape) {
  switch (shape) {
    case "square":
    case "rectangle":
      return 1;
    case "triangle":
      return 2;
    case "star":
      return 3;
    case "roundedRectangle":
      return 4;
    case "ring":
      return 5;
    case "sparkle":
      return 6;
    default:
      return 0;
  }
}
function setBlendMode(gl, mode) {
  gl.enable(gl.BLEND);
  switch (mode) {
    case "additive":
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case "multiply":
      gl.blendFuncSeparate(gl.DST_COLOR, gl.ZERO, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case "screen":
      gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    default:
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
  }
}
var SDF_SHAPE_FUNCTIONS = `
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float sdEquilateralTriangle(vec2 p) {
  const float k = 1.7320508;
  p.x = abs(p.x) - 1.0;
  p.y = p.y + 1.0 / k;
  if (p.x + k * p.y > 0.0) {
    p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  }
  p.x -= clamp(p.x, -2.0, 0.0);
  return -length(p) * sign(p.y);
}

float sdStar5(vec2 p, float r, float rf) {
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-k1.x, k1.y);
  p.x = abs(p.x);
  p -= 2.0 * max(dot(k1, p), 0.0) * k1;
  p -= 2.0 * max(dot(k2, p), 0.0) * k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0.0, 1.0);
  float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
  return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}

float sdRing(vec2 p, float radius, float thickness) {
  return abs(length(p) - radius) - thickness;
}

float sdSparkle(vec2 p) {
  float armWidth = 0.15;
  float d1 = abs(p.x) * 0.7 + abs(p.y) - 1.0;
  float w1 = abs(p.x) - armWidth;
  float arm1 = max(d1, w1);
  float d2 = abs(p.y) * 0.7 + abs(p.x) - 1.0;
  float w2 = abs(p.y) - armWidth;
  float arm2 = max(d2, w2);
  vec2 pr = vec2(p.x + p.y, p.y - p.x) * 0.7071;
  float d3 = abs(pr.x) * 0.7 + abs(pr.y) - 0.7;
  float w3 = abs(pr.x) - armWidth;
  float arm3 = max(d3, w3);
  float d4 = abs(pr.y) * 0.7 + abs(pr.x) - 0.7;
  float w4 = abs(pr.y) - armWidth;
  float arm4 = max(d4, w4);
  return min(min(arm1, arm2), min(arm3, arm4));
}

float shapeSdf(vec2 p, float shapeId) {
  if (shapeId < 0.5) {
    return length(p) - 1.0;
  }
  if (shapeId < 1.5) {
    return sdBox(p, vec2(1.0));
  }
  if (shapeId < 2.5) {
    return sdEquilateralTriangle(p);
  }
  if (shapeId < 3.5) {
    return sdStar5(p, 1.0, 0.45);
  }
  if (shapeId < 4.5) {
    return sdRoundedBox(p, vec2(0.75), 0.25);
  }
  if (shapeId < 5.5) {
    return sdRing(p, 0.75, 0.2);
  }
  return sdSparkle(p);
}
`;

// src/particular/renderers/webglRenderer.ts
var VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;
in float a_particle_shape;

uniform vec2 u_resolution;
uniform float u_glowExpand;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;
out float v_particle_shape;

void main() {
  float expand = 1.0 + u_glowExpand;
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);
  vec2 pos = (a_particle_pos + rotated * a_particle_size * expand) / u_resolution * 2.0 - 1.0;
  pos.y = -pos.y;
  gl_Position = vec4(pos, 0.0, 1.0);
  v_color = a_particle_color;
  v_uv = a_position * expand;
  v_particle_size = a_particle_size;
  v_particle_shape = a_particle_shape;
}
`;
var FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
in float v_particle_size;
in float v_particle_shape;

uniform float u_softness;
uniform float u_glow;
uniform float u_glowSize;
uniform vec4 u_glowColor;
uniform float u_isShadow;
uniform vec4 u_shadowColor;
uniform float u_shadowBlur;

out vec4 outColor;

${SDF_SHAPE_FUNCTIONS}

void main() {
  float sd = shapeSdf(v_uv, v_particle_shape);
  float particleAlpha = pow(clamp(v_color.a, 0.0, 1.0), 0.8);

  if (u_isShadow > 0.0) {
    float retraction = clamp(v_color.a, 0.0, 1.0);
    float sizeScale = clamp(v_particle_size / 12.0, 0.45, 2.2);
    float effectiveShadowBlur = u_shadowBlur * retraction * sizeScale;
    float shadowAlpha = 1.0 - smoothstep(-0.02, effectiveShadowBlur, sd);
    outColor = vec4(u_shadowColor.rgb, u_shadowColor.a * shadowAlpha * retraction);
    return;
  }

  float coreAlpha = 1.0 - smoothstep(-u_softness, u_softness, sd);
  float alpha = coreAlpha;
  vec3 rgb = v_color.rgb;
  if (u_glow > 0.0) {
    float glowScale = mix(0.75, 1.75, clamp((v_particle_size - 4.0) / 20.0, 0.0, 1.0));
    float glowRange = u_glowSize * glowScale;
    float halo = 1.0 - smoothstep(-0.2, glowRange, sd);
    float glowAlpha = halo * u_glowColor.a;
    alpha = max(alpha, glowAlpha);
    float glowMix = clamp((1.0 - coreAlpha) * glowAlpha, 0.0, 1.0);
    rgb = mix(rgb, u_glowColor.rgb, glowMix);
  }
  outColor = vec4(rgb, particleAlpha * alpha);
}
`;
var IMAGE_VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;

uniform vec2 u_resolution;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;

void main() {
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);
  vec2 pos = (a_particle_pos + rotated * a_particle_size) / u_resolution * 2.0 - 1.0;
  pos.y = -pos.y;
  gl_Position = vec4(pos, 0.0, 1.0);
  v_color = a_particle_color;
  v_uv = a_position * 0.5 + 0.5;
  v_particle_size = a_particle_size;
}
`;
var IMAGE_FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
in float v_particle_size;

uniform sampler2D u_texture;
uniform float u_tint;
uniform float u_isShadow;
uniform vec4 u_shadowColor;
uniform float u_shadowBlur;

out vec4 outColor;

void main() {
  vec4 tex = texture(u_texture, v_uv);

  if (u_isShadow > 0.0) {
    vec2 texel = 1.0 / vec2(textureSize(u_texture, 0));
    float retraction = clamp(v_color.a, 0.0, 1.0);
    float sizeScale = clamp(v_particle_size / 12.0, 0.45, 2.2);
    vec2 blur = texel * (u_shadowBlur * retraction * sizeScale);

    // 9-tap weighted blur on alpha for softer image shadows.
    float a = tex.a * 0.28;
    a += texture(u_texture, v_uv + vec2( blur.x, 0.0)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(-blur.x, 0.0)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(0.0,  blur.y)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(0.0, -blur.y)).a * 0.12;
    a += texture(u_texture, v_uv + vec2( blur.x,  blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2(-blur.x,  blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2( blur.x, -blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2(-blur.x, -blur.y)).a * 0.06;
    outColor = vec4(u_shadowColor.rgb, min(1.0, a) * u_shadowColor.a * retraction);
    return;
  }

  vec3 rgb = mix(tex.rgb, tex.rgb * v_color.rgb, u_tint);
  float particleAlpha = pow(clamp(v_color.a, 0.0, 1.0), 0.8);
  outColor = vec4(rgb, tex.a * particleAlpha);
}
`;
var WebGLRenderer = class {
  constructor(target, options) {
    this.gl = null;
    this.program = null;
    this.imageProgram = null;
    this.quadBuffer = null;
    this.circleQuadBuffer = null;
    this.instanceBuffer = null;
    this.particular = null;
    this.pixelRatio = 2;
    this.instanceStride = 9;
    this.resolutionUniform = null;
    this.softnessUniform = null;
    this.glowUniform = null;
    this.glowExpandUniform = null;
    this.glowSizeUniform = null;
    this.glowColorUniform = null;
    this.isShadowUniform = null;
    this.shadowColorUniform = null;
    this.shadowBlurUniform = null;
    this.imageResolutionUniform = null;
    this.imageTintUniform = null;
    this.imageIsShadowUniform = null;
    this.imageShadowColorUniform = null;
    this.imageShadowBlurUniform = null;
    this.textureCache = /* @__PURE__ */ new Map();
    // Cached attribute locations (circle program)
    this.circleAttrPos = -1;
    this.circleAttrParticlePos = -1;
    this.circleAttrSize = -1;
    this.circleAttrRotation = -1;
    this.circleAttrColor = -1;
    this.circleAttrShape = -1;
    // Cached attribute locations (image program)
    this.imageAttrPos = -1;
    this.imageAttrParticlePos = -1;
    this.imageAttrSize = -1;
    this.imageAttrRotation = -1;
    this.imageAttrColor = -1;
    this.imageTexUniform = null;
    // Object pools to avoid per-frame allocations
    this.ghostPool = [];
    this.ghostPoolIdx = 0;
    this.expandedArr = [];
    this.batchPool = [];
    this.batchPoolIdx = 0;
    this.resize = (args) => {
      if (!args || !this.gl) return;
      const { width, height } = args;
      this.target.width = width;
      this.target.height = height;
      this.gl.viewport(0, 0, width, height);
    };
    this.onUpdate = () => {
      if (!this.gl) return;
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    this._batchResult = [];
    this.onUpdateAfter = () => {
      if (!this.gl || !this.particular || !this.program) return;
      const baseParticles = this.particular.getAllParticles();
      const particles = this.expandParticlesWithTrails(baseParticles);
      for (let ai = 0; ai < this.particular.attractors.length; ai++) {
        const attractor = this.particular.attractors[ai];
        if (attractor.visible) {
          particles.push(attractor.toDrawable());
        }
      }
      const pixelRatio = this.particular.pixelRatio;
      const w = this.target.width || this.particular.width;
      const h = this.target.height || this.particular.height;
      const logicalW = w / pixelRatio;
      const logicalH = h / pixelRatio;
      if (logicalW <= 0 || logicalH <= 0) return;
      const batches = this.buildBatches(particles);
      if (!this.resolutionUniform || !this.softnessUniform || !this.glowUniform || !this.glowSizeUniform || !this.glowColorUniform) return;
      this.gl.useProgram(this.program);
      this.gl.uniform2f(this.resolutionUniform, logicalW, logicalH);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleQuadBuffer);
      const posLoc = this.circleAttrPos;
      this.gl.enableVertexAttribArray(posLoc);
      this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);
      for (let bi = 0; bi < batches.length; bi++) {
        const batch = batches[bi];
        if (batch.type === "circle") {
          this.drawCircleBatch(batch);
        } else {
          this.drawImageBatch(batch, logicalW, logicalH);
          this.gl.useProgram(this.program);
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleQuadBuffer);
          this.gl.enableVertexAttribArray(posLoc);
          this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);
        }
      }
    };
    this.target = target;
    this.maxInstances = options?.maxInstances ?? 16384;
    this.instanceStride = 9;
    this.instanceData = new Float32Array(this.maxInstances * this.instanceStride);
  }
  init(particular, pixelRatio) {
    this.particular = particular;
    this.pixelRatio = pixelRatio;
    const gl = this.target.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true
    });
    if (!gl) {
      throw new Error("WebGL2 not supported");
    }
    this.gl = gl;
    const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) throw new Error("Failed to create program");
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Shader link error: " + gl.getProgramInfoLog(program));
    }
    this.program = program;
    this.resolutionUniform = gl.getUniformLocation(program, "u_resolution");
    this.softnessUniform = gl.getUniformLocation(program, "u_softness");
    this.glowUniform = gl.getUniformLocation(program, "u_glow");
    this.glowExpandUniform = gl.getUniformLocation(program, "u_glowExpand");
    this.glowSizeUniform = gl.getUniformLocation(program, "u_glowSize");
    this.glowColorUniform = gl.getUniformLocation(program, "u_glowColor");
    this.isShadowUniform = gl.getUniformLocation(program, "u_isShadow");
    this.shadowColorUniform = gl.getUniformLocation(program, "u_shadowColor");
    this.shadowBlurUniform = gl.getUniformLocation(program, "u_shadowBlur");
    this.circleAttrPos = gl.getAttribLocation(program, "a_position");
    this.circleAttrParticlePos = gl.getAttribLocation(program, "a_particle_pos");
    this.circleAttrSize = gl.getAttribLocation(program, "a_particle_size");
    this.circleAttrRotation = gl.getAttribLocation(program, "a_particle_rotation");
    this.circleAttrColor = gl.getAttribLocation(program, "a_particle_color");
    this.circleAttrShape = gl.getAttribLocation(program, "a_particle_shape");
    const imageVs = this.compileShader(gl.VERTEX_SHADER, IMAGE_VERTEX_SHADER);
    const imageFs = this.compileShader(gl.FRAGMENT_SHADER, IMAGE_FRAGMENT_SHADER);
    const imageProgram = gl.createProgram();
    if (!imageProgram) throw new Error("Failed to create image program");
    gl.attachShader(imageProgram, imageVs);
    gl.attachShader(imageProgram, imageFs);
    gl.linkProgram(imageProgram);
    if (!gl.getProgramParameter(imageProgram, gl.LINK_STATUS)) {
      throw new Error("Image shader link error: " + gl.getProgramInfoLog(imageProgram));
    }
    this.imageProgram = imageProgram;
    this.imageResolutionUniform = gl.getUniformLocation(imageProgram, "u_resolution");
    this.imageTintUniform = gl.getUniformLocation(imageProgram, "u_tint");
    this.imageIsShadowUniform = gl.getUniformLocation(imageProgram, "u_isShadow");
    this.imageShadowColorUniform = gl.getUniformLocation(imageProgram, "u_shadowColor");
    this.imageShadowBlurUniform = gl.getUniformLocation(imageProgram, "u_shadowBlur");
    this.imageAttrPos = gl.getAttribLocation(imageProgram, "a_position");
    this.imageAttrParticlePos = gl.getAttribLocation(imageProgram, "a_particle_pos");
    this.imageAttrSize = gl.getAttribLocation(imageProgram, "a_particle_size");
    this.imageAttrRotation = gl.getAttribLocation(imageProgram, "a_particle_rotation");
    this.imageAttrColor = gl.getAttribLocation(imageProgram, "a_particle_color");
    this.imageTexUniform = gl.getUniformLocation(imageProgram, "u_texture");
    const quadData = new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1
    ]);
    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);
    const circleQuadData = new Float32Array([
      -2,
      -2,
      2,
      -2,
      -2,
      2,
      -2,
      2,
      2,
      -2,
      2,
      2
    ]);
    this.circleQuadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleQuadData, gl.STATIC_DRAW);
    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.instanceData.byteLength,
      gl.DYNAMIC_DRAW
    );
    particular.addEventListener("UPDATE", this.onUpdate);
    particular.addEventListener("UPDATE_AFTER", this.onUpdateAfter);
    particular.addEventListener("RESIZE", this.resize);
  }
  getOrCreateTexture(image) {
    if (!image.complete || image.naturalWidth === 0) return null;
    let tex = this.textureCache.get(image);
    if (tex) return tex;
    const gl = this.gl;
    tex = gl.createTexture();
    if (!tex) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    this.textureCache.set(image, tex);
    return tex;
  }
  compileShader(type, source) {
    return compileShader(this.gl, type, source);
  }
  expandParticlesWithTrails(particles) {
    const expanded = this.expandedArr;
    expanded.length = 0;
    this.ghostPoolIdx = 0;
    for (let pi = 0; pi < particles.length; pi++) {
      const particle = particles[pi];
      expanded.push(particle);
      if (!particle.trail || particle.trailSegments.length === 0) continue;
      const maxAge = Math.max(1, Math.floor(particle.trailLength));
      for (let si = 0; si < particle.trailSegments.length; si++) {
        const segment = particle.trailSegments[si];
        const life = 1 - segment.age / maxAge;
        if (life <= 0) continue;
        const sizeScale = particle.trailShrink + life * (1 - particle.trailShrink);
        const alphaScale = life * particle.trailFade;
        const ghost = this.acquireGhost();
        ghost.position.x = segment.x;
        ghost.position.y = segment.y;
        ghost.position.z = segment.z;
        ghost.factoredSize = Math.max(0.1, segment.size * sizeScale);
        ghost.rotation = segment.rotation;
        ghost.alpha = segment.alpha * alphaScale;
        ghost.color = particle.color;
        ghost.colorR = particle.colorR;
        ghost.colorG = particle.colorG;
        ghost.colorB = particle.colorB;
        ghost.shape = particle.shape;
        ghost.blendMode = particle.blendMode;
        ghost.image = particle.image;
        ghost.imageTint = particle.imageTint;
        ghost.glow = false;
        ghost.shadow = false;
        expanded.push(ghost);
      }
    }
    return expanded;
  }
  acquireGhost() {
    if (this.ghostPoolIdx < this.ghostPool.length) {
      return this.ghostPool[this.ghostPoolIdx++];
    }
    const ghost = {
      position: { x: 0, y: 0 },
      factoredSize: 0,
      rotation: 0,
      alpha: 0,
      color: "",
      colorR: 0,
      colorG: 0,
      colorB: 0,
      shape: "circle",
      blendMode: "normal",
      image: null,
      imageTint: false,
      glow: false,
      shadow: false,
      trail: false,
      trailSegments: [],
      shadowLightOrigin: null
    };
    this.ghostPool.push(ghost);
    this.ghostPoolIdx++;
    return ghost;
  }
  buildBatches(particles) {
    this.batchPoolIdx = 0;
    const batches = this._batchResult;
    batches.length = 0;
    let current = null;
    for (let bi = 0; bi < particles.length; bi++) {
      const p = particles[bi];
      const img = p.image && p.image instanceof HTMLImageElement ? p.image : null;
      const tex = img ? this.getOrCreateTexture(img) : null;
      const isImage = !!tex;
      const blendMode = p.blendMode;
      const imageTint = !!p.imageTint;
      const sameBatch = current && current.type === (isImage ? "image" : "circle") && current.blendMode === blendMode && current.shadow === p.shadow && (!p.shadow || current.shadowOffsetX === p.shadowOffsetX && current.shadowOffsetY === p.shadowOffsetY && current.shadowBlur === p.shadowBlur && current.shadowColor === p.shadowColor && current.shadowAlpha === p.shadowAlpha) && (isImage ? current.texture === tex && current.imageTint === imageTint : current.glow === p.glow && (!p.glow || current.glowSize === p.glowSize && current.glowColor === p.glowColor && current.glowAlpha === p.glowAlpha));
      if (!sameBatch) {
        current = this.acquireBatch();
        current.type = isImage ? "image" : "circle";
        current.blendMode = blendMode;
        current.shadow = p.shadow;
        current.shadowBlur = p.shadowBlur;
        current.shadowOffsetX = p.shadowOffsetX;
        current.shadowOffsetY = p.shadowOffsetY;
        current.shadowColor = p.shadowColor;
        current.shadowAlpha = p.shadowAlpha;
        if (isImage && tex) {
          current.texture = tex;
          current.image = img;
          current.imageTint = imageTint;
        } else {
          current.texture = void 0;
          current.image = void 0;
          current.imageTint = void 0;
          current.glow = p.glow;
          current.glowSize = p.glowSize;
          current.glowColor = p.glowColor;
          current.glowAlpha = p.glowAlpha;
        }
        batches.push(current);
      }
      current.particles.push(p);
    }
    return batches;
  }
  acquireBatch() {
    if (this.batchPoolIdx < this.batchPool.length) {
      const batch2 = this.batchPool[this.batchPoolIdx++];
      batch2.particles.length = 0;
      return batch2;
    }
    const batch = {
      type: "circle",
      blendMode: "normal",
      particles: []
    };
    this.batchPool.push(batch);
    this.batchPoolIdx++;
    return batch;
  }
  fillInstanceData(particles, startIdx, endIdx, offsetX = 0, offsetY = 0, scaleOffsetByAlpha = false, directionalFromLightOrigin = false) {
    let offset = 0;
    for (let pi = startIdx; pi < endIdx; pi++) {
      const p = particles[pi];
      const r = p.colorR;
      const g = p.colorG;
      const b = p.colorB;
      let effectiveOffsetX = offsetX;
      let effectiveOffsetY = offsetY;
      if (directionalFromLightOrigin) {
        const baseDistance = Math.hypot(offsetX, offsetY);
        const lightDx = p.position.x - p.shadowLightOrigin.x;
        const lightDy = p.position.y - p.shadowLightOrigin.y;
        const lightDist = Math.hypot(lightDx, lightDy);
        if (baseDistance > 0 && lightDist > 1e-4) {
          effectiveOffsetX = lightDx / lightDist * baseDistance;
          effectiveOffsetY = lightDy / lightDist * baseDistance;
        }
      }
      if (scaleOffsetByAlpha) {
        const retraction = Math.max(0, Math.min(1, p.alpha));
        const sizeScale = Math.max(0.45, Math.min(2.2, p.factoredSize / 12));
        effectiveOffsetX *= retraction;
        effectiveOffsetY *= retraction;
        effectiveOffsetX *= sizeScale;
        effectiveOffsetY *= sizeScale;
      }
      this.instanceData[offset++] = p.position.x + effectiveOffsetX;
      this.instanceData[offset++] = p.position.y + effectiveOffsetY;
      this.instanceData[offset++] = p.factoredSize;
      this.instanceData[offset++] = p.rotation * Math.PI / 180;
      this.instanceData[offset++] = r;
      this.instanceData[offset++] = g;
      this.instanceData[offset++] = b;
      this.instanceData[offset++] = p.alpha;
      this.instanceData[offset++] = shapeToId(p.shape);
    }
  }
  drawCircleInstances(list, offsetX, offsetY, scaleOffsetByAlpha = false, directionalFromLightOrigin = false) {
    const gl = this.gl;
    const stride = this.instanceStride;
    const posLoc2 = this.circleAttrParticlePos;
    const sizeLoc = this.circleAttrSize;
    const rotLoc = this.circleAttrRotation;
    const colLoc = this.circleAttrColor;
    const shapeLoc = this.circleAttrShape;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.enableVertexAttribArray(posLoc2);
    gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, stride * 4, 0);
    gl.vertexAttribDivisor(posLoc2, 1);
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride * 4, 8);
    gl.vertexAttribDivisor(sizeLoc, 1);
    gl.enableVertexAttribArray(rotLoc);
    gl.vertexAttribPointer(rotLoc, 1, gl.FLOAT, false, stride * 4, 12);
    gl.vertexAttribDivisor(rotLoc, 1);
    gl.enableVertexAttribArray(colLoc);
    gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, stride * 4, 16);
    gl.vertexAttribDivisor(colLoc, 1);
    gl.enableVertexAttribArray(shapeLoc);
    gl.vertexAttribPointer(shapeLoc, 1, gl.FLOAT, false, stride * 4, 32);
    gl.vertexAttribDivisor(shapeLoc, 1);
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const end = Math.min(i + this.maxInstances, list.length);
      const count = end - i;
      this.fillInstanceData(list, i, end, offsetX, offsetY, scaleOffsetByAlpha, directionalFromLightOrigin);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, count * stride));
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
    }
    gl.vertexAttribDivisor(posLoc2, 0);
    gl.vertexAttribDivisor(sizeLoc, 0);
    gl.vertexAttribDivisor(rotLoc, 0);
    gl.vertexAttribDivisor(colLoc, 0);
    gl.vertexAttribDivisor(shapeLoc, 0);
  }
  drawCircleBatch(batch) {
    const gl = this.gl;
    const list = batch.particles;
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? "#000000");
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.isShadowUniform, 1);
      gl.uniform1f(this.glowExpandUniform, 0);
      gl.uniform4f(this.shadowColorUniform, sr, sg, sb, sa);
      gl.uniform1f(this.shadowBlurUniform, Math.min(1, (batch.shadowBlur ?? 8) / 20));
      this.drawCircleInstances(list, batch.shadowOffsetX ?? 4, batch.shadowOffsetY ?? 4, true, true);
      gl.uniform1f(this.isShadowUniform, 0);
    }
    setBlendMode(gl, batch.blendMode);
    gl.uniform1f(this.softnessUniform, 0.1);
    gl.uniform1f(this.glowUniform, batch.glow ? 1 : 0);
    const glowUV = Math.min(1, (batch.glowSize ?? 10) / 30) * 1.75;
    gl.uniform1f(this.glowExpandUniform, batch.glow ? glowUV : 0);
    gl.uniform1f(this.glowSizeUniform, Math.min(1, (batch.glowSize ?? 10) / 30));
    const [gr, gg, gb] = hexToRgba(batch.glowColor ?? "#ffffff");
    gl.uniform4f(this.glowColorUniform, gr, gg, gb, Math.max(0, Math.min(1, batch.glowAlpha ?? 0.35)));
    this.drawCircleInstances(list, 0, 0);
  }
  drawImageInstances(list, offsetX, offsetY, scaleOffsetByAlpha = false, directionalFromLightOrigin = false) {
    const gl = this.gl;
    const stride = this.instanceStride;
    const posLoc2 = this.imageAttrParticlePos;
    const sizeLoc = this.imageAttrSize;
    const rotLoc = this.imageAttrRotation;
    const colLoc = this.imageAttrColor;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.enableVertexAttribArray(posLoc2);
    gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, stride * 4, 0);
    gl.vertexAttribDivisor(posLoc2, 1);
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride * 4, 8);
    gl.vertexAttribDivisor(sizeLoc, 1);
    gl.enableVertexAttribArray(rotLoc);
    gl.vertexAttribPointer(rotLoc, 1, gl.FLOAT, false, stride * 4, 12);
    gl.vertexAttribDivisor(rotLoc, 1);
    gl.enableVertexAttribArray(colLoc);
    gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, stride * 4, 16);
    gl.vertexAttribDivisor(colLoc, 1);
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const end = Math.min(i + this.maxInstances, list.length);
      const count = end - i;
      this.fillInstanceData(list, i, end, offsetX, offsetY, scaleOffsetByAlpha, directionalFromLightOrigin);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, count * stride));
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
    }
    gl.vertexAttribDivisor(posLoc2, 0);
    gl.vertexAttribDivisor(sizeLoc, 0);
    gl.vertexAttribDivisor(rotLoc, 0);
    gl.vertexAttribDivisor(colLoc, 0);
  }
  drawImageBatch(batch, logicalW, logicalH) {
    const gl = this.gl;
    const list = batch.particles;
    if (!this.imageProgram || !batch.texture || !this.imageResolutionUniform || !this.imageTintUniform || !this.imageShadowBlurUniform) return;
    gl.useProgram(this.imageProgram);
    gl.uniform2f(this.imageResolutionUniform, logicalW, logicalH);
    gl.uniform1f(this.imageTintUniform, batch.imageTint ? 1 : 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, batch.texture);
    gl.uniform1i(this.imageTexUniform, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.enableVertexAttribArray(this.imageAttrPos);
    gl.vertexAttribPointer(this.imageAttrPos, 2, gl.FLOAT, false, 0, 0);
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? "#000000");
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.imageIsShadowUniform, 1);
      gl.uniform4f(this.imageShadowColorUniform, sr, sg, sb, sa);
      gl.uniform1f(this.imageShadowBlurUniform, Math.max(0, batch.shadowBlur ?? 8));
      this.drawImageInstances(list, batch.shadowOffsetX ?? 4, batch.shadowOffsetY ?? 4, true, true);
      gl.uniform1f(this.imageIsShadowUniform, 0);
    }
    setBlendMode(gl, batch.blendMode);
    this.drawImageInstances(list, 0, 0);
  }
  destroy() {
    this.remove();
  }
  remove() {
    if (!this.particular || !this.gl) return;
    this.particular.removeEventListener("UPDATE", this.onUpdate);
    this.particular.removeEventListener("UPDATE_AFTER", this.onUpdateAfter);
    this.particular.removeEventListener("RESIZE", this.resize);
    if (this.quadBuffer) this.gl.deleteBuffer(this.quadBuffer);
    if (this.circleQuadBuffer) this.gl.deleteBuffer(this.circleQuadBuffer);
    if (this.instanceBuffer) this.gl.deleteBuffer(this.instanceBuffer);
    if (this.program) this.gl.deleteProgram(this.program);
    if (this.imageProgram) this.gl.deleteProgram(this.imageProgram);
    for (const tex of this.textureCache.values()) {
      this.gl.deleteTexture(tex);
    }
    this.textureCache.clear();
    this.particular = null;
    this.gl = null;
    this.program = null;
    this.imageProgram = null;
    this.quadBuffer = null;
    this.circleQuadBuffer = null;
    this.instanceBuffer = null;
  }
};

// src/particular/utils/mat4.ts
function perspective(fov, aspect, near, far) {
  const m = new Float32Array(16);
  const f = 1 / Math.tan(fov / 2);
  const rangeInv = 1 / (near - far);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (near + far) * rangeInv;
  m[11] = -1;
  m[14] = 2 * near * far * rangeInv;
  return m;
}
function lookAt(eye, center, up) {
  let fx = center.x - eye.x;
  let fy = center.y - eye.y;
  let fz = center.z - eye.z;
  let len = Math.sqrt(fx * fx + fy * fy + fz * fz);
  if (len > 0) {
    fx /= len;
    fy /= len;
    fz /= len;
  }
  let sx = fy * up.z - fz * up.y;
  let sy = fz * up.x - fx * up.z;
  let sz = fx * up.y - fy * up.x;
  len = Math.sqrt(sx * sx + sy * sy + sz * sz);
  if (len > 0) {
    sx /= len;
    sy /= len;
    sz /= len;
  }
  const ux = sy * fz - sz * fy;
  const uy = sz * fx - sx * fz;
  const uz = sx * fy - sy * fx;
  const m = new Float32Array(16);
  m[0] = sx;
  m[1] = ux;
  m[2] = -fx;
  m[3] = 0;
  m[4] = sy;
  m[5] = uy;
  m[6] = -fy;
  m[7] = 0;
  m[8] = sz;
  m[9] = uz;
  m[10] = -fz;
  m[11] = 0;
  m[12] = -(sx * eye.x + sy * eye.y + sz * eye.z);
  m[13] = -(ux * eye.x + uy * eye.y + uz * eye.z);
  m[14] = -(-fx * eye.x + -fy * eye.y + -fz * eye.z);
  m[15] = 1;
  return m;
}
function multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] = a[row] * b[col * 4] + a[4 + row] * b[col * 4 + 1] + a[8 + row] * b[col * 4 + 2] + a[12 + row] * b[col * 4 + 3];
    }
  }
  return out;
}

// src/particular/renderers/camera.ts
var defaultCamera = {
  fov: 60,
  position: { x: 0, y: 0, z: 500 },
  target: { x: 0, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  near: 1,
  far: 5e3
};
var Camera = class {
  constructor(config) {
    const c = { ...defaultCamera, ...config };
    this.fov = c.fov;
    this.position = { ...c.position };
    this.target = { ...c.target };
    this.up = { ...c.up };
    this.near = c.near;
    this.far = c.far;
    this.viewProjection = new Float32Array(16);
  }
  /** Recompute viewProjection matrix. Call after changing position/target/fov. */
  update(aspect) {
    const fovRad = this.fov * Math.PI / 180;
    const proj = perspective(fovRad, aspect, this.near, this.far);
    const view = lookAt(this.position, this.target, this.up);
    this.viewProjection = multiply(proj, view);
  }
  /** Set camera position from spherical coordinates around the target. */
  orbit(azimuth, elevation, distance) {
    const cosElev = Math.cos(elevation);
    this.position.x = this.target.x + distance * cosElev * Math.cos(azimuth);
    this.position.y = this.target.y + distance * Math.sin(elevation);
    this.position.z = this.target.z + distance * cosElev * Math.sin(azimuth);
  }
  /** Attach mouse-drag orbit + scroll-zoom controls to a canvas. Returns cleanup function. */
  enableOrbitControls(canvas) {
    let azimuth = Math.atan2(
      this.position.z - this.target.z,
      this.position.x - this.target.x
    );
    let elevation = Math.asin(
      Math.min(1, Math.max(
        -1,
        (this.position.y - this.target.y) / this.getDistance()
      ))
    );
    let distance = this.getDistance();
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    const prevPointerEvents = canvas.style.pointerEvents;
    canvas.style.pointerEvents = "auto";
    const onMouseDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      azimuth -= dx * 5e-3;
      elevation = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, elevation + dy * 5e-3));
      this.orbit(azimuth, elevation, distance);
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      distance = Math.max(this.near + 10, distance * (1 + e.deltaY * 1e-3));
      this.orbit(azimuth, elevation, distance);
    };
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.style.pointerEvents = prevPointerEvents;
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }
  getDistance() {
    const dx = this.position.x - this.target.x;
    const dy = this.position.y - this.target.y;
    const dz = this.position.z - this.target.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
};

// src/particular/renderers/webgl3dRenderer.ts
var VERTEX_SHADER_3D = `#version 300 es
in vec2 a_position;
in vec3 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;
in float a_particle_shape;

uniform mat4 u_viewProjection;
uniform vec2 u_resolution;
uniform vec2 u_referenceCenter;
uniform float u_worldScale;
uniform float u_glowExpand;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;
out float v_particle_shape;

void main() {
  float expand = 1.0 + u_glowExpand;
  // Convert engine coords (origin top-left, y-down) to world coords (origin center, y-up)
  // Uses fixed reference center captured on first frame so particles don't jump on resize
  vec3 worldPos = vec3(
    (a_particle_pos.x - u_referenceCenter.x) * u_worldScale,
    -(a_particle_pos.y - u_referenceCenter.y) * u_worldScale,
    a_particle_pos.z * u_worldScale
  );

  // Project particle center into clip space
  vec4 center = u_viewProjection * vec4(worldPos, 1.0);

  // Cull particles behind the camera (w <= 0 means behind or on the near plane)
  if (center.w <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // move off-screen
    v_color = vec4(0.0);
    v_uv = a_position;
    v_particle_size = 0.0;
    v_particle_shape = a_particle_shape;
    return;
  }

  // Billboarding: offset quad vertices in screen space (NDC)
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);

  // Scale size by perspective: size in pixels / screen height * 2 * w (expand accounts for glow)
  float sizeNDC = a_particle_size * expand / u_resolution.y * 2.0;
  vec2 offset = rotated * sizeNDC * center.w;

  // Correct for aspect ratio (NDC x range is -1..1 regardless of width)
  offset.x *= u_resolution.y / u_resolution.x;

  gl_Position = vec4(center.xy + offset, center.z, center.w);

  v_color = a_particle_color;
  v_uv = a_position * expand;
  v_particle_size = a_particle_size;
  v_particle_shape = a_particle_shape;
}
`;
var FRAGMENT_SHADER_3D = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
in float v_particle_size;
in float v_particle_shape;

uniform float u_softness;
uniform float u_glow;
uniform float u_glowSize;
uniform vec4 u_glowColor;
uniform float u_isShadow;
uniform vec4 u_shadowColor;
uniform float u_shadowBlur;

out vec4 outColor;

${SDF_SHAPE_FUNCTIONS}

void main() {
  float sd = shapeSdf(v_uv, v_particle_shape);
  float particleAlpha = pow(clamp(v_color.a, 0.0, 1.0), 0.8);

  if (u_isShadow > 0.0) {
    float retraction = clamp(v_color.a, 0.0, 1.0);
    float sizeScale = clamp(v_particle_size / 12.0, 0.45, 2.2);
    float effectiveShadowBlur = u_shadowBlur * retraction * sizeScale;
    float shadowAlpha = 1.0 - smoothstep(-0.02, effectiveShadowBlur, sd);
    outColor = vec4(u_shadowColor.rgb, u_shadowColor.a * shadowAlpha * retraction);
    return;
  }

  float coreAlpha = 1.0 - smoothstep(-u_softness, u_softness, sd);
  float alpha = coreAlpha;
  vec3 rgb = v_color.rgb;
  if (u_glow > 0.0) {
    float glowScale = mix(0.75, 1.75, clamp((v_particle_size - 4.0) / 20.0, 0.0, 1.0));
    float glowRange = u_glowSize * glowScale;
    float halo = 1.0 - smoothstep(-0.2, glowRange, sd);
    float glowAlpha = halo * u_glowColor.a;
    alpha = max(alpha, glowAlpha);
    float glowMix = clamp((1.0 - coreAlpha) * glowAlpha, 0.0, 1.0);
    rgb = mix(rgb, u_glowColor.rgb, glowMix);
  }
  float finalAlpha = particleAlpha * alpha;
  if (finalAlpha < 0.01) discard;
  outColor = vec4(rgb, finalAlpha);
}
`;
var IMAGE_VERTEX_SHADER_3D = `#version 300 es
in vec2 a_position;
in vec3 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;

uniform mat4 u_viewProjection;
uniform vec2 u_resolution;
uniform vec2 u_referenceCenter;
uniform float u_worldScale;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;

void main() {
  // Convert engine coords (origin top-left, y-down) to world coords (origin center, y-up)
  // Uses fixed reference center captured on first frame so particles don't jump on resize
  vec3 worldPos = vec3(
    (a_particle_pos.x - u_referenceCenter.x) * u_worldScale,
    -(a_particle_pos.y - u_referenceCenter.y) * u_worldScale,
    a_particle_pos.z * u_worldScale
  );

  vec4 center = u_viewProjection * vec4(worldPos, 1.0);

  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);

  float sizeNDC = a_particle_size / u_resolution.y * 2.0;
  vec2 offset = rotated * sizeNDC * center.w;
  offset.x *= u_resolution.y / u_resolution.x;

  gl_Position = vec4(center.xy + offset, center.z, center.w);
  v_color = a_particle_color;
  v_uv = a_position * 0.5 + 0.5;
  v_particle_size = a_particle_size;
}
`;
var IMAGE_FRAGMENT_SHADER_3D = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
in float v_particle_size;

uniform sampler2D u_texture;
uniform float u_tint;
uniform float u_isShadow;
uniform vec4 u_shadowColor;
uniform float u_shadowBlur;

out vec4 outColor;

void main() {
  vec4 tex = texture(u_texture, v_uv);

  if (u_isShadow > 0.0) {
    vec2 texel = 1.0 / vec2(textureSize(u_texture, 0));
    float retraction = clamp(v_color.a, 0.0, 1.0);
    float sizeScale = clamp(v_particle_size / 12.0, 0.45, 2.2);
    vec2 blur = texel * (u_shadowBlur * retraction * sizeScale);
    float a = tex.a * 0.28;
    a += texture(u_texture, v_uv + vec2( blur.x, 0.0)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(-blur.x, 0.0)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(0.0,  blur.y)).a * 0.12;
    a += texture(u_texture, v_uv + vec2(0.0, -blur.y)).a * 0.12;
    a += texture(u_texture, v_uv + vec2( blur.x,  blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2(-blur.x,  blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2( blur.x, -blur.y)).a * 0.06;
    a += texture(u_texture, v_uv + vec2(-blur.x, -blur.y)).a * 0.06;
    outColor = vec4(u_shadowColor.rgb, min(1.0, a) * u_shadowColor.a * retraction);
    return;
  }

  vec3 rgb = mix(tex.rgb, tex.rgb * v_color.rgb, u_tint);
  float particleAlpha = pow(clamp(v_color.a, 0.0, 1.0), 0.8);
  float finalAlpha = tex.a * particleAlpha;
  if (finalAlpha < 0.01) discard;
  outColor = vec4(rgb, finalAlpha);
}
`;
var WebGL3DRenderer = class {
  constructor(target, options) {
    this.gl = null;
    this.particular = null;
    this.pixelRatio = 2;
    this.program = null;
    this.imageProgram = null;
    this.quadBuffer = null;
    this.circleQuadBuffer = null;
    this.instanceBuffer = null;
    // x, y, z, size, rotation, r, g, b, a, shape
    this.instanceStride = 10;
    // Circle program uniforms
    this.vpUniform = null;
    this.resUniform = null;
    this.refCenterUniform = null;
    this.worldScaleUniform = null;
    this.softnessUniform = null;
    this.glowUniform = null;
    this.glowExpandUniform = null;
    this.glowSizeUniform = null;
    this.glowColorUniform = null;
    this.isShadowUniform = null;
    this.shadowColorUniform = null;
    this.shadowBlurUniform = null;
    // Circle attribute locations
    this.cAttrPos = -1;
    this.cAttrPPos = -1;
    this.cAttrSize = -1;
    this.cAttrRot = -1;
    this.cAttrColor = -1;
    this.cAttrShape = -1;
    // Image program uniforms
    this.imgVpUniform = null;
    this.imgResUniform = null;
    this.imgRefCenterUniform = null;
    this.imgWorldScaleUniform = null;
    this.imgTintUniform = null;
    this.imgIsShadowUniform = null;
    this.imgShadowColorUniform = null;
    this.imgShadowBlurUniform = null;
    this.imgTexUniform = null;
    // Image attribute locations
    this.iAttrPos = -1;
    this.iAttrPPos = -1;
    this.iAttrSize = -1;
    this.iAttrRot = -1;
    this.iAttrColor = -1;
    this.textureCache = /* @__PURE__ */ new Map();
    // Pools
    this.ghostPool = [];
    this.ghostPoolIdx = 0;
    this.expandedArr = [];
    this.batchPool = [];
    this.batchPoolIdx = 0;
    this._batchResult = [];
    // Sort scratch
    this.sortArr = [];
    // Reference-based coordinate mapping: captured on first valid frame to prevent
    // particle position jumps when the viewport resizes.
    this._refCenterX = 0;
    this._refCenterY = 0;
    this._refWorldScale = 0;
    this._refInitialized = false;
    this.resize = (args) => {
      if (!args || !this.gl) return;
      const { width, height } = args;
      this.target.width = width;
      this.target.height = height;
      this.gl.viewport(0, 0, width, height);
    };
    this.onUpdate = () => {
      if (!this.gl) return;
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    this.onUpdateAfter = () => {
      if (!this.gl || !this.particular || !this.program) return;
      const baseParticles = this.particular.getAllParticles();
      const particles = this.expandParticlesWithTrails(baseParticles);
      for (let ai = 0; ai < this.particular.attractors.length; ai++) {
        const attractor = this.particular.attractors[ai];
        if (attractor.visible) particles.push(attractor.toDrawable());
      }
      const w = this.target.width || this.particular.width;
      const h = this.target.height || this.particular.height;
      const pixelRatio = this.pixelRatio;
      const logicalW = w / pixelRatio;
      const logicalH = h / pixelRatio;
      if (logicalW <= 0 || logicalH <= 0) return;
      this.camera.update(logicalW / logicalH);
      const fovRad = this.camera.fov * Math.PI / 180;
      const camDist = this.camera.getDistance();
      const visibleHalfH = camDist * Math.tan(fovRad / 2);
      const worldScale = visibleHalfH / (logicalH / 2);
      if (!this._refInitialized && logicalW > 0 && logicalH > 0) {
        this._refCenterX = logicalW * 0.5;
        this._refCenterY = logicalH * 0.5;
        this._refWorldScale = worldScale;
        this._refInitialized = true;
      }
      const batches = this.buildBatches(particles);
      const gl = this.gl;
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.vpUniform, false, this.camera.viewProjection);
      gl.uniform2f(this.resUniform, logicalW, logicalH);
      gl.uniform2f(this.refCenterUniform, this._refCenterX, this._refCenterY);
      gl.uniform1f(this.worldScaleUniform, this._refWorldScale);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
      gl.enableVertexAttribArray(this.cAttrPos);
      gl.vertexAttribPointer(this.cAttrPos, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      for (let bi = 0; bi < batches.length; bi++) {
        const batch = batches[bi];
        if (batch.blendMode !== "additive") {
          this.sortBackToFront(batch.particles);
        }
        if (batch.type === "circle") {
          this.drawCircleBatch(batch);
        } else {
          this.drawImageBatch(batch, logicalW, logicalH);
          gl.useProgram(this.program);
          gl.uniformMatrix4fv(this.vpUniform, false, this.camera.viewProjection);
          gl.uniform2f(this.resUniform, logicalW, logicalH);
          gl.uniform2f(this.refCenterUniform, this._refCenterX, this._refCenterY);
          gl.uniform1f(this.worldScaleUniform, this._refWorldScale);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
          gl.enableVertexAttribArray(this.cAttrPos);
          gl.vertexAttribPointer(this.cAttrPos, 2, gl.FLOAT, false, 0, 0);
        }
      }
      gl.disable(gl.DEPTH_TEST);
    };
    this.target = target;
    this.maxInstances = options?.maxInstances ?? 16384;
    this.instanceData = new Float32Array(this.maxInstances * this.instanceStride);
    this.camera = new Camera(options?.camera);
  }
  init(particular, pixelRatio) {
    this.particular = particular;
    this.pixelRatio = pixelRatio;
    particular.boundsPadding = 3;
    const gl = this.target.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true
    });
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_3D);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_3D);
    this.program = linkProgram(gl, vs, fs);
    this.vpUniform = gl.getUniformLocation(this.program, "u_viewProjection");
    this.resUniform = gl.getUniformLocation(this.program, "u_resolution");
    this.refCenterUniform = gl.getUniformLocation(this.program, "u_referenceCenter");
    this.worldScaleUniform = gl.getUniformLocation(this.program, "u_worldScale");
    this.softnessUniform = gl.getUniformLocation(this.program, "u_softness");
    this.glowUniform = gl.getUniformLocation(this.program, "u_glow");
    this.glowExpandUniform = gl.getUniformLocation(this.program, "u_glowExpand");
    this.glowSizeUniform = gl.getUniformLocation(this.program, "u_glowSize");
    this.glowColorUniform = gl.getUniformLocation(this.program, "u_glowColor");
    this.isShadowUniform = gl.getUniformLocation(this.program, "u_isShadow");
    this.shadowColorUniform = gl.getUniformLocation(this.program, "u_shadowColor");
    this.shadowBlurUniform = gl.getUniformLocation(this.program, "u_shadowBlur");
    this.cAttrPos = gl.getAttribLocation(this.program, "a_position");
    this.cAttrPPos = gl.getAttribLocation(this.program, "a_particle_pos");
    this.cAttrSize = gl.getAttribLocation(this.program, "a_particle_size");
    this.cAttrRot = gl.getAttribLocation(this.program, "a_particle_rotation");
    this.cAttrColor = gl.getAttribLocation(this.program, "a_particle_color");
    this.cAttrShape = gl.getAttribLocation(this.program, "a_particle_shape");
    const ivs = compileShader(gl, gl.VERTEX_SHADER, IMAGE_VERTEX_SHADER_3D);
    const ifs = compileShader(gl, gl.FRAGMENT_SHADER, IMAGE_FRAGMENT_SHADER_3D);
    this.imageProgram = linkProgram(gl, ivs, ifs);
    this.imgVpUniform = gl.getUniformLocation(this.imageProgram, "u_viewProjection");
    this.imgResUniform = gl.getUniformLocation(this.imageProgram, "u_resolution");
    this.imgRefCenterUniform = gl.getUniformLocation(this.imageProgram, "u_referenceCenter");
    this.imgWorldScaleUniform = gl.getUniformLocation(this.imageProgram, "u_worldScale");
    this.imgTintUniform = gl.getUniformLocation(this.imageProgram, "u_tint");
    this.imgIsShadowUniform = gl.getUniformLocation(this.imageProgram, "u_isShadow");
    this.imgShadowColorUniform = gl.getUniformLocation(this.imageProgram, "u_shadowColor");
    this.imgShadowBlurUniform = gl.getUniformLocation(this.imageProgram, "u_shadowBlur");
    this.imgTexUniform = gl.getUniformLocation(this.imageProgram, "u_texture");
    this.iAttrPos = gl.getAttribLocation(this.imageProgram, "a_position");
    this.iAttrPPos = gl.getAttribLocation(this.imageProgram, "a_particle_pos");
    this.iAttrSize = gl.getAttribLocation(this.imageProgram, "a_particle_size");
    this.iAttrRot = gl.getAttribLocation(this.imageProgram, "a_particle_rotation");
    this.iAttrColor = gl.getAttribLocation(this.imageProgram, "a_particle_color");
    const quadData = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);
    const circleQuadData = new Float32Array([-2, -2, 2, -2, -2, 2, -2, 2, 2, -2, 2, 2]);
    this.circleQuadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleQuadData, gl.STATIC_DRAW);
    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.instanceData.byteLength, gl.DYNAMIC_DRAW);
    particular.addEventListener("UPDATE", this.onUpdate);
    particular.addEventListener("UPDATE_AFTER", this.onUpdateAfter);
    particular.addEventListener("RESIZE", this.resize);
  }
  // ── Depth sorting ──────────────────────────────────────────────────────
  sortBackToFront(particles) {
    const vp = this.camera.viewProjection;
    const halfW = this._refCenterX;
    const halfH = this._refCenterY;
    const ws = this._refWorldScale;
    const m2 = vp[2], m6 = vp[6], m10 = vp[10], m14 = vp[14];
    const m3 = vp[3], m7 = vp[7], m11 = vp[11], m15 = vp[15];
    const arr = this.sortArr;
    arr.length = particles.length;
    for (let i = 0; i < particles.length; i++) arr[i] = particles[i];
    arr.sort((a, b) => {
      const awx = (a.position.x - halfW) * ws;
      const awy = -(a.position.y - halfH) * ws;
      const awz = a.position.z * ws;
      const az = m2 * awx + m6 * awy + m10 * awz + m14;
      const aw = m3 * awx + m7 * awy + m11 * awz + m15;
      const bwx = (b.position.x - halfW) * ws;
      const bwy = -(b.position.y - halfH) * ws;
      const bwz = b.position.z * ws;
      const bz = m2 * bwx + m6 * bwy + m10 * bwz + m14;
      const bw = m3 * bwx + m7 * bwy + m11 * bwz + m15;
      return az / aw - bz / bw;
    });
    for (let i = 0; i < arr.length; i++) particles[i] = arr[i];
  }
  // ── Trail expansion ────────────────────────────────────────────────────
  expandParticlesWithTrails(particles) {
    const expanded = this.expandedArr;
    expanded.length = 0;
    this.ghostPoolIdx = 0;
    for (let pi = 0; pi < particles.length; pi++) {
      const particle = particles[pi];
      expanded.push(particle);
      if (!particle.trail || particle.trailSegments.length === 0) continue;
      const maxAge = Math.max(1, Math.floor(particle.trailLength));
      for (let si = 0; si < particle.trailSegments.length; si++) {
        const segment = particle.trailSegments[si];
        const life = 1 - segment.age / maxAge;
        if (life <= 0) continue;
        const sizeScale = particle.trailShrink + life * (1 - particle.trailShrink);
        const alphaScale = life * particle.trailFade;
        const ghost = this.acquireGhost();
        ghost.position.x = segment.x;
        ghost.position.y = segment.y;
        ghost.position.z = segment.z;
        ghost.factoredSize = Math.max(0.1, segment.size * sizeScale);
        ghost.rotation = segment.rotation;
        ghost.alpha = segment.alpha * alphaScale;
        ghost.color = particle.color;
        ghost.colorR = particle.colorR;
        ghost.colorG = particle.colorG;
        ghost.colorB = particle.colorB;
        ghost.shape = particle.shape;
        ghost.blendMode = particle.blendMode;
        ghost.image = particle.image;
        ghost.imageTint = particle.imageTint;
        ghost.glow = false;
        ghost.shadow = false;
        expanded.push(ghost);
      }
    }
    return expanded;
  }
  acquireGhost() {
    if (this.ghostPoolIdx < this.ghostPool.length) {
      return this.ghostPool[this.ghostPoolIdx++];
    }
    const ghost = {
      position: { x: 0, y: 0, z: 0 },
      factoredSize: 0,
      rotation: 0,
      alpha: 0,
      color: "",
      colorR: 0,
      colorG: 0,
      colorB: 0,
      shape: "circle",
      blendMode: "normal",
      image: null,
      imageTint: false,
      glow: false,
      shadow: false,
      trail: false,
      trailSegments: [],
      shadowLightOrigin: null
    };
    this.ghostPool.push(ghost);
    this.ghostPoolIdx++;
    return ghost;
  }
  // ── Batching ───────────────────────────────────────────────────────────
  buildBatches(particles) {
    this.batchPoolIdx = 0;
    const batches = this._batchResult;
    batches.length = 0;
    let current = null;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const img = p.image && p.image instanceof HTMLImageElement ? p.image : null;
      const tex = img ? this.getOrCreateTexture(img) : null;
      const isImage = !!tex;
      const sameBatch = current && current.type === (isImage ? "image" : "circle") && current.blendMode === p.blendMode && current.shadow === p.shadow && (!p.shadow || current.shadowBlur === p.shadowBlur && current.shadowColor === p.shadowColor && current.shadowAlpha === p.shadowAlpha) && (isImage ? current.texture === tex && current.imageTint === !!p.imageTint : current.glow === p.glow && (!p.glow || current.glowSize === p.glowSize && current.glowColor === p.glowColor && current.glowAlpha === p.glowAlpha));
      if (!sameBatch) {
        current = this.acquireBatch();
        current.type = isImage ? "image" : "circle";
        current.blendMode = p.blendMode;
        current.shadow = p.shadow;
        current.shadowBlur = p.shadowBlur;
        current.shadowColor = p.shadowColor;
        current.shadowAlpha = p.shadowAlpha;
        if (isImage && tex) {
          current.texture = tex;
          current.image = img;
          current.imageTint = !!p.imageTint;
        } else {
          current.texture = void 0;
          current.image = void 0;
          current.imageTint = void 0;
          current.glow = p.glow;
          current.glowSize = p.glowSize;
          current.glowColor = p.glowColor;
          current.glowAlpha = p.glowAlpha;
        }
        batches.push(current);
      }
      current.particles.push(p);
    }
    return batches;
  }
  acquireBatch() {
    if (this.batchPoolIdx < this.batchPool.length) {
      const batch2 = this.batchPool[this.batchPoolIdx++];
      batch2.particles.length = 0;
      return batch2;
    }
    const batch = { type: "circle", blendMode: "normal", particles: [] };
    this.batchPool.push(batch);
    this.batchPoolIdx++;
    return batch;
  }
  // ── Instance data fill ─────────────────────────────────────────────────
  fillInstanceData(particles, startIdx, endIdx) {
    let offset = 0;
    for (let i = startIdx; i < endIdx; i++) {
      const p = particles[i];
      this.instanceData[offset++] = p.position.x;
      this.instanceData[offset++] = p.position.y;
      this.instanceData[offset++] = p.position.z;
      this.instanceData[offset++] = p.factoredSize;
      this.instanceData[offset++] = p.rotation * Math.PI / 180;
      this.instanceData[offset++] = p.colorR;
      this.instanceData[offset++] = p.colorG;
      this.instanceData[offset++] = p.colorB;
      this.instanceData[offset++] = p.alpha;
      this.instanceData[offset++] = shapeToId(p.shape);
    }
  }
  // ── Draw helpers ───────────────────────────────────────────────────────
  drawCircleInstances(list) {
    const gl = this.gl;
    const stride = this.instanceStride;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.enableVertexAttribArray(this.cAttrPPos);
    gl.vertexAttribPointer(this.cAttrPPos, 3, gl.FLOAT, false, stride * 4, 0);
    gl.vertexAttribDivisor(this.cAttrPPos, 1);
    gl.enableVertexAttribArray(this.cAttrSize);
    gl.vertexAttribPointer(this.cAttrSize, 1, gl.FLOAT, false, stride * 4, 12);
    gl.vertexAttribDivisor(this.cAttrSize, 1);
    gl.enableVertexAttribArray(this.cAttrRot);
    gl.vertexAttribPointer(this.cAttrRot, 1, gl.FLOAT, false, stride * 4, 16);
    gl.vertexAttribDivisor(this.cAttrRot, 1);
    gl.enableVertexAttribArray(this.cAttrColor);
    gl.vertexAttribPointer(this.cAttrColor, 4, gl.FLOAT, false, stride * 4, 20);
    gl.vertexAttribDivisor(this.cAttrColor, 1);
    gl.enableVertexAttribArray(this.cAttrShape);
    gl.vertexAttribPointer(this.cAttrShape, 1, gl.FLOAT, false, stride * 4, 36);
    gl.vertexAttribDivisor(this.cAttrShape, 1);
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const end = Math.min(i + this.maxInstances, list.length);
      const count = end - i;
      this.fillInstanceData(list, i, end);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, count * stride));
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
    }
    gl.vertexAttribDivisor(this.cAttrPPos, 0);
    gl.vertexAttribDivisor(this.cAttrSize, 0);
    gl.vertexAttribDivisor(this.cAttrRot, 0);
    gl.vertexAttribDivisor(this.cAttrColor, 0);
    gl.vertexAttribDivisor(this.cAttrShape, 0);
  }
  drawCircleBatch(batch) {
    const gl = this.gl;
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? "#000000");
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.isShadowUniform, 1);
      gl.uniform1f(this.glowExpandUniform, 0);
      gl.uniform4f(this.shadowColorUniform, sr, sg, sb, sa);
      gl.uniform1f(this.shadowBlurUniform, Math.min(1, (batch.shadowBlur ?? 8) / 20));
      gl.depthMask(false);
      this.drawCircleInstances(batch.particles);
      gl.depthMask(true);
      gl.uniform1f(this.isShadowUniform, 0);
    }
    setBlendMode(gl, batch.blendMode);
    gl.depthMask(false);
    gl.uniform1f(this.softnessUniform, 0.1);
    gl.uniform1f(this.glowUniform, batch.glow ? 1 : 0);
    const glowUV = Math.min(1, (batch.glowSize ?? 10) / 30) * 1.75;
    gl.uniform1f(this.glowExpandUniform, batch.glow ? glowUV : 0);
    gl.uniform1f(this.glowSizeUniform, Math.min(1, (batch.glowSize ?? 10) / 30));
    const [gr, gg, gb] = hexToRgba(batch.glowColor ?? "#ffffff");
    gl.uniform4f(this.glowColorUniform, gr, gg, gb, Math.max(0, Math.min(1, batch.glowAlpha ?? 0.35)));
    this.drawCircleInstances(batch.particles);
    gl.depthMask(true);
  }
  drawImageInstances(list) {
    const gl = this.gl;
    const stride = this.instanceStride;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.enableVertexAttribArray(this.iAttrPPos);
    gl.vertexAttribPointer(this.iAttrPPos, 3, gl.FLOAT, false, stride * 4, 0);
    gl.vertexAttribDivisor(this.iAttrPPos, 1);
    gl.enableVertexAttribArray(this.iAttrSize);
    gl.vertexAttribPointer(this.iAttrSize, 1, gl.FLOAT, false, stride * 4, 12);
    gl.vertexAttribDivisor(this.iAttrSize, 1);
    gl.enableVertexAttribArray(this.iAttrRot);
    gl.vertexAttribPointer(this.iAttrRot, 1, gl.FLOAT, false, stride * 4, 16);
    gl.vertexAttribDivisor(this.iAttrRot, 1);
    gl.enableVertexAttribArray(this.iAttrColor);
    gl.vertexAttribPointer(this.iAttrColor, 4, gl.FLOAT, false, stride * 4, 20);
    gl.vertexAttribDivisor(this.iAttrColor, 1);
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const end = Math.min(i + this.maxInstances, list.length);
      const count = end - i;
      this.fillInstanceData(list, i, end);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, count * stride));
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
    }
    gl.vertexAttribDivisor(this.iAttrPPos, 0);
    gl.vertexAttribDivisor(this.iAttrSize, 0);
    gl.vertexAttribDivisor(this.iAttrRot, 0);
    gl.vertexAttribDivisor(this.iAttrColor, 0);
  }
  drawImageBatch(batch, w, h) {
    const gl = this.gl;
    if (!this.imageProgram || !batch.texture) return;
    gl.useProgram(this.imageProgram);
    gl.uniformMatrix4fv(this.imgVpUniform, false, this.camera.viewProjection);
    gl.uniform2f(this.imgResUniform, w, h);
    gl.uniform2f(this.imgRefCenterUniform, this._refCenterX, this._refCenterY);
    gl.uniform1f(this.imgWorldScaleUniform, this._refWorldScale);
    gl.uniform1f(this.imgTintUniform, batch.imageTint ? 1 : 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, batch.texture);
    gl.uniform1i(this.imgTexUniform, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.enableVertexAttribArray(this.iAttrPos);
    gl.vertexAttribPointer(this.iAttrPos, 2, gl.FLOAT, false, 0, 0);
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? "#000000");
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.imgIsShadowUniform, 1);
      gl.uniform4f(this.imgShadowColorUniform, sr, sg, sb, sa);
      gl.uniform1f(this.imgShadowBlurUniform, Math.max(0, batch.shadowBlur ?? 8));
      gl.depthMask(false);
      this.drawImageInstances(batch.particles);
      gl.depthMask(true);
      gl.uniform1f(this.imgIsShadowUniform, 0);
    }
    setBlendMode(gl, batch.blendMode);
    gl.depthMask(false);
    this.drawImageInstances(batch.particles);
    gl.depthMask(true);
  }
  getOrCreateTexture(image) {
    if (!image.complete || image.naturalWidth === 0) return null;
    let tex = this.textureCache.get(image);
    if (tex) return tex;
    const gl = this.gl;
    tex = gl.createTexture();
    if (!tex) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    this.textureCache.set(image, tex);
    return tex;
  }
  /** Reference center X (logical coords), captured on first frame. 0 before first render. */
  get referenceCenterX() {
    return this._refCenterX;
  }
  /** Reference center Y (logical coords), captured on first frame. 0 before first render. */
  get referenceCenterY() {
    return this._refCenterY;
  }
  /** Reference worldScale, captured on first frame. 0 before first render. */
  get referenceWorldScale() {
    return this._refWorldScale;
  }
  destroy() {
    this.remove();
  }
  remove() {
    if (!this.particular || !this.gl) return;
    this.particular.removeEventListener("UPDATE", this.onUpdate);
    this.particular.removeEventListener("UPDATE_AFTER", this.onUpdateAfter);
    this.particular.removeEventListener("RESIZE", this.resize);
    if (this.quadBuffer) this.gl.deleteBuffer(this.quadBuffer);
    if (this.circleQuadBuffer) this.gl.deleteBuffer(this.circleQuadBuffer);
    if (this.instanceBuffer) this.gl.deleteBuffer(this.instanceBuffer);
    if (this.program) this.gl.deleteProgram(this.program);
    if (this.imageProgram) this.gl.deleteProgram(this.imageProgram);
    for (const tex of this.textureCache.values()) {
      this.gl.deleteTexture(tex);
    }
    this.textureCache.clear();
    this.particular = null;
    this.gl = null;
    this.program = null;
    this.imageProgram = null;
    this.quadBuffer = null;
    this.circleQuadBuffer = null;
    this.instanceBuffer = null;
  }
};

// src/particular/canvasStyles.ts
var DEFAULT_Z_INDEX = 1e4;
var particlesBackgroundLayerStyle = {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: DEFAULT_Z_INDEX
};
function getParticlesBackgroundLayerStyle(zIndex) {
  return zIndex !== void 0 ? { ...particlesBackgroundLayerStyle, zIndex } : particlesBackgroundLayerStyle;
}
var particlesContainerLayerStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none"
};
function getParticlesContainerLayerStyle(zIndex) {
  return zIndex !== void 0 ? { ...particlesContainerLayerStyle, zIndex } : particlesContainerLayerStyle;
}
function applyCanvasStyles(canvas, container, zIndex) {
  const style = container ? getParticlesContainerLayerStyle(zIndex) : getParticlesBackgroundLayerStyle(zIndex);
  Object.assign(canvas.style, style);
}

// src/particular/components/icons.ts
var images = [];
function processImages(icons) {
  images = [];
  for (const icon of icons) {
    if (typeof icon === "string") {
      const imageObject = new Image();
      imageObject.src = icon;
      images.push(imageObject);
    } else {
      images.push(icon);
    }
  }
  return images;
}

// src/particular/convenience/resize.ts
function getViewportSize(container) {
  if (container) {
    return { w: container.clientWidth, h: container.clientHeight };
  }
  return { w: window.innerWidth, h: window.innerHeight };
}
function watchResize(callback, options = {}) {
  const { container, debounceMs = 200, cleanups } = options;
  const skipSmall = options.skipSmallChanges ?? debounceMs > 0;
  const initial = getViewportSize(container);
  let debounceTimer = null;
  const fire = () => {
    const current = getViewportSize(container);
    const scaleX = initial.w > 0 ? current.w / initial.w : 1;
    const scaleY = initial.h > 0 ? current.h / initial.h : 1;
    if (skipSmall && Math.abs(scaleX - 1) < 0.01 && Math.abs(scaleY - 1) < 0.01) return;
    callback(scaleX, scaleY, current);
  };
  const handler = () => {
    if (debounceMs <= 0) {
      fire();
      return;
    }
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fire, debounceMs);
  };
  const teardown = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
  };
  if (container) {
    const ro = new ResizeObserver(handler);
    ro.observe(container);
    cleanups?.push(() => {
      ro.disconnect();
      teardown();
    });
  } else {
    window.addEventListener("resize", handler);
    cleanups?.push(() => {
      window.removeEventListener("resize", handler);
      teardown();
    });
  }
  return initial;
}

// src/particular/convenience/forces.ts
function createForces(engine, container, cleanups) {
  const addAttractor = (config) => {
    const attractor = new Attractor(config);
    engine.addAttractor(attractor);
    return attractor;
  };
  const removeAttractor = (attractor) => {
    engine.removeAttractor(attractor);
  };
  const addRandomAttractors = (count, config) => {
    const pixelRatio = engine.pixelRatio;
    const vp = getViewportSize(container);
    const viewW = vp.w / pixelRatio;
    const viewH = vp.h / pixelRatio;
    const marginX = viewW * 0.1;
    const marginY = viewH * 0.1;
    const result = [];
    for (let i = 0; i < count; i++) {
      const x = marginX + Math.random() * (viewW - marginX * 2);
      const y = marginY + Math.random() * (viewH - marginY * 2);
      const attractor = addAttractor({
        x,
        y,
        strength: 1,
        radius: 200,
        visible: true,
        ...config
      });
      result.push(attractor);
    }
    return result;
  };
  const removeAllAttractors = () => {
    engine.attractors.splice(0);
  };
  const addMouseForce = (config = {}) => {
    const { track, ...forceConfig } = config;
    const mouseForce = new MouseForce(forceConfig);
    engine.addMouseForce(mouseForce);
    if (track) {
      const target = track === true ? window : track;
      mouseForce.startTracking(target, engine.pixelRatio, container);
      cleanups.push(() => mouseForce.stopTracking());
    }
    return mouseForce;
  };
  const removeMouseForce = (mouseForce) => {
    mouseForce.stopTracking();
    engine.removeMouseForce(mouseForce);
  };
  const addFlockingForce = (config) => {
    const flockingForce = new FlockingForce(config);
    engine.addFlockingForce(flockingForce);
    return flockingForce;
  };
  const removeFlockingForce = (flockingForce) => {
    engine.removeFlockingForce(flockingForce);
  };
  return { addAttractor, removeAttractor, addRandomAttractors, removeAllAttractors, addMouseForce, removeMouseForce, addFlockingForce, removeFlockingForce };
}

// src/particular/convenience/boundary.ts
function createBoundaryHelper(engine, container, cleanups) {
  const addBoundary = (config) => {
    const {
      element,
      strength = -1.5,
      radius = 10,
      inset: insetFraction = 0.4
    } = config;
    const pr = engine.pixelRatio;
    let attractors = [];
    let offsets = [];
    const rebuild = () => {
      for (const a of attractors) engine.removeAttractor(a);
      attractors = [];
      offsets = [];
      const refRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      const elW = elRect.width / pr;
      const elH = elRect.height / pr;
      const ins = radius * insetFraction;
      const localL = ins;
      const localR = elW - ins;
      const localT = ins;
      const localB = elH - ins;
      const w = localR - localL;
      const h = localB - localT;
      if (w <= 0 || h <= 0) return;
      const stepsX = Math.max(2, Math.ceil(w / radius) + 1);
      const stepsY = Math.max(2, Math.ceil(h / radius) + 1);
      const add = (dx, dy) => {
        const a = new Attractor({ x: elLeft + dx, y: elTop + dy, strength, radius });
        engine.addAttractor(a);
        attractors.push(a);
        offsets.push({ dx, dy });
      };
      for (let i = 0; i < stepsX; i++) {
        const x = localL + w * i / (stepsX - 1);
        add(x, localT);
        add(x, localB);
      }
      for (let i = 1; i < stepsY - 1; i++) {
        const y = localT + h * i / (stepsY - 1);
        add(localL, y);
        add(localR, y);
      }
    };
    const reposition = () => {
      if (attractors.length === 0) return;
      const refRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      for (let i = 0; i < attractors.length; i++) {
        const a = attractors[i];
        const o = offsets[i];
        a.position.x = elLeft + o.dx;
        a.position.y = elTop + o.dy;
      }
    };
    rebuild();
    let rebuildRafId = 0;
    const ro = new ResizeObserver(() => {
      if (rebuildRafId) return;
      rebuildRafId = requestAnimationFrame(() => {
        rebuildRafId = 0;
        rebuild();
      });
    });
    ro.observe(element);
    if (container) ro.observe(container);
    let scrollRafId = 0;
    const onScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        reposition();
      });
    };
    const scrollTarget = container ?? window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    const handle = {
      update: rebuild,
      destroy: () => {
        ro.disconnect();
        if (rebuildRafId) cancelAnimationFrame(rebuildRafId);
        scrollTarget.removeEventListener("scroll", onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const a of attractors) engine.removeAttractor(a);
        attractors = [];
        offsets = [];
      }
    };
    cleanups.push(() => handle.destroy());
    return handle;
  };
  return { addBoundary };
}

// src/particular/convenience/containerGlow.ts
var EDGE_ANGLES = {
  top: -Math.PI / 2,
  bottom: Math.PI / 2,
  left: Math.PI,
  right: 0
};
function createContainerGlowHelper(engine, container, cleanups) {
  const addContainerGlow = (config) => {
    const { element, ...userConfig } = config;
    const resolved = { ...defaultContainerGlow, ...userConfig };
    const pr = engine.pixelRatio;
    let emitters = [];
    let edgeData = [];
    let pulseTick = 0;
    let paused = false;
    const baseRate = resolved.rate;
    const buildParticleConfig = (angle) => configureParticle({
      rate: resolved.rate,
      life: 999999,
      particleLife: resolved.particleLife,
      velocity: Vector.fromAngle(angle, resolved.velocity),
      spread: resolved.spread,
      sizeMin: resolved.sizeMin,
      sizeMax: resolved.sizeMax,
      velocityMultiplier: 0,
      fadeTime: resolved.fadeTime,
      gravity: 0,
      scaleStep: 1,
      friction: resolved.friction,
      frictionSize: 0,
      acceleration: 0,
      accelerationSize: 0,
      colors: resolved.colors,
      shape: resolved.shape,
      blendMode: resolved.blendMode,
      glow: resolved.glow,
      glowSize: resolved.glowSize,
      glowColor: resolved.glowColor,
      glowAlpha: resolved.glowAlpha,
      shadow: false,
      trail: false
    });
    const rebuild = () => {
      for (const em of emitters) {
        engine.emitters.splice(engine.emitters.indexOf(em), 1);
        em.destroy();
      }
      emitters = [];
      edgeData = [];
      const refRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      const elW = elRect.width / pr;
      const elH = elRect.height / pr;
      const edges = [
        { edge: "top", offsetX: elW / 2, offsetY: 0, spawnW: elW, spawnH: 0 },
        { edge: "bottom", offsetX: elW / 2, offsetY: elH, spawnW: elW, spawnH: 0 },
        { edge: "left", offsetX: 0, offsetY: elH / 2, spawnW: 0, spawnH: elH },
        { edge: "right", offsetX: elW, offsetY: elH / 2, spawnW: 0, spawnH: elH }
      ];
      for (const { edge, offsetX, offsetY, spawnW, spawnH } of edges) {
        const particleConfig = buildParticleConfig(EDGE_ANGLES[edge]);
        const emitter = new Emitter({
          point: new Vector(elLeft + offsetX, elTop + offsetY),
          ...particleConfig,
          spawnWidth: spawnW,
          spawnHeight: spawnH,
          icons: []
        });
        engine.addEmitter(emitter);
        emitter.isEmitting = true;
        emitter.emit();
        emitters.push(emitter);
        edgeData.push({ edge, offsetX, offsetY });
      }
    };
    const reposition = () => {
      if (emitters.length === 0) return;
      const refRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      for (let i = 0; i < emitters.length; i++) {
        const em = emitters[i];
        const data = edgeData[i];
        em.configuration.point.x = elLeft + data.offsetX;
        em.configuration.point.y = elTop + data.offsetY;
      }
    };
    const onUpdate = () => {
      if (paused) {
        for (const em of emitters) em.isEmitting = false;
        return;
      }
      if (resolved.pulseAmplitude > 0 && resolved.pulseSpeed > 0) {
        pulseTick++;
        const pulse = 1 + resolved.pulseAmplitude * Math.sin(pulseTick * resolved.pulseSpeed);
        for (const em of emitters) {
          em.configuration.rate = baseRate * pulse;
        }
      }
    };
    rebuild();
    engine.addEventListener(Particular.UPDATE, onUpdate);
    let rebuildRafId = 0;
    const ro = new ResizeObserver(() => {
      if (rebuildRafId) return;
      rebuildRafId = requestAnimationFrame(() => {
        rebuildRafId = 0;
        rebuild();
      });
    });
    ro.observe(element);
    if (container) ro.observe(container);
    let scrollRafId = 0;
    const onScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        reposition();
      });
    };
    const scrollTarget = container ?? window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    const stop = () => {
      paused = true;
      for (const em of emitters) em.isEmitting = false;
    };
    const start = () => {
      paused = false;
      for (const em of emitters) em.isEmitting = true;
    };
    const handle = {
      update: rebuild,
      stop,
      start,
      destroy: () => {
        engine.removeEventListener(Particular.UPDATE, onUpdate);
        ro.disconnect();
        if (rebuildRafId) cancelAnimationFrame(rebuildRafId);
        scrollTarget.removeEventListener("scroll", onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const em of emitters) {
          const idx = engine.emitters.indexOf(em);
          if (idx !== -1) engine.emitters.splice(idx, 1);
          em.destroy();
        }
        emitters = [];
        edgeData = [];
      }
    };
    cleanups.push(() => handle.destroy());
    return handle;
  };
  return { addContainerGlow };
}

// src/particular/convenience/mouseTrail.ts
function createMouseTrailHelper(engine, container, cleanups) {
  const addMouseTrail = (config = {}) => {
    const { target: userTarget, ...userConfig } = config;
    const resolved = { ...defaultMouseTrail, ...userConfig };
    const pr = engine.pixelRatio;
    const target = userTarget ?? window;
    let paused = false;
    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;
    let mouseSpeed = 0;
    let hasMoved = false;
    const particleConfig = configureParticle({
      rate: resolved.rate,
      life: 999999,
      particleLife: resolved.particleLife,
      velocity: new Vector(0, 0),
      spread: resolved.spread,
      sizeMin: resolved.sizeMin,
      sizeMax: resolved.sizeMax,
      velocityMultiplier: 0,
      fadeTime: resolved.fadeTime,
      gravity: 0,
      scaleStep: 1,
      friction: resolved.friction,
      frictionSize: 0,
      acceleration: 0,
      accelerationSize: 0,
      colors: resolved.colors,
      shape: resolved.shape,
      blendMode: resolved.blendMode,
      glow: resolved.glow,
      glowSize: resolved.glowSize,
      glowColor: resolved.glowColor,
      glowAlpha: resolved.glowAlpha,
      shadow: false,
      trail: resolved.trail,
      trailLength: resolved.trailLength,
      trailFade: resolved.trailFade,
      trailShrink: resolved.trailShrink
    });
    const emitter = new Emitter({
      point: new Vector(0, 0),
      ...particleConfig,
      spawnWidth: 0,
      spawnHeight: 0,
      icons: []
    });
    engine.addEmitter(emitter);
    emitter.isEmitting = false;
    let cachedRect = null;
    let rectDirty = true;
    const invalidateRect = () => {
      rectDirty = true;
    };
    let trailRo = null;
    if (container) {
      trailRo = new ResizeObserver(invalidateRect);
      trailRo.observe(container);
      window.addEventListener("scroll", invalidateRect, { passive: true });
      container.addEventListener("scroll", invalidateRect, { passive: true });
    }
    const handleCoords = (clientX, clientY) => {
      let x = clientX;
      let y = clientY;
      if (container) {
        if (rectDirty || !cachedRect) {
          const rect = container.getBoundingClientRect();
          cachedRect = { left: rect.left, top: rect.top };
          rectDirty = false;
        }
        x -= cachedRect.left;
        y -= cachedRect.top;
      }
      mouseX = x / pr;
      mouseY = y / pr;
      hasMoved = true;
    };
    const onMouseMove = (e) => {
      const me = e;
      handleCoords(me.clientX, me.clientY);
    };
    const onTouchMove = (e) => {
      const te = e;
      const touch = te.touches[0];
      if (touch) handleCoords(touch.clientX, touch.clientY);
    };
    target.addEventListener("mousemove", onMouseMove);
    target.addEventListener("touchmove", onTouchMove, { passive: true });
    target.addEventListener("touchstart", onTouchMove, { passive: true });
    const onUpdate = () => {
      if (paused) {
        emitter.isEmitting = false;
        return;
      }
      if (!hasMoved) {
        emitter.isEmitting = false;
        return;
      }
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      prevX = mouseX;
      prevY = mouseY;
      emitter.configuration.point.x = mouseX;
      emitter.configuration.point.y = mouseY;
      if (mouseSpeed < resolved.minSpeed) {
        emitter.isEmitting = false;
        return;
      }
      const angle = Math.atan2(dy, dx);
      emitter.configuration.velocity = Vector.fromAngle(angle + Math.PI, resolved.velocity);
      emitter.isEmitting = true;
    };
    engine.addEventListener(Particular.UPDATE, onUpdate);
    const handle = {
      stop: () => {
        paused = true;
        emitter.isEmitting = false;
      },
      start: () => {
        paused = false;
      },
      destroy: () => {
        engine.removeEventListener(Particular.UPDATE, onUpdate);
        target.removeEventListener("mousemove", onMouseMove);
        target.removeEventListener("touchmove", onTouchMove);
        target.removeEventListener("touchstart", onTouchMove);
        if (trailRo) trailRo.disconnect();
        if (container) {
          window.removeEventListener("scroll", invalidateRect);
          container.removeEventListener("scroll", invalidateRect);
        }
        const idx = engine.emitters.indexOf(emitter);
        if (idx !== -1) engine.emitters.splice(idx, 1);
        emitter.destroy();
      }
    };
    cleanups.push(() => handle.destroy());
    return handle;
  };
  return { addMouseTrail };
}

// src/particular/convenience/effects.ts
function createEffects(engine, mergedConfig) {
  const explode = (options = {}) => {
    const destroyParents = options.destroyParents ?? true;
    const allParticles = engine.getAllParticles();
    if (allParticles.length === 0) return;
    const snapshots = allParticles.map((p) => ({
      x: p.position.x,
      y: p.position.y,
      color: p.color,
      shape: p.shape,
      blendMode: p.blendMode
    }));
    if (destroyParents) {
      for (const emitter of engine.emitters) {
        for (const p of emitter.particles) {
          p.destroy();
        }
        emitter.particles = [];
      }
    }
    const fallbackColors = generateHarmoniousPalette();
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: []
    });
    collector.isEmitting = false;
    const childCount = options.childCount ?? 5;
    const currentCount = engine.getCount();
    const budget = Math.max(0, engine.maxCount - currentCount);
    let spawned = 0;
    for (const parent of snapshots) {
      for (let i = 0; i < childCount; i++) {
        if (spawned >= budget) break;
        const child = createExplosionChild(parent, options, engine, fallbackColors);
        collector.particles.push(child);
        spawned++;
      }
      if (spawned >= budget) break;
    }
    engine.addEmitter(collector);
  };
  const scatter = (options = {}) => {
    const baseVelocity = options.velocity ?? 10;
    const rotationImpulse = options.rotation ?? 0;
    const allParticles = engine.getAllParticles();
    for (const particle of allParticles) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = baseVelocity * (0.3 + Math.random() * 1.4);
      particle.velocity.x += Math.cos(angle) * magnitude;
      particle.velocity.y += Math.sin(angle) * magnitude;
      if (particle.position.z !== 0 || particle.homePosition && particle.homePosition.z !== 0) {
        particle.velocity.z += (Math.random() - 0.5) * magnitude;
      }
      if (rotationImpulse > 0) {
        particle.rotationVelocity += (Math.random() - 0.5) * 2 * rotationImpulse;
      }
    }
  };
  let wobbleCleanup = null;
  const startWobble = (config) => {
    stopWobble();
    const { track, ...rest } = config ?? {};
    const resolved = { ...defaultWobble, ...rest };
    for (const p of engine.getAllParticles()) {
      p.preventSettle = true;
    }
    const allParticles = engine.getAllParticles();
    let cx = 0, cy = 0, homeCount = 0;
    for (const p of allParticles) {
      if (p.homePosition) {
        cx += p.homePosition.x;
        cy += p.homePosition.y;
        homeCount++;
      }
    }
    if (homeCount > 0) {
      cx /= homeCount;
      cy /= homeCount;
    }
    const center = { x: cx, y: cy };
    let mouseX = center.x;
    let mouseY = center.y;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let hasMouse = false;
    const eventCleanups = [];
    if (track) {
      const pr = mergedConfig.pixelRatio;
      const container = engine.container;
      let cachedRect = null;
      let rectDirty = true;
      const invalidateRect = () => {
        rectDirty = true;
      };
      let wobbleRo = null;
      if (container) {
        wobbleRo = new ResizeObserver(invalidateRect);
        wobbleRo.observe(container);
        window.addEventListener("scroll", invalidateRect, { passive: true });
        container.addEventListener("scroll", invalidateRect, { passive: true });
      }
      const updateMouse = (clientX, clientY) => {
        let x = clientX;
        let y = clientY;
        if (container) {
          if (rectDirty || !cachedRect) {
            const rect = container.getBoundingClientRect();
            cachedRect = { left: rect.left, top: rect.top };
            rectDirty = false;
          }
          x -= cachedRect.left;
          y -= cachedRect.top;
        }
        const newX = x / pr;
        const newY = y / pr;
        if (hasMouse) {
          mouseVelX = newX - mouseX;
          mouseVelY = newY - mouseY;
        }
        mouseX = newX;
        mouseY = newY;
        hasMouse = true;
      };
      const onMouseMove = (e) => updateMouse(e.clientX, e.clientY);
      const onTouchMove = (e) => {
        if (e.touches.length > 0) {
          updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      track.addEventListener("mousemove", onMouseMove);
      track.addEventListener("touchmove", onTouchMove);
      eventCleanups.push(
        () => track.removeEventListener("mousemove", onMouseMove),
        () => track.removeEventListener("touchmove", onTouchMove),
        () => {
          if (wobbleRo) wobbleRo.disconnect();
        },
        () => {
          if (container) {
            window.removeEventListener("scroll", invalidateRect);
            container.removeEventListener("scroll", invalidateRect);
          }
        }
      );
    }
    const wobble = () => {
      const particles = engine.getAllParticles();
      const pr = mergedConfig.pixelRatio;
      const engineRadius = resolved.mouseRadius / pr;
      for (const p of particles) {
        if (track && p.homePosition) {
          const outDx = p.homePosition.x - center.x;
          const outDy = p.homePosition.y - center.y;
          const outAngle = Math.atan2(outDy, outDx);
          const mDx = p.position.x - mouseX;
          const mDy = p.position.y - mouseY;
          const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
          const proximity = Math.max(0, 1 - mDist / engineRadius);
          const angleJitter = (Math.random() - 0.5) * 0.8;
          const pushAngle = outAngle + angleJitter;
          const pushStrength = resolved.velocity * (0.3 + proximity * resolved.mouseStrength) * (0.3 + Math.random() * 1.4);
          p.velocity.x += Math.cos(pushAngle) * pushStrength;
          p.velocity.y += Math.sin(pushAngle) * pushStrength;
          if (proximity > 0.1) {
            p.velocity.x += mouseVelX * proximity * 0.3;
            p.velocity.y += mouseVelY * proximity * 0.3;
          }
          p.rotationVelocity += (Math.random() - 0.5) * resolved.rotation * 2 * (0.3 + proximity * 2);
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 0.3;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 0.3;
        } else {
          p.velocity.x += (Math.random() - 0.5) * resolved.velocity * 2;
          p.velocity.y += (Math.random() - 0.5) * resolved.velocity * 2;
          p.rotationVelocity += (Math.random() - 0.5) * resolved.rotation * 2;
        }
      }
      mouseVelX *= 0.85;
      mouseVelY *= 0.85;
    };
    engine.addEventListener("UPDATE", wobble);
    wobbleCleanup = () => {
      engine.removeEventListener("UPDATE", wobble);
      for (const cleanup of eventCleanups) cleanup();
      for (const p of engine.getAllParticles()) {
        p.preventSettle = false;
      }
    };
  };
  const stopWobble = () => {
    if (wobbleCleanup) {
      wobbleCleanup();
      wobbleCleanup = null;
    }
  };
  return { explode, scatter, startWobble, stopWobble };
}

// src/particular/utils/pixelSampler.ts
function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (src instanceof HTMLCanvasElement) {
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = reject;
      img2.src = src.toDataURL("image/png");
      return;
    }
    if (src instanceof HTMLImageElement) {
      if (src.complete && src.naturalWidth > 0) {
        resolve(src);
      } else {
        src.onload = () => resolve(src);
        src.onerror = reject;
      }
      return;
    }
    const img = new Image();
    try {
      const absolute = new URL(src, window.location.href);
      if (absolute.origin !== window.location.origin && /^https?:$/.test(absolute.protocol)) {
        img.crossOrigin = "anonymous";
      }
    } catch {
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
function sampleImagePixels(source, resolution, alphaThreshold) {
  const srcWidth = source instanceof HTMLCanvasElement ? source.width : source.naturalWidth;
  const srcHeight = source instanceof HTMLCanvasElement ? source.height : source.naturalHeight;
  const aspect = srcWidth / srcHeight;
  let sampleW;
  let sampleH;
  if (aspect >= 1) {
    sampleW = resolution;
    sampleH = Math.max(1, Math.round(resolution / aspect));
  } else {
    sampleH = resolution;
    sampleW = Math.max(1, Math.round(resolution * aspect));
  }
  const canvas = document.createElement("canvas");
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, sampleW, sampleH);
  const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
  const { data } = imageData;
  const samples = [];
  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const i = (y * sampleW + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3] / 255;
      if (a < alphaThreshold) continue;
      const hex = "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
      samples.push({
        nx: (x + 0.5) / sampleW,
        ny: (y + 0.5) / sampleH,
        color: hex,
        alpha: a,
        gridX: x,
        gridY: y
      });
    }
  }
  return samples;
}

// src/particular/utils/imageSource.ts
var defaultGradientStops = [
  { offset: 0, color: "#ff6b6b" },
  { offset: 0.3, color: "#feca57" },
  { offset: 0.5, color: "#48dbfb" },
  { offset: 0.7, color: "#ff9ff3" },
  { offset: 1, color: "#54a0ff" }
];
function createTextImage(config) {
  const {
    text,
    fontSize = 200,
    fontFamily = "system-ui, -apple-system, sans-serif",
    fontWeight = "bold",
    fill
  } = config;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const paddingY = Math.max(8, Math.round(fontSize * 0.18));
  const textWidth = Math.ceil(metrics.width);
  const ascent = metrics.actualBoundingBoxAscent ?? metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent ?? metrics.fontBoundingBoxDescent ?? fontSize * 0.24;
  const glyphHeight = Math.ceil(ascent + descent);
  canvas.width = textWidth;
  canvas.height = glyphHeight + paddingY * 2;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  if (typeof fill === "string") {
    ctx.fillStyle = fill;
  } else {
    const stops = fill ?? defaultGradientStops;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    for (const stop of stops) {
      gradient.addColorStop(stop.offset, stop.color);
    }
    ctx.fillStyle = gradient;
  }
  ctx.fillText(text, 0, paddingY + ascent);
  return canvas;
}
function createHeartImage(size = 400) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const heartPath = () => {
    const steps = 200;
    const cx = size * 0.5;
    const cy = size * 0.48;
    const scale = size * 0.27;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const px = cx + hx * scale / 16;
      const py = cy + hy * scale / 16;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };
  const bodyGrad = ctx.createRadialGradient(
    size * 0.42,
    size * 0.36,
    size * 0.03,
    size * 0.5,
    size * 0.5,
    size * 0.42
  );
  bodyGrad.addColorStop(0, "#ff7e95");
  bodyGrad.addColorStop(0.2, "#ff4d6d");
  bodyGrad.addColorStop(0.45, "#e63356");
  bodyGrad.addColorStop(0.7, "#c41e3a");
  bodyGrad.addColorStop(0.9, "#9b1230");
  bodyGrad.addColorStop(1, "#6e0a22");
  heartPath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.save();
  heartPath();
  ctx.clip();
  const bottomDark = ctx.createLinearGradient(0, size * 0.5, 0, size * 0.85);
  bottomDark.addColorStop(0, "rgba(60, 5, 15, 0)");
  bottomDark.addColorStop(0.6, "rgba(60, 5, 15, 0.2)");
  bottomDark.addColorStop(1, "rgba(40, 0, 10, 0.45)");
  ctx.fillStyle = bottomDark;
  ctx.fillRect(0, 0, size, size);
  const rimGrad = ctx.createLinearGradient(0, size * 0.12, 0, size * 0.42);
  rimGrad.addColorStop(0, "rgba(255, 180, 190, 0.35)");
  rimGrad.addColorStop(0.5, "rgba(255, 120, 140, 0.1)");
  rimGrad.addColorStop(1, "rgba(255, 80, 100, 0)");
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 0, size, size);
  const hl1 = ctx.createRadialGradient(
    size * 0.34,
    size * 0.32,
    size * 0.01,
    size * 0.37,
    size * 0.36,
    size * 0.16
  );
  hl1.addColorStop(0, "rgba(255, 255, 255, 0.75)");
  hl1.addColorStop(0.25, "rgba(255, 220, 225, 0.45)");
  hl1.addColorStop(0.6, "rgba(255, 160, 175, 0.12)");
  hl1.addColorStop(1, "rgba(255, 100, 120, 0)");
  ctx.fillStyle = hl1;
  ctx.fillRect(0, 0, size, size);
  const hl2 = ctx.createRadialGradient(
    size * 0.61,
    size * 0.31,
    size * 5e-3,
    size * 0.62,
    size * 0.33,
    size * 0.09
  );
  hl2.addColorStop(0, "rgba(255, 255, 255, 0.55)");
  hl2.addColorStop(0.35, "rgba(255, 210, 215, 0.2)");
  hl2.addColorStop(1, "rgba(255, 150, 160, 0)");
  ctx.fillStyle = hl2;
  ctx.fillRect(0, 0, size, size);
  const centerGlow = ctx.createRadialGradient(
    size * 0.48,
    size * 0.42,
    size * 0.01,
    size * 0.48,
    size * 0.44,
    size * 0.2
  );
  centerGlow.addColorStop(0, "rgba(255, 130, 150, 0.2)");
  centerGlow.addColorStop(1, "rgba(255, 80, 100, 0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();
  return canvas;
}
function canvasToDataURL(canvas) {
  return canvas.toDataURL("image/png");
}

// src/particular/utils/elementCapture.ts
function parseLinearGradient(value) {
  const match = value.match(/linear-gradient\((.+)\)/);
  if (!match) return null;
  const inner = match[1];
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of inner) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current.trim());
  if (parts.length < 2) return null;
  let angle = 180;
  let startIndex = 0;
  const first = parts[0];
  const degMatch = first.match(/^([\d.]+)deg$/);
  if (degMatch) {
    angle = parseFloat(degMatch[1]);
    startIndex = 1;
  } else if (first.startsWith("to ")) {
    const dir = first.replace("to ", "");
    const dirMap = {
      top: 0,
      right: 90,
      bottom: 180,
      left: 270,
      "top right": 45,
      "right top": 45,
      "bottom right": 135,
      "right bottom": 135,
      "bottom left": 225,
      "left bottom": 225,
      "top left": 315,
      "left top": 315
    };
    angle = dirMap[dir] ?? 180;
    startIndex = 1;
  }
  const stops = [];
  const colorParts = parts.slice(startIndex);
  for (let i = 0; i < colorParts.length; i++) {
    const part = colorParts[i];
    const pctMatch = part.match(/^(.+?)\s+([\d.]+)%\s*$/);
    if (pctMatch) {
      stops.push({ offset: parseFloat(pctMatch[2]) / 100, color: pctMatch[1] });
    } else {
      stops.push({ offset: i / (colorParts.length - 1), color: part });
    }
  }
  return { angle, stops };
}
function applyGradient(ctx, grad, x, y, w, h) {
  const rad = (grad.angle - 90) * (Math.PI / 180);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const len = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
  const dx = Math.cos(rad) * len / 2;
  const dy = Math.sin(rad) * len / 2;
  const canvasGrad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  for (const stop of grad.stops) {
    canvasGrad.addColorStop(stop.offset, stop.color);
  }
  ctx.fillStyle = canvasGrad;
}
function roundedRectPath(ctx, x, y, w, h, radii) {
  const [tl, tr, br, bl] = radii;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  if (tr) ctx.arcTo(x + w, y, x + w, y + tr, tr);
  else ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - br);
  if (br) ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  else ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + bl, y + h);
  if (bl) ctx.arcTo(x, y + h, x, y + h - bl, bl);
  else ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + tl);
  if (tl) ctx.arcTo(x, y, x + tl, y, tl);
  else ctx.lineTo(x, y);
  ctx.closePath();
}
function parseBorderRadii(style, w, h) {
  const parse = (v) => {
    if (v.endsWith("%")) return Math.min(w, h) * parseFloat(v) / 100;
    return parseFloat(v) || 0;
  };
  return [
    parse(style.borderTopLeftRadius),
    parse(style.borderTopRightRadius),
    parse(style.borderBottomRightRadius),
    parse(style.borderBottomLeftRadius)
  ];
}
function isTransparent(color) {
  if (color === "transparent" || color === "rgba(0, 0, 0, 0)") return true;
  const m = color.match(/rgba?\(.+?,\s*([\d.]+)\s*\)$/);
  if (m && parseFloat(m[1]) === 0) return true;
  return false;
}
function renderNode(ctx, node, rootLeft, rootTop) {
  const rect = node.getBoundingClientRect();
  const style = window.getComputedStyle(node);
  if (style.display === "none" || style.visibility === "hidden") return;
  const x = rect.left - rootLeft;
  const y = rect.top - rootTop;
  const w = rect.width;
  const h = rect.height;
  if (w <= 0 || h <= 0) return;
  const opacity = parseFloat(style.opacity) || 1;
  if (opacity < 0.01) return;
  ctx.save();
  if (opacity < 1) ctx.globalAlpha *= opacity;
  const radii = parseBorderRadii(style, w, h);
  const hasRadius = radii.some((r) => r > 0);
  if (hasRadius) {
    roundedRectPath(ctx, x, y, w, h, radii);
    ctx.save();
    ctx.clip();
  }
  const boxShadow = style.boxShadow;
  if (boxShadow && boxShadow !== "none") {
    const sm = boxShadow.match(/(rgba?\([^)]+\)|#\w+|[a-z]+)\s+([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px/);
    if (sm) {
      ctx.save();
      ctx.shadowColor = sm[1];
      ctx.shadowOffsetX = parseFloat(sm[2]);
      ctx.shadowOffsetY = parseFloat(sm[3]);
      ctx.shadowBlur = parseFloat(sm[4]);
      roundedRectPath(ctx, x, y, w, h, radii);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();
      ctx.restore();
    }
  }
  const bgColor = style.backgroundColor;
  const bgImage = style.backgroundImage;
  const bgClipVal = style.webkitBackgroundClip || style["background-clip"];
  const isBgClipText = bgClipVal === "text";
  if (bgImage && bgImage !== "none" && !isBgClipText) {
    const grad = parseLinearGradient(bgImage);
    if (grad) {
      applyGradient(ctx, grad, x, y, w, h);
      ctx.fillRect(x, y, w, h);
    }
  }
  if (bgColor && !isTransparent(bgColor)) {
    if (!bgImage || bgImage === "none" || isBgClipText) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, w, h);
    } else {
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }
  }
  const drawBorderSide = (width, color, bStyle, fx, fy, fw, fh) => {
    const bw = parseFloat(width);
    if (bw <= 0 || bStyle === "none" || isTransparent(color)) return;
    ctx.fillStyle = color;
    ctx.fillRect(fx, fy, fw, fh);
  };
  drawBorderSide(
    style.borderTopWidth,
    style.borderTopColor,
    style.borderTopStyle,
    x,
    y,
    w,
    parseFloat(style.borderTopWidth)
  );
  drawBorderSide(
    style.borderBottomWidth,
    style.borderBottomColor,
    style.borderBottomStyle,
    x,
    y + h - parseFloat(style.borderBottomWidth),
    w,
    parseFloat(style.borderBottomWidth)
  );
  drawBorderSide(
    style.borderLeftWidth,
    style.borderLeftColor,
    style.borderLeftStyle,
    x,
    y,
    parseFloat(style.borderLeftWidth),
    h
  );
  drawBorderSide(
    style.borderRightWidth,
    style.borderRightColor,
    style.borderRightStyle,
    x + w - parseFloat(style.borderRightWidth),
    y,
    parseFloat(style.borderRightWidth),
    h
  );
  const textColor = style.color;
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const isGradientText = isBgClipText && bgImage && bgImage !== "none";
  for (const child of node.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE) continue;
    const text = child.textContent;
    if (!text || !text.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(child);
    const lineRects = range.getClientRects();
    ctx.font = font;
    ctx.textBaseline = "top";
    const textLen = child.textContent.length;
    let charIdx = 0;
    for (const lr of lineRects) {
      const tx = lr.left - rootLeft;
      const ty = lr.top - rootTop;
      let lineText = "";
      const charRange = document.createRange();
      while (charIdx < textLen) {
        charRange.setStart(child, charIdx);
        charRange.setEnd(child, Math.min(charIdx + 1, textLen));
        const charRect = charRange.getBoundingClientRect();
        const charMidY = charRect.top + charRect.height / 2;
        if (charMidY >= lr.top - 1 && charMidY <= lr.bottom + 1) {
          lineText += child.textContent[charIdx];
          charIdx++;
        } else {
          break;
        }
      }
      if (!lineText.trim()) continue;
      if (isGradientText) {
        const grad = parseLinearGradient(bgImage);
        if (grad) {
          ctx.save();
          applyGradient(ctx, grad, x, y, w, h);
          ctx.fillText(lineText, tx, ty);
          ctx.restore();
        }
      } else {
        ctx.fillStyle = textColor;
        ctx.fillText(lineText, tx, ty);
      }
    }
  }
  for (const child of node.children) {
    if (child instanceof HTMLElement) {
      renderNode(ctx, child, rootLeft, rootTop);
    }
  }
  if (hasRadius) ctx.restore();
  ctx.restore();
}
function captureElement(element) {
  const rect = element.getBoundingClientRect();
  const width = Math.ceil(rect.width);
  const height = Math.ceil(rect.height);
  if (width === 0 || height === 0) {
    throw new Error("elementToParticles: element has zero dimensions");
  }
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  renderNode(ctx, element, rect.left, rect.top);
  return canvas;
}

// src/particular/convenience/imageParticles.ts
function createImageParticles(engine, mergedConfig, container, cleanups) {
  const imageToParticles = async (config) => {
    const merged = { ...defaultImageParticles, ...config };
    const {
      image: imageSrc,
      resolution: resolutionOverride,
      alphaThreshold = 0.1,
      particleLife = 99999,
      gravity = 0,
      fadeTime = 40,
      particleSize: sizeOverride,
      scaleStep: scaleStepOverride,
      shape,
      blendMode,
      glow,
      glowSize,
      glowColor,
      glowAlpha,
      shadow,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowAlpha,
      trail,
      trailLength,
      trailFade,
      trailShrink,
      imageTint,
      homeConfig,
      intro
    } = merged;
    const resolution = resolutionOverride ?? (shape === "square" ? 400 : 200);
    let image;
    try {
      image = await loadImage(imageSrc);
    } catch (err) {
      console.warn("Particular: imageToParticles failed to load image.", typeof imageSrc === "string" ? imageSrc : "(HTMLImageElement)", err);
      throw err;
    }
    const aspect = image.naturalWidth / image.naturalHeight;
    const viewport = getViewportSize(container);
    const x = config.x ?? viewport.w / 2;
    const y = config.y ?? viewport.h / 2;
    let displayW;
    let displayH;
    if (config.width != null && config.height != null) {
      displayW = config.width;
      displayH = config.height;
    } else if (config.width != null) {
      displayW = config.width;
      displayH = config.width / aspect;
    } else if (config.height != null) {
      displayH = config.height;
      displayW = config.height * aspect;
    } else {
      displayW = Math.min(image.naturalWidth, viewport.w * 0.5);
      displayH = displayW / aspect;
      if (displayH > viewport.h * 0.5) {
        displayH = viewport.h * 0.5;
        displayW = displayH * aspect;
      }
    }
    const pr = mergedConfig.pixelRatio;
    const engineW = displayW / pr;
    const engineH = displayH / pr;
    const centerX = x / pr;
    const centerY = y / pr;
    const originX = centerX - engineW / 2;
    const originY = centerY - engineH / 2;
    const sizeForRes = (res, particleShape) => {
      const cols = aspect >= 1 ? res : Math.max(1, Math.round(res * aspect));
      const sp = engineW / cols;
      const scale = particleShape === "square" ? 0.55 : particleShape === "triangle" ? 0.95 : 0.7;
      return sp * scale;
    };
    const imageCenter = new Vector(centerX, centerY);
    const samples = sampleImagePixels(image, resolution, alphaThreshold);
    const size = sizeOverride != null ? sizeOverride / pr : sizeForRes(resolution, shape ?? "square");
    const scaleStep = scaleStepOverride ?? size;
    if (engine.maxCount < engine.getCount() + samples.length) {
      engine.maxCount = engine.getCount() + samples.length;
    }
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: []
    });
    collector.isEmitting = false;
    const makeParticle = (sample, introScaleStep) => {
      const px = originX + sample.nx * engineW;
      const py = originY + sample.ny * engineH;
      const homePos = new Vector(px, py);
      const particle = Particle.create({
        color: sample.color,
        baseAlpha: sample.alpha,
        point: new Vector(px, py),
        velocity: new Vector(0, 0),
        acceleration: new Vector(0, 0),
        friction: 0,
        size,
        particleLife,
        gravity,
        scaleStep: introScaleStep ?? scaleStep,
        fadeTime,
        shape,
        blendMode,
        glow,
        glowSize,
        glowColor,
        glowAlpha,
        shadow,
        shadowBlur,
        shadowOffsetX,
        shadowOffsetY,
        shadowColor,
        shadowAlpha,
        trail,
        trailLength,
        trailFade,
        trailShrink,
        imageTint,
        homePosition: homePos,
        homeCenter: imageCenter,
        homeConfig
      });
      if (shape === "triangle" && (sample.gridX + sample.gridY) % 2 === 1) {
        particle.rotation = 180;
      }
      particle.init(null, engine);
      return particle;
    };
    if (intro) {
      const mode = intro.mode ?? "scatter";
      const duration = intro.duration ?? 800;
      const introScaleStep = size / 15;
      if (mode === "scatter") {
        const scatterRadius = Math.max(engineW, engineH) * 0.3;
        for (const sample of samples) {
          const particle = makeParticle(sample, introScaleStep);
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * scatterRadius;
          particle.position.x += Math.cos(angle) * dist;
          particle.position.y += Math.sin(angle) * dist;
          particle.velocity.x = (Math.random() - 0.5) * 2;
          particle.velocity.y = (Math.random() - 0.5) * 2;
          particle.factoredSize = 0;
          collector.particles.push(particle);
        }
        engine.addEmitter(collector);
      } else if (mode === "scaleIn") {
        const sorted = [...samples];
        sorted.sort((a, b) => {
          const dA = Math.hypot(a.nx - 0.5, a.ny - 0.5);
          const dB = Math.hypot(b.nx - 0.5, b.ny - 0.5);
          return dB - dA;
        });
        const spread = Math.max(engineW, engineH) * 0.03;
        const numBatches = 30;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const speedVariance = 0.5 + Math.random() * 1;
              const particle = makeParticle(sorted[i], introScaleStep * speedVariance);
              particle.position.x = centerX + (Math.random() - 0.5) * spread;
              particle.position.y = centerY + (Math.random() - 0.5) * spread;
              particle.factoredSize = 0;
              particle.homeConfig.springDamping = 0.75;
              particle.homeConfig.springStrength = 0.08;
              particle.homeConfig.returnNoise = 0;
              const dx = particle.homePosition.x - centerX;
              const dy = particle.homePosition.y - centerY;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const nudge = dist * 0.03 * (0.8 + Math.random() * 0.4);
              particle.velocity.x = dx / dist * nudge;
              particle.velocity.y = dy / dist * nudge;
              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };
          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      } else if (mode === "ripple") {
        const sorted = [...samples];
        sorted.sort((a, b) => {
          const dA = Math.hypot(a.nx - 0.5, a.ny - 0.5);
          const dB = Math.hypot(b.nx - 0.5, b.ny - 0.5);
          return dA - dB;
        });
        const numBatches = 40;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const s = sorted[i];
              const speedVariance = 0.4 + Math.random() * 1.2;
              const particle = makeParticle(s, introScaleStep * speedVariance);
              particle.factoredSize = 0;
              const dx = s.nx - 0.5;
              const dy = s.ny - 0.5;
              const radialAngle = Math.atan2(dy, dx);
              const wobble = (Math.random() - 0.5) * 0.7;
              const pushAngle = radialAngle + wobble;
              const pushMag = 2.5 + Math.random() * 2.5;
              particle.velocity.x = Math.cos(pushAngle) * pushMag;
              particle.velocity.y = Math.sin(pushAngle) * pushMag;
              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };
          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      } else {
        const sorted = [...samples];
        sorted.sort((a, b) => a.nx + Math.random() * 0.05 - (b.nx + Math.random() * 0.05));
        const launchX = centerX;
        const launchY = originY + engineH;
        const numBatches = 40;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              const speedVariance = 0.5 + Math.random() * 1;
              const particle = makeParticle(sorted[i], introScaleStep * speedVariance);
              particle.position.x = launchX;
              particle.position.y = launchY;
              particle.factoredSize = 0;
              particle.homeConfig.springDamping = 0.75;
              particle.homeConfig.springStrength = 0.08;
              particle.homeConfig.returnNoise = 0;
              const dx = particle.homePosition.x - launchX;
              const dy = particle.homePosition.y - launchY;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const aimAngle = Math.atan2(dy, dx);
              const wobble = (Math.random() - 0.5) * 0.3;
              const speed = dist * 0.03 * (0.9 + Math.random() * 0.2);
              particle.velocity.x = Math.cos(aimAngle + wobble) * speed;
              particle.velocity.y = Math.sin(aimAngle + wobble) * speed;
              collector.particles.push(particle);
            }
            if (b === 0) engine.addEmitter(collector);
          };
          if (b === 0) {
            createBatch();
          } else {
            setTimeout(createBatch, b * batchMs);
          }
        }
      }
    } else {
      for (const sample of samples) {
        const particle = makeParticle(sample);
        collector.particles.push(particle);
      }
      engine.addEmitter(collector);
    }
    const autoCenter = config.autoCenter ?? true;
    if (autoCenter) {
      let resizeGen = 0;
      watchResize((scaleX, scaleY) => {
        const gen = ++resizeGen;
        const idx = engine.emitters.indexOf(collector);
        if (idx !== -1) engine.emitters.splice(idx, 1);
        collector.particles.length = 0;
        const scaledConfig = {
          ...config,
          intro: void 0,
          autoCenter: false
        };
        if (config.x != null) scaledConfig.x = config.x * scaleX;
        if (config.y != null) scaledConfig.y = config.y * scaleY;
        if (config.width != null) scaledConfig.width = config.width * scaleX;
        if (config.height != null) scaledConfig.height = config.height * scaleY;
        imageToParticles(scaledConfig).then((newCollector) => {
          if (gen !== resizeGen) {
            const staleIdx = engine.emitters.indexOf(newCollector);
            if (staleIdx !== -1) engine.emitters.splice(staleIdx, 1);
            return;
          }
          collector.particles.push(...newCollector.particles);
          const newIdx = engine.emitters.indexOf(newCollector);
          if (newIdx !== -1) engine.emitters.splice(newIdx, 1);
          engine.addEmitter(collector);
        });
      }, { container, cleanups });
    }
    return collector;
  };
  const textToParticles = async (text, config) => {
    const { textConfig, ...imageConfig } = config ?? {};
    const textCanvas = createTextImage({ text, ...textConfig });
    return imageToParticles({
      ...imageConfig,
      image: canvasToDataURL(textCanvas)
    });
  };
  const readElementRect = (element) => {
    const rect = element.getBoundingClientRect();
    const containerRect = container?.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - (containerRect?.left ?? 0),
      y: rect.top + rect.height / 2 - (containerRect?.top ?? 0),
      width: rect.width,
      height: rect.height
    };
  };
  const elementToParticles = async (element, config) => {
    const merged = { ...defaultElementParticles, ...config };
    const { hideElement, restoreElement, ...imageConfig } = merged;
    let capturedCanvas;
    try {
      capturedCanvas = captureElement(element);
    } catch (err) {
      console.warn("Particular: elementToParticles failed to capture element.", element, err);
      throw err;
    }
    const dataURL = canvasToDataURL(capturedCanvas);
    const elemRect = readElementRect(element);
    const x = imageConfig.x ?? elemRect.x;
    const y = imageConfig.y ?? elemRect.y;
    const width = imageConfig.width ?? elemRect.width;
    const height = imageConfig.height ?? elemRect.height;
    const emitter = await imageToParticles({
      ...imageConfig,
      image: dataURL,
      x,
      y,
      width,
      height,
      autoCenter: false
    });
    if (hideElement) {
      element.style.visibility = "hidden";
    }
    if (restoreElement && hideElement) {
      cleanups?.push(() => {
        element.style.visibility = "";
      });
    }
    if (imageConfig.autoCenter !== false) {
      let lastX = x;
      let lastY = y;
      let lastW = width;
      let lastH = height;
      let elemResizeGen = 0;
      watchResize(() => {
        const gen = ++elemResizeGen;
        const newRect = readElementRect(element);
        const newX = imageConfig.x ?? newRect.x;
        const newY = imageConfig.y ?? newRect.y;
        const newW = imageConfig.width ?? newRect.width;
        const newH = imageConfig.height ?? newRect.height;
        if (Math.abs(newX - lastX) < 1 && Math.abs(newY - lastY) < 1 && Math.abs(newW - lastW) < 1 && Math.abs(newH - lastH) < 1) return;
        lastX = newX;
        lastY = newY;
        lastW = newW;
        lastH = newH;
        const idx = engine.emitters.indexOf(emitter);
        if (idx !== -1) engine.emitters.splice(idx, 1);
        emitter.particles.length = 0;
        imageToParticles({
          ...imageConfig,
          image: dataURL,
          x: newX,
          y: newY,
          width: newW,
          height: newH,
          autoCenter: false,
          intro: void 0
        }).then((newCollector) => {
          if (gen !== elemResizeGen) {
            const staleIdx = engine.emitters.indexOf(newCollector);
            if (staleIdx !== -1) engine.emitters.splice(staleIdx, 1);
            return;
          }
          emitter.particles.push(...newCollector.particles);
          const newIdx = engine.emitters.indexOf(newCollector);
          if (newIdx !== -1) engine.emitters.splice(newIdx, 1);
          engine.addEmitter(emitter);
        });
      }, { container, cleanups, skipSmallChanges: false });
    }
    return emitter;
  };
  const setIdleEffect = (enabled) => {
    for (const particle of engine.getAllParticles()) {
      if (particle.homePosition) {
        particle.idleEnabled = enabled;
      }
    }
  };
  return { imageToParticles, textToParticles, elementToParticles, setIdleEffect };
}

// src/particular/utils/imageChunker.ts
function buildJitteredGrid(w, h, cols, rows, jitter) {
  const cellW = w / cols;
  const cellH = h / rows;
  const grid = [];
  for (let j = 0; j <= rows; j++) {
    const row = [];
    for (let i = 0; i <= cols; i++) {
      let x = i * cellW;
      let y = j * cellH;
      if (i > 0 && i < cols && j > 0 && j < rows) {
        x += (Math.random() - 0.5) * cellW * jitter;
        y += (Math.random() - 0.5) * cellH * jitter;
      }
      row.push({ x, y });
    }
    grid.push(row);
  }
  return grid;
}
function clipPolygon(source, points, expand = 1) {
  let clipPoints = points;
  if (expand > 0) {
    const pcx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const pcy = points.reduce((s, p) => s + p.y, 0) / points.length;
    clipPoints = points.map((p) => {
      const dx = p.x - pcx;
      const dy = p.y - pcy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: p.x + dx / d * expand, y: p.y + dy / d * expand };
    });
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const margin = Math.ceil(expand) + 1;
  minX -= margin;
  minY -= margin;
  maxX += margin;
  maxY += margin;
  const bw = Math.ceil(maxX - minX);
  const bh = Math.ceil(maxY - minY);
  const side = Math.max(bw, bh);
  const padX = (side - bw) / 2;
  const padY = (side - bh) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = side;
  canvas.height = side;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(clipPoints[0].x - minX + padX, clipPoints[0].y - minY + padY);
  for (let i = 1; i < clipPoints.length; i++) {
    ctx.lineTo(clipPoints[i].x - minX + padX, clipPoints[i].y - minY + padY);
  }
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(source, -minX + padX, -minY + padY);
  return canvas;
}
async function generateImageChunks(source, chunkCount, jitter = 0.35) {
  const w = source.width;
  const h = source.height;
  const aspect = w / h;
  const cols = Math.max(2, Math.round(Math.sqrt(chunkCount * aspect)));
  const rows = Math.max(2, Math.round(chunkCount / cols));
  const grid = buildJitteredGrid(w, h, cols, rows, jitter);
  const chunks = [];
  const imagePromises = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const tl = grid[j][i];
      const tr = grid[j][i + 1];
      const br = grid[j + 1][i + 1];
      const bl = grid[j + 1][i];
      const points = [tl, tr, br, bl];
      const pMinX = Math.min(tl.x, tr.x, br.x, bl.x);
      const pMaxX = Math.max(tl.x, tr.x, br.x, bl.x);
      const pMinY = Math.min(tl.y, tr.y, br.y, bl.y);
      const pMaxY = Math.max(tl.y, tr.y, br.y, bl.y);
      const cx = (pMinX + pMaxX) / 2;
      const cy = (pMinY + pMaxY) / 2;
      const chunkCanvas = clipPolygon(source, points);
      const chunk = {
        image: null,
        cx: cx / w,
        cy: cy / h,
        size: chunkCanvas.width
      };
      chunks.push(chunk);
      const p = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          chunk.image = img;
          resolve();
        };
        img.src = chunkCanvas.toDataURL();
      });
      imagePromises.push(p);
    }
  }
  await Promise.all(imagePromises);
  return chunks;
}

// src/particular/convenience/imageShatter.ts
function createImageShatterHelper(engine, mergedConfig, container) {
  const shatterImage = async (config) => {
    const resolved = { ...defaultImageShatter, ...config };
    const {
      image: imageSrc,
      chunkCount,
      jitter,
      velocity,
      velocitySpread,
      gravity,
      rotationSpeed,
      particleLife,
      fadeTime,
      friction,
      scaleStep,
      homeConfig
    } = resolved;
    const interactive = !!homeConfig;
    let image;
    try {
      image = await loadImage(imageSrc);
    } catch (err) {
      console.warn("Particular: shatterImage failed to load image.", typeof imageSrc === "string" ? imageSrc : "(HTMLImageElement)", err);
      throw err;
    }
    const aspect = image.naturalWidth / image.naturalHeight;
    const viewport = getViewportSize(container);
    const x = config.x ?? viewport.w / 2;
    const y = config.y ?? viewport.h / 2;
    let displayW;
    let displayH;
    if (config.width != null && config.height != null) {
      displayW = config.width;
      displayH = config.height;
    } else if (config.width != null) {
      displayW = config.width;
      displayH = config.width / aspect;
    } else if (config.height != null) {
      displayH = config.height;
      displayW = config.height * aspect;
    } else {
      displayW = Math.min(image.naturalWidth, viewport.w * 0.5);
      displayH = displayW / aspect;
      if (displayH > viewport.h * 0.5) {
        displayH = viewport.h * 0.5;
        displayW = displayH * aspect;
      }
    }
    const pr = mergedConfig.pixelRatio;
    const engineW = displayW / pr;
    const engineH = displayH / pr;
    const centerX = x / pr;
    const centerY = y / pr;
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = Math.round(displayW);
    sourceCanvas.height = Math.round(displayH);
    const sourceCtx = sourceCanvas.getContext("2d");
    sourceCtx.drawImage(image, 0, 0, sourceCanvas.width, sourceCanvas.height);
    const chunks = await generateImageChunks(sourceCanvas, chunkCount, jitter);
    if (engine.maxCount < engine.getCount() + chunks.length) {
      engine.maxCount = engine.getCount() + chunks.length;
    }
    const collectorConfig = configureParticle({}, mergedConfig);
    const collector = new Emitter({
      point: new Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: []
    });
    collector.isEmitting = false;
    const imageCenter = new Vector(centerX, centerY);
    for (const chunk of chunks) {
      const px = centerX - engineW / 2 + chunk.cx * engineW;
      const py = centerY - engineH / 2 + chunk.cy * engineH;
      const chunkSize = chunk.size / sourceCanvas.width * engineW / 2;
      if (interactive) {
        const homePos = new Vector(px, py);
        const particle = Particle.create({
          point: new Vector(px, py),
          velocity: new Vector(0, 0),
          acceleration: new Vector(0, 0),
          friction,
          size: chunkSize,
          particleLife: Infinity,
          gravity: 0,
          scaleStep: chunkSize,
          // instant full size
          fadeTime: 1,
          colors: [],
          color: "#ffffff",
          shape: "square",
          homePosition: homePos,
          homeCenter: imageCenter,
          homeConfig
        });
        particle.init(chunk.image, engine);
        collector.particles.push(particle);
      } else {
        const dx = px - centerX;
        const dy = py - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const angle = Math.atan2(dy, dx);
        const spreadAngle = angle + (Math.random() - 0.5) * 0.6;
        const speedMul = 1 + (Math.random() - 0.5) * 2 * velocitySpread;
        const distFactor = 0.5 + dist / Math.max(engineW, engineH) * 1.5;
        const speed = velocity * speedMul * distFactor;
        const particle = Particle.create({
          point: new Vector(px, py),
          velocity: new Vector(
            Math.cos(spreadAngle) * speed,
            Math.sin(spreadAngle) * speed
          ),
          acceleration: new Vector(0, 0),
          friction,
          size: chunkSize,
          particleLife,
          gravity,
          scaleStep,
          fadeTime,
          colors: [],
          color: "#ffffff",
          shape: "square"
        });
        particle.rotationVelocity = (Math.random() - 0.5) * 2 * rotationSpeed;
        particle.init(chunk.image, engine);
        collector.particles.push(particle);
      }
    }
    engine.addEmitter(collector);
    return collector;
  };
  const shatterText = async (text, config) => {
    const { textConfig, ...shatterConfig } = config ?? {};
    const textCanvas = createTextImage({ text, ...textConfig });
    return shatterImage({
      ...shatterConfig,
      image: canvasToDataURL(textCanvas)
    });
  };
  return { shatterImage, shatterText };
}

// src/particular/convenience/index.ts
function createParticles({
  canvas: userCanvas,
  preset = "magic",
  config,
  renderer = "webgl",
  autoResize = true,
  autoClick = false,
  clickTarget,
  container,
  mouseForce
} = {}) {
  if (typeof document === "undefined") {
    throw new Error("Particular: createParticles() requires a browser environment (document is not defined). Wrap the call in a useEffect or check for window before calling.");
  }
  if (container) {
    const position = getComputedStyle(container).position;
    if (position === "static") {
      console.warn(
        'Particular: container element has position: static. The canvas will be positioned with position: absolute inside it, which requires a positioned parent (relative, absolute, or fixed). Add "position: relative" to your container.'
      );
    }
  }
  let canvas;
  let canvasAutoCreated = false;
  if (userCanvas) {
    canvas = userCanvas;
  } else {
    canvas = document.createElement("canvas");
    canvasAutoCreated = true;
    const parent = container ?? document.body;
    parent.appendChild(canvas);
  }
  applyCanvasStyles(canvas, container, config?.zIndex);
  const engine = new Particular();
  const basePreset = getPreset(preset);
  const mergedConfig = configureParticular({ ...basePreset, ...config, container });
  engine.initialize(mergedConfig);
  let camera3d = null;
  let renderer3d = null;
  if (renderer === "webgl3d") {
    renderer3d = new WebGL3DRenderer(canvas, {
      maxInstances: mergedConfig.webglMaxInstances,
      camera: config?.camera
    });
    camera3d = renderer3d.camera;
    engine.addRenderer(renderer3d);
  } else if (renderer === "webgl") {
    engine.addRenderer(
      new WebGLRenderer(canvas, {
        maxInstances: mergedConfig.webglMaxInstances
      })
    );
  } else {
    engine.addRenderer(new CanvasRenderer(canvas));
  }
  engine.onResize();
  const cleanups = [];
  if (autoResize) {
    const handleResize = () => {
      engine.onResize();
      if (autoStartEmitter) {
        const pr = mergedConfig.pixelRatio;
        if (renderer3d && renderer3d.referenceWorldScale > 0) {
          autoStartEmitter.configuration.point.x = renderer3d.referenceCenterX;
          autoStartEmitter.configuration.point.y = renderer3d.referenceCenterY;
        } else {
          const newSize = getViewportSize(container);
          autoStartEmitter.configuration.point.x = newSize.w / 2 / pr;
          autoStartEmitter.configuration.point.y = newSize.h / 2 / pr;
        }
      }
    };
    if (container) {
      const ro = new ResizeObserver(handleResize);
      ro.observe(container);
      cleanups.push(() => ro.disconnect());
    } else {
      window.addEventListener("resize", handleResize);
      cleanups.push(() => window.removeEventListener("resize", handleResize));
    }
  }
  const toEngineCoords = (clientX, clientY) => {
    let x = clientX;
    let y = clientY;
    if (container) {
      const rect = container.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
    const pr = mergedConfig.pixelRatio;
    let engineX = x / pr;
    let engineY = y / pr;
    if (renderer3d && renderer3d.referenceWorldScale > 0) {
      const currentCenterX = engine.width / pr * 0.5;
      const currentCenterY = engine.height / pr * 0.5;
      engineX += renderer3d.referenceCenterX - currentCenterX;
      engineY += renderer3d.referenceCenterY - currentCenterY;
    }
    return { x: engineX, y: engineY };
  };
  const burst = (options) => {
    const { x, y, ...overrides } = options;
    const combinedSettings = configureParticle(overrides, mergedConfig);
    let icons = [];
    if (combinedSettings.icons) {
      icons = processImages(combinedSettings.icons);
    }
    const enginePos = toEngineCoords(x, y);
    const emitter = new Emitter({
      point: new Vector(enginePos.x, enginePos.y),
      ...combinedSettings,
      icons
    });
    engine.addEmitter(emitter);
    emitter.isEmitting = true;
    emitter.emit();
    return emitter;
  };
  const attachClickBurst = (target = clickTarget ?? document, overrides) => {
    const onClick = (event) => {
      const mouseEvent = event;
      burst({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        ...overrides ?? {}
      });
    };
    target.addEventListener("click", onClick);
    return () => target.removeEventListener("click", onClick);
  };
  if (autoClick) {
    const cleanupClick = attachClickBurst(clickTarget ?? document);
    cleanups.push(cleanupClick);
  }
  let autoStartEmitter = null;
  if (mergedConfig.autoStart) {
    const size = getViewportSize(container);
    const centerX = size.w / 2 / mergedConfig.pixelRatio;
    const centerY = size.h / 2 / mergedConfig.pixelRatio;
    const particleConfig = configureParticle({}, mergedConfig);
    autoStartEmitter = new Emitter({
      point: new Vector(centerX, centerY),
      ...particleConfig,
      icons: []
    });
    engine.addEmitter(autoStartEmitter);
    autoStartEmitter.isEmitting = true;
    autoStartEmitter.emit();
  }
  const forces = createForces(engine, container, cleanups);
  const boundary = createBoundaryHelper(engine, container, cleanups);
  const containerGlow = createContainerGlowHelper(engine, container, cleanups);
  const mouseTrail = createMouseTrailHelper(engine, container, cleanups);
  const effects = createEffects(engine, mergedConfig);
  const imageApi = createImageParticles(engine, mergedConfig, container, cleanups);
  const imageShatter = createImageShatterHelper(engine, mergedConfig, container);
  if (mouseForce) {
    const mouseConfig = mouseForce === true ? { track: true } : { track: true, ...mouseForce };
    const mf = forces.addMouseForce(mouseConfig);
    if (camera3d && renderer3d) {
      mf.projectToScreen = (px, py, pz) => {
        const cam = camera3d;
        const r3d = renderer3d;
        const w = engine.width;
        const h = engine.height;
        const pr = engine.pixelRatio;
        const logicalW = w / pr;
        const logicalH = h / pr;
        if (logicalW <= 0 || logicalH <= 0) return null;
        const refCX = r3d.referenceCenterX;
        const refCY = r3d.referenceCenterY;
        const ws = r3d.referenceWorldScale;
        if (ws === 0) return null;
        const wx = (px - refCX) * ws;
        const wy = -(py - refCY) * ws;
        const wz = pz * ws;
        const vp = cam.viewProjection;
        const clipW = vp[3] * wx + vp[7] * wy + vp[11] * wz + vp[15];
        if (clipW <= 0) return null;
        const clipX = vp[0] * wx + vp[4] * wy + vp[8] * wz + vp[12];
        const clipY = vp[1] * wx + vp[5] * wy + vp[9] * wz + vp[13];
        return {
          x: (clipX / clipW + 1) * 0.5 * logicalW,
          y: (1 - clipY / clipW) * 0.5 * logicalH
        };
      };
    }
  }
  const setCameraPosition = (x, y, z) => {
    if (!camera3d) return;
    camera3d.position.x = x;
    camera3d.position.y = y;
    camera3d.position.z = z;
  };
  const orbitCamera = (azimuth, elevation, distance) => {
    if (!camera3d) return;
    camera3d.orbit(azimuth, elevation, distance);
  };
  const enableOrbitControls = () => {
    if (!camera3d) return null;
    const cleanup = camera3d.enableOrbitControls(canvas);
    cleanups.push(cleanup);
    return cleanup;
  };
  const enableAutoOrbit = (speed = 0.3) => {
    if (!camera3d) return null;
    let lastTime = performance.now();
    const onUpdate = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1e3;
      lastTime = now;
      const cam = camera3d;
      const azimuth = Math.atan2(
        cam.position.z - cam.target.z,
        cam.position.x - cam.target.x
      );
      const elevation = Math.asin(
        Math.min(1, Math.max(
          -1,
          (cam.position.y - cam.target.y) / cam.getDistance()
        ))
      );
      cam.orbit(azimuth + speed * dt, elevation, cam.getDistance());
    };
    engine.addEventListener("UPDATE", onUpdate);
    const cleanup = () => engine.removeEventListener("UPDATE", onUpdate);
    cleanups.push(cleanup);
    return cleanup;
  };
  const destroy2 = () => {
    for (const cleanup of cleanups) cleanup();
    engine.destroy();
    if (canvasAutoCreated && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
  };
  return {
    engine,
    canvas,
    camera: camera3d,
    burst,
    attachClickBurst,
    ...forces,
    ...boundary,
    ...containerGlow,
    ...mouseTrail,
    ...effects,
    ...imageApi,
    ...imageShatter,
    setCameraPosition,
    orbitCamera,
    enableOrbitControls,
    enableAutoOrbit,
    destroy: destroy2
  };
}

// src/particular/convenience/screensaver.ts
function startScreensaver({
  canvas,
  preset = "snow",
  config,
  renderer = "webgl",
  autoResize = true,
  mouseWind: mouseWindOption,
  container
}) {
  const basePreset = getPreset(preset);
  const mergedConfig = {
    ...basePreset,
    continuous: true,
    ...config,
    autoStart: false
    // screensaver creates its own emitter — don't double-spawn
  };
  const controller = createParticles({
    canvas,
    preset,
    config: mergedConfig,
    renderer,
    autoResize,
    container
  });
  const pixelRatio = controller.engine.pixelRatio;
  const initialSize = getViewportSize(container);
  const spawnWidth = initialSize.w / pixelRatio;
  const emitter = new Emitter({
    point: new Vector(initialSize.w / 2 / pixelRatio, 0),
    ...configureParticle(mergedConfig),
    spawnWidth,
    spawnHeight: defaultParticle.spawnHeight,
    icons: []
  });
  controller.engine.addEmitter(emitter);
  emitter.isEmitting = true;
  emitter.emit();
  const cleanups = [];
  if (mouseWindOption !== false) {
    controller.addMouseForce({
      ...defaultMouseWind,
      track: true,
      ...mouseWindOption
    });
  }
  if (autoResize) {
    watchResize((_sx, _sy, current) => {
      emitter.configuration.spawnWidth = current.w / pixelRatio;
      emitter.configuration.point.x = current.w / 2 / pixelRatio;
    }, { container, debounceMs: 0, cleanups });
  }
  const destroy2 = () => {
    for (const cleanup of cleanups) cleanup();
    controller.destroy();
  };
  return {
    engine: controller.engine,
    controller,
    destroy: destroy2
  };
}

// src/particular/devFPSOverlay.ts
var SMOOTHING_SAMPLES = 20;
var DEFAULT_STYLE = {
  position: "fixed",
  top: "8px",
  right: "8px",
  padding: "6px 10px",
  fontFamily: "ui-monospace, monospace",
  fontSize: "12px",
  lineHeight: "1.4",
  color: "#e0e0e0",
  backgroundColor: "rgba(0,0,0,0.75)",
  borderRadius: "6px",
  pointerEvents: "none",
  zIndex: "2147483647",
  userSelect: "none"
};
function showFPSOverlay(options = {}) {
  const {
    container = document.body,
    getParticleCount,
    smoothing = SMOOTHING_SAMPLES
  } = options;
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, DEFAULT_STYLE);
  container.appendChild(el);
  const samples = [];
  let lastTime = performance.now();
  let rafId = null;
  const tick = () => {
    rafId = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = now - lastTime;
    lastTime = now;
    if (dt > 0) {
      samples.push(dt);
      if (samples.length > smoothing) samples.shift();
    }
    const avgMs = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
    const fps = avgMs > 0 ? Math.round(1e3 / avgMs) : 0;
    const parts = [`FPS: ${fps}`];
    if (getParticleCount) {
      try {
        const count = getParticleCount();
        parts.push(`Particles: ${count}`);
      } catch {
        parts.push("Particles: \u2014");
      }
    }
    el.textContent = parts.join("  \xB7  ");
  };
  rafId = requestAnimationFrame(tick);
  return {
    destroy() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.remove();
    }
  };
}

exports.Attractor = Attractor;
exports.Camera = Camera;
exports.CanvasRenderer = CanvasRenderer;
exports.Emitter = Emitter;
exports.FlockingForce = FlockingForce;
exports.MouseForce = MouseForce;
exports.Particle = Particle;
exports.Particular = Particular;
exports.Vector = Vector;
exports.WebGL3DRenderer = WebGL3DRenderer;
exports.WebGLRenderer = WebGLRenderer;
exports.applyCanvasStyles = applyCanvasStyles;
exports.canvasToDataURL = canvasToDataURL;
exports.colorPalettes = colorPalettes;
exports.configureParticle = configureParticle;
exports.createHeartImage = createHeartImage;
exports.createParticles = createParticles;
exports.createTextImage = createTextImage;
exports.defaultCamera = defaultCamera;
exports.getParticlesBackgroundLayerStyle = getParticlesBackgroundLayerStyle;
exports.getParticlesContainerLayerStyle = getParticlesContainerLayerStyle;
exports.particlesBackgroundLayerStyle = particlesBackgroundLayerStyle;
exports.particlesContainerLayerStyle = particlesContainerLayerStyle;
exports.particlesDefaultZIndex = DEFAULT_Z_INDEX;
exports.presets = presets;
exports.setParticlePoolSize = setParticlePoolSize;
exports.showFPSOverlay = showFPSOverlay;
exports.startScreensaver = startScreensaver;
//# sourceMappingURL=standalone.cjs.map
//# sourceMappingURL=standalone.cjs.map