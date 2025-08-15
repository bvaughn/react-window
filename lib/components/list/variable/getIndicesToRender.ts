import type { CachedBounds } from "../types";
import { getCachedRowBounds } from "./getCachedRowBounds";
import type { RowHeight } from "./VariableList";

export function getIndicesToRender<RowProps extends object>({
  cachedBounds,
  height,
  rowCount,
  rowHeight,
  rowProps,
  scrollTop,
}: {
  cachedBounds: CachedBounds;
  height: number;
  rowCount: number;
  rowHeight: RowHeight<RowProps>;
  rowProps: RowProps;
  scrollTop: number;
}) {
  const maxIndex = rowCount - 1;

  let startIndex = 0;
  let stopIndex = 0;
  let currentIndex = 0;

  while (currentIndex < maxIndex) {
    const bounds = getCachedRowBounds({
      cachedBounds,
      index: currentIndex,
      rowHeight,
      rowProps,
    });

    if (bounds.scrollTop + bounds.height > scrollTop) {
      break;
    }

    currentIndex++;
  }

  startIndex = currentIndex;

  while (currentIndex < maxIndex) {
    const bounds = getCachedRowBounds({
      cachedBounds,
      index: currentIndex,
      rowHeight,
      rowProps,
    });

    if (bounds.scrollTop + bounds.height >= scrollTop + height) {
      break;
    }

    currentIndex++;
  }

  stopIndex = Math.min(maxIndex, currentIndex);

  return [startIndex, stopIndex];
}
