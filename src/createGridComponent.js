// @flow

import React from "react";

export type ScrollToAlign = "auto" | "center" | "start" | "end";

type CellSize = number | ((index: number) => number);

export type RenderFunction = ({
  columnIndex: number,
  key: string,
  rowIndex: number,
  style: Object
}) => React$Node;

type ScrollEvent = SyntheticEvent<HTMLDivElement>;

export type Props = {|
  columnCount: number,
  columnWidth: CellSize,
  children: RenderFunction,
  className?: string,
  height: number,
  overscanCount: number,
  rowCount: number,
  rowHeight: CellSize,
  style?: Object,
  useIsScrolling: boolean,
  width: number
|};

type State = {|
  isScrolling: boolean,
  horizontalScrollDirection: "forward" | "backward",
  scrollLeft: number,
  scrollTop: number,
  verticalScrollDirection: "forward" | "backward"
|};

type getCellSize = (props: Props, index: number) => number;
type getEstimatedTotalSize = (props: Props) => number;
type getOffsetForCell = (
  props: Props,
  index: number,
  align: ScrollToAlign,
  scrollOffset: number
) => number;
type getStartIndexForOffset = (props: Props, offset: number) => number;
type getStopIndexForStartIndex = (props: Props, startIndex: number) => number;
type validateProps = (props: Props) => void;

const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;

