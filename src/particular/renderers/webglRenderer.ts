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
uniform float u_glowSize;

out vec4 outColor;

void main() {
  float dist = length(v_uv);
  float coreAlpha = 1.0 - smoothstep(1.0 - u_softness, 1.0, dist);
  float alpha = coreAlpha;
  if (u_glow > 0.0) {
    float halo = 1.0 - smoothstep(1.0, 1.0 + u_glowSize, dist);
    alpha = max(alpha, halo * 0.8);
  }
  outColor = vec4(v_color.rgb, v_color.a * alpha);
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

void main() {
  float c = cos(a_particle_rotation);
  float s = sin(a_particle_rotation);
  vec2 rotated = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);
  vec2 pos = (a_particle_pos + rotated * a_particle_size) / u_resolution * 2.0 - 1.0;
  pos.y = -pos.y;
  gl_Position = vec4(pos, 0.0, 1.0);
  v_color = a_particle_color;
  v_uv = a_position * 0.5 + 0.5;
}
`;

const IMAGE_FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;

uniform sampler2D u_texture;
uniform float u_tint;

out vec4 outColor;

void main() {
  vec4 tex = texture(u_texture, v_uv);
  vec3 rgb = mix(tex.rgb, tex.rgb * v_color.rgb, u_tint);
  outColor = vec4(rgb, tex.a * v_color.a);
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

interface DrawBatch {
  type: 'circle' | 'image';
  blendMode: BlendMode;
  glow?: boolean;
  glowSize?: number;
  texture?: WebGLTexture;
  image?: HTMLImageElement;
  imageTint?: boolean;
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
  instanceBuffer: WebGLBuffer | null = null;
  particular: Particular | null = null;
  pixelRatio = 2;
  private instanceData: Float32Array;
  private maxInstances: number;
  private instanceStride = 8;
  private resolutionUniform: WebGLUniformLocation | null = null;
  private softnessUniform: WebGLUniformLocation | null = null;
  private glowUniform: WebGLUniformLocation | null = null;
  private glowSizeUniform: WebGLUniformLocation | null = null;
  private imageResolutionUniform: WebGLUniformLocation | null = null;
  private imageTintUniform: WebGLUniformLocation | null = null;
  private textureCache = new Map<HTMLImageElement, WebGLTexture>();

  constructor(target: HTMLCanvasElement, options?: WebGLRendererOptions) {
    this.target = target;
    this.maxInstances = options?.maxInstances ?? 4096;
    this.instanceStride = 8; // x, y, size, rotation, r, g, b, a
    this.instanceData = new Float32Array(this.maxInstances * this.instanceStride);
  }

  init(particular: Particular, pixelRatio: number): void {
    this.particular = particular;
    this.pixelRatio = pixelRatio;

    const gl = this.target.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
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
        (isImage
          ? current.texture === tex && current.imageTint === imageTint
          : current.glow === p.glow && (!p.glow || current.glowSize === p.glowSize));

      if (!sameBatch) {
        current = {
          type: isImage ? 'image' : 'circle',
          blendMode,
          particles: [],
        };
        if (isImage && tex) {
          current.texture = tex;
          current.image = img!;
          current.imageTint = imageTint;
        } else {
          current.glow = p.glow;
          current.glowSize = p.glowSize;
        }
        batches.push(current);
      }
      current!.particles.push(p);
    }
    return batches;
  }

  private fillInstanceData(particles: Particle[]): void {
    let offset = 0;
    for (const p of particles) {
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
  }

  private drawCircleBatch(batch: DrawBatch): void {
    const gl = this.gl!;
    const list = batch.particles;
    setBlendMode(gl, batch.blendMode);
    gl.uniform1f(this.softnessUniform!, 0.1);
    gl.uniform1f(this.glowUniform!, batch.glow ? 1 : 0);
    gl.uniform1f(this.glowSizeUniform!, Math.min(0.5, (batch.glowSize ?? 10) / 30));

    const stride = this.instanceStride;
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const chunk = list.slice(i, i + this.maxInstances);
      this.fillInstanceData(chunk);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, chunk.length * stride));

    const posLoc2 = gl.getAttribLocation(this.program!, 'a_particle_pos');
    gl.enableVertexAttribArray(posLoc2);
    gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, stride * 4, 0);
    gl.vertexAttribDivisor(posLoc2, 1);

    const sizeLoc = gl.getAttribLocation(this.program!, 'a_particle_size');
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride * 4, 8);
    gl.vertexAttribDivisor(sizeLoc, 1);

    const rotLoc = gl.getAttribLocation(this.program!, 'a_particle_rotation');
    gl.enableVertexAttribArray(rotLoc);
    gl.vertexAttribPointer(rotLoc, 1, gl.FLOAT, false, stride * 4, 12);
    gl.vertexAttribDivisor(rotLoc, 1);

    const colLoc = gl.getAttribLocation(this.program!, 'a_particle_color');
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
    if (!this.imageProgram || !batch.texture || !this.imageResolutionUniform || !this.imageTintUniform) return;

    setBlendMode(gl, batch.blendMode);
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

    const stride = this.instanceStride;
    for (let i = 0; i < list.length; i += this.maxInstances) {
      const chunk = list.slice(i, i + this.maxInstances);
      this.fillInstanceData(chunk);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData.subarray(0, chunk.length * stride));

      const posLoc2 = gl.getAttribLocation(this.imageProgram, 'a_particle_pos');
      gl.enableVertexAttribArray(posLoc2);
      gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, stride * 4, 0);
      gl.vertexAttribDivisor(posLoc2, 1);

      const sizeLoc = gl.getAttribLocation(this.imageProgram, 'a_particle_size');
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride * 4, 8);
      gl.vertexAttribDivisor(sizeLoc, 1);

      const rotLoc = gl.getAttribLocation(this.imageProgram, 'a_particle_rotation');
      gl.enableVertexAttribArray(rotLoc);
      gl.vertexAttribPointer(rotLoc, 1, gl.FLOAT, false, stride * 4, 12);
      gl.vertexAttribDivisor(rotLoc, 1);

      const colLoc = gl.getAttribLocation(this.imageProgram, 'a_particle_color');
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

  onUpdateAfter = (): void => {
    if (!this.gl || !this.particular || !this.program) return;

    const particles = this.particular.getAllParticles();
    const pixelRatio = this.particular.pixelRatio;
    const w = this.target.width || this.particular.width;
    const h = this.target.height || this.particular.height;
    const logicalW = w / pixelRatio;
    const logicalH = h / pixelRatio;
    if (logicalW <= 0 || logicalH <= 0) return;

    const batches = this.buildBatches(particles);
    if (!this.resolutionUniform || !this.softnessUniform || !this.glowUniform || !this.glowSizeUniform) return;

    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.resolutionUniform, logicalW, logicalH);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    const posLoc = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);

    for (const batch of batches) {
      if (batch.type === 'circle') {
        this.drawCircleBatch(batch);
      } else {
        this.drawImageBatch(batch, logicalW, logicalH);
        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
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
    this.instanceBuffer = null;
  }
}
