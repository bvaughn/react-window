"use client";

import { useLayoutEffect, useRef } from "react";

export function AnimationFrameRowCounter() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element) {
      const id = requestAnimationFrame(() => {
        element.textContent =
          "" +
          document.body.querySelectorAll("[data-react-window-index]").length;
      });

      return () => {
        cancelAnimationFrame(id);
      };
    }
  }, []);

  return (
    <div className="flex flex-row gap-1 text-xs text-green-400">
      Row count on mount: <div ref={ref} />
    </div>
  );
}
