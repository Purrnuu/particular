/**
 * Capture an HTML element's visual appearance to an HTMLCanvasElement.
 *
 * Uses manual Canvas 2D rendering — reads computed styles from the DOM tree
 * and draws backgrounds, borders, and text directly. This avoids SVG
 * foreignObject which taints the canvas and blocks pixel extraction.
 *
 * Covers: background colors, linear gradients, text (including gradient text
 * via -webkit-background-clip), borders, border-radius, box-shadow, opacity.
 */

/** Parsed linear-gradient: angle + color stops. */
interface ParsedGradient {
  angle: number;
  stops: { offset: number; color: string }[];
}

/** Parse a computed `linear-gradient(...)` string into angle + stops. */
function parseLinearGradient(value: string): ParsedGradient | null {
  // Match: linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(254, 202, 87) 50%, ...)
  const match = value.match(/linear-gradient\((.+)\)/);
  if (!match) return null;
  const inner = match[1]!;

  // Split on commas that are NOT inside parentheses (rgb/rgba color values)
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of inner) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  parts.push(current.trim());

  if (parts.length < 2) return null;

  // First part may be an angle
  let angle = 180; // default: to bottom
  let startIndex = 0;
  const first = parts[0]!;
  const degMatch = first.match(/^([\d.]+)deg$/);
  if (degMatch) {
    angle = parseFloat(degMatch[1]!);
    startIndex = 1;
  } else if (first.startsWith('to ')) {
    const dir = first.replace('to ', '');
    const dirMap: Record<string, number> = {
      top: 0, right: 90, bottom: 180, left: 270,
      'top right': 45, 'right top': 45,
      'bottom right': 135, 'right bottom': 135,
      'bottom left': 225, 'left bottom': 225,
      'top left': 315, 'left top': 315,
    };
    angle = dirMap[dir] ?? 180;
    startIndex = 1;
  }

  const stops: { offset: number; color: string }[] = [];
  const colorParts = parts.slice(startIndex);
  for (let i = 0; i < colorParts.length; i++) {
    const part = colorParts[i]!;
    // Extract color and optional percentage
    const pctMatch = part.match(/^(.+?)\s+([\d.]+)%\s*$/);
    if (pctMatch) {
      stops.push({ offset: parseFloat(pctMatch[2]!) / 100, color: pctMatch[1]! });
    } else {
      // Auto-distribute
      stops.push({ offset: i / (colorParts.length - 1), color: part });
    }
  }

  return { angle, stops };
}

