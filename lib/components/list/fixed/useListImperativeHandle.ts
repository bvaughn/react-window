import { useImperativeHandle, type Ref } from "react";
import { getScrollTopForIndex } from "../getScrollTopForIndex";
import type { Align, ListImperativeAPI } from "../types";

export function useListImperativeApi({
  element,
  height,
  listRef,
  rowCount,
  rowHeight,
  scrollTop: prevScrollTop,
}: {
  element: HTMLDivElement | null;
  height: number;
  listRef: Ref<ListImperativeAPI> | undefined;
  rowCount: number;
  rowHeight: number;
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
        const scrollTop = getScrollTopForIndex({
          align,
          getRowOffset: (index: number) => index * rowHeight,
          height,
          index,
          rowCount,
          prevScrollTop,
          rowHeight: () => rowHeight,
        });

        element?.scrollTo({
          top: scrollTop,
          behavior,
        });
      },
    }),
    [element, height, prevScrollTop, rowCount, rowHeight],
  );
}
