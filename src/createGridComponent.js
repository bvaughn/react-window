// @flow

import memoizeOne from 'memoize-one';
import React from 'react';

export type ScrollToAlign = 'auto' | 'center' | 'start' | 'end';

type CellSize = number | ((index: number) => number);

export type RenderFunction = ({
  columnIndex: number,
  key: string,
  rowIndex: number,
  style: Object,
}) => React$Node;

type ScrollDirection = 'forward' | 'backward';

type onItemsRenderedCallback = ({
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number,
  visibleColumnStartIndex: number,
  visibleColumnStopIndex: number,
  visibleRowStartIndex: number,
  visibleRowStopIndex: number,
}) => void;
type onScrollCallback = ({
  horizontalScrollDirection: ScrollDirection,
  scrollLeft: number,
  scrollTop: number,
  verticalScrollDirection: ScrollDirection,
}) => void;

type ScrollEvent = SyntheticEvent<HTMLDivElement>;

export type Props = {|
  children: RenderFunction,
  className?: string,
  columnCount: number,
  columnWidth: CellSize,
  height: number,
  onItemsRendered?: onItemsRenderedCallback,
  onScroll?: onScrollCallback,
  overscanCount: number,
  rowCount: number,
  rowHeight: CellSize,
  style?: Object,
  useIsScrolling: boolean,
  width: number,
|};

type State = {|
  isScrolling: boolean,
  horizontalScrollDirection: ScrollDirection,
  scrollLeft: number,
  scrollTop: number,
  verticalScrollDirection: ScrollDirection,
|};

type getCellOffset = (
  props: Props,
  index: number,
  instanceProps: any
) => number;
type getCellSize = (props: Props, index: number, instanceProps: any) => number;
type getEstimatedTotalSize = (props: Props, instanceProps: any) => number;
type getOffsetForCellAndAlignment = (
  props: Props,
  index: number,
  align: ScrollToAlign,
  scrollOffset: number,
  instanceProps: any
) => number;
type getStartIndexForOffset = (
  props: Props,
  offset: number,
  instanceProps: any
) => number;
type getStopIndexForStartIndex = (
  props: Props,
  startIndex: number,
  instanceProps: any
) => number;
type initInstanceProps = (props: Props, instance: any) => any;
type validateProps = (props: Props) => void;

const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;

