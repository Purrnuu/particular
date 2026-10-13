import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResourceScope } from '../src/particular/core/resourceScope';

afterEach(() => vi.useRealTimers());

describe('ResourceScope', () => {
  it('unregisters manual disposers and disposes once in reverse order', () => {
    const scope = new ResourceScope();
    const order: number[] = [];
    const first = scope.add(() => order.push(1));
    scope.add(() => order.push(2));
    first();
    first();
    scope.dispose();
    scope.dispose();
    expect(order).toEqual([1, 2]);
    expect(scope.signal.aborted).toBe(true);
  });

  it('finishes cleanup even when one disposer throws', () => {
    const scope = new ResourceScope();
    const cleanup = vi.fn();
    scope.add(cleanup);
    scope.add(() => {
      throw new Error('cleanup failed');
    });
    expect(() => scope.dispose()).toThrow('cleanup failed');
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it('cancels scheduled work and rejects pending asynchronous work', async () => {
    vi.useFakeTimers();
    const scope = new ResourceScope();
    const callback = vi.fn();
    scope.timeout(callback, 50);
    const pending = scope.waitFor(new Promise(() => {}));
    const rejection = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    scope.dispose();
    vi.runAllTimers();
    await rejection;
    expect(callback).not.toHaveBeenCalled();
    expect(() => scope.assertActive()).toThrow();
  });

  it('releases completed timer work before teardown', () => {
    vi.useFakeTimers();
    const scope = new ResourceScope();
    const callback = vi.fn();
    scope.timeout(callback, 50);
    vi.advanceTimersByTime(50);
    scope.dispose();
    expect(callback).toHaveBeenCalledOnce();
  });
});
