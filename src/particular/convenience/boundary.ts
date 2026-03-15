import Attractor from '../components/attractor';
import type Particular from '../core/particular';
import type { BoundaryConfig } from '../types';
import type { BoundaryHandle } from './types';

/**
 * Create the addBoundary() helper bound to an engine instance.
 *
 * Tiles repulsion attractors along an HTML element's perimeter, auto-syncing
 * on resize (via ResizeObserver) and scroll (via rAF-throttled scroll listener).
 */
export function createBoundaryHelper(
  engine: Particular,
  container: HTMLElement | undefined,
  cleanups: Array<() => void>,
) {
  const addBoundary = (config: BoundaryConfig): BoundaryHandle => {
    const {
      element,
      strength = -1.5,
      radius = 10,
      inset: insetFraction = 0.4,
    } = config;
    const pr = engine.pixelRatio;
    let attractors: Attractor[] = [];
    // Store offsets relative to element top-left (engine coords) for fast scroll reposition
    let offsets: { dx: number; dy: number }[] = [];

    /** Full rebuild: recompute tiling and create/destroy attractors. Called on resize. */
    const rebuild = () => {
      for (const a of attractors) engine.removeAttractor(a);
      attractors = [];
      offsets = [];

      const refRect = container
        ? container.getBoundingClientRect()
        : { left: 0, top: 0 };

      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      const elW = elRect.width / pr;
      const elH = elRect.height / pr;

      // Inset so the repulsion boundary aligns with the visible edge
      const ins = radius * insetFraction;
      const localL = ins;
      const localR = elW - ins;
      const localT = ins;
      const localB = elH - ins;
      const w = localR - localL;
      const h = localB - localT;
      if (w <= 0 || h <= 0) return;

      const stepsX = Math.max(2, Math.ceil(w / radius) + 1);
      const stepsY = Math.max(2, Math.ceil(h / radius) + 1);

      const add = (dx: number, dy: number) => {
        const a = new Attractor({ x: elLeft + dx, y: elTop + dy, strength, radius });
        engine.addAttractor(a);
        attractors.push(a);
        offsets.push({ dx, dy });
      };

      // Top and bottom edges
      for (let i = 0; i < stepsX; i++) {
        const x = localL + (w * i) / (stepsX - 1);
        add(x, localT);
        add(x, localB);
      }
      // Left and right edges (skip corners — already placed)
      for (let i = 1; i < stepsY - 1; i++) {
        const y = localT + (h * i) / (stepsY - 1);
        add(localL, y);
        add(localR, y);
      }
    };

    /** Lightweight reposition: move existing attractors without alloc. Called on scroll. */
    const reposition = () => {
      if (attractors.length === 0) return;
      const refRect = container
        ? container.getBoundingClientRect()
        : { left: 0, top: 0 };
      const elRect = element.getBoundingClientRect();
      const elLeft = (elRect.left - refRect.left) / pr;
      const elTop = (elRect.top - refRect.top) / pr;
      for (let i = 0; i < attractors.length; i++) {
        const a = attractors[i]!;
        const o = offsets[i]!;
        a.position.x = elLeft + o.dx;
        a.position.y = elTop + o.dy;
      }
    };

    // Initial build
    rebuild();

    // Auto-rebuild on element/container resize (tiling count may change)
    const ro = new ResizeObserver(rebuild);
    ro.observe(element);
    if (container) ro.observe(container);

    // rAF-throttled scroll reposition (just moves existing attractors — cheap)
    let scrollRafId = 0;
    const onScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        reposition();
      });
    };
    const scrollTarget = container ?? window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    const handle: BoundaryHandle = {
      update: rebuild,
      destroy: () => {
        ro.disconnect();
        scrollTarget.removeEventListener('scroll', onScroll);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        for (const a of attractors) engine.removeAttractor(a);
        attractors = [];
        offsets = [];
      },
    };

    cleanups.push(() => handle.destroy());
    return handle;
  };

  return { addBoundary };
}
