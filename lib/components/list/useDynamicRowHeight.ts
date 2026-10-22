import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStableCallback } from "../../hooks/useStableCallback";
import { getOwnerWindow } from "../../utils/getOwnerWindow";
import { getResizeObserverClass } from "../../utils/getResizeObserverClass";
import { getItemIndex } from "../../core/itemIndex";
import type { DynamicRowHeight } from "./types";

function createInitialMap(
  initialRowHeights: ReadonlyMap<number, number> | readonly number[] | undefined
): Map<number, number> {
  const map = new Map<number, number>();
  if (initialRowHeights !== undefined) {
    // Invalid heights would corrupt cached row positions; treat them as unmeasured
    initialRowHeights.forEach((height: number, index: number) => {
      if (Number.isFinite(height) && height > 0) {
        map.set(index, height);
      }
    });
  }
  return map;
}

export function useDynamicRowHeight({
  defaultRowHeight,
  initialRowHeights,
  key
}: {
  /**
   * Estimated height (in pixels) of rows that have not yet been measured.
   */
  defaultRowHeight: number;

  /**
   * Row heights (in pixels) that are known or can be estimated ahead of time, e.g. estimated from each row's content.
   * This can be either an array (where each item is the height of the row at that index) or a Map of row index to height.
   *
   * These values are used in place of `defaultRowHeight` until rows are rendered and measured,
   * so providing them can make server-rendered lists and initial scroll positions more accurate.
   *
   * ℹ️ This value is only read when the hook first mounts and when the `key` changes.
   */
  initialRowHeights?: ReadonlyMap<number, number> | readonly number[];

  /**
   * Changing this value clears all measured row heights,
   * e.g. when the list renders a different set of data.
   */
  key?: string | number;
}) {
  const [state, setState] = useState<{
    key: string | number | undefined;
    map: Map<number, number>;
  }>(() => ({
    key,
    map: createInitialMap(initialRowHeights)
  }));

  if (state.key !== key) {
    setState({
      key,
      map: createInitialMap(initialRowHeights)
    });
  }

  const { map } = state;

  const getAverageRowHeight = useCallback(() => {
    let totalHeight = 0;

    map.forEach((height) => {
      totalHeight += height;
    });

    if (totalHeight === 0) {
      return defaultRowHeight;
    }

    return totalHeight / map.size;
  }, [defaultRowHeight, map]);

  const getRowHeight = useCallback(
    (index: number) => {
      const measuredHeight = map.get(index);
      if (measuredHeight !== undefined) {
        return measuredHeight;
      }

      // Keep estimates stable when rowProps change (see issue #863), but do not
      // store them as measurements or include them in the measured average.
      return defaultRowHeight;
    },
    [defaultRowHeight, map]
  );

  const setRowHeight = useCallback((index: number, size: number) => {
    setState((prevState) => {
      if (prevState.map.get(index) === size) {
        return prevState;
      }

      const clonedMap = new Map(prevState.map);
      clonedMap.set(index, size);

      return {
        ...prevState,
        map: clonedMap
      };
    });
  }, []);

  const resizeObserverCallback = useStableCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries.length === 0) {
        return;
      }

      entries.forEach((entry) => {
        const { borderBoxSize, target } = entry;

        // Elements without a valid index can't be associated with a row
        // (useVirtualizer warns about these when they're registered)
        const index = getItemIndex(target);
        if (index === undefined) {
          return;
        }

        const { blockSize: height } = borderBoxSize[0];
        if (!height) {
          // Ignore heights that have not yet been measured (e.g. <img> elements that have not yet loaded)
          return;
        }

        setRowHeight(index, height);
      });
    }
  );

  // Rows may be rendered into another window (e.g. a popup rendered into via a portal),
  // and observers only report on elements in documents they belong to
  const resizeObserverRef = useRef<{
    resizeObserver: ResizeObserver;
    view: Window;
  } | null>(null);

  useEffect(
    () => () => {
      resizeObserverRef.current?.resizeObserver.disconnect();
      resizeObserverRef.current = null;
    },
    []
  );

  const observeRowElements = useCallback(
    (elements: Element[] | NodeListOf<Element>) => {
      const observed: [Element, ResizeObserver][] = [];

      elements.forEach((element) => {
        const view = getOwnerWindow(element);

        // Rows from one list share a window, so this only happens if the list moves to another window
        if (resizeObserverRef.current?.view !== view) {
          resizeObserverRef.current?.resizeObserver.disconnect();

          const ResizeObserverClass = getResizeObserverClass(element);
          resizeObserverRef.current = ResizeObserverClass
            ? {
                resizeObserver: new ResizeObserverClass(resizeObserverCallback),
                view
              }
            : null;
        }

        const resizeObserver = resizeObserverRef.current?.resizeObserver;
        if (resizeObserver) {
          resizeObserver.observe(element);
          observed.push([element, resizeObserver]);
        }
      });

      return () => {
        observed.forEach(([element, resizeObserver]) =>
          resizeObserver.unobserve(element)
        );
      };
    },
    [resizeObserverCallback]
  );

  return useMemo<DynamicRowHeight>(
    () => ({
      getAverageRowHeight,
      getRowHeight,
      setRowHeight,
      observeRowElements
    }),
    [getAverageRowHeight, getRowHeight, setRowHeight, observeRowElements]
  );
}
