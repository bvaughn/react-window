import { useMemo } from "react";
import { createCachedBounds } from "./createCachedBounds";
import type { CachedBounds, SizeFunction } from "./types";

export function useCachedBounds<Props extends object>({
  estimatedItemSize,
  itemCount,
  itemProps,
  itemSize
}: {
  estimatedItemSize: number;
  itemCount: number;
  itemProps: Props;
  itemSize: number | SizeFunction<Props> | undefined;
}): CachedBounds {
  return useMemo(
    () =>
      createCachedBounds({
        estimatedItemSize,
        itemCount,
        itemProps,
        itemSize
      }),
    [estimatedItemSize, itemCount, itemProps, itemSize]
  );
}
