export interface PixelSample {
  /** Normalized x position (0–1) within the image. */
  nx: number;
  /** Normalized y position (0–1) within the image. */
  ny: number;
  /** Hex color string (e.g. '#ff8800'). */
  color: string;
  /** Source alpha (0–1). Edge pixels have partial alpha for anti-aliasing. */
  alpha: number;
  /** Grid column index. */
  gridX: number;
  /** Grid row index. */
  gridY: number;
}

/**
 * Load an image from a URL string, resolve an existing HTMLImageElement,
 * or convert an HTMLCanvasElement to an image.
 * Sets crossOrigin to 'anonymous' for URL strings so pixel data is accessible.
 */
export function loadImage(
  src: string | HTMLImageElement | HTMLCanvasElement,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (src instanceof HTMLCanvasElement) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src.toDataURL('image/png');
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
    // Only set crossOrigin for absolute cross-origin HTTP URLs.
    // Relative paths, data URIs, blob URLs, and same-origin URLs must NOT have
    // crossOrigin set — otherwise servers without CORS headers taint the canvas.
    try {
      const absolute = new URL(src, window.location.href);
      if (absolute.origin !== window.location.origin && /^https?:$/.test(absolute.protocol)) {
        img.crossOrigin = 'anonymous';
      }
    } catch {
      // Invalid URL (e.g. data URI on some engines) — skip crossOrigin
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Sample an image's pixels at a reduced resolution grid.
 * Returns an array of non-transparent pixel samples with normalized coordinates and hex colors.
 *
 * Accepts HTMLImageElement or HTMLCanvasElement as source.
 *
 * @param source - Loaded image or canvas element
 * @param resolution - Number of samples along the longest axis
 * @param alphaThreshold - Skip pixels with alpha below this (0–1)
 */
export function sampleImagePixels(
  source: HTMLImageElement | HTMLCanvasElement,
  resolution: number,
  alphaThreshold: number,
): PixelSample[] {
  const srcWidth = source instanceof HTMLCanvasElement ? source.width : source.naturalWidth;
  const srcHeight = source instanceof HTMLCanvasElement ? source.height : source.naturalHeight;
  const aspect = srcWidth / srcHeight;

  let sampleW: number;
  let sampleH: number;
  if (aspect >= 1) {
    sampleW = resolution;
    sampleH = Math.max(1, Math.round(resolution / aspect));
  } else {
    sampleH = resolution;
    sampleW = Math.max(1, Math.round(resolution * aspect));
  }

  const canvas = document.createElement('canvas');
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0, sampleW, sampleH);
  const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
  const { data } = imageData;

  const samples: PixelSample[] = [];
  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const i = (y * sampleW + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]! / 255;
      if (a < alphaThreshold) continue;

      const hex =
        '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');

      samples.push({
        nx: (x + 0.5) / sampleW,
        ny: (y + 0.5) / sampleH,
        color: hex,
        alpha: a,
        gridX: x,
        gridY: y,
      });
    }
  }

  return samples;
}
