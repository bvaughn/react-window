import {
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useStableObject } from "../../hooks/useStableObject";
import type { Align } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import type { GridProps } from "./types";
import { NOOP_FUNCTION } from "../../../src/constants";

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
  onScroll: onScrollProp = NOOP_FUNCTION,
  overscanCount = 3,
  rowCount,
  rowHeight,
  style,
  ...rest
}: GridProps<CellProps>) {
  const cellProps = useStableObject(cellPropsUnstable);
  const CellComponent = useMemo(
    () => memo(CellComponentProp, arePropsEqual),
    [CellComponentProp]
  );

  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const columnVirtualizer = useVirtualizer({
    containerElement: element,
    defaultContainerSize: defaultWidth,
    direction: "horizontal",
    itemCount: columnCount,
    itemProps: cellProps,
    itemSize: columnWidth,
    onResize,
    overscanCount
  });

  const rowVirtualizer = useVirtualizer({
    containerElement: element,
    defaultContainerSize: defaultHeight,
    direction: "vertical",
    itemCount: rowCount,
    itemProps: cellProps,
    itemSize: rowHeight,
    onResize,
    overscanCount
  });

  const { startIndex: columnStartIndex, stopIndex: columnStopIndex } =
    columnVirtualizer;

  const { startIndex: rowStartIndex, stopIndex: rowStopIndex } = rowVirtualizer;

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
        rowVirtualizer?.scrollToIndex({
          align: rowAlign,
          behavior,
          containerScrollOffset: element?.scrollTop ?? 0,
          index: rowIndex
        });
        columnVirtualizer?.scrollToIndex({
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
        columnVirtualizer?.scrollToIndex({
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
        rowVirtualizer?.scrollToIndex({
          align,
          behavior,
          containerScrollOffset: element?.scrollTop ?? 0,
          index
        });
      }
    }),
    [columnVirtualizer, element, rowVirtualizer]
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
    if (
      columnVirtualizer &&
      columnCount > 0 &&
      rowVirtualizer &&
      rowCount > 0
    ) {
      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        const rowBounds = rowVirtualizer.getCellBounds(rowIndex);
        for (
          let columnIndex = columnStartIndex;
          columnIndex <= columnStopIndex;
          columnIndex++
        ) {
          const columnBounds = columnVirtualizer.getCellBounds(columnIndex);

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
                height: rowBounds.size,
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
    columnVirtualizer,
    rowCount,
    rowStartIndex,
    rowStopIndex,
    rowVirtualizer
  ]);

  return (
    <div
      role="grid"
      {...rest}
      className={className}
      onScroll={(event) => {
        columnVirtualizer.onScroll();
        rowVirtualizer.onScroll();
        onScrollProp(event);
      }}
      ref={setElement}
      style={{
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
          height: rowVirtualizer?.getEstimatedHeight(),
          width: columnVirtualizer?.getEstimatedHeight()
        }}
      >
        {cells}
      </div>
    </div>
  );
}
