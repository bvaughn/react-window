import { useCallback, useEffect, useMemo, useState } from "react";
import { useStableCallback } from "../../hooks/useStableCallback";
import { assert } from "../../utils/assert";
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

      // Temporarily store default height in the cache map to avoid scroll jumps if rowProps change
      // Else rowProps changes can impact the average height, and cause rows to shift up or down within the list
      // see github.com/bvaughn/react-window/issues/863
      map.set(index, defaultRowHeight);

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

  const [resizeObserver] = useState(
    () => new ResizeObserver(resizeObserverCallback)
  );

  useEffect(() => {
    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeObserver]);

  const observeRowElements = useCallback(
    (elements: Element[] | NodeListOf<Element>) => {
      elements.forEach((element) => resizeObserver.observe(element));
      return () => {
        elements.forEach((element) => resizeObserver.unobserve(element));
      };
    },
    [resizeObserver]
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
