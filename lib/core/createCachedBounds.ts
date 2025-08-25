import { assert } from "../utils/assert";
import type { Bounds, CachedBounds, SizeFunction } from "./types";

export function createCachedBounds<Props extends object>({
  estimatedItemSize,
  itemCount,
  itemProps,
  itemSize
}: {
  estimatedItemSize: number;
  itemCount: number;
  itemProps: Props;
  itemSize: number | SizeFunction<Props> | undefined;
}): CachedBounds {
  const cache = new Map<number, Bounds>();

  const api = {
    get averageSize() {
      const lastBounds = cache.get(cache.size - 1);
      if (lastBounds) {
        return (lastBounds.scrollOffset + lastBounds.size) / cache.size;
      } else {
        return estimatedItemSize;
      }
    },
    get(index: number) {
      assert(index < itemCount, `Invalid index ${index}`);

      if (itemSize) {
        while (cache.size - 1 < index) {
          const currentIndex = cache.size;

          if (itemSize !== undefined) {
            const size =
              typeof itemSize === "number"
                ? itemSize
                : itemSize(currentIndex, itemProps);

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
        }

        const bounds = cache.get(index);
        assert(bounds, `Unexpected cache miss for index ${index}`);

        return bounds;
      } else {
        return cache.get(index);
      }
    },
    has(index: number) {
      return cache.has(index);
    },
    get length() {
      return cache.size;
    },
    set(index: number, size: number) {
      // Note this function assumes items are measured in sequence;
      // I think that's a safe assumption but if it turns out not to be we'll need to rethink things
      let scrollOffset = 0;
      if (index > 0) {
        if (cache.size >= index) {
          const bounds = cache.get(index - 1);
          assert(bounds, `Unexpected cache miss at index ${index - 1}`);

          scrollOffset = bounds.scrollOffset + bounds.size;
        } else {
          const lastBounds = cache.get(cache.size - 1);
          assert(
            lastBounds,
            `Unexpected cache miss at index ${cache.size - 1}`
          );

          const numEstimated = index - cache.size;
          scrollOffset =
            lastBounds.scrollOffset +
            lastBounds.size +
            api.averageSize * numEstimated;
        }
      }

      cache.set(index, { scrollOffset, size });

      // Adjust offset for items afterward in the cache
      while (index < cache.size) {
        const bounds = cache.get(index);
        assert(bounds, `Unexpected cache miss at index ${index}`);

        bounds.scrollOffset = scrollOffset;

        scrollOffset += bounds.size;

        index++;
      }
    },
    toString() {
      return JSON.stringify(Array.from(cache.entries()), null, 2);
    }
  };

  return api;
}
