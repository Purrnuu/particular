export function abortError(): Error {
  const error = new Error('Particular: this instance has been destroyed.');
  error.name = 'AbortError';
  return error;
}

/** Owns resources for one engine. Returned disposers also unregister themselves. */
export class ResourceScope {
  private cleanups = new Set<() => void>();
  private controller = new AbortController();

  get signal(): AbortSignal {
    return this.controller.signal;
  }

  get disposed(): boolean {
    return this.signal.aborted;
  }

  assertActive(): void {
    if (this.disposed) throw abortError();
  }

  add(cleanup: () => void): () => void {
    let active = true;
    const dispose = () => {
      if (!active) return;
      active = false;
      this.cleanups.delete(dispose);
      cleanup();
    };
    if (this.disposed) dispose();
    else this.cleanups.add(dispose);
    return dispose;
  }

  timeout(callback: () => void, delay: number): () => void {
    this.assertActive();
    const timer = setTimeout(() => {
      dispose();
      if (!this.disposed) callback();
    }, delay);
    const dispose = this.add(() => clearTimeout(timer));
    return dispose;
  }

  waitFor<T>(promise: Promise<T>): Promise<T> {
    if (this.disposed) {
      // Consume an eventual rejection even when cancellation wins immediately.
      void promise.catch(() => {});
      return Promise.reject(abortError());
    }
    return new Promise((resolve, reject) => {
      const onAbort = () => reject(abortError());
      this.signal.addEventListener('abort', onAbort, { once: true });
      promise.then(
        (value) => {
          this.signal.removeEventListener('abort', onAbort);
          if (this.disposed) reject(abortError());
          else resolve(value);
        },
        (error: unknown) => {
          this.signal.removeEventListener('abort', onAbort);
          reject(error);
        }
      );
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.controller.abort();
    let failed = false;
    let firstError: unknown;
    for (const cleanup of Array.from(this.cleanups).reverse()) {
      try {
        cleanup();
      } catch (error) {
        if (!failed) firstError = error;
        failed = true;
      }
    }
    this.cleanups.clear();
    if (failed) throw firstError;
  }
}
