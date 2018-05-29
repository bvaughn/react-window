// @flow

import memoizeOne from 'memoize-one';
import React, { PureComponent } from 'react';

export type ScrollToAlign = 'auto' | 'center' | 'start' | 'end';

type CellSize = number | ((index: number) => number);

type RenderFunctionParams = {
  columnIndex: number,
  key: string,
  rowIndex: number,
  style: Object,
};
export type RenderFunction = (params: RenderFunctionParams) => React$Node;

type ScrollDirection = 'forward' | 'backward';

type OnItemsRenderedCallback = ({
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number,
  visibleColumnStartIndex: number,
  visibleColumnStopIndex: number,
  visibleRowStartIndex: number,
  visibleRowStopIndex: number,
}) => void;
type OnScrollCallback = ({
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
  defaultScrollLeft?: number,
  defaultScrollTop?: number,
  height: number,
  onItemsRendered?: OnItemsRenderedCallback,
  onScroll?: OnScrollCallback,
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
type GetOffsetForCellAndAlignment = (
  props: Props,
  index: number,
  align: ScrollToAlign,
  scrollOffset: number,
  instanceProps: any
) => number;
type GetStartIndexForOffset = (
  props: Props,
  offset: number,
  instanceProps: any
) => number;
type GetStopIndexForStartIndex = (
  props: Props,
  startIndex: number,
  scrollOffset: number,
  instanceProps: any
) => number;
type InitInstanceProps = (props: Props, instance: any) => any;
type ValidateProps = (props: Props) => void;

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
  getColumnStartIndexForOffset: GetStartIndexForOffset,
  getColumnStopIndexForStartIndex: GetStopIndexForStartIndex,
  getColumnWidth: getCellSize,
  getEstimatedTotalHeight: getEstimatedTotalSize,
  getEstimatedTotalWidth: getEstimatedTotalSize,
  getOffsetForColumnAndAlignment: GetOffsetForCellAndAlignment,
  getOffsetForRowAndAlignment: GetOffsetForCellAndAlignment,
  getRowOffset: getCellOffset,
  getRowHeight: getCellSize,
  getRowStartIndexForOffset: GetStartIndexForOffset,
  getRowStopIndexForStartIndex: GetStopIndexForStartIndex,
  initInstanceProps: InitInstanceProps,
  validateProps: ValidateProps,
|}) {
  return class Grid extends PureComponent<Props, State> {
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
      scrollLeft:
        typeof this.props.defaultScrollLeft === 'number'
          ? this.props.defaultScrollLeft
          : 0,
      scrollTop:
        typeof this.props.defaultScrollTop === 'number'
          ? this.props.defaultScrollTop
          : 0,
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

      if (process.env.NODE_ENV === 'test') {
        // Setting scroll offset doesn't fire the onScroll callback for react-test-renderer.
        // This test-only code makes it easier to test simualted scrolling behavior.
        // It should be stripped out of any non-test code.
        this._onScroll(({ currentTarget: { scrollLeft, scrollTop } }: any));
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
      const { defaultScrollLeft, defaultScrollTop } = this.props;

      if (
        typeof defaultScrollLeft === 'number' &&
        this._scrollingContainer != null
      ) {
        ((this
          ._scrollingContainer: any): HTMLDivElement).scrollLeft = defaultScrollLeft;
      }
      if (
        typeof defaultScrollTop === 'number' &&
        this._scrollingContainer != null
      ) {
        ((this
          ._scrollingContainer: any): HTMLDivElement).scrollTop = defaultScrollTop;
      }

      this._callPropsCallbacks();
    }

    componentDidUpdate() {
      this._callPropsCallbacks();
    }

    componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }
    }

    render() {
      const {
        className,
        columnCount,
        height,
        rowCount,
        style,
        useIsScrolling,
        width,
      } = this.props;
      const { isScrolling } = this.state;

      const estimatedTotalHeight = getEstimatedTotalHeight(
        this.props,
        this._instanceProps
      );
      const estimatedTotalWidth = getEstimatedTotalWidth(
        this.props,
        this._instanceProps
      );

      const [
        columnStartIndex,
        columnStopIndex,
      ] = this._getHorizontalRangeToRender();
      const [rowStartIndex, rowStopIndex] = this._getVerticalRangeToRender();

      return (
        <div
          className={className}
          ref={this._scrollingContainerRef}
          style={{
            position: 'relative',
            height,
            width,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform',
            ...style,
          }}
          onScroll={this._onScroll}
        >
          <div
            style={{
              height: estimatedTotalHeight,
              overflow: 'hidden',
              pointerEvents: isScrolling ? 'none' : '',
              width: estimatedTotalWidth,
            }}
          >
            {columnCount > 0 &&
              rowCount > 0 && (
                <GridItems
                  columnStartIndex={columnStartIndex}
                  columnStopIndex={columnStopIndex}
                  getCellStyle={this._getCellStyle}
                  isScrolling={useIsScrolling ? isScrolling : undefined}
                  renderFunction={this._renderFunction}
                  rowStartIndex={rowStartIndex}
                  rowStopIndex={rowStopIndex}
                />
              )}
          </div>
        </div>
      );
    }

    _callOnItemsRendered: (
      overscanColumnStartIndex: number,
      overscanColumnStopIndex: number,
      overscanRowStartIndex: number,
      overscanRowStopIndex: number,
      visibleColumnStartIndex: number,
      visibleColumnStopIndex: number,
      visibleRowStartIndex: number,
      visibleRowStopIndex: number
    ) => void;
    _callOnItemsRendered = memoizeOne(
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
        ((this.props.onItemsRendered: any): OnItemsRenderedCallback)({
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

    _callOnScroll: (
      scrollLeft: number,
      scrollTop: number,
      horizontalScrollDirection: ScrollDirection,
      verticalScrollDirection: ScrollDirection
    ) => void;
    _callOnScroll = memoizeOne(
      (
        scrollLeft: number,
        scrollTop: number,
        horizontalScrollDirection: ScrollDirection,
        verticalScrollDirection: ScrollDirection
      ) =>
        ((this.props.onScroll: any): OnScrollCallback)({
          horizontalScrollDirection,
          scrollLeft,
          scrollTop,
          verticalScrollDirection,
        })
    );

    _callPropsCallbacks() {
      if (typeof this.props.onItemsRendered === 'function') {
        const [
          overscanColumnStartIndex,
          overscanColumnStopIndex,
          visibleColumnStartIndex,
          visibleColumnStopIndex,
        ] = this._getHorizontalRangeToRender();
        const [
          overscanRowStartIndex,
          overscanRowStopIndex,
          visibleRowStartIndex,
          visibleRowStopIndex,
        ] = this._getVerticalRangeToRender();
        this._callOnItemsRendered(
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
        this._callOnScroll(
          scrollLeft,
          scrollTop,
          horizontalScrollDirection,
          verticalScrollDirection
        );
      }
    }

    // Lazily create and cache cell styles while scrolling,
    // So that pure component sCU will prevent re-renders.
    _getCellStyle: (rowIndex: number, columnIndex: number) => Object;
    _getCellStyle = (rowIndex: number, columnIndex: number): Object => {
      const key = `${rowIndex}:${columnIndex}`;

      let style;
      if (this._cellStyleCache.hasOwnProperty(key)) {
        style = this._cellStyleCache[key];
      } else {
        this._cellStyleCache[key] = style = {
          position: 'absolute',
          left: getColumnOffset(this.props, columnIndex, this._instanceProps),
          top: getRowOffset(this.props, rowIndex, this._instanceProps),
          height: getRowHeight(this.props, rowIndex, this._instanceProps),
          width: getColumnWidth(this.props, columnIndex, this._instanceProps),
        };
      }

      return style;
    };

    _getHorizontalRangeToRender(): [number, number, number, number] {
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
        scrollLeft,
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
        Math.max(0, Math.min(columnCount - 1, stopIndex + overscanForward)),
        startIndex,
        stopIndex,
      ];
    }

    _getVerticalRangeToRender(): [number, number, number, number] {
      const { rowCount, overscanCount } = this.props;
      const { verticalScrollDirection, scrollTop } = this.state;

      const startIndex = getRowStartIndexForOffset(
        this.props,
        scrollTop,
        this._instanceProps
      );
      const stopIndex = getRowStopIndexForStartIndex(
        this.props,
        startIndex,
        scrollTop,
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
        Math.max(0, Math.min(rowCount - 1, stopIndex + overscanForward)),
        startIndex,
        stopIndex,
      ];
    }

    _onScroll = (event: ScrollEvent): void => {
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
        this._resetIsScrollingDebounced
      );
    };

    _scrollingContainerRef = (ref: any): void => {
      this._scrollingContainer = ((ref: any): HTMLDivElement);
    };

    // Facade for the user-provided children function.
    // This adds the overhead of an additional method call,
    // But has hte benefit of not breaking pure sCU checks,
    // Allowing List to avoid re-rendering cells until indices change.
    _renderFunction: RenderFunction;
    _renderFunction = (params: RenderFunctionParams) =>
      this.props.children(params);

    _resetIsScrollingDebounced = () => {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }

      this._resetIsScrollingTimeoutId = setTimeout(
        this._resetIsScrolling,
        IS_SCROLLING_DEBOUNCE_INTERVAL
      );
    };

    _resetIsScrollingDebounced = () => {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }

      this._resetIsScrollingTimeoutId = setTimeout(
        this._resetIsScrolling,
        IS_SCROLLING_DEBOUNCE_INTERVAL
      );
    };

    _resetIsScrolling = () => {
      this._resetIsScrollingTimeoutId = null;

      this.setState({ isScrolling: false }, () => {
        // Clear style cache after state update has been committed.
        // This way we don't break pure sCU for cells that don't use isScrolling param.
        this._cellStyleCache = {};
      });
    };
  };
}

type GridItemsProps = {
  columnStartIndex: number,
  columnStopIndex: number,
  getCellStyle: (rowIndex: number, columnIndex: number) => Object,
  isScrolling?: boolean,
  renderFunction: RenderFunction,
  rowStartIndex: number,
  rowStopIndex: number,
};

class GridItems extends PureComponent<GridItemsProps, void> {
  render() {
    const {
      columnStartIndex,
      columnStopIndex,
      getCellStyle,
      isScrolling,
      renderFunction,
      rowStartIndex,
      rowStopIndex,
    } = this.props;

    const cells = [];

    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      for (
        let columnIndex = columnStartIndex;
        columnIndex <= columnStopIndex;
        columnIndex++
      ) {
        const key = `${rowIndex}:${columnIndex}`;
        const style = getCellStyle(rowIndex, columnIndex);

        cells.push(
          renderFunction({
            columnIndex,
            key,
            isScrolling,
            rowIndex,
            style,
          })
        );
      }
    }

    return cells;
  }
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
