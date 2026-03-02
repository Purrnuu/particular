import type Particular from '../core/particular';
import type Particle from '../components/particle';
import type { BlendMode } from '../types';

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;

uniform vec2 u_resolution;

out vec4 v_color;
out vec2 v_uv;

void main() {
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);
  vec2 pos = (a_particle_pos + rotated * a_particle_size) / u_resolution * 2.0 - 1.0;
  pos.y = -pos.y;
  gl_Position = vec4(pos, 0.0, 1.0);
  v_color = a_particle_color;
  v_uv = a_position;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;

uniform float u_softness;
uniform float u_glow;

out vec4 outColor;

void main() {
  float dist = length(v_uv);
  float alpha = 1.0 - smoothstep(1.0 - u_softness, 1.0, dist);
  if (u_glow > 0.0) {
    alpha *= 1.0 - smoothstep(0.5, 1.0, dist) * 0.5;
  }
  outColor = vec4(v_color.rgb, v_color.a * alpha);
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

function setBlendMode(gl: WebGL2RenderingContext, mode: BlendMode): void {
  gl.enable(gl.BLEND);
  switch (mode) {
    case 'additive':
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case 'multiply':
      gl.blendFunc(gl.DST_COLOR, gl.ZERO);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    case 'screen':
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
      gl.blendEquation(gl.FUNC_ADD);
      break;
    default:
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
  }
}

export default class WebGLRenderer {
  target: HTMLCanvasElement;
  gl: WebGL2RenderingContext | null = null;
  program: WebGLProgram | null = null;
  quadBuffer: WebGLBuffer | null = null;
  instanceBuffer: WebGLBuffer | null = null;
  particular: Particular | null = null;
  pixelRatio = 2;
  private instanceData: Float32Array;
  private maxInstances = 4096;
  private instanceStride = 9; // pos(2) + size(1) + rotation(1) + color(4) + alpha(1) = 9? Actually color is 4, so pos(2)+size(1)+rot(1)+color(4) = 8. Alpha is in color. So 8.
  private resolutionUniform: WebGLUniformLocation | null = null;
  private softnessUniform: WebGLUniformLocation | null = null;
  private glowUniform: WebGLUniformLocation | null = null;

  constructor(target: HTMLCanvasElement) {
    this.target = target;
    this.instanceStride = 8; // x, y, size, rotation, r, g, b, a
    this.instanceData = new Float32Array(this.maxInstances * this.instanceStride);
  }

  init(particular: Particular, pixelRatio: number): void {
    this.particular = particular;
    this.pixelRatio = pixelRatio;

    const gl = this.target.getContext('webgl2');
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

    // Quad vertices (NDC-style -1 to 1)
    const quadData = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);

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

  onUpdateAfter = (): void => {
    if (!this.gl || !this.particular || !this.program) return;

    const particles = this.particular.getAllParticles();
    const pixelRatio = this.particular.pixelRatio;
    // Use canvas buffer size (fallback to engine size if canvas not yet resized)
    const w = this.target.width || this.particular.width;
    const h = this.target.height || this.particular.height;
    const logicalW = w / pixelRatio;
    const logicalH = h / pixelRatio;
    if (logicalW <= 0 || logicalH <= 0) return;

    // Group by (blendMode, glow) for efficient batching
    const groups = new Map<string, Particle[]>();
    for (const p of particles) {
      if (p.image) continue; // Skip image particles in WebGL v1
      const key = `${p.blendMode}:${p.glow ? 1 : 0}`;
      let list = groups.get(key);
      if (!list) {
        list = [];
        groups.set(key, list);
      }
      list.push(p);
    }

    if (!this.resolutionUniform || !this.softnessUniform || !this.glowUniform) return;

    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.resolutionUniform, logicalW, logicalH);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    const posLoc = this.gl.getAttribLocation(this.program!, 'a_position');
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);

    for (const [key, list] of groups) {
      const [blendMode, glow] = key.split(':');
      setBlendMode(this.gl, blendMode as BlendMode);

      // Use creation order (no sorting)—stable layering so particles don't jump
      // when moving or scaling; first-created = bottom, last-created = top
      const drawList = list;
      this.gl.uniform1f(this.softnessUniform, 0.1);
      this.gl.uniform1f(this.glowUniform, glow === '1' ? 1 : 0);

      let offset = 0;
      const stride = this.instanceStride;
      for (const p of drawList) {
        const [r, g, b] = hexToRgba(p.color);
        this.instanceData[offset++] = p.position.x;
        this.instanceData[offset++] = p.position.y;
        this.instanceData[offset++] = p.factoredSize;
        this.instanceData[offset++] = (p.rotation * Math.PI) / 180;
        this.instanceData[offset++] = r;
        this.instanceData[offset++] = g;
        this.instanceData[offset++] = b;
        this.instanceData[offset++] = p.alpha;
      }

      const count = drawList.length;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceBuffer);
      this.gl.bufferSubData(
        this.gl.ARRAY_BUFFER,
        0,
        this.instanceData.subarray(0, count * stride),
      );

      const posLoc2 = this.gl.getAttribLocation(this.program!, 'a_particle_pos');
      this.gl.enableVertexAttribArray(posLoc2);
      this.gl.vertexAttribPointer(posLoc2, 2, this.gl.FLOAT, false, stride * 4, 0);
      this.gl.vertexAttribDivisor(posLoc2, 1);

      const sizeLoc = this.gl.getAttribLocation(this.program!, 'a_particle_size');
      this.gl.enableVertexAttribArray(sizeLoc);
      this.gl.vertexAttribPointer(sizeLoc, 1, this.gl.FLOAT, false, stride * 4, 8);
      this.gl.vertexAttribDivisor(sizeLoc, 1);

      const rotLoc = this.gl.getAttribLocation(this.program!, 'a_particle_rotation');
      this.gl.enableVertexAttribArray(rotLoc);
      this.gl.vertexAttribPointer(rotLoc, 1, this.gl.FLOAT, false, stride * 4, 12);
      this.gl.vertexAttribDivisor(rotLoc, 1);

      const colLoc = this.gl.getAttribLocation(this.program!, 'a_particle_color');
      this.gl.enableVertexAttribArray(colLoc);
      this.gl.vertexAttribPointer(colLoc, 4, this.gl.FLOAT, false, stride * 4, 16);
      this.gl.vertexAttribDivisor(colLoc, 1);

      this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, count);

      this.gl.vertexAttribDivisor(posLoc2, 0);
      this.gl.vertexAttribDivisor(sizeLoc, 0);
      this.gl.vertexAttribDivisor(rotLoc, 0);
      this.gl.vertexAttribDivisor(colLoc, 0);
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
    if (this.instanceBuffer) this.gl!.deleteBuffer(this.instanceBuffer);
    if (this.program) this.gl!.deleteProgram(this.program);

    this.particular = null;
    this.gl = null;
    this.program = null;
    this.quadBuffer = null;
    this.instanceBuffer = null;
  }
}
