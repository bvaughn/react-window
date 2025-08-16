import { assert } from "../../../utils/assert";
import type { CachedBounds } from "../types";

export function getEstimatedHeight({
  cachedBounds,
  rowCount,
}: {
  cachedBounds: CachedBounds;
  rowCount: number;
}) {
  const bounds = cachedBounds.get(cachedBounds.size - 1);
  assert(bounds !== undefined, "Unexpected bounds cache miss");

  const averageRowHeight =
    (bounds.scrollTop + bounds.height) / cachedBounds.size;

  return rowCount * averageRowHeight;
}
