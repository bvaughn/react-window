import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Key
} from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useStableCallback } from "../../hooks/useStableCallback";
import { getOwnerWindow } from "../../utils/getOwnerWindow";
import { getResizeObserverClass } from "../../utils/getResizeObserverClass";
import { getItemIndex } from "../../core/itemIndex";
import type { DynamicRowHeight, RowKeys } from "./types";

export type State = {
  key: string | number | undefined;
  // Heights of rows measured with a key (so that they follow their rows when rows are inserted or removed)
  keyMap: Map<Key, number>;
  // Initial heights, and heights of rows measured without a key
  map: Map<number, number>;
};

type Measurement = { index: number; key: Key | undefined; size: number };

// Heights of rows that were removed from the list stay in the cache until it holds this many times as many rows
// as the list has had at most (so that removing rows is cheap, the cache doesn't grow without bound as rows come and go,
// and rows hidden for a while, e.g. by a filter, keep their heights)
const PRUNE_RATIO = 2;
// Small caches aren't pruned
const MIN_PRUNE_SIZE = 1000;

/**
 * Applies the specified measurements (copying each map at most once),
 * or returns the previous state if nothing changed.
 *
 * @internal Exported for testing
 */
export function applyMeasurements(
  prevState: State,
  measurements: readonly Measurement[],
  rowKeys: RowKeys | undefined,
  maxRowCount: number = rowKeys?.count ?? 0
): State {
  let keyMap: Map<Key, number> | undefined = undefined;
  let map: Map<number, number> | undefined = undefined;

  for (const { index, key, size } of measurements) {
    if (key !== undefined) {
      if ((keyMap ?? prevState.keyMap).get(key) !== size) {
        keyMap ??= new Map(prevState.keyMap);
        keyMap.set(key, size);
      }
    } else if ((map ?? prevState.map).get(index) !== size) {
      map ??= new Map(prevState.map);
      map.set(index, size);
    }
  }

  if (keyMap === undefined && map === undefined) {
    return prevState;
  }

  if (
    keyMap !== undefined &&
    rowKeys !== undefined &&
    keyMap.size >
      Math.max(
        MIN_PRUNE_SIZE,
        Math.max(maxRowCount, rowKeys.count) * PRUNE_RATIO
      )
  ) {
    // Remove the heights of rows that are no longer in the list
    const keys = new Set<Key | undefined>();
    for (let index = 0; index < rowKeys.count; index++) {
      keys.add(rowKeys.getKey(index));
    }
    for (const key of Array.from(keyMap.keys())) {
      if (!keys.has(key)) {
        keyMap.delete(key);
      }
    }
  }

  return {
    ...prevState,
    keyMap: keyMap ?? prevState.keyMap,
    map: map ?? prevState.map
  };
}

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
  const [state, setState] = useState<State>(() => ({
    key,
    keyMap: new Map(),
    map: createInitialMap(initialRowHeights)
  }));

  if (state.key !== key) {
    setState({
      key,
      keyMap: new Map(),
      map: createInitialMap(initialRowHeights)
    });
  }

  const { keyMap, map } = state;

  const getAverageRowHeight = useCallback(() => {
    let totalHeight = 0;

    map.forEach((height) => {
      totalHeight += height;
    });
    keyMap.forEach((height) => {
      totalHeight += height;
    });

    if (totalHeight === 0) {
      return defaultRowHeight;
    }

    return totalHeight / (map.size + keyMap.size);
  }, [defaultRowHeight, keyMap, map]);

  const getRowHeight = useCallback(
    (index: number, key?: Key) => {
      const measuredHeight =
        (key !== undefined ? keyMap.get(key) : undefined) ?? map.get(index);
      if (measuredHeight !== undefined) {
        return measuredHeight;
      }

      // Keep estimates stable when rowProps change (see issue #863), but do not
      // store them as measurements or include them in the measured average.
      return defaultRowHeight;
    },
    [defaultRowHeight, keyMap, map]
  );

  // Provided by the list each time it observes rows (see observeRowElements)
  const rowKeysRef = useRef<RowKeys | undefined>(undefined);
  // The most rows the list has had (for the current key)
  const maxRowCountRef = useRef(0);
  useIsomorphicLayoutEffect(() => {
    maxRowCountRef.current = rowKeysRef.current?.count ?? 0;
  }, [key]);

  const setRowHeights = useCallback((measurements: readonly Measurement[]) => {
    setState((prevState) =>
      // Deterministic for a given state (React may call this twice in development)
      applyMeasurements(
        prevState,
        measurements,
        rowKeysRef.current,
        maxRowCountRef.current
      )
    );
  }, []);

  const setRowHeight = useCallback(
    (index: number, size: number, key?: Key) =>
      setRowHeights([{ index, key, size }]),
    [setRowHeights]
  );

  const resizeObserverCallback = useStableCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries.length === 0) {
        return;
      }

      // Applied at once, so that the cache is only copied once (rather than for each row)
      const measurements: Measurement[] = [];
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

        measurements.push({
          index,
          key: rowKeysRef.current?.getKey(index),
          size: height
        });
      });

      if (measurements.length > 0) {
        setRowHeights(measurements);
      }
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
    (elements: Element[] | NodeListOf<Element>, rowKeys?: RowKeys) => {
      rowKeysRef.current = rowKeys;
      if (rowKeys !== undefined) {
        maxRowCountRef.current = Math.max(
          maxRowCountRef.current,
          rowKeys.count
        );
      }

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
