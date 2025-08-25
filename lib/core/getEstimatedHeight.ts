import type { CachedBounds, SizeFunction } from "./types";

export function getEstimatedHeight<Props extends object>({
  cachedBounds,
  estimatedItemSize,
  itemCount,
  itemSize
}: {
  cachedBounds: CachedBounds;
  estimatedItemSize: number;
  itemCount: number;
  itemSize: number | SizeFunction<Props> | undefined;
}) {
  if (typeof itemSize === "number") {
    return itemCount * itemSize;
  } else if (cachedBounds.length > 0) {
    return itemCount * cachedBounds.averageSize;
  } else {
    return itemCount * estimatedItemSize;
  }
}
