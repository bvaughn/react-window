import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import type { Align, CommonListProps, ScrollState } from "./types";

export function SimpleList<ExtraProps extends object>({
  className,
  defaultHeight = 0,
  length,
  listRef,
  onRowsRendered,
  rowComponent: Row,
  rowHeight,
  rowProps,
  style,
}: Omit<CommonListProps<ExtraProps>, "rowHeight"> & {
  /**
   * Fixed row height (in pixels).
   */
  rowHeight: number;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const { height = 0 } = useResizeObserver({
    defaultHeight,
    element,
  });

  const [scrollState, setScrollState] = useState<ScrollState>({
    prevScrollTop: 0,
    scrollTop: 0,
  });

  useImperativeHandle(
    listRef,
    () => ({
      get element() {
        return element;
      },

      scrollToRow(
        index: number,
        align: Align = "auto",
        behavior: ScrollBehavior = "auto",
      ) {
        const scrollTop = getScrollTopForIndex({
          align,
          height,
          index,
          length,
          prevScrollTop: scrollState.scrollTop,
          rowHeight,
        });

        element?.scrollTo({
          top: scrollTop,
          behavior,
        });
      },
    }),
    [element, height, length, scrollState.scrollTop, rowHeight],
  );

  const [startIndex, stopIndex] = getIndicesToRender({
    height,
    length,
    rowHeight,
    scrollTop: scrollState.scrollTop,
  });

  const rows = useMemo(() => {
    const children: ReactNode[] = [];
    if (length > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        children.push(
          <Row
            {...(rowProps as ExtraProps)}
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
  }, [length, Row, rowHeight, rowProps, startIndex, stopIndex]);

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
      className={className}
      ref={setElement}
      onScroll={(event) => {
        const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;

        // If scroll event was triggered by the imperative API, ignore it
        if (scrollState.scrollTop === scrollTop) {
          return;
        }

        // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
        const nextScrollTop = Math.max(
          0,
          Math.min(scrollTop, scrollHeight - clientHeight),
        );

        setScrollState({
          prevScrollTop: scrollTop,
          scrollTop: nextScrollTop,
        });
      }}
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
          height: length * rowHeight,
          position: "relative",
          width: "100%",
        }}
      >
        {rows}
      </div>
    </div>
  );
}

export type SimpleListProps = ComponentProps<typeof SimpleList>;

function getIndicesToRender({
  height,
  length,
  rowHeight,
  scrollTop,
}: {
  height: number;
  length: number;
  rowHeight: number;
  scrollTop: number;
}) {
  const startIndex = Math.max(
    0,
    Math.min(length - 1, Math.floor(scrollTop / rowHeight)),
  );

  const numVisibleItems = Math.ceil(
    (height + scrollTop - startIndex * rowHeight) / rowHeight,
  );
  const stopIndex = Math.max(
    0,
    Math.min(
      length - 1,
      startIndex + numVisibleItems - 1, // -1 is because stop index is inclusive
    ),
  );

  return [startIndex, stopIndex];
}

function getScrollTopForIndex({
  align,
  height,
  index,
  length,
  prevScrollTop,
  rowHeight,
}: {
  align: Align;
  height: number;
  index: number;
  length: number;
  prevScrollTop: number;
  rowHeight: number;
}) {
  const lastRowTop = Math.max(0, length * rowHeight - height);
  const minScrollTop = Math.max(0, (index + 1) * rowHeight - height);
  const maxScrollTop = Math.min(lastRowTop, index * rowHeight);

  if (align === "smart") {
    if (
      prevScrollTop >= minScrollTop - height &&
      prevScrollTop <= maxScrollTop + height
    ) {
      align = "auto";
    } else {
      align = "center";
    }
  }

  switch (align) {
    case "start":
      return maxScrollTop;
    case "end":
      return minScrollTop;
    case "center": {
      // "Centered" offset is usually the average of the min and max.
      // But near the edges of the list, this doesn't hold true.
      const middleOffset = Math.round(
        minScrollTop + (maxScrollTop - minScrollTop) / 2,
      );
      if (middleOffset < Math.ceil(height / 2)) {
        return 0; // near the beginning
      } else if (middleOffset > lastRowTop + Math.floor(height / 2)) {
        return lastRowTop; // near the end
      } else {
        return middleOffset;
      }
    }
    case "auto":
    default:
      if (prevScrollTop >= minScrollTop && prevScrollTop <= maxScrollTop) {
        return prevScrollTop;
      } else if (prevScrollTop < minScrollTop) {
        return minScrollTop;
      } else {
        return maxScrollTop;
      }
  }
}
