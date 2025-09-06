import {
  createElement,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useVirtualizer } from "../../core/useVirtualizer";
import { useMemoizedObject } from "../../hooks/useMemoizedObject";
import type { Align, TagNames } from "../../types";
import { arePropsEqual } from "../../utils/arePropsEqual";
import type { ListProps } from "./types";

export function List<
  RowProps extends object,
  TagName extends TagNames = "div"
>({
  children,
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
  tagName = "div" as TagName,
  style,
  ...rest
}: ListProps<RowProps, TagName>) {
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
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
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
        const top = scrollToIndex({
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
    [element, scrollToIndex]
  );

  useEffect(() => {
    if (startIndexOverscan >= 0 && stopIndexOverscan >= 0 && onRowsRendered) {
      onRowsRendered(
        {
          startIndex: startIndexVisible,
          stopIndex: stopIndexVisible
        },
        {
          startIndex: startIndexOverscan,
          stopIndex: stopIndexOverscan
        }
      );
    }
  }, [
    onRowsRendered,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  ]);

  const rows = useMemo(() => {
    const children: ReactNode[] = [];
    if (rowCount > 0) {
      for (
        let index = startIndexOverscan;
        index <= stopIndexOverscan;
        index++
      ) {
        const bounds = getCellBounds(index);

        children.push(
          <RowComponent
            {...(rowProps as RowProps)}
            ariaAttributes={{
              "aria-posinset": index + 1,
              "aria-setsize": rowCount,
              role: "listitem"
            }}
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
  }, [
    RowComponent,
    getCellBounds,
    rowCount,
    rowProps,
    startIndexOverscan,
    stopIndexOverscan
  ]);

  const sizingElement = (
    <div
      aria-hidden
      style={{
        height: getEstimatedSize(),
        width: "100%",
        zIndex: -1
      }}
    ></div>
  );

  return createElement(
    tagName,
    {
      role: "list",
      ...rest,
      className,
      ref: setElement,
      style: {
        position: "relative",
        maxHeight: "100%",
        flexGrow: 1,
        overflowY: "auto",
        ...style
      }
    },
    rows,
    children,
    sizingElement
  );
}
