import { assert } from "../utils/assert";
import type { Bounds, CachedBounds, SizeFunction } from "./types";

export function createCachedBounds<Props extends object>({
  itemCount,
  itemProps,
  itemSize
}: {
  itemCount: number;
  itemProps: Props;
  itemSize: number | SizeFunction<Props>;
}): CachedBounds {
  const cache = new Map<number, Bounds>();

  return {
    get(index: number) {
      assert(index < itemCount, `Invalid index ${index}`);

      while (cache.size - 1 < index) {
        const currentIndex = cache.size;

        let size: number;
        switch (typeof itemSize) {
          case "function": {
            size = itemSize(currentIndex, itemProps);
            break;
          }
          case "number": {
            size = itemSize;
            break;
          }
        }

        if (currentIndex === 0) {
          cache.set(currentIndex, {
            size,
            scrollOffset: 0
          });
        } else {
          const previousRowBounds = cache.get(currentIndex - 1);
          assert(
            previousRowBounds !== undefined,
            `Unexpected bounds cache miss for index ${index}`
          );

          cache.set(currentIndex, {
            scrollOffset:
              previousRowBounds.scrollOffset + previousRowBounds.size,
            size
          });
        }
      }

      const bounds = cache.get(index);
      assert(
        bounds !== undefined,
        `Unexpected bounds cache miss for index ${index}`
      );

      return bounds;
    },
    set(index: number, bounds: Bounds) {
      cache.set(index, bounds);
    },
    get size() {
      return cache.size;
    }
  };
}