export default function createGridComponent({
  getColumnStartIndexForOffset,
  getColumnStopIndexForStartIndex,
  getColumnWidth,
  getEstimatedTotalHeight,
  getEstimatedTotalWidth,
  getOffsetForColumn,
  getOffsetForRow,
  getRowHeight,
  getRowStartIndexForOffset,
  getRowStopIndexForStartIndex,
  validateProps
}: {
  getColumnStartIndexForOffset: getStartIndexForOffset,
  getColumnStopIndexForStartIndex: getStopIndexForStartIndex,
  getColumnWidth: getCellSize,
  getEstimatedTotalHeight: getEstimatedTotalSize,
  getEstimatedTotalWidth: getEstimatedTotalSize,
  getOffsetForColumn: getOffsetForCell,
  getOffsetForRow: getOffsetForCell,
  getRowHeight: getCellSize,
  getRowStartIndexForOffset: getStartIndexForOffset,
  getRowStopIndexForStartIndex: getStopIndexForStartIndex,
  validateProps: validateProps
}) {
  return class List extends React.Component<Props, State> {
    _cellStyleCache: { [key: string]: Object } = {};
    _resetIsScrollingTimeoutId: TimeoutID | null = null;
    _scrollingContainer: ?HTMLDivElement;

    static defaultProps = {
      overscanCount: 1,
      useIsScrolling: false
    };

    state: State = {
      isScrolling: false,
      horizontalScrollDirection: "forward",
      scrollLeft: 0,
      scrollTop: 0,
      verticalScrollDirection: "forward"
    };

    static getDerivedStateFromProps(
      nextProps: Props,
      prevState: State
    ): $Shape<State> {
      validateSharedProps(nextProps);
      validateProps(nextProps);
      return null;
    }

    scrollTo({
      scrollLeft,
      scrollTop
    }: {
      scrollLeft: number,
      scrollTop: number
    }): void {
      if (this._scrollingContainer != null) {
        ((this
          ._scrollingContainer: any): HTMLDivElement).scrollLeft = scrollLeft;
        ((this._scrollingContainer: any): HTMLDivElement).scrollTop = scrollTop;
      }
    }

    scrollToCell({
      align = "auto",
      columnIndex,
      rowIndex
    }: {
      align: ScrollToAlign,
      columnIndex: number,
      rowIndex: number
    }): void {
      const { scrollLeft, scrollTop } = this.state;

      this.scrollTo({
        scrollLeft: getOffsetForColumn(
          this.props,
          columnIndex,
          align,
          scrollLeft
        ),
        scrollTop: getOffsetForRow(this.props, rowIndex, align, scrollTop)
      });
    }

    componnetWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }
    }

    render() {
      const { className, height, style, width } = this.props;
      const { isScrolling } = this.state;

      const estimatedTotalHeight = getEstimatedTotalHeight(this.props);
      const estimatedTotalWidth = getEstimatedTotalWidth(this.props);

      return (
        <div
          className={className}
          ref={this.scrollingContainerRef}
          style={{
            position: "relative",
            height,
            width,
            overflow: "auto",
            ...style
          }}
          onScroll={this.onScroll}
        >
          <div
            style={{
              height: estimatedTotalHeight,
              overflow: "hidden",
              pointerEvents: isScrolling ? "none" : "",
              width: estimatedTotalWidth
            }}
          >
            {this.renderCells()}
          </div>
        </div>
      );
    }

    renderCells(): Array<React$Node> {
      const { children, useIsScrolling } = this.props;
      const { isScrolling } = this.state;

      const [
        columnStartIndex,
        columnStopIndex
      ] = this.getHorizontalRangeToRender();
      const [rowStartIndex, rowStopIndex] = this.getVerticalRangeToRender();

      const cells = [];

      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        for (
          let columnIndex = columnStartIndex;
          columnIndex <= columnStopIndex;
          columnIndex++
        ) {
          const key = `${rowIndex}:${columnIndex}`;

          // Cache cell styles while scrolling,
          // So that pure component sCU will prevent re-renders.
          let style;
          if (this._cellStyleCache.hasOwnProperty(key)) {
            style = this._cellStyleCache[key];
          } else {
            // TODO Get position of cell using helper, not hard-coded number type
            this._cellStyleCache[key] = style = {
              position: "absolute",
              left: columnIndex * getColumnWidth(this.props, columnIndex),
              top: rowIndex * getRowHeight(this.props, rowIndex),
              height: getRowHeight(this.props, rowIndex),
              width: getColumnWidth(this.props, columnIndex)
            };
          }

          cells.push(
            children({
              columnIndex,
              key,
              isScrolling: useIsScrolling ? isScrolling : undefined,
              rowIndex,
              style
            })
          );
        }
      }

      return cells;
    }

    getHorizontalRangeToRender(): [number, number] {
      const { columnCount, overscanCount } = this.props;
      const { horizontalScrollDirection, scrollLeft } = this.state;

      const startIndex = getColumnStartIndexForOffset(this.props, scrollLeft);
      const stopIndex = getColumnStopIndexForStartIndex(this.props, startIndex);

      // Overscan by one cell in each direction so that tab/focus works.
      // If there isn't at least one extra cell, tab loops back around.
      const overscanBackward =
        horizontalScrollDirection === "backward"
          ? Math.max(1, overscanCount)
          : 1;
      const overscanForward =
        horizontalScrollDirection === "forward"
          ? Math.max(1, overscanCount)
          : 1;

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.min(columnCount - 1, stopIndex + overscanForward)
      ];
    }

    getVerticalRangeToRender(): [number, number] {
      const { columnCount, overscanCount } = this.props;
      const { verticalScrollDirection, scrollTop } = this.state;

      const startIndex = getRowStartIndexForOffset(this.props, scrollTop);
      const stopIndex = getRowStopIndexForStartIndex(this.props, startIndex);

      // Overscan by one cell in each direction so that tab/focus works.
      // If there isn't at least one extra cell, tab loops back around.
      const overscanBackward =
        verticalScrollDirection === "backward" ? Math.max(1, overscanCount) : 1;
      const overscanForward =
        verticalScrollDirection === "forward" ? Math.max(1, overscanCount) : 1;

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.min(columnCount - 1, stopIndex + overscanForward)
      ];
    }

    onScroll = (event: ScrollEvent): void => {
      const { scrollLeft, scrollTop } = event.currentTarget;
      this.setState(
        prevState => ({
          isScrolling: true,
          horizontalScrollDirection:
            prevState.scrollLeft < scrollLeft ? "forward" : "backward",
          scrollLeft,
          scrollTop,
          verticalScrollDirection:
            prevState.scrollTop < scrollTop ? "forward" : "backward"
        }),
        this.resetIsScrollingDebounced
      );
    };

    scrollingContainerRef = (ref: any): void => {
      this._scrollingContainer = ((ref: any): HTMLDivElement);
    };

    resetIsScrollingDebounced = () => {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }

      this._resetIsScrollingTimeoutId = setTimeout(
        this.resetIsScrolling,
        IS_SCROLLING_DEBOUNCE_INTERVAL
      );
    };

    resetIsScrolling = () => {
      this._resetIsScrollingTimeoutId = null;

      this.setState({ isScrolling: false }, () => {
        // Clear style cache after state update has been committed.
        // This way we don't break pure sCU for cells that don't use isScrolling param.
        this._cellStyleCache = {};
      });
    };
  };
}

const validateSharedProps = ({ children, height, width }: Props): void => {
  if (typeof children !== "function") {
    throw Error(
      'An invalid "children" prop has been specified. ' +
        "Value should be a function that creates a React element. " +
        `"${children === null ? "null" : typeof children}" was specified.`
    );
  }

  if (typeof width !== "number") {
    throw Error(
      'An invalid "width" prop has been specified. ' +
        "Grids must specify a number for width. " +
        `"${width === null ? "null" : typeof width}" was specified.`
    );
  }

  if (typeof height !== "number") {
    throw Error(
      'An invalid "height" prop has been specified. ' +
        "Grids must specify a number for height. " +
        `"${height === null ? "null" : typeof height}" was specified.`
    );
  }
};
