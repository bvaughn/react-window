"use client";

import { useLayoutEffect, useRef } from "react";

export function AnimationFrameRowCellCounter() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element) {
      const count = () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timeoutId);

        const cellCount =
          document.body.querySelectorAll('[role="gridcell"]').length;
        const rowCount =
          document.body.querySelectorAll('[role="listitem"]').length;
        element.textContent = `${cellCount + rowCount}`;
      };

      // WebKit on Linux (in CI) sometimes stops running animation frames,
      // so also count after a short timeout (whichever happens first)
      const animationFrameId = requestAnimationFrame(count);
      const timeoutId = setTimeout(count, 100);

      return () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return (
    <div className="flex flex-row gap-1 text-xs text-green-400">
      Rows/cells on mount: <div ref={ref} />
    </div>
  );
}
