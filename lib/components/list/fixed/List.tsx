import {
  memo,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { EMPTY_OBJECT } from "../../../../src/constants";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { useRowProps } from "../hooks/useRowProps";
import { useScrollState } from "../hooks/useScrollState";
import type { CommonListProps, ListImperativeAPI } from "../types";
import { getIndicesToRender } from "./getIndicesToRender";
import { useListImperativeApi } from "./useListImperativeHandle";
import { arePropsEqual } from "../../../utils/arePropsEqual";

export type ListProps<RowProps extends object> = CommonListProps<RowProps> &
  HTMLAttributes<HTMLDivElement> & {
    /**
     * Ref used to interact with this component's imperative API.
     *
     * This API has imperative methods for scrolling and a getter for the outermost DOM element.
     *
     * ⚠️ The `useListRef` hook is exported for convenience use in TypeScript projects.
     */
    listRef?: Ref<ListImperativeAPI>;

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
  overscanCount = 1,
  rowComponent: RowComponentProp,
  rowCount,
  rowHeight,
  // @ts-expect-error Find a way to cast this
  rowProps: rowPropsUnstable = EMPTY_OBJECT,
  style,
  ...rest
}: ListProps<RowProps>) {
  const rowProps = useRowProps(rowPropsUnstable);
  const RowComponent = useMemo(
    () => memo(RowComponentProp, arePropsEqual),
    [RowComponentProp],
  );

  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const { height = 0 } = useResizeObserver({
    defaultHeight,
    element,
    mode: "only-height",
    style,
  });

  const { onScroll, scrollState } = useScrollState();

  useListImperativeApi({
    element,
    height,
    listRef,
    rowCount,
    rowHeight,
    scrollTop: scrollState.prevScrollTop,
  });

  const [startIndex, stopIndex] = getIndicesToRender({
    height,
    overscanCount,
    rowCount,
    rowHeight,
    scrollTop: scrollState.scrollTop,
  });

  const rows = useMemo(() => {
    const children: ReactNode[] = [];
    if (rowCount > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        children.push(
          <RowComponent
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
  }, [rowCount, RowComponent, rowHeight, rowProps, startIndex, stopIndex]);

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
