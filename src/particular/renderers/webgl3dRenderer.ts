/**
 * WebGL2 3D particle renderer with perspective projection.
 *
 * Particles are rendered as camera-facing billboarded quads using SDF shapes.
 * All existing 2D shapes (circle, star, sparkle, etc.) work without modification.
 * Non-additive batches are sorted back-to-front for correct transparency.
 */

import type Particular from '../core/particular';
import type Particle from '../components/particle';
import { Camera, type CameraConfig } from './camera';
import {
  compileShader,
  linkProgram,
  hexToRgba,
  shapeToId,
  setBlendMode,
  SDF_SHAPE_FUNCTIONS,
  type DrawBatch,
} from './webglShared';

// ── 3D Vertex Shader ──────────────────────────────────────────────────────
// Projects particle center through viewProjection, then offsets rotated quad
// vertices in clip space to create a billboarded quad.

const VERTEX_SHADER_3D = `#version 300 es
in vec2 a_position;
in vec3 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;
in float a_particle_shape;

uniform mat4 u_viewProjection;
uniform vec2 u_resolution;
uniform float u_worldScale;
uniform float u_glowExpand;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;
out float v_particle_shape;

void main() {
  float expand = 1.0 + u_glowExpand;
  // Convert engine coords (origin top-left, y-down) to world coords (origin center, y-up)
  // worldScale maps engine viewport to camera frustum at the target plane
  vec3 worldPos = vec3(
    (a_particle_pos.x - u_resolution.x * 0.5) * u_worldScale,
    -(a_particle_pos.y - u_resolution.y * 0.5) * u_worldScale,
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

// ── 3D Fragment Shader (same SDF as 2D) ──────────────────────────────────

const FRAGMENT_SHADER_3D = `#version 300 es
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

// ── Image shaders (3D versions) ──────────────────────────────────────────

const IMAGE_VERTEX_SHADER_3D = `#version 300 es
in vec2 a_position;
in vec3 a_particle_pos;
in float a_particle_size;
in float a_particle_rotation;
in vec4 a_particle_color;

uniform mat4 u_viewProjection;
uniform vec2 u_resolution;
uniform float u_worldScale;

out vec4 v_color;
out vec2 v_uv;
out float v_particle_size;

void main() {
  // Convert engine coords (origin top-left, y-down) to world coords (origin center, y-up)
  vec3 worldPos = vec3(
    (a_particle_pos.x - u_resolution.x * 0.5) * u_worldScale,
    -(a_particle_pos.y - u_resolution.y * 0.5) * u_worldScale,
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

const IMAGE_FRAGMENT_SHADER_3D = `#version 300 es
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

export interface WebGL3DRendererOptions {
  maxInstances?: number;
  camera?: CameraConfig;
}

export default class WebGL3DRenderer {
  target: HTMLCanvasElement;
  camera: Camera;
  gl: WebGL2RenderingContext | null = null;
  particular: Particular | null = null;
  pixelRatio = 2;

  private program: WebGLProgram | null = null;
  private imageProgram: WebGLProgram | null = null;
  private quadBuffer: WebGLBuffer | null = null;
  private circleQuadBuffer: WebGLBuffer | null = null;
  private instanceBuffer: WebGLBuffer | null = null;

  private instanceData: Float32Array;
  private maxInstances: number;
  // x, y, z, size, rotation, r, g, b, a, shape
  private instanceStride = 10;

  // Circle program uniforms
  private vpUniform: WebGLUniformLocation | null = null;
  private resUniform: WebGLUniformLocation | null = null;
  private worldScaleUniform: WebGLUniformLocation | null = null;
  private softnessUniform: WebGLUniformLocation | null = null;
  private glowUniform: WebGLUniformLocation | null = null;
  private glowExpandUniform: WebGLUniformLocation | null = null;
  private glowSizeUniform: WebGLUniformLocation | null = null;
  private glowColorUniform: WebGLUniformLocation | null = null;
  private isShadowUniform: WebGLUniformLocation | null = null;
  private shadowColorUniform: WebGLUniformLocation | null = null;
  private shadowBlurUniform: WebGLUniformLocation | null = null;
  // Circle attribute locations
  private cAttrPos = -1;
  private cAttrPPos = -1;
  private cAttrSize = -1;
  private cAttrRot = -1;
  private cAttrColor = -1;
  private cAttrShape = -1;

