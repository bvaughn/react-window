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
import type { ListProps } from "./types";

export function List<RowProps extends object>({
  className,
  defaultHeight = 0,
  listRef,
  onResize,
  onRowsRendered,
  overscanCount = 3,
  rowComponent: RowComponentProp,
  rowCount,
  rowHeight,
  rowProps: rowPropsUnstable,
  style,
  ...rest
}: ListProps<RowProps>) {
  const rowProps = useMemoizedObject(rowPropsUnstable);
  const RowComponent = useMemo(
    () => memo(RowComponentProp, arePropsEqual),
    [RowComponentProp]
  );

  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const {
    getCellBounds,
    getEstimatedSize,
    scrollToIndex,
    startIndex,
    stopIndex
  } = useVirtualizer({
    containerElement: element,
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
        scrollToIndex({
          align,
          behavior,
          containerScrollOffset: element?.scrollTop ?? 0,
          index
        });
      }
    }),
    [element, scrollToIndex]
  );

  useEffect(() => {
    if (startIndex >= 0 && stopIndex >= 0 && onRowsRendered) {
      onRowsRendered({
        startIndex,
        stopIndex
      });
    }
  }, [onRowsRendered, startIndex, stopIndex]);

  const rows = useMemo(() => {
    const children: ReactNode[] = [];
    if (rowCount > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        const bounds = getCellBounds(index);

        children.push(
          <RowComponent
            {...(rowProps as RowProps)}
            key={index}
            index={index}
            style={{
              position: "absolute",
              left: 0,
              transform: `translateY(${bounds.scrollOffset}px)`,
              height: bounds.size,
              width: "100%"
            }}
          />
        );
      }
    }
    return children;
  }, [RowComponent, getCellBounds, rowCount, rowProps, startIndex, stopIndex]);

  return (
    <div
      {...rest}
      className={className}
      ref={setElement}
      style={{
        ...style,
        maxHeight: "100%",
        flexGrow: 1,
        overflowY: "auto"
      }}
    >
      <div
        className={className}
        style={{
          height: getEstimatedSize(),
          position: "relative",
          width: "100%"
        }}
      >
        {rows}
      </div>
    </div>
  );
}
