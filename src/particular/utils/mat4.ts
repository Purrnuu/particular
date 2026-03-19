/**
 * Minimal 4×4 matrix math for 3D projection. Column-major Float32Array layout
 * matching WebGL's uniform convention. Zero dependencies.
 */

export type Mat4 = Float32Array;

export function identity(): Mat4 {
  const m = new Float32Array(16);
  m[0] = 1; m[5] = 1; m[10] = 1; m[15] = 1;
  return m;
}

/** Perspective projection matrix. fov in radians, near/far > 0. */
export function perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
  const m = new Float32Array(16);
  const f = 1.0 / Math.tan(fov / 2);
  const rangeInv = 1.0 / (near - far);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (near + far) * rangeInv;
  m[11] = -1;
  m[14] = 2 * near * far * rangeInv;
  return m;
}

/** Look-at view matrix. eye/center/up are {x,y,z}. */
export function lookAt(
  eye: { x: number; y: number; z: number },
  center: { x: number; y: number; z: number },
  up: { x: number; y: number; z: number },
): Mat4 {
  let fx = center.x - eye.x;
  let fy = center.y - eye.y;
  let fz = center.z - eye.z;
  let len = Math.sqrt(fx * fx + fy * fy + fz * fz);
  if (len > 0) { fx /= len; fy /= len; fz /= len; }

  // side = forward × up
  let sx = fy * up.z - fz * up.y;
  let sy = fz * up.x - fx * up.z;
  let sz = fx * up.y - fy * up.x;
  len = Math.sqrt(sx * sx + sy * sy + sz * sz);
  if (len > 0) { sx /= len; sy /= len; sz /= len; }

  // u = side × forward
  const ux = sy * fz - sz * fy;
  const uy = sz * fx - sx * fz;
  const uz = sx * fy - sy * fx;

  const m = new Float32Array(16);
  m[0] = sx;  m[1] = ux;  m[2] = -fx;  m[3] = 0;
  m[4] = sy;  m[5] = uy;  m[6] = -fy;  m[7] = 0;
  m[8] = sz;  m[9] = uz;  m[10] = -fz; m[11] = 0;
  m[12] = -(sx * eye.x + sy * eye.y + sz * eye.z);
  m[13] = -(ux * eye.x + uy * eye.y + uz * eye.z);
  m[14] = -(-fx * eye.x + -fy * eye.y + -fz * eye.z);
  m[15] = 1;
  return m;
}

/** Multiply two 4×4 column-major matrices: result = a × b. */
export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[row]!     * b[col * 4]!     +
        a[4 + row]! * b[col * 4 + 1]! +
        a[8 + row]! * b[col * 4 + 2]! +
        a[12 + row]! * b[col * 4 + 3]!;
    }
  }
  return out;
}
