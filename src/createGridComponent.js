// @flow

import memoizeOne from 'memoize-one';
import React, { PureComponent } from 'react';

export type ScrollToAlign = 'auto' | 'center' | 'start' | 'end';

type itemSize = number | ((index: number) => number);

type RenderFunctionParams = {|
  columnIndex: number,
  isScrolling?: boolean,
  rowIndex: number,
  style: Object,
|};
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
  scrollUpdateWasRequested: boolean,
  verticalScrollDirection: ScrollDirection,
}) => void;

type ScrollEvent = SyntheticEvent<HTMLDivElement>;

export type Props = {|
  children: RenderFunction,
  className?: string,
  columnCount: number,
  columnWidth: itemSize,
  initialScrollLeft?: number,
  initialScrollTop?: number,
  height: number,
  onItemsRendered?: OnItemsRenderedCallback,
  onScroll?: OnScrollCallback,
  overscanCount: number,
  rowCount: number,
  rowHeight: itemSize,
  style?: Object,
  useIsScrolling: boolean,
  width: number,
|};

type State = {|
  isScrolling: boolean,
  horizontalScrollDirection: ScrollDirection,
  scrollLeft: number,
  scrollTop: number,
  scrollUpdateWasRequested: boolean,
  verticalScrollDirection: ScrollDirection,
|};

