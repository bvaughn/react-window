import { useMemo, useState, type CSSProperties } from "react";
import { parseNumericStyleValue } from "../utils/parseNumericStyleValue";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useResizeObserver({
  box,
  defaultHeight,
  defaultWidth,
  disabled: disabledProp,
  element,
  mode,
  style
}: {
  box?: ResizeObserverBoxOptions;
  defaultHeight?: number;
  defaultWidth?: number;
  disabled?: boolean;
  element: HTMLElement | null;
  mode?: "only-height" | "only-width";
  style: CSSProperties | undefined;
}) {
  const { styleHeight, styleWidth } = useMemo(
    () => ({
      styleHeight: parseNumericStyleValue(style?.height),
      styleWidth: parseNumericStyleValue(style?.width)
    }),
    [style?.height, style?.width]
  );

  const [state, setState] = useState<{
    height: number | undefined;
    width: number | undefined;
  }>({
    height: defaultHeight,
    width: defaultWidth
  });

  const disabled =
    disabledProp ||
    (mode === "only-height" && styleHeight !== undefined) ||
    (mode === "only-width" && styleWidth !== undefined) ||
    (styleHeight !== undefined && styleWidth !== undefined);

  useIsomorphicLayoutEffect(() => {
    if (element === null || disabled) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { contentRect, target } = entry;
        if (element === target) {
          setState((prevState) => {
            if (
              prevState.height === contentRect.height &&
              prevState.width === contentRect.width
            ) {
              return prevState;
            }

            return {
              height: contentRect.height,
              width: contentRect.width
            };
          });
        }
      }
    });
    resizeObserver.observe(element, { box });

    return () => {
      resizeObserver?.unobserve(element);
    };
  }, [box, disabled, element, styleHeight, styleWidth]);

  return useMemo(
    () => ({
      height: styleHeight ?? state.height,
      width: styleWidth ?? state.width
    }),
    [state, styleHeight, styleWidth]
  );
}
