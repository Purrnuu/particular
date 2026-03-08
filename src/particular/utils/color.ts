/** Convert HSL (h: 0–360, s: 0–100, l: 0–100) to a hex color string. */
function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Generate a 6-color analogous HSL palette around a random base hue. */
export function generateHarmoniousPalette(): string[] {
  const baseHue = Math.random() * 360;
  const offsets = [-20, -8, 0, 10, 20, 30];
  const saturations = [65, 75, 85, 80, 70, 60];
  const lightnesses = [82, 68, 55, 48, 60, 42];
  const colors: string[] = [];
  for (let i = 0; i < 6; i++) {
    const h = (baseHue + offsets[i]! + 360) % 360;
    colors.push(hslToHex(h, saturations[i]!, lightnesses[i]!));
  }
  return colors;
}
