import { useMemo } from "react";
import { createCachedBounds } from "../core/createCachedBounds";
import type { CachedBounds, SizeFunction } from "../core/types";

export function useCachedBounds<Props extends object>({
  itemCount,
  itemProps,
  itemSize
}: {
  itemCount: number;
  itemProps: Props;
  itemSize: number | SizeFunction<Props>;
}): CachedBounds {
  return useMemo(
    () =>
      createCachedBounds({
        itemCount,
        itemProps,
        itemSize
      }),
    [itemCount, itemProps, itemSize]
  );
}
