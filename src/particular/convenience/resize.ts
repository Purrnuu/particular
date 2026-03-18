/**
 * Shared resize watcher for convenience modules.
 *
 * Abstracts container-vs-window detection, debouncing, scale factor calculation,
 * and cleanup registration so each module doesn't reimplement the pattern.
 */

/** Get current viewport (window) or container size. */
export function getViewportSize(container?: HTMLElement): { w: number; h: number } {
  if (container) {
    return { w: container.clientWidth, h: container.clientHeight };
  }
  return { w: window.innerWidth, h: window.innerHeight };
}

export interface WatchResizeOptions {
  /** Container element — uses ResizeObserver on it. Omit for window resize. */
  container?: HTMLElement;
  /** Debounce delay in ms. Default 200. Set to 0 for immediate (no debounce). */
  debounceMs?: number;
  /** Cleanup array — teardown is automatically registered. */
  cleanups?: Array<() => void>;
  /** Skip callback when scale change < 1%. Default true when debounced, false when immediate. */
  skipSmallChanges?: boolean;
}

/**
 * Watch for resize on the container (ResizeObserver) or window, with optional debouncing.
 *
 * The callback receives scale factors relative to the size at the time `watchResize` was called,
 * plus the current absolute size. Returns the initial size snapshot.
 */
export function watchResize(
  callback: (scaleX: number, scaleY: number, current: { w: number; h: number }) => void,
  options: WatchResizeOptions = {},
): { w: number; h: number } {
  const { container, debounceMs = 200, cleanups } = options;
  const skipSmall = options.skipSmallChanges ?? (debounceMs > 0);
  const initial = getViewportSize(container);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const fire = () => {
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
    cleanups?.push(() => { ro.disconnect(); teardown(); });
  } else {
    window.addEventListener('resize', handler);
    cleanups?.push(() => { window.removeEventListener('resize', handler); teardown(); });
  }

  return initial;
}