  // Image program uniforms
  private imgVpUniform: WebGLUniformLocation | null = null;
  private imgResUniform: WebGLUniformLocation | null = null;
  private imgWorldScaleUniform: WebGLUniformLocation | null = null;
  private imgTintUniform: WebGLUniformLocation | null = null;
  private imgIsShadowUniform: WebGLUniformLocation | null = null;
  private imgShadowColorUniform: WebGLUniformLocation | null = null;
  private imgShadowBlurUniform: WebGLUniformLocation | null = null;
  private imgTexUniform: WebGLUniformLocation | null = null;
  // Image attribute locations
  private iAttrPos = -1;
  private iAttrPPos = -1;
  private iAttrSize = -1;
  private iAttrRot = -1;
  private iAttrColor = -1;

  private textureCache = new Map<HTMLImageElement, WebGLTexture>();
  // Pools
  private ghostPool: Particle[] = [];
  private ghostPoolIdx = 0;
  private expandedArr: Particle[] = [];
  private batchPool: DrawBatch[] = [];
  private batchPoolIdx = 0;
  private _batchResult: DrawBatch[] = [];
  // Sort scratch
  private sortArr: Particle[] = [];

  constructor(target: HTMLCanvasElement, options?: WebGL3DRendererOptions) {
    this.target = target;
    this.maxInstances = options?.maxInstances ?? 16384;
    this.instanceData = new Float32Array(this.maxInstances * this.instanceStride);
    this.camera = new Camera(options?.camera);
  }

