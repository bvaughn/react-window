import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStableCallback } from "../../hooks/useStableCallback";
import { assert } from "../../utils/assert";
import { getOwnerWindow } from "../../utils/getOwnerWindow";
import { getResizeObserverClass } from "../../utils/getResizeObserverClass";
import { DATA_ATTRIBUTE_LIST_INDEX } from "./List";
import type { DynamicRowHeight } from "./types";

export function useDynamicRowHeight({
  defaultRowHeight,
  key
}: {
  defaultRowHeight: number;
  key?: string | number;
}) {
  const [state, setState] = useState<{
    key: string | number | undefined;
    map: Map<number, number>;
  }>({
    key,
    map: new Map()
  });

  if (state.key !== key) {
    setState({
      key,
      map: new Map()
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

        const attribute = target.getAttribute(DATA_ATTRIBUTE_LIST_INDEX);
        assert(
          attribute !== null,
          `Invalid ${DATA_ATTRIBUTE_LIST_INDEX} attribute value`
        );

        const index = parseInt(attribute);

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
