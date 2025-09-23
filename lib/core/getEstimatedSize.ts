import type { CachedBounds, SizeFunction } from "./types";

export function getEstimatedSize<Props extends object>({
  cachedBounds,
  itemCount,
  itemSize
}: {
  cachedBounds: CachedBounds;
  itemCount: number;
  itemSize: number | SizeFunction<Props>;
}) {
  if (itemCount === 0) {
    return 0;
  } else {
    switch (typeof itemSize) {
      case "function": {
        const bounds = cachedBounds.getItemBounds(
          cachedBounds.size === 0 ? 0 : cachedBounds.size - 1
        );

        const averageItemSize =
          (bounds.scrollOffset + bounds.size) / cachedBounds.size;

        return itemCount * averageItemSize;
      }
      case "number": {
        return itemCount * itemSize;
      }
    }
  }
}
