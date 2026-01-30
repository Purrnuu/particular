export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const TO_RADIANS = Math.PI / 180;

export function degToRad(deg: number): number {
  return deg * TO_RADIANS;
}
