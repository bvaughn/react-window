import { assert } from "../../../utils/assert";
import type { CachedBounds } from "../types";
import type { RowHeight } from "./VariableList";

export function getCachedRowBounds<RowProps extends object>({
  cachedBounds,
  index,
  rowHeight,
  rowProps,
}: {
  cachedBounds: CachedBounds;
  index: number;
  rowHeight: RowHeight<RowProps>;
  rowProps: RowProps;
}) {
  while (cachedBounds.size - 1 < index) {
    const currentIndex = cachedBounds.size;
    const height = rowHeight(currentIndex, rowProps);
    if (currentIndex === 0) {
      cachedBounds.set(currentIndex, {
        height,
        scrollTop: 0,
      });
    } else {
      const previousRowBounds = cachedBounds.get(currentIndex - 1);
      assert(
        previousRowBounds !== undefined,
        `Unexpected bounds cache miss for index ${index}`,
      );

      cachedBounds.set(currentIndex, {
        height,
        scrollTop: previousRowBounds.scrollTop + previousRowBounds.height,
      });
    }
  }

  const bounds = cachedBounds.get(index);
  assert(
    bounds !== undefined,
    `Unexpected bounds cache miss for index ${index}`,
  );

  return bounds;
}
