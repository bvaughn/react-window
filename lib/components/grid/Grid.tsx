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
import type { GridProps } from "./types";

export function Grid<
  CellProps extends object,
  TagName extends TagNames = "div"
>({
  cellComponent: CellComponentProp,
  cellProps: cellPropsUnstable,
  children,
  className,
  columnCount,
  columnWidth,
  defaultHeight = 0,
  defaultWidth = 0,
  dir,
  gridRef,
  onCellsRendered,
  onResize,
  overscanCount = 3,
  rowCount,
  rowHeight,
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

  const {
    getCellBounds: getColumnBounds,
    getEstimatedSize: getEstimatedWidth,
    startIndexOverscan: columnStartIndexOverscan,
    startIndexVisible: columnStartIndexVisible,
    scrollToIndex: scrollToColumnIndex,
    stopIndexOverscan: columnStopIndexOverscan,
    stopIndexVisible: columnStopIndexVisible
  } = useVirtualizer({
    containerElement: element,
    containerStyle: style,
    defaultContainerSize: defaultWidth,
    direction: "horizontal",
    isRtl,
    itemCount: columnCount,
    itemProps: cellProps,
    itemSize: columnWidth,
    onResize,
    overscanCount
  });

  const {
    getCellBounds: getRowBounds,
    getEstimatedSize: getEstimatedHeight,
    startIndexOverscan: rowStartIndexOverscan,
    startIndexVisible: rowStartIndexVisible,
    scrollToIndex: scrollToRowIndex,
    stopIndexOverscan: rowStopIndexOverscan,
    stopIndexVisible: rowStopIndexVisible
  } = useVirtualizer({
    containerElement: element,
    containerStyle: style,
    defaultContainerSize: defaultHeight,
    direction: "vertical",
    itemCount: rowCount,
    itemProps: cellProps,
    itemSize: rowHeight,
    onResize,
    overscanCount
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
        const left = scrollToColumnIndex({
          align: columnAlign,
          containerScrollOffset: element?.scrollLeft ?? 0,
          index: columnIndex
        });
        const top = scrollToRowIndex({
          align: rowAlign,
          containerScrollOffset: element?.scrollTop ?? 0,
          index: rowIndex
        });

        if (typeof element?.scrollTo === "function") {
          element.scrollTo({
            behavior,
            left,
            top
          });
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
        const left = scrollToColumnIndex({
          align,
          containerScrollOffset: element?.scrollLeft ?? 0,
          index
        });

        if (typeof element?.scrollTo === "function") {
          element.scrollTo({
            behavior,
            left
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
        const top = scrollToRowIndex({
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
    [element, scrollToColumnIndex, scrollToRowIndex]
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
              key={columnIndex}
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
          <div key={rowIndex} role="row" aria-rowindex={rowIndex + 1}>
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
    columnStartIndexOverscan,
    columnStopIndexOverscan,
    getColumnBounds,
    getRowBounds,
    isRtl,
    rowCount,
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
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        maxWidth: "100%",
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
