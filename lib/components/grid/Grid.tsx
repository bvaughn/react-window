"use client";

import {
  createElement,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode
} from "react";
import { useIsRtl } from "../../core/useIsRtl";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useMemoizedObject } from "../../hooks/useMemoizedObject";
import type { Align, TagNames } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import { scrollTargetTo } from "../../utils/scrollElement";
import type { GridProps } from "./types";

/**
 * Renders data with many rows and columns.
 *
 * ℹ️ Unlike `List` rows, `Grid` cell sizes must be known ahead of time.
 * Either static sizes or something that can be derived (from the data in `CellProps`) without rendering.
 */
export function Grid<
  CellProps extends object,
  TagName extends TagNames = "div"
>({
  cellComponent: CellComponentProp,
  cellProps: cellPropsUnstable,
  children,
  className,
  columnCount,
  columnKey,
  columnWidth,
  defaultHeight = 0,
  defaultScrollLeft = 0,
  defaultScrollTop = 0,
  defaultWidth = 0,
  dir,
  gridRef,
  onCellsRendered,
  onResize,
  overscanCount = 3,
  rowCount,
  rowHeight,
  rowKey,
  scrollElement,
  style,
  tagName = "div" as TagName,
  ...rest
}: GridProps<CellProps, TagName>): ReactElement {
  const cellProps = useMemoizedObject(cellPropsUnstable);
  const CellComponent = useMemo(
    () => memo(CellComponentProp, arePropsEqual),
    [CellComponentProp]
  );

  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const isRtl = useIsRtl(element, dir);

  // TODO With a scrollElement, each virtualizer (one per axis) separately adds scroll/resize listeners,
  // observes preceding content, and measures the grid and scroll element after every render and scroll event.
  // Measure once (e.g. in Grid) and share the result with both axes.
  const {
    getCellBounds: getColumnBounds,
    getEstimatedSize: getEstimatedWidth,
    startIndexOverscan: columnStartIndexOverscan,
    startIndexVisible: columnStartIndexVisible,
    getScrollPositionForIndex: getColumnScrollPosition,
    stopIndexOverscan: columnStopIndexOverscan,
    stopIndexVisible: columnStopIndexVisible
  } = useVirtualizer({
    containerElement: element,
    containerStyle: style,
    defaultContainerSize: defaultWidth,
    defaultScrollOffset: defaultScrollLeft,
    direction: "horizontal",
    isRtl,
    itemCount: columnCount,
    itemProps: cellProps,
    itemSize: columnWidth,
    onResize,
    overscanCount,
    scrollElement
  });

  const {
    getCellBounds: getRowBounds,
    getEstimatedSize: getEstimatedHeight,
    startIndexOverscan: rowStartIndexOverscan,
    startIndexVisible: rowStartIndexVisible,
    getScrollPositionForIndex: getRowScrollPosition,
    stopIndexOverscan: rowStopIndexOverscan,
    stopIndexVisible: rowStopIndexVisible
  } = useVirtualizer({
    containerElement: element,
    containerStyle: style,
    defaultContainerSize: defaultHeight,
    defaultScrollOffset: defaultScrollTop,
    direction: "vertical",
    itemCount: rowCount,
    itemProps: cellProps,
    itemSize: rowHeight,
    onResize,
    overscanCount,
    scrollElement
  });

  useImperativeHandle(
    gridRef,
    () => ({
      get element() {
        return element;
      },

      scrollToCell({
        behavior = "auto",
        columnAlign = "auto",
        columnIndex,
        rowAlign = "auto",
        rowIndex
      }: {
        behavior?: ScrollBehavior;
        columnAlign?: Align;
        columnIndex: number;
        rowAlign?: Align;
        rowIndex: number;
      }) {
        const column = getColumnScrollPosition({
          align: columnAlign,
          index: columnIndex
        });
        const row = getRowScrollPosition({
          align: rowAlign,
          index: rowIndex
        });

        // Columns and rows may scroll different elements (e.g. columns scroll within the grid and rows scroll with the page)
        if (column && row && column.scrollTarget === row.scrollTarget) {
          scrollTargetTo(row.scrollTarget, {
            behavior,
            left: column.scrollOffset,
            top: row.scrollOffset
          });
        } else {
          if (column) {
            scrollTargetTo(column.scrollTarget, {
              behavior,
              left: column.scrollOffset
            });
          }
          if (row) {
            scrollTargetTo(row.scrollTarget, {
              behavior,
              top: row.scrollOffset
            });
          }
        }
      },

      scrollToColumn({
        align = "auto",
        behavior = "auto",
        index
      }: {
        align?: Align;
        behavior?: ScrollBehavior;
        index: number;
      }) {
        const column = getColumnScrollPosition({ align, index });
        if (column) {
          scrollTargetTo(column.scrollTarget, {
            behavior,
            left: column.scrollOffset
          });
        }
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
        const row = getRowScrollPosition({ align, index });
        if (row) {
          scrollTargetTo(row.scrollTarget, {
            behavior,
            top: row.scrollOffset
          });
        }
      }
    }),
    [element, getColumnScrollPosition, getRowScrollPosition]
  );

  useEffect(() => {
    if (
      columnStartIndexOverscan >= 0 &&
      columnStopIndexOverscan >= 0 &&
      rowStartIndexOverscan >= 0 &&
      rowStopIndexOverscan >= 0 &&
      onCellsRendered
    ) {
      onCellsRendered(
        {
          columnStartIndex: columnStartIndexVisible,
          columnStopIndex: columnStopIndexVisible,
          rowStartIndex: rowStartIndexVisible,
          rowStopIndex: rowStopIndexVisible
        },
        {
          columnStartIndex: columnStartIndexOverscan,
          columnStopIndex: columnStopIndexOverscan,
          rowStartIndex: rowStartIndexOverscan,
          rowStopIndex: rowStopIndexOverscan
        }
      );
    }
  }, [
    onCellsRendered,
    columnStartIndexOverscan,
    columnStartIndexVisible,
    columnStopIndexOverscan,
    columnStopIndexVisible,
    rowStartIndexOverscan,
    rowStartIndexVisible,
    rowStopIndexOverscan,
    rowStopIndexVisible
  ]);

  const cells = useMemo(() => {
    const children: ReactNode[] = [];
    if (columnCount > 0 && rowCount > 0) {
      for (
        let rowIndex = rowStartIndexOverscan;
        rowIndex <= rowStopIndexOverscan;
        rowIndex++
      ) {
        const rowBounds = getRowBounds(rowIndex);

        const columns: ReactNode[] = [];

        for (
          let columnIndex = columnStartIndexOverscan;
          columnIndex <= columnStopIndexOverscan;
          columnIndex++
        ) {
          const columnBounds = getColumnBounds(columnIndex);

          columns.push(
            <CellComponent
              {...(cellProps as CellProps)}
              ariaAttributes={{
                "aria-colindex": columnIndex + 1,
                role: "gridcell"
              }}
              columnIndex={columnIndex}
              key={
                columnKey
                  ? columnKey({
                      columnIndex,
                      data: cellProps,
                      rowIndex
                    })
                  : columnIndex
              }
              rowIndex={rowIndex}
              style={{
                position: "absolute",
                left: isRtl ? undefined : 0,
                right: isRtl ? 0 : undefined,
                transform: `translate(${isRtl ? -columnBounds.scrollOffset : columnBounds.scrollOffset}px, ${rowBounds.scrollOffset}px)`,
                height: rowBounds.size,
                width: columnBounds.size
              }}
            />
          );
        }

        children.push(
          <div
            key={
              rowKey
                ? rowKey({
                    data: cellProps,
                    rowIndex
                  })
                : rowIndex
            }
            role="row"
            aria-rowindex={rowIndex + 1}
          >
            {columns}
          </div>
        );
      }
    }
    return children;
  }, [
    CellComponent,
    cellProps,
    columnCount,
    columnKey,
    columnStartIndexOverscan,
    columnStopIndexOverscan,
    getColumnBounds,
    getRowBounds,
    isRtl,
    rowCount,
    rowKey,
    rowStartIndexOverscan,
    rowStopIndexOverscan
  ]);

  const sizingElement = (
    <div
      aria-hidden
      style={{
        height: getEstimatedHeight(),
        width: getEstimatedWidth(),
        zIndex: -1
      }}
    ></div>
  );

  return createElement(
    tagName,
    {
      "aria-colcount": columnCount,
      "aria-rowcount": rowCount,
      role: "grid",
      ...rest,
      className,
      dir,
      ref: setElement,
      style: {
        position: "relative",
        // Grids that scroll with an outer element render at their full height,
        // and at their full width unless constrained by their parent (in which case columns scroll within the grid)
        ...(scrollElement === undefined && {
          maxHeight: "100%",
          maxWidth: "100%"
        }),
        flexGrow: 1,
        overflow: "auto",
        ...style
      }
    },
    cells,
    children,
    sizingElement
  );
}
