import type Particular from '../core/particular';
import type Particle from '../components/particle';
import type { BlendMode } from '../types';

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;
in float a_particle_shape;

uniform vec2 u_resolution;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;
out float v_particle_shape;

void main() {
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);
  vec2 pos = (a_particle_pos + rotated * a_particle_size) / u_resolution * 2.0 - 1.0;
  pos.y = -pos.y;
  gl_Position = vec4(pos, 0.0, 1.0);
  v_color = a_particle_color;
  v_uv = a_position;
  v_particle_size = a_particle_size;
  v_particle_shape = a_particle_shape;
}
`;

const FRAGMENT_SHADER = `#version 300 es
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
  // 4-pointed star: union of two diamond shapes rotated 45 degrees
  float armWidth = 0.15;
  // Axis-aligned diamond (vertical/horizontal arms)
  float d1 = abs(p.x) * 0.7 + abs(p.y) - 1.0;
  float w1 = abs(p.x) - armWidth;
  float arm1 = max(d1, w1);
  float d2 = abs(p.y) * 0.7 + abs(p.x) - 1.0;
  float w2 = abs(p.y) - armWidth;
  float arm2 = max(d2, w2);
  // Diagonal arms (rotated 45 degrees)
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
    return length(p) - 1.0; // circle
  }
  if (shapeId < 1.5) {
    return sdBox(p, vec2(1.0)); // rectangle/square
  }
  if (shapeId < 2.5) {
    return sdEquilateralTriangle(p); // triangle
  }
  if (shapeId < 3.5) {
    return sdStar5(p, 1.0, 0.45); // star
  }
  if (shapeId < 4.5) {
    return sdRoundedBox(p, vec2(0.75), 0.25); // rounded rectangle
  }
  if (shapeId < 5.5) {
    return sdRing(p, 0.75, 0.2); // ring
  }
  return sdSparkle(p); // sparkle
}

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
    float halo = 1.0 - smoothstep(0.0, glowRange, sd);
    // Quadratic tail softens the outer edge so glow fades more naturally.
    halo = halo * halo;
    float glowAlpha = halo * u_glowColor.a;
    alpha = max(alpha, glowAlpha);
    float glowMix = clamp((1.0 - coreAlpha) * glowAlpha, 0.0, 1.0);
    rgb = mix(rgb, u_glowColor.rgb, glowMix);
  }
  outColor = vec4(rgb, particleAlpha * alpha);
}
`;

const IMAGE_VERTEX_SHADER = `#version 300 es
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

