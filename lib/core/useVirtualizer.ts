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
import { adjustScrollOffsetForRtl } from "../utils/adjustScrollOffsetForRtl";
import { getEstimatedSize as getEstimatedSizeUtil } from "./getEstimatedSize";
import { getOffsetForIndex } from "./getOffsetForIndex";
import { getStartStopIndices as getStartStopIndicesUtil } from "./getStartStopIndices";
import type { Direction, SizeFunction } from "./types";
import { useCachedBounds } from "./useCachedBounds";
import { useItemSize } from "./useItemSize";

export function useVirtualizer<Props extends object>({
  containerElement,
  containerStyle,
  defaultContainerSize = 0,
  direction,
  isRtl = false,
  itemCount,
  itemProps,
  itemSize: itemSizeProp,
  onResize,
  overscanCount
}: {
  containerElement: HTMLElement | null;
  containerStyle?: CSSProperties;
  defaultContainerSize?: number;
  direction: Direction;
  isRtl?: boolean;
  itemCount: number;
  itemProps: Props;
  itemSize: number | string | SizeFunction<Props>;
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

  const containerSize = direction === "vertical" ? height : width;

  const itemSize = useItemSize({ containerSize, itemSize: itemSizeProp });

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

  const cachedBounds = useCachedBounds({
    itemCount,
    itemProps,
    itemSize
  });

  const getCellBounds = useCallback(
    (index: number) => cachedBounds.get(index),
    [cachedBounds]
  );

  const getEstimatedSize = useCallback(
    () =>
      getEstimatedSizeUtil({
        cachedBounds,
        itemCount,
        itemSize
      }),
    [cachedBounds, itemCount, itemSize]
  );

  const getStartStopIndices = useCallback(
    (scrollOffset: number) => {
      const containerScrollOffset = adjustScrollOffsetForRtl({
        containerElement,
        direction,
        isRtl,
        scrollOffset
      });

      return getStartStopIndicesUtil({
        cachedBounds,
        containerScrollOffset,
        containerSize,
        itemCount,
        overscanCount
      });
    },
    [
      cachedBounds,
      containerElement,
      containerSize,
      direction,
      isRtl,
      itemCount,
      overscanCount
    ]
  );

  useIsomorphicLayoutEffect(() => {
    const scrollOffset =
      (direction === "vertical"
        ? containerElement?.scrollTop
        : containerElement?.scrollLeft) ?? 0;

    setIndices(getStartStopIndices(scrollOffset));
  }, [containerElement, direction, getStartStopIndices]);

  useIsomorphicLayoutEffect(() => {
    if (!containerElement) {
      return;
    }

    const onScroll = () => {
      setIndices((prev) => {
        const { scrollLeft, scrollTop } = containerElement;

        const scrollOffset = adjustScrollOffsetForRtl({
          containerElement,
          direction,
          isRtl,
          scrollOffset: direction === "vertical" ? scrollTop : scrollLeft
        });

        const next = getStartStopIndicesUtil({
          cachedBounds,
          containerScrollOffset: scrollOffset,
          containerSize,
          itemCount,
          overscanCount
        });

        if (next[0] === prev[0] && next[1] === prev[1]) {
          return prev;
        }

        return next;
      });
    };

    containerElement.addEventListener("scroll", onScroll);

    return () => {
      containerElement.removeEventListener("scroll", onScroll);
    };
  }, [
    cachedBounds,
    containerElement,
    containerSize,
    direction,
    itemCount,
    overscanCount
  ]);

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
      let scrollOffset = getOffsetForIndex({
        align,
        cachedBounds,
        containerScrollOffset,
        containerSize,
        index,
        itemCount,
        itemSize
      });

      if (containerElement) {
        scrollOffset = adjustScrollOffsetForRtl({
          containerElement,
          direction,
          isRtl,
          scrollOffset
        });

        if (typeof containerElement.scrollTo === "function") {
          if (direction === "horizontal") {
            containerElement.scrollTo({
              left: scrollOffset,
              behavior: behavior || undefined
            });
          } else {
            containerElement.scrollTo({
              behavior: behavior || undefined,
              top: scrollOffset
            });
          }
        } else {
          // Special case for environments like jsdom that don't implement scrollTo
          const next = getStartStopIndices(scrollOffset);
          if (next[0] !== startIndex || next[1] !== stopIndex) {
            setIndices(next);
          }
        }
      }
    }
  );

  return {
    getCellBounds,
    getEstimatedSize,
    scrollToIndex,
    startIndex,
    stopIndex
  };
}
