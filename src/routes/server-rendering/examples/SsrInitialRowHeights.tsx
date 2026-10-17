// <begin>

import { useDynamicRowHeight } from "react-window";

function useRowHeight(cachedRowHeights: number[] | undefined) {
  return useDynamicRowHeight({
    defaultRowHeight: 50,
    initialRowHeights: cachedRowHeights
  });
}

// <end>

export { useRowHeight };
