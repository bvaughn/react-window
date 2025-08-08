import { useState } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useResizeObserver({
  box,
  defaultHeight,
  defaultWidth,
  disabled,
  element,
}: {
  box?: ResizeObserverBoxOptions;
  defaultHeight?: number;
  defaultWidth?: number;
  disabled?: boolean;
  element: HTMLElement | null;
}) {
  const [size, setSize] = useState<{
    height: number | undefined;
    width: number | undefined;
  }>({
    height: defaultHeight,
    width: defaultWidth,
  });

  // Stable ResizeObserver even if element or box option change
  const [resizeObserver] = useState(
    () =>
      new ResizeObserver((entries) => {
        console.log("on ResizeObserver:", entries[0]?.contentRect);
        for (const entry of entries) {
          setSize(entry.contentRect);
        }
      }),
  );

  useIsomorphicLayoutEffect(() => {
    if (element === null || disabled) {
      return;
    }

    resizeObserver.observe(element, { box });

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [box, disabled, element, resizeObserver]);

  return size;
}
