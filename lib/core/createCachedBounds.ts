import { assert } from "../utils/assert";
import type { CachedBounds, SizeFunction } from "./types";

export function createCachedBounds<Props extends object>({
  itemCount,
  itemProps,
  itemSize
}: {
  itemCount: number;
  itemProps: Props;
  itemSize: number | SizeFunction<Props> | undefined;
}): CachedBounds {
  const cache = new Map<number, number>();

  let lastContiguousMeasuredIndex = -1;
  let totalSize = 0;

  const api = {
    getEstimatedSize() {
      return cache.size === 0 ? undefined : totalSize / cache.size;
    },
    getItemBounds(index: number) {
      assert(index < itemCount, `Invalid index ${index}`);

      let size: number | undefined = undefined;

      if (itemSize) {
        while (cache.size <= index) {
          const currentIndex = cache.size;

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

          lastContiguousMeasuredIndex = currentIndex;
          totalSize += size;

          cache.set(currentIndex, size);
        }

        size = cache.get(index);
      } else {
        size = cache.get(index);
      }

      if (size !== undefined) {
        const averageSize = api.getEstimatedSize() ?? 0;

        let scrollOffset = 0;

        while (index > 0) {
          index--;
          scrollOffset += cache.get(index) ?? averageSize;
        }

        return {
          scrollOffset,
          size
        };
      }
    },
    hasItemBounds(index: number) {
      return cache.has(index);
    },
    setItemSize(index: number, size: number) {
      const prevSize = cache.get(index);
      if (prevSize !== undefined) {
        totalSize -= prevSize;
      }

      totalSize += size;

      if (index === lastContiguousMeasuredIndex + 1) {
        lastContiguousMeasuredIndex = index;
      }

      cache.set(index, size);
    },
    get size() {
      return cache.size;
    }
  };

  return api;
}
