// <begin>

import { useState } from "react";
import { useDynamicRowHeight } from "react-window";

const LINE_HEIGHT = 20;
const PADDING = 10;

function useRowHeight(messages: string[]) {
  // Only read when the hook first mounts, so there's no need to recompute it
  const [initialRowHeights] = useState(() =>
    messages.map(
      (message) => message.split("\n").length * LINE_HEIGHT + PADDING
    )
  );

  return useDynamicRowHeight({
    defaultRowHeight: 50,
    initialRowHeights
  });
}

// <end>

export { useRowHeight };