type getItemOffset = (
  props: Props,
  index: number,
  instanceProps: any
) => number;
type getItemSize = (props: Props, index: number, instanceProps: any) => number;
type getEstimatedTotalSize = (props: Props, instanceProps: any) => number;
type GetOffsetForItemAndAlignment = (
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
  getColumnOffset: getItemOffset,
  getColumnStartIndexForOffset: GetStartIndexForOffset,
  getColumnStopIndexForStartIndex: GetStopIndexForStartIndex,
  getColumnWidth: getItemSize,
  getEstimatedTotalHeight: getEstimatedTotalSize,
  getEstimatedTotalWidth: getEstimatedTotalSize,
  getOffsetForColumnAndAlignment: GetOffsetForItemAndAlignment,
  getOffsetForRowAndAlignment: GetOffsetForItemAndAlignment,
  getRowOffset: getItemOffset,
  getRowHeight: getItemSize,
  getRowStartIndexForOffset: GetStartIndexForOffset,
  getRowStopIndexForStartIndex: GetStopIndexForStartIndex,
  initInstanceProps: InitInstanceProps,
  validateProps: ValidateProps,
|}) {
  return class Grid extends PureComponent<Props, State> {
    _itemStyleCache: { [key: string]: Object } = {};
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
        typeof this.props.initialScrollLeft === 'number'
          ? this.props.initialScrollLeft
          : 0,
      scrollTop:
        typeof this.props.initialScrollTop === 'number'
          ? this.props.initialScrollTop
          : 0,
      scrollUpdateWasRequested: false,
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
      this.setState(
        prevState => ({
          horizontalScrollDirection:
            prevState.scrollLeft < scrollLeft ? 'forward' : 'backward',
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
          scrollUpdateWasRequested: true,
          verticalScrollDirection:
            prevState.scrollTop < scrollTop ? 'forward' : 'backward',
        }),
        this._resetIsScrollingDebounced
      );
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
      const { initialScrollLeft, initialScrollTop } = this.props;
      if (
        typeof initialScrollLeft === 'number' &&
        this._scrollingContainer != null
      ) {
        ((this
          ._scrollingContainer: any): HTMLDivElement).scrollLeft = initialScrollLeft;
      }
      if (
        typeof initialScrollTop === 'number' &&
        this._scrollingContainer != null
      ) {
        ((this
          ._scrollingContainer: any): HTMLDivElement).scrollTop = initialScrollTop;
      }

      this._callPropsCallbacks();
    }

    componentDidUpdate() {
      const { scrollLeft, scrollTop, scrollUpdateWasRequested } = this.state;
      if (scrollUpdateWasRequested && this._scrollingContainer !== null) {
        ((this
          ._scrollingContainer: any): HTMLDivElement).scrollLeft = scrollLeft;
        ((this._scrollingContainer: any): HTMLDivElement).scrollTop = scrollTop;
      }

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

      const [
        columnStartIndex,
        columnStopIndex,
      ] = this._getHorizontalRangeToRender();
      const [rowStartIndex, rowStopIndex] = this._getVerticalRangeToRender();

      const items = [];
      if (columnCount > 0 && rowCount) {
        for (
          let rowIndex = rowStartIndex;
          rowIndex <= rowStopIndex;
          rowIndex++
        ) {
          for (
            let columnIndex = columnStartIndex;
            columnIndex <= columnStopIndex;
            columnIndex++
          ) {
            items.push(
              <GridItem
                columnIndex={columnIndex}
                isScrolling={useIsScrolling ? isScrolling : undefined}
                key={`${rowIndex}:${columnIndex}`}
                renderFunction={this._renderFunction}
                rowIndex={rowIndex}
                style={this._getItemStyle(rowIndex, columnIndex)}
              />
            );
          }
        }
      }

      // Read this value AFTER items have been created,
      // So their actual sizes (if variable) are taken into consideration.
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
            {items}
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
      verticalScrollDirection: ScrollDirection,
      scrollUpdateWasRequested: boolean
    ) => void;
    _callOnScroll = memoizeOne(
      (
        scrollLeft: number,
        scrollTop: number,
        horizontalScrollDirection: ScrollDirection,
        verticalScrollDirection: ScrollDirection,
        scrollUpdateWasRequested: boolean
      ) =>
        ((this.props.onScroll: any): OnScrollCallback)({
          horizontalScrollDirection,
          scrollLeft,
          scrollTop,
          verticalScrollDirection,
          scrollUpdateWasRequested,
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
          scrollUpdateWasRequested,
          verticalScrollDirection,
        } = this.state;
        this._callOnScroll(
          scrollLeft,
          scrollTop,
          horizontalScrollDirection,
          verticalScrollDirection,
          scrollUpdateWasRequested
        );
      }
    }

    // Lazily create and cache item styles while scrolling,
    // So that pure component sCU will prevent re-renders.
    // We maintain this cache, and pass a style prop rather than index,
    // So that List can clear cached styles and force item re-render if necessary.
    _getItemStyle: (rowIndex: number, columnIndex: number) => Object;
    _getItemStyle = (rowIndex: number, columnIndex: number): Object => {
      const key = `${rowIndex}:${columnIndex}`;

      let style;
      if (this._itemStyleCache.hasOwnProperty(key)) {
        style = this._itemStyleCache[key];
      } else {
        this._itemStyleCache[key] = style = {
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

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
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

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
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
      this.setState(prevState => {
        if (
          prevState.scrollLeft === scrollLeft &&
          prevState.scrollTop === scrollTop
        ) {
          // Scroll position may have been updated by cDM/cDU,
          // In which case we don't need to trigger another render,
          // And we don't want to update state.isScrolling.
          return null;
        }

        return {
          isScrolling: true,
          horizontalScrollDirection:
            prevState.scrollLeft < scrollLeft ? 'forward' : 'backward',
          scrollLeft,
          scrollTop,
          verticalScrollDirection:
            prevState.scrollTop < scrollTop ? 'forward' : 'backward',
          scrollUpdateWasRequested: false,
        };
      }, this._resetIsScrollingDebounced);
    };

    _scrollingContainerRef = (ref: any): void => {
      this._scrollingContainer = ((ref: any): HTMLDivElement);
    };

    // Facade for the user-provided children function.
    // This adds the overhead of an additional method call,
    // But has hte benefit of not breaking pure sCU checks,
    // Allowing List to avoid re-rendering items until indices change.
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
        // This way we don't break pure sCU for items that don't use isScrolling param.
        this._itemStyleCache = {};
      });
    };
  };
}

type GridItemProps = {
  columnIndex: number,
  isScrolling?: boolean,
  renderFunction: RenderFunction,
  rowIndex: number,
  style: Object,
};

class GridItem extends PureComponent<GridItemProps, void> {
  render() {
    const {
      columnIndex,
      isScrolling,
      renderFunction,
      rowIndex,
      style,
    } = this.props;

    return renderFunction({
      columnIndex,
      isScrolling,
      rowIndex,
      style,
    });
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
