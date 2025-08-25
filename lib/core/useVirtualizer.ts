import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties
} from "react";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { useStableCallback } from "../hooks/useStableCallback";
import type { Align } from "../types";
import { getEstimatedHeight as getEstimatedHeightUtil } from "./getEstimatedHeight";
import { getOffsetForIndex } from "./getOffsetForIndex";
import { getStartStopIndices as getStartStopIndicesUtil } from "./getStartStopIndices";
import type { Direction, SizeFunction } from "./types";
import { useCachedBounds } from "./useCachedBounds";

export function useVirtualizer<Props extends object>({
  containerElement,
  containerStyle,
  defaultContainerSize = 0,
  direction,
  itemCount,
  itemProps,
  itemSize,
  onResize,
  overscanCount
}: {
  containerElement: HTMLElement | null;
  containerStyle?: CSSProperties;
  defaultContainerSize?: number;
  direction: Direction;
  itemCount: number;
  itemProps: Props;
  itemSize: SizeFunction<Props> | number;
  onResize:
    | ((
        size: { height: number; width: number },
        prevSize: { height: number; width: number }
      ) => void)
    | undefined;
  overscanCount: number;
}) {
  const [indices, setIndices] = useState([0, -1]);

  // Guard against temporarily invalid indices that may occur when item count decreases
  // Cached bounds object will be re-created and a second render will restore things
  const [startIndex, stopIndex] = [
    Math.min(itemCount - 1, indices[0]),
    Math.min(itemCount - 1, indices[1])
  ];

  const { height = defaultContainerSize, width = defaultContainerSize } =
    useResizeObserver({
      defaultHeight:
        direction === "vertical" ? defaultContainerSize : undefined,
      defaultWidth:
        direction === "horizontal" ? defaultContainerSize : undefined,
      element: containerElement,
      mode: direction === "vertical" ? "only-height" : "only-width",
      style: containerStyle
    });

  const prevSizeRef = useRef<{ height: number; width: number }>({
    height: 0,
    width: 0
  });

  useLayoutEffect(() => {
    if (typeof onResize === "function") {
      const prevSize = prevSizeRef.current;

      if (prevSize.height !== height || prevSize.width !== width) {
        onResize({ height, width }, { ...prevSize });

        prevSize.height = height;
        prevSize.width = width;
      }
    }
  }, [height, onResize, width]);

  const containerSize = direction === "vertical" ? height : width;

  const cachedBounds = useCachedBounds({
    itemCount,
    itemProps,
    itemSize
  });

  const getCellBounds = useCallback(
    (index: number) => cachedBounds.get(index),
    [cachedBounds]
  );

  const getEstimatedHeight = useCallback(
    () =>
      getEstimatedHeightUtil({
        cachedBounds,
        itemCount,
        itemSize
      }),
    [cachedBounds, itemCount, itemSize]
  );

  const getStartStopIndices = useCallback(
    (containerScrollOffset: number) =>
      getStartStopIndicesUtil({
        cachedBounds,
        containerScrollOffset,
        containerSize,
        itemCount,
        overscanCount
      }),
    [cachedBounds, containerSize, itemCount, overscanCount]
  );

  useIsomorphicLayoutEffect(() => {
    const scrollOffset =
      (direction === "vertical"
        ? containerElement?.scrollTop
        : containerElement?.scrollLeft) ?? 0;
    setIndices(getStartStopIndices(scrollOffset));
  }, [containerElement, direction, getStartStopIndices]);

  const scrollToIndex = useStableCallback(
    ({
      align = "auto",
      behavior = "auto",
      containerScrollOffset,
      index
    }: {
      align?: Align;
      behavior?: ScrollBehavior;
      containerScrollOffset: number;
      index: number;
    }) => {
      const scrollOffset = getOffsetForIndex({
        align,
        cachedBounds,
        containerScrollOffset,
        containerSize,
        index,
        itemCount
      });

      if (direction === "horizontal") {
        containerElement?.scrollTo({
          left: scrollOffset,
          behavior: behavior || undefined
        });
      } else {
        containerElement?.scrollTo({
          behavior: behavior || undefined,
          top: scrollOffset
        });
      }
    }
  );

  return {
    getCellBounds,
    getEstimatedHeight,
    onScroll: () => {
      const next = getStartStopIndices(
        (direction === "vertical"
          ? containerElement?.scrollTop
          : containerElement?.scrollLeft) ?? 0
      );

      if (next[0] !== startIndex || next[1] !== stopIndex) {
        setIndices(next);
      }
    },
    scrollToIndex,
    startIndex,
    stopIndex
  };
}
