import type { CachedBounds, SizeFunction } from "./types";
import { assert } from "../utils/assert";

export function getEstimatedHeight<Props extends object>({
  cachedBounds,
  itemCount,
  itemSize
}: {
  cachedBounds: CachedBounds;
  itemCount: number;
  itemSize: number | SizeFunction<Props>;
}) {
  if (typeof itemSize === "number") {
    return itemCount * itemSize;
  } else if (cachedBounds.size > 0) {
    const bounds = cachedBounds.get(cachedBounds.size - 1);
    assert(bounds !== undefined, "Unexpected bounds cache miss");

    const averageItemSize =
      (bounds.scrollOffset + bounds.size) / cachedBounds.size;

    return itemCount * averageItemSize;
  } else {
    return 0;
  }
}
