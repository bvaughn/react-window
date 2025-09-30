import {
  createElement,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMemoizedObject } from "../../hooks/useMemoizedObject";
import type { Align, TagNames } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import { isDynamicRowHeight as isDynamicRowHeightUtil } from "./isDynamicRowHeight";
import type { ListProps } from "./types";

export const DATA_ATTRIBUTE_LIST_INDEX = "data-react-window-index";

export function List<
  RowProps extends object,
  TagName extends TagNames = "div"
>({
  children,
  className,
  defaultHeight = 0,
  listRef,
  onResize,
  onRowsRendered,
  overscanCount = 3,
  rowComponent: RowComponentProp,
  rowCount,
  rowHeight: rowHeightProp,
  rowProps: rowPropsUnstable,
  tagName = "div" as TagName,
  style,
  ...rest
}: ListProps<RowProps, TagName>) {
  const rowProps = useMemoizedObject(rowPropsUnstable);
  const RowComponent = useMemo(
    () => memo(RowComponentProp, arePropsEqual),
    [RowComponentProp]
  );

  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const isDynamicRowHeight = isDynamicRowHeightUtil(rowHeightProp);

  const rowHeight = useMemo(() => {
    if (isDynamicRowHeight) {
      return (index: number) => {
        return (
          rowHeightProp.getRowHeight(index) ??
          rowHeightProp.getAverageRowHeight()
        );
      };
    }

    return rowHeightProp;
  }, [isDynamicRowHeight, rowHeightProp]);

  const {
    getCellBounds,
    getEstimatedSize,
    scrollToIndex,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  } = useVirtualizer({
    containerElement: element,
    containerStyle: style,
    defaultContainerSize: defaultHeight,
    direction: "vertical",
    itemCount: rowCount,
    itemProps: rowProps,
    itemSize: rowHeight,
    onResize,
    overscanCount
  });

  useImperativeHandle(
    listRef,
    () => ({
      get element() {
        return element;
      },

      scrollToRow({
        align = "auto",
        behavior = "auto",
        index
      }: {
        align?: Align;
        behavior?: ScrollBehavior;
        index: number;
      }) {
        const top = scrollToIndex({
          align,
          containerScrollOffset: element?.scrollTop ?? 0,
          index
        });

        if (typeof element?.scrollTo === "function") {
          element.scrollTo({
            behavior,
            top
          });
        }
      }
    }),
    [element, scrollToIndex]
  );

  useIsomorphicLayoutEffect(() => {
    if (!element) {
      return;
    }

    const rows = Array.from(element.children).filter((item, index) => {
      if (item.hasAttribute("aria-hidden")) {
        // Ignore sizing element
        return false;
      }

      const attribute = `${startIndexOverscan + index}`;
      item.setAttribute(DATA_ATTRIBUTE_LIST_INDEX, attribute);

      return true;
    });

    if (isDynamicRowHeight) {
      return rowHeightProp.observeRowElements(rows);
    }
  }, [
    element,
    isDynamicRowHeight,
    rowHeightProp,
    startIndexOverscan,
    stopIndexOverscan
  ]);

  useEffect(() => {
    if (startIndexOverscan >= 0 && stopIndexOverscan >= 0 && onRowsRendered) {
      onRowsRendered(
        {
          startIndex: startIndexVisible,
          stopIndex: stopIndexVisible
        },
        {
          startIndex: startIndexOverscan,
          stopIndex: stopIndexOverscan
        }
      );
    }
  }, [
    onRowsRendered,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  ]);

  const rows = useMemo(() => {
    const children: ReactNode[] = [];
    if (rowCount > 0) {
      for (
        let index = startIndexOverscan;
        index <= stopIndexOverscan;
        index++
      ) {
        const bounds = getCellBounds(index);

        children.push(
          <RowComponent
            {...(rowProps as RowProps)}
            ariaAttributes={{
              "aria-posinset": index + 1,
              "aria-setsize": rowCount,
              role: "listitem"
            }}
            key={index}
            index={index}
            style={{
              position: "absolute",
              left: 0,
              transform: `translateY(${bounds.scrollOffset}px)`,
              // In case of dynamic row heights, don't specify a height style
              // otherwise a default/estimated height would mask the actual height
              height: isDynamicRowHeight ? undefined : bounds.size,
              width: "100%"
            }}
          />
        );
      }
    }
    return children;
  }, [
    RowComponent,
    getCellBounds,
    isDynamicRowHeight,
    rowCount,
    rowProps,
    startIndexOverscan,
    stopIndexOverscan
  ]);

  const sizingElement = (
    <div
      aria-hidden
      style={{
        height: getEstimatedSize(),
        width: "100%",
        zIndex: -1
      }}
    ></div>
  );

  return createElement(
    tagName,
    {
      role: "list",
      ...rest,
      className,
      ref: setElement,
      style: {
        position: "relative",
        maxHeight: "100%",
        flexGrow: 1,
        overflowY: "auto",
        ...style
      }
    },
    rows,
    children,
    sizingElement
  );
}
