interface Destroyable {
  destroy: (param?: unknown) => void;
}

export function destroy<T extends Destroyable>(array: T[], param?: unknown): void {
  let i = array.length;

  while (i--) {
    try {
      array[i]?.destroy(param);
    } catch (e) {
      // Silently catch errors during destruction
    }
  }

  array.splice(0, array.length);
}
