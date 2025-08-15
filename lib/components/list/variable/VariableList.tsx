import {
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { EMPTY_OBJECT } from "../../../../src/constants";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { useRowProps } from "../hooks/useRowProps";
import { useScrollState } from "../hooks/useScrollState";
import type { CommonListProps } from "../types";
import { getCachedRowBounds } from "./getCachedRowBounds";
import { getEstimatedHeight } from "./getEstimatedHeight";
import { getIndicesToRender } from "./getIndicesToRender";
import { useCachedBounds } from "./useCachedBounds";
import { useVariableListImperativeApi } from "./useVariableListImperativeApi";

export type VariableListProps<RowProps extends object> =
  CommonListProps<RowProps> &
    HTMLAttributes<HTMLDivElement> & {
      /**
       * Function that returns the height of a row given its index (and `rowProps` data).
       */
      rowHeight: (index: number, rowProps: RowProps) => number;
    };

export type RowHeight<RowProps extends object> =
  VariableListProps<RowProps>["rowHeight"];

export function VariableList<RowProps extends object>({
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
}: VariableListProps<RowProps>) {
  const rowProps = useRowProps(rowPropsUnstable);

  const cachedBounds = useCachedBounds({ rowHeight, rowProps });

  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const { height = 0 } = useResizeObserver({
    defaultHeight,
    element,
  });

  const { onScroll, scrollState } = useScrollState();

  useVariableListImperativeApi({
    cachedBounds,
    element,
    listRef,
    height,
    rowCount,
    rowHeight,
    rowProps,
    scrollTop: scrollState.scrollTop,
  });

  const [startIndex, stopIndex] = getIndicesToRender({
    cachedBounds,
    height,
    rowCount,
    rowHeight,
    rowProps,
    scrollTop: scrollState.scrollTop,
  });

  const rows = useMemo(() => {
    const children: ReactNode[] = [];
    if (rowCount > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        const height = rowHeight(index, rowProps);

        const { scrollTop } = getCachedRowBounds({
          cachedBounds,
          index,
          rowHeight,
          rowProps,
        });

        children.push(
          <Row
            {...(rowProps as RowProps)}
            key={index}
            index={index}
            style={{
              position: "absolute",
              top: scrollTop,
              height,
              width: "100%",
            }}
          />,
        );
      }
    }
    return children;
  }, [cachedBounds, rowCount, Row, rowHeight, rowProps, startIndex, stopIndex]);

  useEffect(() => {
    if (onRowsRendered) {
      onRowsRendered({
        startIndex,
        stopIndex,
      });
    }
  }, [onRowsRendered, startIndex, stopIndex]);

  const estimatedHeight = getEstimatedHeight({
    cachedBounds,
    rowCount,
  });

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
          height: estimatedHeight,
          position: "relative",
          width: "100%",
        }}
      >
        {rows}
      </div>
    </div>
  );
}
