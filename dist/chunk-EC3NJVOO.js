import { getRandomInt } from './chunk-4GKXOSKX.js';

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
  /** Boids flock: bird-like triangles with gentle steering and sustained flight. Use with addFlockingForce(). */
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
    spread: Math.PI / 5,
    colors: sunsetPalette,
    sizeMin: 3,
    sizeMax: 6,
    velocityMultiplier: 0,
    fadeTime: 80,
    gravity: 0,
    acceleration: 0,
    accelerationSize: 0,
    friction: 2e-3,
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
  mode: "wind",
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
  separationWeight: 1.2,
  alignmentWeight: 1.5,
  cohesionWeight: 0.15,
  maxSteeringForce: 0.08,
  boundarySteeringForce: 0.12,
  minSpeed: 1.5,
  containment: true,
  boundsScale: 1,
  boundsDepth: 0,
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
  expandBudget: true,
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
  expandBudget: true,
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
      const snapshot = arr.slice();
      let i = snapshot.length;
      while (i--) {
        const listener = snapshot[i];
        if (!this.listeners?.[type]?.includes(listener)) continue;
        const handled = !!listener(args);
        result = handled || result;
      }
    }
    return result;
  }
  hasEventListener(type) {
    return !!(this.listeners && this.listeners[type]);
  }
};

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
    this.trailSampleRemainder = 0;
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
    this.destroyed = false;
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
    this.destroyed = false;
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
    this.trailSampleRemainder = 0;
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
          this.velocity.z += (f.z ?? 0) * dt;
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
      if (this.velocity.x === 0 && this.velocity.y === 0 && this.velocity.z === 0) {
        if (this.particular && this.particular.hasEventListener("PARTICLE_UPDATE")) {
          this.particular.dispatchEvent("PARTICLE_UPDATE", this);
        }
        return;
      }
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
      if (this.velocity.z !== 0) this.position.z += this.velocity.z * dt;
      this.applyConstraints(forces);
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
        this.velocity.z += (f.z ?? 0) * dt;
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
          const noise = this.homeConfig.returnNoise * Math.sqrt(dt);
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
    const baseSize = Math.min(this.factoredSize + this.scaleStep * dt, this.size);
    if (this.idleEnabled && this.homePosition && this.homeConfig && this.homeConfig.breathingAmplitude > 0) {
      this.breathingPhase += this.homeConfig.breathingSpeed * dt;
      this.factoredSize = baseSize * (1 + Math.sin(this.breathingPhase) * this.homeConfig.breathingAmplitude);
    } else {
      this.factoredSize = baseSize;
    }
    this.applyConstraints(forces);
    if (this.rotateToVelocity) {
      this.rotation = Math.atan2(this.velocity.y, this.velocity.x) * (180 / Math.PI) - 90;
    } else {
      this.rotation += this.rotationVelocity * dt;
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
  applyConstraints(forces) {
    if (!forces) return;
    for (let i = 0; i < forces.length; i++) forces[i].constrain?.(this);
  }
  advanceTrail(dt = 1) {
    this.updateTrail(false, dt);
  }
  updateTrail(addCurrentPoint, dt = 1) {
    if (dt <= 0) return;
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
      if (segment.age < maxAge - 1e-9) {
        this.trailSegments[writeIdx++] = segment;
      } else {
        if (freeSegments.length < _maxFreeSegments) freeSegments.push(segment);
      }
    }
    this.trailSegments.length = writeIdx;
    const previousRemainder = this.trailSampleRemainder;
    const elapsed = previousRemainder + dt;
    const samples = Math.floor(elapsed + 1e-9);
    this.trailSampleRemainder = Math.max(0, elapsed - samples);
    if (!addCurrentPoint) return;
    if (this.alpha <= 0) return;
    for (let i = Math.max(0, samples - maxAge); i < samples; i++) {
      const sampleTime = 1 - previousRemainder + i;
      const offset = sampleTime - 1;
      const seg = freeSegments.pop() ?? {
        x: 0,
        y: 0,
        z: 0,
        size: 0,
        rotation: 0,
        alpha: 0,
        age: 0
      };
      seg.x = this.position.x + this.velocity.x * offset;
      seg.y = this.position.y + this.velocity.y * offset;
      seg.z = this.position.z + this.velocity.z * offset;
      seg.size = this.factoredSize;
      seg.rotation = this.rotation;
      seg.alpha = this.alpha;
      seg.age = Math.max(0, dt - sampleTime);
      this.trailSegments.push(seg);
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
    if (this.destroyed) return;
    this.destroyed = true;
    this.dispatch("PARTICLE_DEAD", this);
    for (let i = 0; i < this.trailSegments.length; i++) {
      if (freeSegments.length < _maxFreeSegments) freeSegments.push(this.trailSegments[i]);
    }
    this.trailSegments.length = 0;
    this.particular = null;
    this.image = null;
    this.homePosition = null;
    this.homeConfig = null;
    this.removeAllEventListeners();
    if (_particlePool.length < _maxPoolSize) {
      _particlePool.push(this);
    }
  }
};
EventDispatcher.bind(Particle);

