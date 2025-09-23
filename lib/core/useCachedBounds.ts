import { useMemo } from "react";
import { createCachedBounds } from "./createCachedBounds";
import type { CachedBounds, SizeFunction } from "./types";

export function useCachedBounds<Props extends object>({
  itemCount,
  itemProps,
  itemSize
}: {
  itemCount: number;
  itemProps: Props;
  itemSize: number | SizeFunction<Props> | undefined;
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
