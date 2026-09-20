"use client";

import {
  createElement,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode
} from "react";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMemoizedObject } from "../../hooks/useMemoizedObject";
import type { TagNames } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import { isDynamicRowHeight as isDynamicRowHeightUtil } from "./isDynamicRowHeight";
import type { ListProps } from "./types";
import { useScrollToRow } from "./useScrollToRow";

export const DATA_ATTRIBUTE_LIST_INDEX = "data-react-window-index";

/**
 * Renders data with many rows.
 */
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
  rowKey,
  rowProps: rowPropsUnstable,
  tagName = "div" as TagName,
  style,
  ...rest
}: ListProps<RowProps, TagName>): ReactElement {
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

  const rowElements = useRef<Element[]>([]);
  const scrollToRow = useScrollToRow({
    element,
    getCellBounds,
    isDynamicRowHeight,
    rowCount,
    rowElements,
    scrollToIndex
  });

  useImperativeHandle(
    listRef,
    () => ({
      get element() {
        return element;
      },
      scrollToRow
    }),
    [element, scrollToRow]
  );

  useIsomorphicLayoutEffect(() => {
    if (!element) {
      return;
    }

    // Additional children (e.g. overlays) are not rows and must not be measured.
    const rows = Array.from(element.children)
      .slice(
        0,
        startIndexOverscan < 0 ? 0 : stopIndexOverscan - startIndexOverscan + 1
      )
      .filter((item, index) => {
        if (item.hasAttribute("aria-hidden")) {
          // Ignore sizing element
          return false;
        }

        const attribute = `${startIndexOverscan + index}`;
        item.setAttribute(DATA_ATTRIBUTE_LIST_INDEX, attribute);

        return true;
      });

    rowElements.current = rows;

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
            key={rowKey ? rowKey(index, rowProps) : index}
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
    rowKey,
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
