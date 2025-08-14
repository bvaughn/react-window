import { useState } from "react";
import type { RowHeight } from "./VariableList";
import type { CachedBounds } from "../types";

export function useCachedBounds<RowProps extends object>({
  rowHeight,
  rowProps,
}: {
  rowHeight: RowHeight<RowProps>;
  rowProps: RowProps;
}) {
  const [state, setState] = useState<{
    bounds: CachedBounds;
    prevRowHeight: RowHeight<RowProps>;
    prevRowProps: RowProps;
  }>({
    bounds: new Map(),
    prevRowHeight: rowHeight,
    prevRowProps: rowProps,
  });

  if (state.prevRowHeight !== rowHeight || state.prevRowProps !== rowProps) {
    // Invalidate cache when inputs change
    setState({
      bounds: new Map(),
      prevRowHeight: rowHeight,
      prevRowProps: rowProps,
    });
  }

  return state.bounds;
}
