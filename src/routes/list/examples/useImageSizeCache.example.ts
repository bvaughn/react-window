import { useCallback, useMemo, useState } from "react";

// <begin>

type Size = {
  height: number;
  width: number;
};

type Cache = {
  getAverageSize(): Size;
  getImageSize(index: number): Size | undefined;
  setImageSize(index: number, size: Size): void;
};

function useImageSizeCache(): Cache {
  const [cachedRowHeights, setCachedRowHeights] = useState<Map<number, Size>>(
    new Map()
  );

  const getAverageSize = useCallback(() => {
    let totalHeight = 0;
    let totalWidth = 0;

    cachedRowHeights.forEach((size) => {
      totalHeight += size.height;
      totalWidth += size.width;
    });

    if (totalHeight === 0) {
      return {
        height: 1,
        width: 1
      };
    }

    return {
      height: totalHeight / cachedRowHeights.size,
      width: totalWidth / cachedRowHeights.size
    };
  }, [cachedRowHeights]);

  const getImageSize = useCallback(
    (index: number) => cachedRowHeights.get(index),
    [cachedRowHeights]
  );

  const setImageSize = useCallback((index: number, size: Size) => {
    setCachedRowHeights((prevMap) => {
      const clonedMap = new Map(prevMap);
      clonedMap.set(index, size);
      return clonedMap;
    });
  }, []);

  return useMemo(
    () => ({
      getAverageSize,
      getImageSize,
      setImageSize
    }),
    [getAverageSize, getImageSize, setImageSize]
  );
}

// <end>

export { useImageSizeCache };
export type { Cache, Size };
