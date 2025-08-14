import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { EMPTY_OBJECT } from "../../../../src/constants";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { getScrollTopForIndex } from "../getScrollTopForIndex";
import { useRowProps } from "../hooks/useRowProps";
import { useScrollState } from "../hooks/useScrollState";
import type { Align, CommonListProps } from "../types";
import { getIndicesToRender } from "./getIndicesToRender";

export type ListProps<RowProps extends object> = CommonListProps<RowProps> &
  HTMLAttributes<HTMLDivElement> & {
    /**
     * Row height (in pixels).
     */
    rowHeight: number;
  };

export function List<RowProps extends object>({
  className,
  defaultHeight = 0,
  listRef,
  onRowsRendered,
  rowComponent: Row,
  rowCount,
  rowHeight,
  // @ts-expect-error Find a way to cast this
  rowProps: rowPropsUnstable = EMPTY_OBJECT,
  style,
  ...rest
}: ListProps<RowProps>) {
  const rowProps = useRowProps(rowPropsUnstable);

  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const { height = 0 } = useResizeObserver({
    defaultHeight,
    element,
  });

  const { onScroll, scrollState } = useScrollState();

  useImperativeHandle(
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
          prevScrollTop: scrollState.scrollTop,
        });

        element?.scrollTo({
          top: scrollTop,
          behavior,
        });
      },
    }),
    [element, height, rowCount, scrollState.scrollTop, rowHeight],
  );

  const [startIndex, stopIndex] = getIndicesToRender({
    height,
    rowCount,
    rowHeight,
    scrollTop: scrollState.scrollTop,
  });

  const rows = useMemo(() => {
    const children: ReactNode[] = [];
    if (rowCount > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        children.push(
          <Row
            {...(rowProps as RowProps)}
            key={index}
            index={index}
            style={{
              position: "absolute",
              top: index * rowHeight,
              height: rowHeight,
              width: "100%",
            }}
          />,
        );
      }
    }
    return children;
  }, [rowCount, Row, rowHeight, rowProps, startIndex, stopIndex]);

  useEffect(() => {
    if (onRowsRendered) {
      onRowsRendered({
        startIndex,
        stopIndex,
      });
    }
  }, [onRowsRendered, startIndex, stopIndex]);

  return (
    <div
      {...rest}
      className={className}
      ref={setElement}
      onScroll={onScroll}
      role="list"
      style={{
        ...style,
        maxHeight: "100%",
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      <div
        className={className}
        style={{
          height: rowCount * rowHeight,
          position: "relative",
          width: "100%",
        }}
      >
        {rows}
      </div>
    </div>
  );
}
