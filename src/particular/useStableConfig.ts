import { useRef } from 'react';
import Vector from './utils/vector';

function equalConfig(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const prototype = Object.getPrototypeOf(a);
  if (prototype !== Object.getPrototypeOf(b)) return false;
  // DOM nodes, event targets, and other opaque objects retain identity semantics.
  if (
    prototype !== Object.prototype &&
    prototype !== Array.prototype &&
    prototype !== Vector.prototype
  )
    return false;
  const left = a as Record<string, unknown>;
  const right = b as Record<string, unknown>;
  const keys = Object.keys(left);
  return (
    keys.length === Object.keys(right).length &&
    keys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(right, key) && equalConfig(left[key], right[key])
    )
  );
}

/** Equivalent inline configs should not tear down a mounted particle engine. */
export function useStableConfig<T>(config: T): T {
  const ref = useRef(config);
  if (!equalConfig(ref.current, config)) ref.current = config;
  return ref.current;
}
