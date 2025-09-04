import {
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useIsRtl } from "../../core/useIsRtl";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useMemoizedObject } from "../../hooks/useMemoizedObject";
import type { Align } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import type { GridProps } from "./types";

export function Grid<CellProps extends object>({
  cellComponent: CellComponentProp,
  cellProps: cellPropsUnstable,
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
  ...rest
}: GridProps<CellProps>) {
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
    startIndex: columnStartIndex,
    scrollToIndex: scrollToColumnIndex,
    stopIndex: columnStopIndex
  } = useVirtualizer({
    containerElement: element,
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
    startIndex: rowStartIndex,
    scrollToIndex: scrollToRowIndex,
    stopIndex: rowStopIndex
  } = useVirtualizer({
    containerElement: element,
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
      columnStartIndex >= 0 &&
      columnStopIndex >= 0 &&
      rowStartIndex >= 0 &&
      rowStopIndex >= 0 &&
      onCellsRendered
    ) {
      onCellsRendered({
        columnStartIndex,
        columnStopIndex,
        rowStartIndex,
        rowStopIndex
      });
    }
  }, [
    onCellsRendered,
    columnStartIndex,
    columnStopIndex,
    rowStartIndex,
    rowStopIndex
  ]);

  const cells = useMemo(() => {
    const children: ReactNode[] = [];
    if (columnCount > 0 && rowCount > 0) {
      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        const rowBounds = getRowBounds(rowIndex);

        const columns: ReactNode[] = [];

        for (
          let columnIndex = columnStartIndex;
          columnIndex <= columnStopIndex;
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
                height: rowCount > 1 ? rowBounds.size : "100%",
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
    columnStartIndex,
    columnStopIndex,
    getColumnBounds,
    getRowBounds,
    isRtl,
    rowCount,
    rowStartIndex,
    rowStopIndex
  ]);

  return (
    <div
      aria-colcount={columnCount}
      aria-rowcount={rowCount}
      role="grid"
      {...rest}
      className={className}
      dir={dir}
      ref={setElement}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        maxWidth: "100%",
        flexGrow: 1,
        overflow: "auto",
        ...style
      }}
    >
      {cells}

      <div
        aria-hidden
        style={{
          height: getEstimatedHeight(),
          width: getEstimatedWidth(),
          zIndex: -1
        }}
      ></div>
    </div>
  );
}
