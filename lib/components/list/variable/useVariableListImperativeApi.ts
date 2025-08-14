import { useImperativeHandle, type Ref } from "react";
import { getScrollTopForIndex } from "../getScrollTopForIndex";
import type { Align, CachedBounds, ListImperativeAPI } from "../types";
import type { RowHeight } from "./VariableList";
import { getCachedRowBounds } from "./getCachedRowBounds";

export function useVariableListImperativeApi<RowProps extends object>({
  cachedBounds,
  element,
  height,
  listRef,
  rowCount,
  rowHeight,
  rowProps,
  scrollTop: prevScrollTop,
}: {
  cachedBounds: CachedBounds;
  element: HTMLDivElement | null;
  height: number;
  listRef: Ref<ListImperativeAPI> | undefined;
  rowCount: number;
  rowHeight: RowHeight<RowProps>;
  rowProps: RowProps;
  scrollTop: number;
}) {
  return useImperativeHandle(
    listRef,
    () => ({
      get element() {
        return element;
      },

      scrollToRow({
        align = "auto",
        behavior = "auto",
        index,
      }: {
        align?: Align;
        behavior?: ScrollBehavior;
        index: number;
      }) {
        const nextScrollTop = getScrollTopForIndex({
          align,
          getRowOffset: (index) => {
            return getCachedRowBounds({
              cachedBounds,
              index,
              rowHeight,
              rowProps,
            }).scrollTop;
          },
          height,
          index,
          length: rowCount,
          prevScrollTop,
        });

        element?.scrollTo({
          top: nextScrollTop,
          behavior,
        });
      },
    }),
    [
      cachedBounds,
      element,
      height,
      prevScrollTop,
      rowCount,
      rowHeight,
      rowProps,
    ],
  );
}