/** Apply a linear gradient fill to a canvas context for a given rect. */
function applyGradient(
  ctx: CanvasRenderingContext2D,
  grad: ParsedGradient,
  x: number, y: number, w: number, h: number,
): void {
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

/** Draw a rounded rect path (handles per-corner radii). */
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  radii: [number, number, number, number], // TL, TR, BR, BL
): void {
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

/** Parse border-radius values from computed style. Returns [TL, TR, BR, BL]. */
function parseBorderRadii(style: CSSStyleDeclaration, w: number, h: number): [number, number, number, number] {
  const parse = (v: string) => {
    if (v.endsWith('%')) return Math.min(w, h) * parseFloat(v) / 100;
    return parseFloat(v) || 0;
  };
  return [
    parse(style.borderTopLeftRadius),
    parse(style.borderTopRightRadius),
    parse(style.borderBottomRightRadius),
    parse(style.borderBottomLeftRadius),
  ];
}

/** Check if a color is transparent (rgba with 0 alpha, or 'transparent'). */
function isTransparent(color: string): boolean {
  if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return true;
  const m = color.match(/rgba?\(.+?,\s*([\d.]+)\s*\)$/);
  if (m && parseFloat(m[1]!) === 0) return true;
  return false;
}

/**
 * Render a single DOM node (background, border, text) onto the canvas.
 * Recurses into child elements.
 */
function renderNode(
  ctx: CanvasRenderingContext2D,
  node: HTMLElement,
  rootLeft: number,
  rootTop: number,
): void {
  const rect = node.getBoundingClientRect();
  const style = window.getComputedStyle(node);

  // Skip invisible elements
  if (style.display === 'none' || style.visibility === 'hidden') return;

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
  const hasRadius = radii.some(r => r > 0);

  // Clip to border-radius if present
  if (hasRadius) {
    roundedRectPath(ctx, x, y, w, h, radii);
    ctx.save();
    ctx.clip();
  }

  // ── Box shadow (outer only, simplified) ──
  const boxShadow = style.boxShadow;
  if (boxShadow && boxShadow !== 'none') {
    // Parse first shadow: offsetX offsetY blur spread color
    const sm = boxShadow.match(/(rgba?\([^)]+\)|#\w+|[a-z]+)\s+([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px/);
    if (sm) {
      ctx.save();
      ctx.shadowColor = sm[1]!;
      ctx.shadowOffsetX = parseFloat(sm[2]!);
      ctx.shadowOffsetY = parseFloat(sm[3]!);
      ctx.shadowBlur = parseFloat(sm[4]!);
      roundedRectPath(ctx, x, y, w, h, radii);
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Background ──
  const bgColor = style.backgroundColor;
  const bgImage = style.backgroundImage;
  const bgClipVal = style.webkitBackgroundClip || (style as unknown as Record<string, string>)['background-clip'];
  const isBgClipText = bgClipVal === 'text';

  // When background-clip: text is set, the gradient is used as text fill,
  // not as a visible background rect — skip the rect fill.
  if (bgImage && bgImage !== 'none' && !isBgClipText) {
    const grad = parseLinearGradient(bgImage);
    if (grad) {
      applyGradient(ctx, grad, x, y, w, h);
      ctx.fillRect(x, y, w, h);
    }
  }
  if (bgColor && !isTransparent(bgColor)) {
    if (!bgImage || bgImage === 'none' || isBgClipText) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, w, h);
    } else {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }
  }

  // ── Border ──
  const drawBorderSide = (width: string, color: string, bStyle: string,
    fx: number, fy: number, fw: number, fh: number) => {
    const bw = parseFloat(width);
    if (bw <= 0 || bStyle === 'none' || isTransparent(color)) return;
    ctx.fillStyle = color;
    ctx.fillRect(fx, fy, fw, fh);
  };
  drawBorderSide(style.borderTopWidth, style.borderTopColor, style.borderTopStyle,
    x, y, w, parseFloat(style.borderTopWidth));
  drawBorderSide(style.borderBottomWidth, style.borderBottomColor, style.borderBottomStyle,
    x, y + h - parseFloat(style.borderBottomWidth), w, parseFloat(style.borderBottomWidth));
  drawBorderSide(style.borderLeftWidth, style.borderLeftColor, style.borderLeftStyle,
    x, y, parseFloat(style.borderLeftWidth), h);
  drawBorderSide(style.borderRightWidth, style.borderRightColor, style.borderRightStyle,
    x + w - parseFloat(style.borderRightWidth), y, parseFloat(style.borderRightWidth), h);

  // ── Text (direct text nodes) ──
  // Draws text per-line using Range.getClientRects() so multi-line text
  // and interleaved inline spans are positioned correctly.
  const textColor = style.color;
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const isGradientText = isBgClipText && bgImage && bgImage !== 'none';

  for (const child of node.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE) continue;
    const text = child.textContent;
    if (!text || !text.trim()) continue;

    // Get per-line bounding rects for this text node
    const range = document.createRange();
    range.selectNodeContents(child);
    const lineRects = range.getClientRects();

    ctx.font = font;
    ctx.textBaseline = 'top';

    // Split text into per-line segments using character-level ranges
    const textLen = child.textContent!.length;
    let charIdx = 0;

    for (const lr of lineRects) {
      const tx = lr.left - rootLeft;
      const ty = lr.top - rootTop;

      // Find which characters belong to this line rect
      let lineText = '';
      const charRange = document.createRange();
      while (charIdx < textLen) {
        charRange.setStart(child, charIdx);
        charRange.setEnd(child, Math.min(charIdx + 1, textLen));
        const charRect = charRange.getBoundingClientRect();
        // Character belongs to this line if its vertical center is within the line rect
        const charMidY = charRect.top + charRect.height / 2;
        if (charMidY >= lr.top - 1 && charMidY <= lr.bottom + 1) {
          lineText += child.textContent![charIdx];
          charIdx++;
        } else {
          break;
        }
      }

      if (!lineText.trim()) continue;

      if (isGradientText) {
        const grad = parseLinearGradient(bgImage!);
        if (grad) {
          ctx.save();
          // Use the parent element's full rect for gradient coordinates
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

  // ── Recurse into child elements ──
  for (const child of node.children) {
    if (child instanceof HTMLElement) {
      renderNode(ctx, child, rootLeft, rootTop);
    }
  }

  if (hasRadius) ctx.restore(); // pop clip
  ctx.restore(); // pop opacity
}

/**
 * Capture an HTML element's visual appearance to an HTMLCanvasElement.
 *
 * Walks the DOM tree, reads computed styles, and draws backgrounds, text,
 * borders, and gradients onto a canvas using Canvas 2D API directly.
 * The resulting canvas is never tainted, so pixel data can be extracted.
 */
export function captureElement(element: HTMLElement): HTMLCanvasElement {
  const rect = element.getBoundingClientRect();
  const width = Math.ceil(rect.width);
  const height = Math.ceil(rect.height);

  if (width === 0 || height === 0) {
    throw new Error('elementToParticles: element has zero dimensions');
  }

  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  renderNode(ctx, element, rect.left, rect.top);

  return canvas;
}