// src/particular/core/resourceScope.ts
function abortError() {
  const error = new Error("Particular: this instance has been destroyed.");
  error.name = "AbortError";
  return error;
}
var ResourceScope = class {
  constructor() {
    this.cleanups = /* @__PURE__ */ new Set();
    this.controller = new AbortController();
  }
  get signal() {
    return this.controller.signal;
  }
  get disposed() {
    return this.signal.aborted;
  }
  assertActive() {
    if (this.disposed) throw abortError();
  }
  add(cleanup) {
    let active = true;
    const dispose = () => {
      if (!active) return;
      active = false;
      this.cleanups.delete(dispose);
      cleanup();
    };
    if (this.disposed) dispose();
    else this.cleanups.add(dispose);
    return dispose;
  }
  timeout(callback, delay) {
    this.assertActive();
    const timer = setTimeout(() => {
      dispose();
      if (!this.disposed) callback();
    }, delay);
    const dispose = this.add(() => clearTimeout(timer));
    return dispose;
  }
  waitFor(promise) {
    if (this.disposed) {
      void promise.catch(() => {
      });
      return Promise.reject(abortError());
    }
    return new Promise((resolve, reject) => {
      const onAbort = () => reject(abortError());
      this.signal.addEventListener("abort", onAbort, { once: true });
      promise.then(
        (value) => {
          this.signal.removeEventListener("abort", onAbort);
          if (this.disposed) reject(abortError());
          else resolve(value);
        },
        (error) => {
          this.signal.removeEventListener("abort", onAbort);
          reject(error);
        }
      );
    });
  }
  dispose() {
    if (this.disposed) return;
    this.controller.abort();
    let failed = false;
    let firstError;
    for (const cleanup of Array.from(this.cleanups).reverse()) {
      try {
        cleanup();
      } catch (error) {
        if (!failed) firstError = error;
        failed = true;
      }
    }
    this.cleanups.clear();
    if (failed) throw firstError;
  }
};

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
    if (this.particular.isDestroyed) return;
    this.emitAccumulator += this.configuration.rate * dt;
    const requested = Math.floor(this.emitAccumulator + 1e-9);
    this.emitAccumulator = Math.max(0, this.emitAccumulator - requested);
    const budget = Math.max(0, Math.floor(this.particular.maxCount - this.particular.getCount()));
    const count = Math.min(requested, budget);
    for (let j = 0; j < count; j++) {
      if (this.particular.getCount() >= this.particular.maxCount) break;
      const particle = this.createParticle();
      const icons = this.configuration.icons;
      const icon = icons.length > 0 ? icons[Math.floor(Math.random() * icons.length)] : null;
      particle.init(icon, this.particular);
      if (this.particular.isDestroyed) {
        particle.destroy();
        return;
      }
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
        const budget = Math.max(
          0,
          this.particular.maxCount - this.particular.getCount() + (i - writeIdx) + 1 - newChildren.length
        );
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
      const baseElevation = Math.atan2(
        emitDirection.z,
        Math.sqrt(emitDirection.x * emitDirection.x + emitDirection.y * emitDirection.y)
      );
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

export { Emitter, EventDispatcher, Particle, ResourceScope, Vector, abortError, colorPalettes, configureParticle, configureParticular, createExplosionChild, defaultAttractor, defaultContainerGlow, defaultElementParticles, defaultFlockingForce, defaultImageParticles, defaultImageShatter, defaultMouseForce, defaultMouseTrail, defaultMouseWind, defaultParticle, defaultParticular, defaultWobble, destroy, generateHarmoniousPalette, getPreset, presets, setParticlePoolSize };
//# sourceMappingURL=chunk-EC3NJVOO.js.map
//# sourceMappingURL=chunk-EC3NJVOO.js.map