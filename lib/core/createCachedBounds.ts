import { assert } from "../utils/assert";
import type { Bounds, CachedBounds, SizeFunction } from "./types";

export function createCachedBounds<Props extends object>({
  itemCount,
  itemProps,
  itemSize
}: {
  itemCount: number;
  itemProps: Props;
  itemSize: number | SizeFunction<Props> | undefined;
}): CachedBounds {
  const cache = new Map<number, Bounds>();

  const api = {
    getEstimatedSize() {
      const lastBounds = cache.get(cache.size - 1);
      if (lastBounds) {
        return (lastBounds.scrollOffset + lastBounds.size) / cache.size;
      }
    },
    getItemBounds(index: number) {
      assert(index < itemCount, `Invalid index ${index}`);

      if (itemSize) {
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
      } else {
        return cache.get(index);
      }
    },
    hasItemBounds(index: number) {
      return cache.has(index);
    },
    setItemSize(index: number, size: number) {
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

          const estimatedSize = api.getEstimatedSize();
          assert(
            estimatedSize !== undefined,
            "Expected at least one measurement"
          );

          const numEstimated = index - cache.size;
          scrollOffset =
            lastBounds.scrollOffset +
            lastBounds.size +
            estimatedSize * numEstimated;
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
    get size() {
      return cache.size;
    }
  };

  return api;
}