  init(particular: Particular, pixelRatio: number): void {
    this.particular = particular;
    this.pixelRatio = pixelRatio;
    // Widen kill-zone bounds — perspective projection means particles outside
    // 2D engine bounds can still be visible on screen (and vice versa).
    particular.boundsPadding = 3;

    const gl = this.target.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
    });
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    // ── Circle program ──
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_3D);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_3D);
    this.program = linkProgram(gl, vs, fs);
    this.vpUniform = gl.getUniformLocation(this.program, 'u_viewProjection');
    this.resUniform = gl.getUniformLocation(this.program, 'u_resolution');
    this.worldScaleUniform = gl.getUniformLocation(this.program, 'u_worldScale');
    this.softnessUniform = gl.getUniformLocation(this.program, 'u_softness');
    this.glowUniform = gl.getUniformLocation(this.program, 'u_glow');
    this.glowExpandUniform = gl.getUniformLocation(this.program, 'u_glowExpand');
    this.glowSizeUniform = gl.getUniformLocation(this.program, 'u_glowSize');
    this.glowColorUniform = gl.getUniformLocation(this.program, 'u_glowColor');
    this.isShadowUniform = gl.getUniformLocation(this.program, 'u_isShadow');
    this.shadowColorUniform = gl.getUniformLocation(this.program, 'u_shadowColor');
    this.shadowBlurUniform = gl.getUniformLocation(this.program, 'u_shadowBlur');
    this.cAttrPos = gl.getAttribLocation(this.program, 'a_position');
    this.cAttrPPos = gl.getAttribLocation(this.program, 'a_particle_pos');
    this.cAttrSize = gl.getAttribLocation(this.program, 'a_particle_size');
    this.cAttrRot = gl.getAttribLocation(this.program, 'a_particle_rotation');
    this.cAttrColor = gl.getAttribLocation(this.program, 'a_particle_color');
    this.cAttrShape = gl.getAttribLocation(this.program, 'a_particle_shape');

    // ── Image program ──
    const ivs = compileShader(gl, gl.VERTEX_SHADER, IMAGE_VERTEX_SHADER_3D);
    const ifs = compileShader(gl, gl.FRAGMENT_SHADER, IMAGE_FRAGMENT_SHADER_3D);
    this.imageProgram = linkProgram(gl, ivs, ifs);
    this.imgVpUniform = gl.getUniformLocation(this.imageProgram, 'u_viewProjection');
    this.imgResUniform = gl.getUniformLocation(this.imageProgram, 'u_resolution');
    this.imgWorldScaleUniform = gl.getUniformLocation(this.imageProgram, 'u_worldScale');
    this.imgTintUniform = gl.getUniformLocation(this.imageProgram, 'u_tint');
    this.imgIsShadowUniform = gl.getUniformLocation(this.imageProgram, 'u_isShadow');
    this.imgShadowColorUniform = gl.getUniformLocation(this.imageProgram, 'u_shadowColor');
    this.imgShadowBlurUniform = gl.getUniformLocation(this.imageProgram, 'u_shadowBlur');
    this.imgTexUniform = gl.getUniformLocation(this.imageProgram, 'u_texture');
    this.iAttrPos = gl.getAttribLocation(this.imageProgram, 'a_position');
    this.iAttrPPos = gl.getAttribLocation(this.imageProgram, 'a_particle_pos');
    this.iAttrSize = gl.getAttribLocation(this.imageProgram, 'a_particle_size');
    this.iAttrRot = gl.getAttribLocation(this.imageProgram, 'a_particle_rotation');
    this.iAttrColor = gl.getAttribLocation(this.imageProgram, 'a_particle_color');

    // ── Buffers ──
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

    particular.addEventListener('UPDATE', this.onUpdate);
    particular.addEventListener('UPDATE_AFTER', this.onUpdateAfter);
    particular.addEventListener('RESIZE', this.resize);
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
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  };

  onUpdateAfter = (): void => {
    if (!this.gl || !this.particular || !this.program) return;

    const baseParticles = this.particular.getAllParticles();
    const particles = this.expandParticlesWithTrails(baseParticles);

    for (let ai = 0; ai < this.particular.attractors.length; ai++) {
      const attractor = this.particular.attractors[ai]!;
      if (attractor.visible) particles.push(attractor.toDrawable());
    }

    const w = this.target.width || this.particular.width;
    const h = this.target.height || this.particular.height;
    const pixelRatio = this.pixelRatio;
    const logicalW = w / pixelRatio;
    const logicalH = h / pixelRatio;
    if (logicalW <= 0 || logicalH <= 0) return;

    // Update camera
    this.camera.update(logicalW / logicalH);

    // Compute worldScale: maps engine viewport to camera frustum at the target plane.
    // Ensures screen-space clicks map to correct world positions under perspective.
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const camDist = this.camera.getDistance();
    const visibleHalfH = camDist * Math.tan(fovRad / 2);
    const worldScale = visibleHalfH / (logicalH / 2);

    // Build batches
    const batches = this.buildBatches(particles);

    // ── Setup circle program ──
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.vpUniform, false, this.camera.viewProjection);
    gl.uniform2f(this.resUniform!, logicalW, logicalH);
    gl.uniform1f(this.worldScaleUniform!, worldScale);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
    gl.enableVertexAttribArray(this.cAttrPos);
    gl.vertexAttribPointer(this.cAttrPos, 2, gl.FLOAT, false, 0, 0);

    // Enable depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const halfW = logicalW * 0.5;
    const halfH = logicalH * 0.5;

    for (let bi = 0; bi < batches.length; bi++) {
      const batch = batches[bi]!;

      // Sort back-to-front for non-additive batches (additive is order-independent)
      if (batch.blendMode !== 'additive') {
        this.sortBackToFront(batch.particles, halfW, halfH, worldScale);
      }

      if (batch.type === 'circle') {
        this.drawCircleBatch(batch);
      } else {
        this.drawImageBatch(batch, logicalW, logicalH, worldScale);
        // Restore circle program state
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.vpUniform, false, this.camera.viewProjection);
        gl.uniform2f(this.resUniform!, logicalW, logicalH);
        gl.uniform1f(this.worldScaleUniform!, worldScale);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.circleQuadBuffer);
        gl.enableVertexAttribArray(this.cAttrPos);
        gl.vertexAttribPointer(this.cAttrPos, 2, gl.FLOAT, false, 0, 0);
      }
    }

    gl.disable(gl.DEPTH_TEST);
  };

  // ── Depth sorting ──────────────────────────────────────────────────────

  private sortBackToFront(particles: Particle[], halfW: number, halfH: number, ws: number): void {
    const vp = this.camera.viewProjection;
    // Camera-space z = dot(viewProjection row 2, position) + vp[14]
    // We use the full transform's z for proper sorting
    const m2 = vp[2]!, m6 = vp[6]!, m10 = vp[10]!, m14 = vp[14]!;
    const m3 = vp[3]!, m7 = vp[7]!, m11 = vp[11]!, m15 = vp[15]!;

    // Build sort keys
    const arr = this.sortArr;
    arr.length = particles.length;
    for (let i = 0; i < particles.length; i++) arr[i] = particles[i]!;

    arr.sort((a, b) => {
      // Transform engine coords to world coords (same as vertex shader, with worldScale)
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
      // Sort by z/w (clip depth) — larger = further back
      return (az / aw) - (bz / bw);
    });

    for (let i = 0; i < arr.length; i++) particles[i] = arr[i]!;
  }

  // ── Trail expansion ────────────────────────────────────────────────────

  private expandParticlesWithTrails(particles: Particle[]): Particle[] {
    const expanded = this.expandedArr;
    expanded.length = 0;
    this.ghostPoolIdx = 0;

    for (let pi = 0; pi < particles.length; pi++) {
      const particle = particles[pi]!;
      expanded.push(particle);
      if (!particle.trail || particle.trailSegments.length === 0) continue;
      const maxAge = Math.max(1, Math.floor(particle.trailLength));

      for (let si = 0; si < particle.trailSegments.length; si++) {
        const segment = particle.trailSegments[si]!;
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

  private acquireGhost(): Particle {
    if (this.ghostPoolIdx < this.ghostPool.length) {
      return this.ghostPool[this.ghostPoolIdx++]!;
    }
    const ghost = {
      position: { x: 0, y: 0, z: 0 },
      factoredSize: 0,
      rotation: 0,
      alpha: 0,
      color: '',
      colorR: 0,
      colorG: 0,
      colorB: 0,
      shape: 'circle',
      blendMode: 'normal',
      image: null,
      imageTint: false,
      glow: false,
      shadow: false,
      trail: false,
      trailSegments: [],
      shadowLightOrigin: null,
    } as unknown as Particle;
    this.ghostPool.push(ghost);
    this.ghostPoolIdx++;
    return ghost;
  }

  // ── Batching ───────────────────────────────────────────────────────────

  private buildBatches(particles: Particle[]): DrawBatch[] {
    this.batchPoolIdx = 0;
    const batches = this._batchResult;
    batches.length = 0;
    let current: DrawBatch | null = null;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;
      const img = p.image && p.image instanceof HTMLImageElement ? p.image : null;
      const tex = img ? this.getOrCreateTexture(img) : null;
      const isImage = !!tex;

      const sameBatch =
        current &&
        current.type === (isImage ? 'image' : 'circle') &&
        current.blendMode === p.blendMode &&
        current.shadow === p.shadow &&
        (!p.shadow || (
          current.shadowBlur === p.shadowBlur &&
          current.shadowColor === p.shadowColor &&
          current.shadowAlpha === p.shadowAlpha
        )) &&
        (isImage
          ? current.texture === tex && current.imageTint === !!p.imageTint
          : current.glow === p.glow &&
            (!p.glow ||
              (current.glowSize === p.glowSize &&
                current.glowColor === p.glowColor &&
                current.glowAlpha === p.glowAlpha)));

      if (!sameBatch) {
        current = this.acquireBatch();
        current.type = isImage ? 'image' : 'circle';
        current.blendMode = p.blendMode;
        current.shadow = p.shadow;
        current.shadowBlur = p.shadowBlur;
        current.shadowColor = p.shadowColor;
        current.shadowAlpha = p.shadowAlpha;
        if (isImage && tex) {
          current.texture = tex;
          current.image = img!;
          current.imageTint = !!p.imageTint;
        } else {
          current.texture = undefined;
          current.image = undefined;
          current.imageTint = undefined;
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

  private acquireBatch(): DrawBatch {
    if (this.batchPoolIdx < this.batchPool.length) {
      const batch = this.batchPool[this.batchPoolIdx++]!;
      batch.particles.length = 0;
      return batch;
    }
    const batch: DrawBatch = { type: 'circle', blendMode: 'normal', particles: [] };
    this.batchPool.push(batch);
    this.batchPoolIdx++;
    return batch;
  }

  // ── Instance data fill ─────────────────────────────────────────────────

  private fillInstanceData(particles: Particle[], startIdx: number, endIdx: number): void {
    let offset = 0;
    for (let i = startIdx; i < endIdx; i++) {
      const p = particles[i]!;
      this.instanceData[offset++] = p.position.x;
      this.instanceData[offset++] = p.position.y;
      this.instanceData[offset++] = p.position.z;
      this.instanceData[offset++] = p.factoredSize;
      this.instanceData[offset++] = (p.rotation * Math.PI) / 180;
      this.instanceData[offset++] = p.colorR;
      this.instanceData[offset++] = p.colorG;
      this.instanceData[offset++] = p.colorB;
      this.instanceData[offset++] = p.alpha;
      this.instanceData[offset++] = shapeToId(p.shape);
    }
  }

  // ── Draw helpers ───────────────────────────────────────────────────────

  private drawCircleInstances(list: Particle[]): void {
    const gl = this.gl!;
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

  private drawCircleBatch(batch: DrawBatch): void {
    const gl = this.gl!;

    // Shadow pass
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? '#000000');
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.isShadowUniform!, 1);
      gl.uniform1f(this.glowExpandUniform!, 0);
      gl.uniform4f(this.shadowColorUniform!, sr, sg, sb, sa);
      gl.uniform1f(this.shadowBlurUniform!, Math.min(1.0, (batch.shadowBlur ?? 8) / 20));
      gl.depthMask(false);
      this.drawCircleInstances(batch.particles);
      gl.depthMask(true);
      gl.uniform1f(this.isShadowUniform!, 0);
    }

    // Main pass — depth writes disabled for all blend modes since batches are
    // sorted back-to-front. Prevents semi-transparent edges from blocking particles behind.
    setBlendMode(gl, batch.blendMode);
    gl.depthMask(false);
    gl.uniform1f(this.softnessUniform!, 0.1);
    gl.uniform1f(this.glowUniform!, batch.glow ? 1 : 0);
    const glowUV = Math.min(1.0, (batch.glowSize ?? 10) / 30) * 1.75;
    gl.uniform1f(this.glowExpandUniform!, batch.glow ? glowUV : 0);
    gl.uniform1f(this.glowSizeUniform!, Math.min(1.0, (batch.glowSize ?? 10) / 30));
    const [gr, gg, gb] = hexToRgba(batch.glowColor ?? '#ffffff');
    gl.uniform4f(this.glowColorUniform!, gr, gg, gb, Math.max(0, Math.min(1, batch.glowAlpha ?? 0.35)));
    this.drawCircleInstances(batch.particles);
    gl.depthMask(true);
  }

  private drawImageInstances(list: Particle[]): void {
    const gl = this.gl!;
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

  private drawImageBatch(batch: DrawBatch, w: number, h: number, worldScale: number): void {
    const gl = this.gl!;
    if (!this.imageProgram || !batch.texture) return;

    gl.useProgram(this.imageProgram);
    gl.uniformMatrix4fv(this.imgVpUniform, false, this.camera.viewProjection);
    gl.uniform2f(this.imgResUniform!, w, h);
    gl.uniform1f(this.imgWorldScaleUniform!, worldScale);
    gl.uniform1f(this.imgTintUniform!, batch.imageTint ? 1 : 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, batch.texture);
    gl.uniform1i(this.imgTexUniform!, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.enableVertexAttribArray(this.iAttrPos);
    gl.vertexAttribPointer(this.iAttrPos, 2, gl.FLOAT, false, 0, 0);

    // Shadow pass
    if (batch.shadow) {
      const [sr, sg, sb] = hexToRgba(batch.shadowColor ?? '#000000');
      const sa = batch.shadowAlpha ?? 0.5;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquation(gl.FUNC_ADD);
      gl.uniform1f(this.imgIsShadowUniform!, 1);
      gl.uniform4f(this.imgShadowColorUniform!, sr, sg, sb, sa);
      gl.uniform1f(this.imgShadowBlurUniform!, Math.max(0, batch.shadowBlur ?? 8));
      gl.depthMask(false);
      this.drawImageInstances(batch.particles);
      gl.depthMask(true);
      gl.uniform1f(this.imgIsShadowUniform!, 0);
    }

    // Main pass
    setBlendMode(gl, batch.blendMode);
    gl.depthMask(false);
    this.drawImageInstances(batch.particles);
    gl.depthMask(true);
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

  destroy(): void {
    this.remove();
  }

  remove(): void {
    if (!this.particular || !this.gl) return;

    this.particular.removeEventListener('UPDATE', this.onUpdate);
    this.particular.removeEventListener('UPDATE_AFTER', this.onUpdateAfter);
    this.particular.removeEventListener('RESIZE', this.resize);

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
}
