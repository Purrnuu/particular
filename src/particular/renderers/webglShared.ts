/**
 * Shared WebGL utilities, shader code, and types used by both
 * the 2D WebGLRenderer and the 3D WebGL3DRenderer.
 */

import type Particle from '../components/particle';
import type { BlendMode } from '../types';

// ── Shader compilation ────────────────────────────────────────────────────

export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader));
  }
  return shader;
}

export function linkProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Shader link error: ' + gl.getProgramInfoLog(program));
  }
  return program;
}

// ── Color / shape helpers ─────────────────────────────────────────────────

export function hexToRgba(hex: string): [number, number, number, number] {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return [1, 1, 1, 1];
  return [
    parseInt(match[1]!, 16) / 255,
    parseInt(match[2]!, 16) / 255,
    parseInt(match[3]!, 16) / 255,
    1,
  ];
}

export function shapeToId(shape: Particle['shape']): number {
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

// ── Blend mode ────────────────────────────────────────────────────────────

export function setBlendMode(gl: WebGL2RenderingContext, mode: BlendMode): void {
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

// ── Shared SDF fragment shader code ───────────────────────────────────────

/** SDF shape functions reused by both 2D and 3D fragment shaders. */
export const SDF_SHAPE_FUNCTIONS = `
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

// ── Shared types ──────────────────────────────────────────────────────────

export interface DrawBatch {
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
