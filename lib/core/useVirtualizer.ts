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
import { assert } from "../utils/assert";
import { getEstimatedHeight as getEstimatedHeightUtil } from "./getEstimatedHeight";
import { getOffsetForIndex } from "./getOffsetForIndex";
import { getStartStopIndices as getStartStopIndicesUtil } from "./getStartStopIndices";
import type { Direction, SizeFunction } from "./types";
import { useCachedBounds } from "./useCachedBounds";

const DATA_ATTRIBUTE = "data-react-window-index";

export function useVirtualizer<Props extends object>({
  containerElement,
  containerStyle,
  defaultContainerSize = 0,
  direction,
  estimatedItemSize = 25,
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
  estimatedItemSize?: number;
  itemCount: number;
  itemProps: Props;
  itemSize: SizeFunction<Props> | number | undefined;
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
    estimatedItemSize,
    itemCount,
    itemProps,
    itemSize
  });
  console.log(
    "useVirtualizer: [%o, %o]",
    startIndex,
    stopIndex,
    cachedBounds.toString()
  );

  const getEstimatedHeight = useCallback(
    () =>
      getEstimatedHeightUtil({
        cachedBounds,
        estimatedItemSize,
        itemCount,
        itemSize
      }),
    [cachedBounds, estimatedItemSize, itemCount, itemSize]
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

  const resizeObserverCallback = useStableCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries.length === 0) {
        return;
      }

      entries.forEach((entry) => {
        const { borderBoxSize, target } = entry;

        const attribute = target.getAttribute(DATA_ATTRIBUTE);
        assert(
          attribute !== null,
          "Invalidate data-react-window-index attribute"
        );

        const index = parseInt(attribute);

        const { inlineSize: width, blockSize: height } = borderBoxSize[0];
        const size = direction === "horizontal" ? width : height;
        console.log(
          "useVirtualizer: resizeObserverCallback: %o -> %o",
          index,
          size,
          cachedBounds.toString()
        );

        cachedBounds.set(index, size);

        // const bounds = cachedBounds.get(index);
        // if (bounds) {
        //   if (direction === "vertical") {
        //     (target as HTMLElement).style.transform =
        //       `translateY(${bounds.scrollOffset}px)`;
        //   } else {
        //     (target as HTMLElement).style.transform =
        //       `translateX(${bounds.scrollOffset}px)`;
        //   }
        // }
      });

      // Schedule an update with new bounds information
      const scrollOffset =
        direction === "vertical"
          ? containerElement?.scrollTop
          : containerElement?.scrollLeft;

      setIndices(getStartStopIndices(scrollOffset ?? 0));
    }
  );

  const [resizeObserver] = useState(() => {
    if (itemSize === undefined) {
      return new ResizeObserver(resizeObserverCallback);
    }
  });

  useLayoutEffect(() => {
    if (!containerElement || !resizeObserver) {
      return;
    }

    const innerElement = containerElement.children[0];

    console.group("useVirtualizer: useEffect:");
    const items = Array.from(innerElement.children);
    items.forEach((item, index) => {
      const attribute = `${startIndex + index}`;
      console.log("observe item:", attribute);
      item.setAttribute(DATA_ATTRIBUTE, attribute);

      resizeObserver.observe(item);
    });
    console.groupEnd();

    return () => {
      console.group("useVirtualizer: useEffect: cleanup");
      items.forEach((item) => {
        console.log("unobserve item:", item.getAttribute(DATA_ATTRIBUTE));
        resizeObserver.unobserve(item);

        item.removeAttribute(DATA_ATTRIBUTE);
      });
      console.groupEnd();
    };
  }, [containerElement, resizeObserver, startIndex, stopIndex]);

  return {
    cachedBounds,
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
