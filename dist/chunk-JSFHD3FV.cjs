'use strict';

var chunkDSCJ6LNA_cjs = require('./chunk-DSCJ6LNA.cjs');

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

// src/particular/utils/pixelSampler.ts
function loadImage(src, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(chunkDSCJ6LNA_cjs.abortError());
      return;
    }
    const image = src instanceof HTMLImageElement ? src : new Image();
    const cleanup = () => {
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
      signal?.removeEventListener("abort", onAbort);
    };
    const onLoad = () => {
      cleanup();
      resolve(image);
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const onAbort = () => {
      cleanup();
      reject(chunkDSCJ6LNA_cjs.abortError());
    };
    image.addEventListener("load", onLoad, { once: true });
    image.addEventListener("error", onError, { once: true });
    signal?.addEventListener("abort", onAbort, { once: true });
    if (src instanceof HTMLCanvasElement) {
      try {
        image.src = src.toDataURL("image/png");
      } catch (error) {
        cleanup();
        reject(error);
      }
      return;
    }
    if (src instanceof HTMLImageElement) {
      if (src.complete && src.naturalWidth > 0) {
        onLoad();
      }
      return;
    }
    try {
      const absolute = new URL(src, window.location.href);
      if (absolute.origin !== window.location.origin && /^https?:$/.test(absolute.protocol)) {
        image.crossOrigin = "anonymous";
      }
    } catch {
    }
    image.src = src;
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

// src/particular/convenience/resize.ts
function getViewportSize(container) {
  if (container) {
    return { w: container.clientWidth, h: container.clientHeight };
  }
  return { w: window.innerWidth, h: window.innerHeight };
}
function watchResize(callback, options = {}) {
  const { container, debounceMs = 200, resources } = options;
  resources?.assertActive();
  const skipSmall = options.skipSmallChanges ?? debounceMs > 0;
  const initial = getViewportSize(container);
  let debounceTimer = null;
  const fire = () => {
    if (resources?.disposed) return;
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
    resources?.add(() => {
      ro.disconnect();
      teardown();
    });
  } else {
    window.addEventListener("resize", handler);
    resources?.add(() => {
      window.removeEventListener("resize", handler);
      teardown();
    });
  }
  return initial;
}

// src/particular/convenience/imageParticles.ts
function createImageParticles({
  engine,
  config: mergedConfig,
  container,
  resources,
  coordinates
}) {
  const imageToParticles = async (config) => {
    resources.assertActive();
    const merged = { ...chunkDSCJ6LNA_cjs.defaultImageParticles, ...config };
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
      image = await loadImage(imageSrc, resources.signal);
    } catch (err) {
      if (!resources.disposed)
        console.warn(
          "Particular: imageToParticles failed to load image.",
          typeof imageSrc === "string" ? imageSrc : "(HTMLImageElement)",
          err
        );
      throw err;
    }
    resources.assertActive();
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
    const { x: centerX, y: centerY } = coordinates.localToEngine(x, y);
    const originX = centerX - engineW / 2;
    const originY = centerY - engineH / 2;
    const sizeForRes = (res, particleShape) => {
      const cols = aspect >= 1 ? res : Math.max(1, Math.round(res * aspect));
      const sp = engineW / cols;
      const scale = particleShape === "square" ? 0.55 : particleShape === "triangle" ? 0.95 : 0.7;
      return sp * scale;
    };
    const imageCenter = new chunkDSCJ6LNA_cjs.Vector(centerX, centerY);
    const samples = sampleImagePixels(image, resolution, alphaThreshold);
    const size = sizeOverride != null ? sizeOverride / pr : sizeForRes(resolution, shape ?? "square");
    const scaleStep = scaleStepOverride ?? size;
    if (merged.expandBudget && engine.maxCount < engine.getCount() + samples.length) {
      engine.maxCount = engine.getCount() + samples.length;
    }
    const collectorConfig = chunkDSCJ6LNA_cjs.configureParticle({}, mergedConfig);
    const collector = new chunkDSCJ6LNA_cjs.Emitter({
      point: new chunkDSCJ6LNA_cjs.Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: []
    });
    collector.isEmitting = false;
    engine.addEmitter(collector);
    const hasBudget = () => engine.getCount() + (engine.emitters.includes(collector) ? 0 : collector.particles.length) < engine.maxCount;
    const introTimers = [];
    const cancelIntro = () => {
      for (const cancel of introTimers) cancel();
      introTimers.length = 0;
      collector.configuration.life = 0;
      collector.isEmitting = false;
    };
    const makeParticle = (sample, introScaleStep) => {
      resources.assertActive();
      const px = originX + sample.nx * engineW;
      const py = originY + sample.ny * engineH;
      const homePos = new chunkDSCJ6LNA_cjs.Vector(px, py);
      const particle = chunkDSCJ6LNA_cjs.Particle.create({
        color: sample.color,
        baseAlpha: sample.alpha,
        point: new chunkDSCJ6LNA_cjs.Vector(px, py),
        velocity: new chunkDSCJ6LNA_cjs.Vector(0, 0),
        acceleration: new chunkDSCJ6LNA_cjs.Vector(0, 0),
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
      if (resources.disposed) {
        particle.destroy();
        resources.assertActive();
      }
      return particle;
    };
    if (intro) {
      const mode = intro.mode ?? "scatter";
      const duration = intro.duration ?? 800;
      const introScaleStep = size / 15;
      if (mode === "scatter") {
        const scatterRadius = Math.max(engineW, engineH) * 0.3;
        for (const sample of samples) {
          if (!hasBudget()) break;
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
        collector.configuration.life = Infinity;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              if (!hasBudget()) break;
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
            if (b === numBatches - 1) cancelIntro();
          };
          if (b === 0) {
            createBatch();
          } else {
            introTimers.push(resources.timeout(createBatch, b * batchMs));
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
        collector.configuration.life = Infinity;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              if (!hasBudget()) break;
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
            if (b === numBatches - 1) cancelIntro();
          };
          if (b === 0) {
            createBatch();
          } else {
            introTimers.push(resources.timeout(createBatch, b * batchMs));
          }
        }
      } else {
        const sorted = [...samples];
        sorted.sort((a, b) => a.nx + Math.random() * 0.05 - (b.nx + Math.random() * 0.05));
        const launchX = centerX;
        const launchY = originY + engineH;
        const numBatches = 40;
        collector.configuration.life = Infinity;
        const batchMs = duration / numBatches;
        for (let b = 0; b < numBatches; b++) {
          const bStart = Math.floor(b * sorted.length / numBatches);
          const bEnd = Math.floor((b + 1) * sorted.length / numBatches);
          const createBatch = () => {
            for (let i = bStart; i < bEnd; i++) {
              if (!hasBudget()) break;
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
            if (b === numBatches - 1) cancelIntro();
          };
          if (b === 0) {
            createBatch();
          } else {
            introTimers.push(resources.timeout(createBatch, b * batchMs));
          }
        }
      }
    } else {
      for (const sample of samples) {
        if (!hasBudget()) break;
        const particle = makeParticle(sample);
        collector.particles.push(particle);
      }
      engine.addEmitter(collector);
    }
    const autoCenter = config.autoCenter ?? true;
    if (autoCenter) {
      let resizeGen = 0;
      watchResize(
        (scaleX, scaleY) => {
          cancelIntro();
          const gen = ++resizeGen;
          const idx = engine.emitters.indexOf(collector);
          if (idx !== -1) engine.emitters.splice(idx, 1);
          collector.destroy();
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
              newCollector.destroy();
              return;
            }
            collector.particles.push(...newCollector.particles);
            newCollector.particles.length = 0;
            const newIdx = engine.emitters.indexOf(newCollector);
            if (newIdx !== -1) engine.emitters.splice(newIdx, 1);
            engine.addEmitter(collector);
          }).catch((error) => {
            if (!resources.disposed) console.warn("Particular: image resize failed.", error);
          });
        },
        { container, resources }
      );
    }
    return collector;
  };
  const textToParticles = async (text, config) => {
    resources.assertActive();
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
    resources.assertActive();
    const merged = { ...chunkDSCJ6LNA_cjs.defaultElementParticles, ...config };
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
    resources.assertActive();
    const originalVisibility = element.style.visibility;
    if (hideElement) {
      element.style.visibility = "hidden";
    }
    if (restoreElement && hideElement) {
      resources.add(() => {
        element.style.visibility = originalVisibility;
      });
    }
    if (imageConfig.autoCenter !== false) {
      let lastX = x;
      let lastY = y;
      let lastW = width;
      let lastH = height;
      let elemResizeGen = 0;
      watchResize(
        () => {
          const gen = ++elemResizeGen;
          const newRect = readElementRect(element);
          const newX = imageConfig.x ?? newRect.x;
          const newY = imageConfig.y ?? newRect.y;
          const newW = imageConfig.width ?? newRect.width;
          const newH = imageConfig.height ?? newRect.height;
          if (Math.abs(newX - lastX) < 1 && Math.abs(newY - lastY) < 1 && Math.abs(newW - lastW) < 1 && Math.abs(newH - lastH) < 1)
            return;
          lastX = newX;
          lastY = newY;
          lastW = newW;
          lastH = newH;
          const idx = engine.emitters.indexOf(emitter);
          if (idx !== -1) engine.emitters.splice(idx, 1);
          emitter.destroy();
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
              newCollector.destroy();
              return;
            }
            emitter.particles.push(...newCollector.particles);
            newCollector.particles.length = 0;
            const newIdx = engine.emitters.indexOf(newCollector);
            if (newIdx !== -1) engine.emitters.splice(newIdx, 1);
            engine.addEmitter(emitter);
          }).catch((error) => {
            if (!resources.disposed) console.warn("Particular: element resize failed.", error);
          });
        },
        { container, resources, skipSmallChanges: false }
      );
    }
    return emitter;
  };
  const setIdleEffect = (enabled) => {
    resources.assertActive();
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
function createImageShatterHelper({
  engine,
  config: mergedConfig,
  container,
  resources,
  coordinates
}) {
  const shatterImage = async (config) => {
    resources.assertActive();
    const resolved = { ...chunkDSCJ6LNA_cjs.defaultImageShatter, ...config };
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
      image = await loadImage(imageSrc, resources.signal);
    } catch (err) {
      if (!resources.disposed)
        console.warn(
          "Particular: shatterImage failed to load image.",
          typeof imageSrc === "string" ? imageSrc : "(HTMLImageElement)",
          err
        );
      throw err;
    }
    resources.assertActive();
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
    const { x: centerX, y: centerY } = coordinates.localToEngine(x, y);
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = Math.round(displayW);
    sourceCanvas.height = Math.round(displayH);
    const sourceCtx = sourceCanvas.getContext("2d");
    sourceCtx.drawImage(image, 0, 0, sourceCanvas.width, sourceCanvas.height);
    const chunks = await resources.waitFor(generateImageChunks(sourceCanvas, chunkCount, jitter));
    resources.assertActive();
    if (resolved.expandBudget && engine.maxCount < engine.getCount() + chunks.length) {
      engine.maxCount = engine.getCount() + chunks.length;
    }
    const collectorConfig = chunkDSCJ6LNA_cjs.configureParticle({}, mergedConfig);
    const collector = new chunkDSCJ6LNA_cjs.Emitter({
      point: new chunkDSCJ6LNA_cjs.Vector(0, 0),
      ...collectorConfig,
      rate: 0,
      life: 0,
      icons: []
    });
    collector.isEmitting = false;
    engine.addEmitter(collector);
    const imageCenter = new chunkDSCJ6LNA_cjs.Vector(centerX, centerY);
    for (const chunk of chunks) {
      resources.assertActive();
      if (engine.getCount() >= engine.maxCount) break;
      const px = centerX - engineW / 2 + chunk.cx * engineW;
      const py = centerY - engineH / 2 + chunk.cy * engineH;
      const chunkSize = chunk.size / sourceCanvas.width * engineW / 2;
      if (interactive) {
        const homePos = new chunkDSCJ6LNA_cjs.Vector(px, py);
        const particle = chunkDSCJ6LNA_cjs.Particle.create({
          point: new chunkDSCJ6LNA_cjs.Vector(px, py),
          velocity: new chunkDSCJ6LNA_cjs.Vector(0, 0),
          acceleration: new chunkDSCJ6LNA_cjs.Vector(0, 0),
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
        if (resources.disposed) {
          particle.destroy();
          resources.assertActive();
        }
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
        const particle = chunkDSCJ6LNA_cjs.Particle.create({
          point: new chunkDSCJ6LNA_cjs.Vector(px, py),
          velocity: new chunkDSCJ6LNA_cjs.Vector(Math.cos(spreadAngle) * speed, Math.sin(spreadAngle) * speed),
          acceleration: new chunkDSCJ6LNA_cjs.Vector(0, 0),
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
        if (resources.disposed) {
          particle.destroy();
          resources.assertActive();
        }
        collector.particles.push(particle);
      }
    }
    engine.addEmitter(collector);
    return collector;
  };
  const shatterText = async (text, config) => {
    resources.assertActive();
    const { textConfig, ...shatterConfig } = config ?? {};
    const textCanvas = createTextImage({ text, ...textConfig });
    return shatterImage({
      ...shatterConfig,
      image: canvasToDataURL(textCanvas)
    });
  };
  return { shatterImage, shatterText };
}

exports.canvasToDataURL = canvasToDataURL;
exports.createHeartImage = createHeartImage;
exports.createImageParticles = createImageParticles;
exports.createImageShatterHelper = createImageShatterHelper;
exports.createTextImage = createTextImage;
exports.getViewportSize = getViewportSize;
exports.watchResize = watchResize;
//# sourceMappingURL=chunk-JSFHD3FV.cjs.map
//# sourceMappingURL=chunk-JSFHD3FV.cjs.map