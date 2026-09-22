import type { CachedBounds } from "./types";

export function getStartStopIndices({
  cachedBounds,
  containerScrollOffset,
  containerSize,
  itemCount,
  overscanCount
}: {
  cachedBounds: CachedBounds;
  containerScrollOffset: number;
  containerSize: number;
  itemCount: number;
  overscanCount: number;
}): {
  startIndexVisible: number;
  stopIndexVisible: number;
  startIndexOverscan: number;
  stopIndexOverscan: number;
} {
  const maxIndex = itemCount - 1;

  if (itemCount === 0) {
    return {
      startIndexVisible: 0,
      stopIndexVisible: -1,
      startIndexOverscan: 0,
      stopIndexOverscan: -1
    };
  }

  let startIndexVisible: number;
  let stopIndexVisible: number;
  const { itemSize } = cachedBounds;

  if (itemSize !== undefined && itemSize > 0) {
    startIndexVisible = Math.max(
      0,
      Math.min(maxIndex, Math.floor(containerScrollOffset / itemSize))
    );
    stopIndexVisible = Math.max(
      startIndexVisible,
      Math.min(
        maxIndex,
        Math.ceil((containerScrollOffset + containerSize) / itemSize) - 1
      )
    );
  } else {
    // Binary search the measured prefix
    let low = 0;
    let high = Math.min(maxIndex, Math.max(0, cachedBounds.size - 1));

    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      const bounds = cachedBounds.get(middle);
      if (bounds.scrollOffset + bounds.size > containerScrollOffset) {
        high = middle;
      } else {
        low = middle + 1;
      }
    }

    // Extend sequentially beyond the measured prefix to avoid evaluating item sizes past the viewport
    while (low < maxIndex) {
      const bounds = cachedBounds.get(low);
      if (bounds.scrollOffset + bounds.size > containerScrollOffset) break;
      low++;
    }

    startIndexVisible = low;
    stopIndexVisible = low;
    while (stopIndexVisible < maxIndex) {
      const bounds = cachedBounds.get(stopIndexVisible);
      if (
        bounds.scrollOffset + bounds.size >=
        containerScrollOffset + containerSize
      )
        break;
      stopIndexVisible++;
    }
  }

  return {
    startIndexVisible,
    stopIndexVisible,
    startIndexOverscan: Math.max(0, startIndexVisible - overscanCount),
    stopIndexOverscan: Math.min(maxIndex, stopIndexVisible + overscanCount)
  };
}
