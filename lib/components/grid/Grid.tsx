import {
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useMemoizedObject } from "../../hooks/useMemoizedObject";
import type { Align } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import type { GridProps } from "./types";

// TODO Handle dir=rtl (onScroll, scrollToCell, scrollOffset)
// TODO Handle scrollbar sizes (add width/height if necessary)

export function Grid<CellProps extends object>({
  cellComponent: CellComponentProp,
  cellProps: cellPropsUnstable,
  className,
  columnCount,
  columnWidth,
  defaultHeight = 0,
  defaultWidth = 0,
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
        scrollToRowIndex({
          align: rowAlign,
          behavior,
          containerScrollOffset: element?.scrollTop ?? 0,
          index: rowIndex
        });
        scrollToColumnIndex({
          align: columnAlign,
          behavior,
          containerScrollOffset: element?.scrollLeft ?? 0,
          index: columnIndex
        });
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
        scrollToColumnIndex({
          align,
          behavior,
          containerScrollOffset: element?.scrollLeft ?? 0,
          index
        });
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
        scrollToRowIndex({
          align,
          behavior,
          containerScrollOffset: element?.scrollTop ?? 0,
          index
        });
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
        for (
          let columnIndex = columnStartIndex;
          columnIndex <= columnStopIndex;
          columnIndex++
        ) {
          const columnBounds = getColumnBounds(columnIndex);

          children.push(
            <CellComponent
              {...(cellProps as CellProps)}
              columnIndex={columnIndex}
              key={`${rowIndex}-${columnIndex}`}
              rowIndex={rowIndex}
              style={{
                position: "absolute",
                left: 0,
                transform: `translate(${columnBounds.scrollOffset}px, ${rowBounds.scrollOffset}px)`,
                height: rowCount > 1 ? rowBounds.size : "100%",
                width: columnBounds.size
              }}
            />
          );
        }
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
    rowCount,
    rowStartIndex,
    rowStopIndex
  ]);

  return (
    <div
      role="grid"
      {...rest}
      className={className}
      ref={setElement}
      style={{
        width: "100%",
        height: "100%",
        ...style,
        maxHeight: "100%",
        maxWidth: "100%",
        flexGrow: 1,
        overflow: "auto"
      }}
    >
      <div
        className={className}
        style={{
          position: "relative",
          height: getEstimatedHeight(),
          width: getEstimatedWidth()
        }}
      >
        {cells}
      </div>
    </div>
  );
}
