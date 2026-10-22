"use client";

import {
  createElement,
  Fragment,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode
} from "react";
import { DATA_ATTRIBUTE_LIST_INDEX } from "../../core/itemIndex";
import { useScrollToIndex } from "../../core/useScrollToIndex";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useAfterResizeObserverNotifications } from "../../hooks/useAfterResizeObserverNotifications";
import { useIsHydrating } from "../../hooks/useIsHydrating";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMemoizedObject } from "../../hooks/useMemoizedObject";
import type { TagNames } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import { isDynamicRowHeight as isDynamicRowHeightUtil } from "./isDynamicRowHeight";
import type { ListProps } from "./types";

export const DATA_ATTRIBUTE_SIZER = "data-react-window-sizer";

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
  defaultScrollOffset = 0,
  listRef,
  onResize,
  onRowsRendered,
  overscanCount = 3,
  rowComponent: RowComponentProp,
  rowCount,
  rowHeight: rowHeightProp,
  rowKey,
  rowProps: rowPropsUnstable,
  scrollElement,
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

  // Server-rendered rows with dynamic heights haven't been measured yet, so absolutely positioning them
  // (based on estimated heights) would cause them to overlap or leave gaps until after hydration.
  // Instead, render them in normal document flow until the first measurements are available.
  const isHydrating = useIsHydrating();
  const [isFlowLayout, setIsFlowLayout] = useState(
    () => isHydrating && isDynamicRowHeight
  );
  const flowLayoutRowHeightRef = useRef(rowHeightProp);
  useIsomorphicLayoutEffect(() => {
    if (isFlowLayout && flowLayoutRowHeightRef.current !== rowHeightProp) {
      setIsFlowLayout(false);
    }
  }, [isFlowLayout, rowHeightProp]);
  // Measurements may never arrive (e.g. if ResizeObserver is unsupported or rows have no height yet),
  // or may exactly match initialRowHeights (in which case rowHeightProp's identity doesn't change)
  useAfterResizeObserverNotifications({
    callback: () => setIsFlowLayout(false),
    element,
    enabled: isFlowLayout
  });

  const {
    getCellBounds,
    getEstimatedSize,
    scrollTarget,
    getScrollPositionForIndex,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  } = useVirtualizer({
    containerElement: element,
    containerStyle: style,
    defaultContainerSize: defaultHeight,
    defaultScrollOffset,
    direction: "vertical",
    itemCount: rowCount,
    itemProps: rowProps,
    itemSize: rowHeight,
    onResize,
    overscanCount,
    scrollElement
  });

  const rowElements = useRef<Element[]>([]);
  const scrollToRow = useScrollToIndex({
    direction: "vertical",
    element,
    getCellBounds,
    isDynamicSize: isDynamicRowHeight,
    itemCount: rowCount,
    itemElements: rowElements,
    scrollTarget,
    getScrollPositionForIndex
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
        if (item.hasAttribute(DATA_ATTRIBUTE_SIZER)) {
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
    RowComponent,
    element,
    isDynamicRowHeight,
    rowCount,
    rowHeightProp,
    rowKey,
    rowProps,
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

  // Flow layout only matches the absolute layout if rendering starts at the first row
  const isFlowLayoutActive =
    isFlowLayout && isDynamicRowHeight && startIndexOverscan === 0;

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
            style={
              isFlowLayoutActive
                ? { width: "100%" }
                : {
                    position: "absolute",
                    left: 0,
                    transform: `translateY(${bounds.scrollOffset}px)`,
                    // In case of dynamic row heights, don't specify a height style
                    // otherwise a default/estimated height would mask the actual height
                    height: isDynamicRowHeight ? undefined : bounds.size,
                    width: "100%"
                  }
            }
          />
        );
      }
    }
    return children;
  }, [
    RowComponent,
    getCellBounds,
    isDynamicRowHeight,
    isFlowLayoutActive,
    rowCount,
    rowKey,
    rowProps,
    startIndexOverscan,
    stopIndexOverscan
  ]);

  const sizingElement = (
    <div
      aria-hidden
      key="sizer"
      {...{ [DATA_ATTRIBUTE_SIZER]: "" }}
      style={{
        // Rows rendered in flow layout already take up space
        position: isFlowLayoutActive ? "absolute" : undefined,
        top: isFlowLayoutActive ? 0 : undefined,
        height: getEstimatedSize(),
        width: "100%",
        zIndex: -1
      }}
    ></div>
  );

  const childrenElement = <Fragment key="children">{children}</Fragment>;
  const rowsElement = <Fragment key="rows">{rows}</Fragment>;

  return createElement(
    tagName,
    {
      role: "list",
      ...rest,
      className,
      ref: setElement,
      style: {
        position: "relative",
        flexGrow: 1,
        // Lists that scroll with an outer element render at their full height (and must not clip sticky rows)
        ...(scrollElement === undefined && {
          maxHeight: "100%",
          overflowY: "auto"
        }),
        ...style
      }
    },
    // Rows rendered in flow layout would push children (e.g. sticky rows) below them, so render children first.
    // Keys let React move children (rather than remounting them) once rows switch to absolute layout.
    ...(isFlowLayoutActive
      ? [childrenElement, rowsElement]
      : [rowsElement, childrenElement]),
    sizingElement
  );
}
