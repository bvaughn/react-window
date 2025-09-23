import type { CachedBounds, SizeFunction } from "./types";
import { assert } from "../utils/assert";

export function getEstimatedSize<Props extends object>({
  cachedBounds,
  itemCount,
  itemSize
}: {
  cachedBounds: CachedBounds;
  itemCount: number;
  itemSize: number | SizeFunction<Props> | undefined;
}) {
  if (itemCount === 0) {
    return 0;
  } else {
    switch (typeof itemSize) {
      case "function": {
        const bounds = cachedBounds.getItemBounds(
          cachedBounds.size === 0 ? 0 : cachedBounds.size - 1
        );
        assert(bounds !== undefined, "Unexpected bounds cache miss");

        const averageItemSize =
          (bounds.scrollOffset + bounds.size) / cachedBounds.size;

        return itemCount * averageItemSize;
      }
      case "number": {
        return itemCount * itemSize;
      }
      default: {
        const estimatedSize = cachedBounds.getEstimatedSize();
        if (estimatedSize !== undefined) {
          return estimatedSize * itemCount;
        }
      }
    }
  }
}
