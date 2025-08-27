import { assert } from "../utils/assert";
import type { SizeFunction } from "./types";

export function useItemSize<Props extends object>({
  containerSize,
  itemSize: itemSizeProp
}: {
  containerSize: number;
  itemSize: number | string | SizeFunction<Props>;
}) {
  let itemSize: number | SizeFunction<Props>;
  switch (typeof itemSizeProp) {
    case "string": {
      assert(
        itemSizeProp.endsWith("%"),
        `Invalid item size: "${itemSizeProp}"; string values must be percentages (e.g. "100%")`
      );
      assert(
        containerSize !== undefined,
        "Container size must be defined if a percentage item size is specified"
      );

      itemSize = (containerSize * parseInt(itemSizeProp)) / 100;
      break;
    }
    default: {
      itemSize = itemSizeProp;
      break;
    }
  }

  return itemSize;
}
