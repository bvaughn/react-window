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

  useIsomorphicLayoutEffect(() => {
    if (element === null || disabled) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { contentRect, target } = entry;
        if (element === target) {
          setSize((prevSize) => {
            if (
              prevSize.height === contentRect.height &&
              prevSize.width === contentRect.width
            ) {
              return prevSize;
            }

            return {
              height: contentRect.height,
              width: contentRect.width,
            };
          });
        }
      }
    });
    resizeObserver.observe(element, { box });

    return () => {
      resizeObserver?.unobserve(element);
    };
  }, [box, disabled, element]);

  return size;
}
