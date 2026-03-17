/**
 * Jittered-grid image chunker — generates irregular polygon chunks
 * from a source canvas, like shattered glass.
 */

export interface ChunkResult {
  /** The chunk image (polygon clipped from source, padded to square). */
  image: HTMLImageElement;
  /** Center x of the chunk (bounding box center), normalized 0–1 within the source. */
  cx: number;
  /** Center y of the chunk (bounding box center), normalized 0–1 within the source. */
  cy: number;
  /** Size of the chunk (side length of the square canvas), in source pixels. */
  size: number;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Generate a jittered grid of points over a rectangle.
 * Edge points stay on the boundary; interior points jitter randomly.
 */
function buildJitteredGrid(
  w: number,
  h: number,
  cols: number,
  rows: number,
  jitter: number,
): Point[][] {
  const cellW = w / cols;
  const cellH = h / rows;
  const grid: Point[][] = [];

  for (let j = 0; j <= rows; j++) {
    const row: Point[] = [];
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

/**
 * Clip a polygon from the source canvas, returning a square-padded canvas.
 * @param expand - Outward expansion in pixels to cover anti-aliased seams. Default 1.
 */
function clipPolygon(
  source: HTMLCanvasElement,
  points: Point[],
  expand = 1,
): HTMLCanvasElement {
  // Compute expanded clip polygon to eliminate anti-aliased seam gaps
  let clipPoints = points;
  if (expand > 0) {
    const pcx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const pcy = points.reduce((s, p) => s + p.y, 0) / points.length;
    clipPoints = points.map(p => {
      const dx = p.x - pcx;
      const dy = p.y - pcy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: p.x + (dx / d) * expand, y: p.y + (dy / d) * expand };
    });
  }

  // Bbox from original points (determines positioning)
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

  // Add margin for the expansion so the expanded clip fits in the canvas
  const margin = Math.ceil(expand) + 1;
  minX -= margin;
  minY -= margin;
  maxX += margin;
  maxY += margin;

  const bw = Math.ceil(maxX - minX);
  const bh = Math.ceil(maxY - minY);
  // Pad to square so the particle renders without distortion
  const side = Math.max(bw, bh);
  const padX = (side - bw) / 2;
  const padY = (side - bh) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = side;
  canvas.height = side;
  const ctx = canvas.getContext('2d')!;

  ctx.beginPath();
  ctx.moveTo(clipPoints[0]!.x - minX + padX, clipPoints[0]!.y - minY + padY);
  for (let i = 1; i < clipPoints.length; i++) {
    ctx.lineTo(clipPoints[i]!.x - minX + padX, clipPoints[i]!.y - minY + padY);
  }
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(source, -minX + padX, -minY + padY);

  return canvas;
}

/**
 * Generate irregular polygon chunks from a source canvas.
 *
 * @param source - The source canvas to shatter
 * @param chunkCount - Approximate number of chunks (actual = cols × rows)
 * @param jitter - Grid jitter amount (0–1). Default 0.35
 * @returns Array of chunk results with images and positions
 */
export async function generateImageChunks(
  source: HTMLCanvasElement,
  chunkCount: number,
  jitter = 0.35,
): Promise<ChunkResult[]> {
  const w = source.width;
  const h = source.height;
  const aspect = w / h;

  const cols = Math.max(2, Math.round(Math.sqrt(chunkCount * aspect)));
  const rows = Math.max(2, Math.round(chunkCount / cols));

  const grid = buildJitteredGrid(w, h, cols, rows, jitter);

  const chunks: ChunkResult[] = [];
  const imagePromises: Promise<void>[] = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const tl = grid[j]![i]!;
      const tr = grid[j]![i + 1]!;
      const br = grid[j + 1]![i + 1]!;
      const bl = grid[j + 1]![i]!;
      const points = [tl, tr, br, bl];

      // Use bounding box center (not polygon centroid) — the chunk canvas
      // is laid out relative to the bbox, so the particle position must match.
      const pMinX = Math.min(tl.x, tr.x, br.x, bl.x);
      const pMaxX = Math.max(tl.x, tr.x, br.x, bl.x);
      const pMinY = Math.min(tl.y, tr.y, br.y, bl.y);
      const pMaxY = Math.max(tl.y, tr.y, br.y, bl.y);
      const cx = (pMinX + pMaxX) / 2;
      const cy = (pMinY + pMaxY) / 2;

      const chunkCanvas = clipPolygon(source, points);

      const chunk: ChunkResult = {
        image: null!,
        cx: cx / w,
        cy: cy / h,
        size: chunkCanvas.width,
      };
      chunks.push(chunk);

      // Convert canvas to image
      const p = new Promise<void>((resolve) => {
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