const IMAGE_FRAGMENT_SHADER = `#version 300 es
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

function hexToRgba(hex: string): [number, number, number, number] {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return [1, 1, 1, 1];
  return [
    parseInt(match[1]!, 16) / 255,
    parseInt(match[2]!, 16) / 255,
    parseInt(match[3]!, 16) / 255,
    1,
  ];
}

function shapeToId(shape: Particle['shape']): number {
  switch (shape) {
    case 'square':
    case 'rectangle':
      return 1;
    case 'triangle':
      return 2;
    case 'star':
      return 3;
    case 'roundedRectangle':
      return 4;
    case 'ring':
      return 5;
    case 'sparkle':
      return 6;
    default:
      return 0;
  }
}

function setBlendMode(gl: WebGL2RenderingContext, mode: BlendMode): void {
  gl.enable(gl.BLEND);
  switch (mode) {
    case 'additive':
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case 'multiply':
      gl.blendFuncSeparate(gl.DST_COLOR, gl.ZERO, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case 'screen':
      gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    default:
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
  }
}

interface DrawBatch {
  type: 'circle' | 'image';
  blendMode: BlendMode;
  glow?: boolean;
  glowSize?: number;
  glowColor?: string;
  glowAlpha?: number;
  texture?: WebGLTexture;
  image?: HTMLImageElement;
  imageTint?: boolean;
  shadow?: boolean;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowColor?: string;
  shadowAlpha?: number;
  particles: Particle[];
}

export interface WebGLRendererOptions {
  /** Max particles per draw call (default 4096). Increase for fewer draw calls with many particles. */
  maxInstances?: number;
}

export default class WebGLRenderer {
  target: HTMLCanvasElement;
  gl: WebGL2RenderingContext | null = null;
  program: WebGLProgram | null = null;
  imageProgram: WebGLProgram | null = null;
  quadBuffer: WebGLBuffer | null = null;
  circleQuadBuffer: WebGLBuffer | null = null;
  instanceBuffer: WebGLBuffer | null = null;
  particular: Particular | null = null;
  pixelRatio = 2;
  private instanceData: Float32Array;
  private maxInstances: number;
  private instanceStride = 9;
  private resolutionUniform: WebGLUniformLocation | null = null;
  private softnessUniform: WebGLUniformLocation | null = null;
  private glowUniform: WebGLUniformLocation | null = null;
  private glowSizeUniform: WebGLUniformLocation | null = null;
  private glowColorUniform: WebGLUniformLocation | null = null;
  private isShadowUniform: WebGLUniformLocation | null = null;
  private shadowColorUniform: WebGLUniformLocation | null = null;
  private shadowBlurUniform: WebGLUniformLocation | null = null;
  private imageResolutionUniform: WebGLUniformLocation | null = null;
  private imageTintUniform: WebGLUniformLocation | null = null;
  private imageIsShadowUniform: WebGLUniformLocation | null = null;
  private imageShadowColorUniform: WebGLUniformLocation | null = null;
  private imageShadowBlurUniform: WebGLUniformLocation | null = null;
  private textureCache = new Map<HTMLImageElement, WebGLTexture>();

  constructor(target: HTMLCanvasElement, options?: WebGLRendererOptions) {
    this.target = target;
    this.maxInstances = options?.maxInstances ?? 4096;
    this.instanceStride = 9; // x, y, size, rotation, r, g, b, a, shape
    this.instanceData = new Float32Array(this.maxInstances * this.instanceStride);
  }

  init(particular: Particular, pixelRatio: number): void {
    this.particular = particular;
    this.pixelRatio = pixelRatio;

    const gl = this.target.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
    });
    if (!gl) {
      throw new Error('WebGL2 not supported');
    }
    this.gl = gl;

    const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create program');
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Shader link error: ' + gl.getProgramInfoLog(program));
    }
    this.program = program;
    this.resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
    this.softnessUniform = gl.getUniformLocation(program, 'u_softness');
    this.glowUniform = gl.getUniformLocation(program, 'u_glow');
    this.glowSizeUniform = gl.getUniformLocation(program, 'u_glowSize');
    this.glowColorUniform = gl.getUniformLocation(program, 'u_glowColor');
    this.isShadowUniform = gl.getUniformLocation(program, 'u_isShadow');
    this.shadowColorUniform = gl.getUniformLocation(program, 'u_shadowColor');
    this.shadowBlurUniform = gl.getUniformLocation(program, 'u_shadowBlur');

    const imageVs = this.compileShader(gl.VERTEX_SHADER, IMAGE_VERTEX_SHADER);
    const imageFs = this.compileShader(gl.FRAGMENT_SHADER, IMAGE_FRAGMENT_SHADER);
    const imageProgram = gl.createProgram();
    if (!imageProgram) throw new Error('Failed to create image program');
    gl.attachShader(imageProgram, imageVs);
    gl.attachShader(imageProgram, imageFs);
    gl.linkProgram(imageProgram);
    if (!gl.getProgramParameter(imageProgram, gl.LINK_STATUS)) {
      throw new Error('Image shader link error: ' + gl.getProgramInfoLog(imageProgram));
    }
    this.imageProgram = imageProgram;
    this.imageResolutionUniform = gl.getUniformLocation(imageProgram, 'u_resolution');
    this.imageTintUniform = gl.getUniformLocation(imageProgram, 'u_tint');
    this.imageIsShadowUniform = gl.getUniformLocation(imageProgram, 'u_isShadow');
    this.imageShadowColorUniform = gl.getUniformLocation(imageProgram, 'u_shadowColor');
    this.imageShadowBlurUniform = gl.getUniformLocation(imageProgram, 'u_shadowBlur');

    // Quad for image particles: exactly [-1, 1] so UV maps to [0, 1]
    const quadData = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);

    // Larger quad for circles: extends beyond the circle edge so glow has room
    // in all directions (not just corners). Glow reaches dist ~1.5 max, so 2.0 is safe.
    const circleQuadData = new Float32Array([
      -2, -2, 2, -2, -2, 2, -2, 2, 2, -2, 2, 2,
    ]);
    this.circleQuadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleQuadData, gl.STATIC_DRAW);

    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.instanceData.byteLength,
      gl.DYNAMIC_DRAW,
    );

    particular.addEventListener('UPDATE', this.onUpdate);
    particular.addEventListener('UPDATE_AFTER', this.onUpdateAfter);
    particular.addEventListener('RESIZE', this.resize);
  }

  private getOrCreateTexture(image: HTMLImageElement): WebGLTexture | null {
    if (!image.complete || image.naturalWidth === 0) return null;
    let tex = this.textureCache.get(image);
    if (tex) return tex;
    const gl = this.gl!;
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

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl!;
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        'Shader compile error: ' + gl.getShaderInfoLog(shader),
      );
    }
    return shader;
  }

  resize = (args?: { width: number; height: number }): void => {
    if (!args || !this.gl) return;
    const { width, height } = args;
    this.target.width = width;
    this.target.height = height;
    this.gl.viewport(0, 0, width, height);
  };

  onUpdate = (): void => {
    if (!this.gl) return;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  };

  private expandParticlesWithTrails(particles: Particle[]): Particle[] {
    const expanded: Particle[] = [];
    for (const particle of particles) {
      expanded.push(particle);

      if (!particle.trail || particle.trailSegments.length === 0) continue;
      const maxAge = Math.max(1, Math.floor(particle.trailLength));

      for (const segment of particle.trailSegments) {
        const life = 1 - segment.age / maxAge;
        if (life <= 0) continue;

        const sizeScale = particle.trailShrink + life * (1 - particle.trailShrink);
        const alphaScale = life * particle.trailFade;
        const ghost = {
          ...particle,
          position: { x: segment.x, y: segment.y },
          factoredSize: Math.max(0.1, segment.size * sizeScale),
          rotation: segment.rotation,
          alpha: segment.alpha * alphaScale,
          glow: false,
          shadow: false,
          trailSegments: [],
        } as unknown as Particle;
        expanded.push(ghost);
      }
    }
    return expanded;
  }

  private buildBatches(particles: Particle[]): DrawBatch[] {
    const batches: DrawBatch[] = [];
    let current: DrawBatch | null = null;

    for (const p of particles) {
      const img = p.image && p.image instanceof HTMLImageElement ? p.image : null;
      const tex = img ? this.getOrCreateTexture(img) : null;
      const isImage = !!tex;

      const blendMode = p.blendMode;
      const imageTint = !!p.imageTint;
      const sameBatch =
        current &&
        current.type === (isImage ? 'image' : 'circle') &&
        current.blendMode === blendMode &&
        current.shadow === p.shadow &&
        (!p.shadow || (
          current.shadowOffsetX === p.shadowOffsetX &&
          current.shadowOffsetY === p.shadowOffsetY &&
          current.shadowBlur === p.shadowBlur &&
          current.shadowColor === p.shadowColor &&
          current.shadowAlpha === p.shadowAlpha
        )) &&
        (isImage
          ? current.texture === tex && current.imageTint === imageTint
          : current.glow === p.glow &&
            (!p.glow ||
              (current.glowSize === p.glowSize &&
                current.glowColor === p.glowColor &&
                current.glowAlpha === p.glowAlpha)));

      if (!sameBatch) {
        current = {
          type: isImage ? 'image' : 'circle',
          blendMode,
          shadow: p.shadow,
          shadowBlur: p.shadowBlur,
          shadowOffsetX: p.shadowOffsetX,
          shadowOffsetY: p.shadowOffsetY,
          shadowColor: p.shadowColor,
          shadowAlpha: p.shadowAlpha,
          particles: [],
        };
        if (isImage && tex) {
          current.texture = tex;
          current.image = img!;
          current.imageTint = imageTint;
        } else {
          current.glow = p.glow;
          current.glowSize = p.glowSize;
          current.glowColor = p.glowColor;
          current.glowAlpha = p.glowAlpha;
        }
        batches.push(current);
      }
      current!.particles.push(p);
    }
    return batches;
  }

  private fillInstanceData(
    particles: Particle[],
    offsetX = 0,
    offsetY = 0,
    scaleOffsetByAlpha = false,
    directionalFromLightOrigin = false,
  ): void {
    let offset = 0;
    for (const p of particles) {
      const [r, g, b] = hexToRgba(p.color);
      let effectiveOffsetX = offsetX;
      let effectiveOffsetY = offsetY;

      if (directionalFromLightOrigin) {
        const baseDistance = Math.hypot(offsetX, offsetY);
        const lightDx = p.position.x - p.shadowLightOrigin.x;
        const lightDy = p.position.y - p.shadowLightOrigin.y;
        const lightDist = Math.hypot(lightDx, lightDy);
        if (baseDistance > 0 && lightDist > 0.0001) {
          effectiveOffsetX = (lightDx / lightDist) * baseDistance;
          effectiveOffsetY = (lightDy / lightDist) * baseDistance;
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
      this.instanceData[offset++] = (p.rotation * Math.PI) / 180;
      this.instanceData[offset++] = r;
      this.instanceData[offset++] = g;
      this.instanceData[offset++] = b;
      this.instanceData[offset++] = p.alpha;
      this.instanceData[offset++] = shapeToId(p.shape);
    }
  }

  private drawCircleInstances(
    list: Particle[],
    offsetX: number,
    offsetY: number,
    scaleOffsetByAlpha = false,
    directionalFromLightOrigin = false,
  ): void {
    const gl = this.gl!;
    const stride = this.instanceStride;
    const posLoc2 = gl.getAttribLocation(this.program!, 'a_particle_pos');
    const sizeLoc = gl.getAttribLocation(this.program!, 'a_particle_size');
    const rotLoc = gl.getAttribLocation(this.program!, 'a_particle_rotation');
    const colLoc = gl.getAttribLocation(this.program!, 'a_particle_color');
    const shapeLoc = gl.getAttribLocation(this.program!, 'a_particle_shape');

    for (let i = 0; i < list.length; i += this.maxInstances) {
      const chunk = list.slice(i, i + this.maxInstances);
      this.fillInstanceData(
        chunk,
        offsetX,
        offsetY,
        scaleOffsetByAlpha,
        directionalFromLightOrigin,
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, chunk.length * stride));

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

      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, chunk.length);

      gl.vertexAttribDivisor(posLoc2, 0);
      gl.vertexAttribDivisor(sizeLoc, 0);
      gl.vertexAttribDivisor(rotLoc, 0);
      gl.vertexAttribDivisor(colLoc, 0);
      gl.vertexAttribDivisor(shapeLoc, 0);
    }
  }

  private drawCircleBatch(batch: DrawBatch): void {
    const gl = this.gl!;
    const list = batch.particles;

    // Shadow pass — drawn first so it sits behind the particle
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? '#000000');
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.isShadowUniform!, 1);
      gl.uniform4f(this.shadowColorUniform!, sr, sg, sb, sa);
      gl.uniform1f(this.shadowBlurUniform!, Math.min(1.0, (batch.shadowBlur ?? 8) / 20));
      this.drawCircleInstances(list, batch.shadowOffsetX ?? 4, batch.shadowOffsetY ?? 4, true, true);
      gl.uniform1f(this.isShadowUniform!, 0);
    }

    // Main pass
    setBlendMode(gl, batch.blendMode);
    gl.uniform1f(this.softnessUniform!, 0.1);
    gl.uniform1f(this.glowUniform!, batch.glow ? 1 : 0);
    gl.uniform1f(this.glowSizeUniform!, Math.min(0.5, (batch.glowSize ?? 10) / 30));
    const [gr, gg, gb] = hexToRgba(batch.glowColor ?? '#ffffff');
    gl.uniform4f(this.glowColorUniform!, gr, gg, gb, Math.max(0, Math.min(1, batch.glowAlpha ?? 0.35)));
    this.drawCircleInstances(list, 0, 0);
  }

  private drawImageInstances(
    list: Particle[],
    offsetX: number,
    offsetY: number,
    scaleOffsetByAlpha = false,
    directionalFromLightOrigin = false,
  ): void {
    const gl = this.gl!;
    const stride = this.instanceStride;
    const posLoc2 = gl.getAttribLocation(this.imageProgram!, 'a_particle_pos');
    const sizeLoc = gl.getAttribLocation(this.imageProgram!, 'a_particle_size');
    const rotLoc = gl.getAttribLocation(this.imageProgram!, 'a_particle_rotation');
    const colLoc = gl.getAttribLocation(this.imageProgram!, 'a_particle_color');

    for (let i = 0; i < list.length; i += this.maxInstances) {
      const chunk = list.slice(i, i + this.maxInstances);
      this.fillInstanceData(
        chunk,
        offsetX,
        offsetY,
        scaleOffsetByAlpha,
        directionalFromLightOrigin,
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, chunk.length * stride));

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

      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, chunk.length);

      gl.vertexAttribDivisor(posLoc2, 0);
      gl.vertexAttribDivisor(sizeLoc, 0);
      gl.vertexAttribDivisor(rotLoc, 0);
      gl.vertexAttribDivisor(colLoc, 0);
    }
  }

  private drawImageBatch(batch: DrawBatch, logicalW: number, logicalH: number): void {
    const gl = this.gl!;
    const list = batch.particles;
    if (
      !this.imageProgram ||
      !batch.texture ||
      !this.imageResolutionUniform ||
      !this.imageTintUniform ||
      !this.imageShadowBlurUniform
    ) return;

    gl.useProgram(this.imageProgram);
    gl.uniform2f(this.imageResolutionUniform, logicalW, logicalH);
    gl.uniform1f(this.imageTintUniform, batch.imageTint ? 1 : 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, batch.texture);
    const texLoc = gl.getUniformLocation(this.imageProgram, 'u_texture');
    gl.uniform1i(texLoc, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    const posLoc = gl.getAttribLocation(this.imageProgram, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Shadow pass
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? '#000000');
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.imageIsShadowUniform!, 1);
      gl.uniform4f(this.imageShadowColorUniform!, sr, sg, sb, sa);
      gl.uniform1f(this.imageShadowBlurUniform, Math.max(0, batch.shadowBlur ?? 8));
      this.drawImageInstances(list, batch.shadowOffsetX ?? 4, batch.shadowOffsetY ?? 4, true, true);
      gl.uniform1f(this.imageIsShadowUniform!, 0);
    }

    // Main pass
    setBlendMode(gl, batch.blendMode);
    this.drawImageInstances(list, 0, 0);
  }

  onUpdateAfter = (): void => {
    if (!this.gl || !this.particular || !this.program) return;

    const baseParticles = this.particular.getAllParticles();

    // Append visible attractor drawables after particles so they render on top
    const attractorDrawables: Particle[] = [];
    for (const attractor of this.particular.attractors) {
      if (attractor.visible) {
        attractorDrawables.push(attractor.toDrawable());
      }
    }

    const particles = this.expandParticlesWithTrails(baseParticles).concat(attractorDrawables);
    const pixelRatio = this.particular.pixelRatio;
    const w = this.target.width || this.particular.width;
    const h = this.target.height || this.particular.height;
    const logicalW = w / pixelRatio;
    const logicalH = h / pixelRatio;
    if (logicalW <= 0 || logicalH <= 0) return;

    const batches = this.buildBatches(particles);
    if (
      !this.resolutionUniform ||
      !this.softnessUniform ||
      !this.glowUniform ||
      !this.glowSizeUniform ||
      !this.glowColorUniform
    ) return;

    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.resolutionUniform, logicalW, logicalH);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleQuadBuffer);
    const posLoc = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);

    for (const batch of batches) {
      if (batch.type === 'circle') {
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

  destroy(): void {
    this.remove();
  }

  remove(): void {
    if (!this.particular || !this.gl) return;

    this.particular.removeEventListener('UPDATE', this.onUpdate);
    this.particular.removeEventListener('UPDATE_AFTER', this.onUpdateAfter);
    this.particular.removeEventListener('RESIZE', this.resize);

    if (this.quadBuffer) this.gl!.deleteBuffer(this.quadBuffer);
    if (this.circleQuadBuffer) this.gl!.deleteBuffer(this.circleQuadBuffer);
    if (this.instanceBuffer) this.gl!.deleteBuffer(this.instanceBuffer);
    if (this.program) this.gl!.deleteProgram(this.program);
    if (this.imageProgram) this.gl!.deleteProgram(this.imageProgram);
    for (const tex of this.textureCache.values()) {
      this.gl!.deleteTexture(tex);
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
}