export default function createGridComponent({
  getColumnOffset,
  getColumnStartIndexForOffset,
  getColumnStopIndexForStartIndex,
  getColumnWidth,
  getEstimatedTotalHeight,
  getEstimatedTotalWidth,
  getOffsetForColumnAndAlignment,
  getOffsetForRowAndAlignment,
  getRowHeight,
  getRowOffset,
  getRowStartIndexForOffset,
  getRowStopIndexForStartIndex,
  initInstanceProps,
  validateProps,
}: {|
  getColumnOffset: getCellOffset,
  getColumnStartIndexForOffset: getStartIndexForOffset,
  getColumnStopIndexForStartIndex: getStopIndexForStartIndex,
  getColumnWidth: getCellSize,
  getEstimatedTotalHeight: getEstimatedTotalSize,
  getEstimatedTotalWidth: getEstimatedTotalSize,
  getOffsetForColumnAndAlignment: getOffsetForCellAndAlignment,
  getOffsetForRowAndAlignment: getOffsetForCellAndAlignment,
  getRowOffset: getCellOffset,
  getRowHeight: getCellSize,
  getRowStartIndexForOffset: getStartIndexForOffset,
  getRowStopIndexForStartIndex: getStopIndexForStartIndex,
  initInstanceProps: initInstanceProps,
  validateProps: validateProps,
|}) {
  return class List extends React.Component<Props, State> {
    _cellStyleCache: { [key: string]: Object } = {};
    _instanceProps: any;
    _resetIsScrollingTimeoutId: TimeoutID | null = null;
    _scrollingContainer: ?HTMLDivElement;

    static defaultProps = {
      overscanCount: 1,
      useIsScrolling: false,
    };

    state: State = {
      isScrolling: false,
      horizontalScrollDirection: 'forward',
      scrollLeft: 0,
      scrollTop: 0,
      verticalScrollDirection: 'forward',
    };

    constructor(props: Props) {
      super(props);

      this._instanceProps = initInstanceProps(props, this);
    }

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
      scrollTop,
    }: {
      scrollLeft: number,
      scrollTop: number,
    }): void {
      if (this._scrollingContainer != null) {
        ((this
          ._scrollingContainer: any): HTMLDivElement).scrollLeft = scrollLeft;
        ((this._scrollingContainer: any): HTMLDivElement).scrollTop = scrollTop;
      }
    }

    scrollToItem({
      align = 'auto',
      columnIndex,
      rowIndex,
    }: {
      align: ScrollToAlign,
      columnIndex: number,
      rowIndex: number,
    }): void {
      const { scrollLeft, scrollTop } = this.state;

      this.scrollTo({
        scrollLeft: getOffsetForColumnAndAlignment(
          this.props,
          columnIndex,
          align,
          scrollLeft,
          this._instanceProps
        ),
        scrollTop: getOffsetForRowAndAlignment(
          this.props,
          rowIndex,
          align,
          scrollTop,
          this._instanceProps
        ),
      });
    }

    componentDidMount() {
      this.callPropsCallbacks();
    }

    componentDidUpdate() {
      this.callPropsCallbacks();
    }

    componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }
    }

    render() {
      const { className, height, style, width } = this.props;
      const { isScrolling } = this.state;

      const estimatedTotalHeight = getEstimatedTotalHeight(
        this.props,
        this._instanceProps
      );
      const estimatedTotalWidth = getEstimatedTotalWidth(
        this.props,
        this._instanceProps
      );

      return (
        <div
          className={className}
          ref={this.scrollingContainerRef}
          style={{
            position: 'relative',
            height,
            width,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform',
            ...style,
          }}
          onScroll={this.onScroll}
        >
          <div
            style={{
              height: estimatedTotalHeight,
              overflow: 'hidden',
              pointerEvents: isScrolling ? 'none' : '',
              width: estimatedTotalWidth,
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
        columnStopIndex,
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
            this._cellStyleCache[key] = style = {
              position: 'absolute',
              left: getColumnOffset(
                this.props,
                columnIndex,
                this._instanceProps
              ),
              top: getRowOffset(this.props, rowIndex, this._instanceProps),
              height: getRowHeight(this.props, rowIndex, this._instanceProps),
              width: getColumnWidth(
                this.props,
                columnIndex,
                this._instanceProps
              ),
            };
          }

          cells.push(
            children({
              columnIndex,
              key,
              isScrolling: useIsScrolling ? isScrolling : undefined,
              rowIndex,
              style,
            })
          );
        }
      }

      return cells;
    }

    callOnItemsRendered: (
      overscanColumnStartIndex: number,
      overscanColumnStopIndex: number,
      overscanRowStartIndex: number,
      overscanRowStopIndex: number,
      visibleColumnStartIndex: number,
      visibleColumnStopIndex: number,
      visibleRowStartIndex: number,
      visibleRowStopIndex: number
    ) => void;
    callOnItemsRendered = memoizeOne(
      (
        overscanColumnStartIndex: number,
        overscanColumnStopIndex: number,
        overscanRowStartIndex: number,
        overscanRowStopIndex: number,
        visibleColumnStartIndex: number,
        visibleColumnStopIndex: number,
        visibleRowStartIndex: number,
        visibleRowStopIndex: number
      ) =>
        ((this.props.onItemsRendered: any): onItemsRenderedCallback)({
          overscanColumnStartIndex,
          overscanColumnStopIndex,
          overscanRowStartIndex,
          overscanRowStopIndex,
          visibleColumnStartIndex,
          visibleColumnStopIndex,
          visibleRowStartIndex,
          visibleRowStopIndex,
        })
    );

    callOnScroll: (
      scrollLeft: number,
      scrollTop: number,
      horizontalScrollDirection: ScrollDirection,
      verticalScrollDirection: ScrollDirection
    ) => void;
    callOnScroll = memoizeOne(
      (
        scrollLeft: number,
        scrollTop: number,
        horizontalScrollDirection: ScrollDirection,
        verticalScrollDirection: ScrollDirection
      ) =>
        ((this.props.onScroll: any): onScrollCallback)({
          horizontalScrollDirection,
          scrollLeft,
          scrollTop,
          verticalScrollDirection,
        })
    );

    callPropsCallbacks() {
      if (typeof this.props.onItemsRendered === 'function') {
        const [
          overscanColumnStartIndex,
          overscanColumnStopIndex,
          visibleColumnStartIndex,
          visibleColumnStopIndex,
        ] = this.getHorizontalRangeToRender();
        const [
          overscanRowStartIndex,
          overscanRowStopIndex,
          visibleRowStartIndex,
          visibleRowStopIndex,
        ] = this.getVerticalRangeToRender();
        this.callOnItemsRendered(
          overscanColumnStartIndex,
          overscanColumnStopIndex,
          overscanRowStartIndex,
          overscanRowStopIndex,
          visibleColumnStartIndex,
          visibleColumnStopIndex,
          visibleRowStartIndex,
          visibleRowStopIndex
        );
      }

      if (typeof this.props.onScroll === 'function') {
        const {
          horizontalScrollDirection,
          scrollLeft,
          scrollTop,
          verticalScrollDirection,
        } = this.state;
        this.callOnScroll(
          scrollLeft,
          scrollTop,
          horizontalScrollDirection,
          verticalScrollDirection
        );
      }
    }

    getHorizontalRangeToRender(): [number, number, number, number] {
      const { columnCount, overscanCount } = this.props;
      const { horizontalScrollDirection, scrollLeft } = this.state;

      const startIndex = getColumnStartIndexForOffset(
        this.props,
        scrollLeft,
        this._instanceProps
      );
      const stopIndex = getColumnStopIndexForStartIndex(
        this.props,
        startIndex,
        this._instanceProps
      );

      // Overscan by one cell in each direction so that tab/focus works.
      // If there isn't at least one extra cell, tab loops back around.
      const overscanBackward =
        horizontalScrollDirection === 'backward'
          ? Math.max(1, overscanCount)
          : 1;
      const overscanForward =
        horizontalScrollDirection === 'forward'
          ? Math.max(1, overscanCount)
          : 1;

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.min(columnCount - 1, stopIndex + overscanForward),
        startIndex,
        stopIndex,
      ];
    }

    getVerticalRangeToRender(): [number, number, number, number] {
      const { columnCount, overscanCount } = this.props;
      const { verticalScrollDirection, scrollTop } = this.state;

      const startIndex = getRowStartIndexForOffset(
        this.props,
        scrollTop,
        this._instanceProps
      );
      const stopIndex = getRowStopIndexForStartIndex(
        this.props,
        startIndex,
        this._instanceProps
      );

      // Overscan by one cell in each direction so that tab/focus works.
      // If there isn't at least one extra cell, tab loops back around.
      const overscanBackward =
        verticalScrollDirection === 'backward' ? Math.max(1, overscanCount) : 1;
      const overscanForward =
        verticalScrollDirection === 'forward' ? Math.max(1, overscanCount) : 1;

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.min(columnCount - 1, stopIndex + overscanForward),
        startIndex,
        stopIndex,
      ];
    }

    onScroll = (event: ScrollEvent): void => {
      const { scrollLeft, scrollTop } = event.currentTarget;
      this.setState(
        prevState => ({
          isScrolling: true,
          horizontalScrollDirection:
            prevState.scrollLeft < scrollLeft ? 'forward' : 'backward',
          scrollLeft,
          scrollTop,
          verticalScrollDirection:
            prevState.scrollTop < scrollTop ? 'forward' : 'backward',
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
  if (process.env.NODE_ENV !== 'production') {
    if (typeof children !== 'function') {
      throw Error(
        'An invalid "children" prop has been specified. ' +
          'Value should be a function that creates a React element. ' +
          `"${children === null ? 'null' : typeof children}" was specified.`
      );
    }

    if (typeof width !== 'number') {
      throw Error(
        'An invalid "width" prop has been specified. ' +
          'Grids must specify a number for width. ' +
          `"${width === null ? 'null' : typeof width}" was specified.`
      );
    }

    if (typeof height !== 'number') {
      throw Error(
        'An invalid "height" prop has been specified. ' +
          'Grids must specify a number for height. ' +
          `"${height === null ? 'null' : typeof height}" was specified.`
      );
    }
  }
};
