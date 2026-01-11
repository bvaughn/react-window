"use client";

import { useLayoutEffect, useRef } from "react";

export function AnimationFrameRowCellCounter() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element) {
      const id = requestAnimationFrame(() => {
        const cellCount =
          document.body.querySelectorAll('[role="gridcell"]').length;
        const rowCount =
          document.body.querySelectorAll('[role="listitem"]').length;
        element.textContent = `${cellCount + rowCount}`;
      });

      return () => {
        cancelAnimationFrame(id);
      };
    }
  }, []);

  return (
    <div className="flex flex-row gap-1 text-xs text-green-400">
      Rows/cells on mount: <div ref={ref} />
    </div>
  );
}
