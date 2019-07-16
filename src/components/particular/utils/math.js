export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const TO_RADIANS = Math.PI / 180;

export function degToRad(deg) {
  return deg * TO_RADIANS;
}
