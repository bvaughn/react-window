import type { CachedBounds, SizeFunction } from "./types";
import { assert } from "../utils/assert";

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
  } else if (typeof itemSize === "number") {
    return itemCount * itemSize;
  } else {
    const bounds = cachedBounds.get(
      cachedBounds.size === 0 ? 0 : cachedBounds.size - 1
    );
    assert(bounds !== undefined, "Unexpected bounds cache miss");

    const averageItemSize =
      (bounds.scrollOffset + bounds.size) / cachedBounds.size;

    return itemCount * averageItemSize;
  }
}
