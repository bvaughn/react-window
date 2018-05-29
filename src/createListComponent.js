// @flow

import memoizeOne from 'memoize-one';
import React, { PureComponent } from 'react';

export type ScrollToAlign = 'auto' | 'center' | 'start' | 'end';

type CellSize = number | ((index: number) => number);
type Direction = 'horizontal' | 'vertical';

type RenderFunctionParams = {
  index: number,
  key: string,
  style: Object,
};
type RenderFunction = (params: RenderFunctionParams) => React$Node;

type ScrollDirection = 'forward' | 'backward';

type onItemsRenderedCallback = ({
  overscanStartIndex: number,
  overscanStopIndex: number,
  visibleStartIndex: number,
  visibleStopIndex: number,
}) => void;
type onScrollCallback = ({
  scrollDirection: ScrollDirection,
  scrollOffset: number,
}) => void;

type ScrollEvent = SyntheticEvent<HTMLDivElement>;

export type Props = {|
  cellSize: CellSize,
  children: RenderFunction,
  className?: string,
  count: number,
  initialScrollOffset?: number,
  direction: Direction,
  height: number | string,
  onItemsRendered?: onItemsRenderedCallback,
  onScroll?: onScrollCallback,
  overscanCount: number,
  style?: Object,
  useIsScrolling: boolean,
  width: number | string,
|};

type State = {|
  isScrolling: boolean,
  scrollDirection: ScrollDirection,
  scrollOffset: number,
|};

type GetCellOffset = (
  props: Props,
  index: number,
  instanceProps: any
) => number;
type GetCellSize = (props: Props, index: number, instanceProps: any) => number;
type GetEstimatedTotalSize = (props: Props, instanceProps: any) => number;
type GetOffsetForIndexAndAlignment = (
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

export default function createListComponent({
  getCellOffset,
  getCellSize,
  getEstimatedTotalSize,
  getOffsetForIndexAndAlignment,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps,
  validateProps,
}: {|
  getCellOffset: GetCellOffset,
  getCellSize: GetCellSize,
  getEstimatedTotalSize: GetEstimatedTotalSize,
  getOffsetForIndexAndAlignment: GetOffsetForIndexAndAlignment,
  getStartIndexForOffset: GetStartIndexForOffset,
  getStopIndexForStartIndex: GetStopIndexForStartIndex,
  initInstanceProps: InitInstanceProps,
  validateProps: ValidateProps,
|}) {
  return class List extends PureComponent<Props, State> {
    _cellStyleCache: { [index: number]: Object } = {};
    _instanceProps: any = initInstanceProps(this.props, this);
    _resetIsScrollingTimeoutId: TimeoutID | null = null;
    _scrollingContainer: ?HTMLDivElement;

    static defaultProps = {
      direction: 'vertical',
      overscanCount: 2,
      useIsScrolling: false,
    };

    state: State = {
      isScrolling: false,
      scrollDirection: 'forward',
      scrollOffset:
        typeof this.props.initialScrollOffset === 'number'
          ? this.props.initialScrollOffset
          : 0,
    };

    static getDerivedStateFromProps(
      nextProps: Props,
      prevState: State
    ): $Shape<State> {
      validateSharedProps(nextProps);
      validateProps(nextProps);
      return null;
    }

    scrollTo(scrollOffset: number): void {
      if (this._scrollingContainer != null) {
        const { direction } = this.props;

        if (direction === 'horizontal') {
          ((this
            ._scrollingContainer: any): HTMLDivElement).scrollLeft = scrollOffset;
        } else {
          ((this
            ._scrollingContainer: any): HTMLDivElement).scrollTop = scrollOffset;
        }
      }

      if (process.env.NODE_ENV === 'test') {
        // Setting scroll offset doesn't fire the onScroll callback for react-test-renderer.
        // This test-only code makes it easier to test simualted scrolling behavior.
        // It should be stripped out of any non-test code.
        if (this.props.direction === 'horizontal') {
          this._onScrollHorizontal(
            ({ currentTarget: { scrollLeft: scrollOffset } }: any)
          );
        } else {
          this._onScrollVertical(
            ({ currentTarget: { scrollTop: scrollOffset } }: any)
          );
        }
      }
    }

    scrollToItem(index: number, align: ScrollToAlign = 'auto'): void {
      const { scrollOffset } = this.state;
      this.scrollTo(
        getOffsetForIndexAndAlignment(
          this.props,
          index,
          align,
          scrollOffset,
          this._instanceProps
        )
      );
    }

    componentDidMount() {
      const { initialScrollOffset, direction } = this.props;

      if (typeof initialScrollOffset === 'number') {
        if (this._scrollingContainer != null) {
          if (direction === 'horizontal') {
            ((this
              ._scrollingContainer: any): HTMLDivElement).scrollLeft = initialScrollOffset;
          } else {
            ((this
              ._scrollingContainer: any): HTMLDivElement).scrollTop = initialScrollOffset;
          }
        }
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
        count,
        direction,
        height,
        style,
        useIsScrolling,
        width,
      } = this.props;
      const { isScrolling } = this.state;

      const onScroll =
        direction === 'vertical'
          ? this._onScrollVertical
          : this._onScrollHorizontal;

      const estimatedTotalSize = getEstimatedTotalSize(
        this.props,
        this._instanceProps
      );

      const [startIndex, stopIndex] = this._getRangeToRender();

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
          onScroll={onScroll}
        >
          <div
            style={{
              height: direction === 'horizontal' ? height : estimatedTotalSize,
              overflow: 'hidden',
              pointerEvents: isScrolling ? 'none' : '',
              width: direction === 'horizontal' ? estimatedTotalSize : width,
            }}
          >
            {count > 0 && (
              <ListItems
                getCellStyle={this._getCellStyle}
                isScrolling={useIsScrolling ? isScrolling : undefined}
                renderFunction={this._renderFunction}
                startIndex={startIndex}
                stopIndex={stopIndex}
              />
            )}
          </div>
        </div>
      );
    }

    _callOnItemsRendered: (
      overscanStartIndex: number,
      overscanStopIndex: number,
      visibleStartIndex: number,
      visibleStopIndex: number
    ) => void;
    _callOnItemsRendered = memoizeOne(
      (
        overscanStartIndex: number,
        overscanStopIndex: number,
        visibleStartIndex: number,
        visibleStopIndex: number
      ) =>
        ((this.props.onItemsRendered: any): onItemsRenderedCallback)({
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex,
        })
    );

    _callOnScroll: (
      scrollDirection: ScrollDirection,
      scrollOffset: number
    ) => void;
    _callOnScroll = memoizeOne(
      (scrollDirection: ScrollDirection, scrollOffset: number) =>
        ((this.props.onScroll: any): onScrollCallback)({
          scrollDirection,
          scrollOffset,
        })
    );

    _callPropsCallbacks() {
      if (typeof this.props.onItemsRendered === 'function') {
        const [
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex,
        ] = this._getRangeToRender();
        this._callOnItemsRendered(
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex
        );
      }

      if (typeof this.props.onScroll === 'function') {
        const { scrollDirection, scrollOffset } = this.state;
        this._callOnScroll(scrollDirection, scrollOffset);
      }
    }

    // Lazily create and cache cell styles while scrolling,
    // So that pure component sCU will prevent re-renders.
    _getCellStyle: (index: number) => Object;
    _getCellStyle = (index: number): Object => {
      const { direction } = this.props;

      let style;
      if (this._cellStyleCache.hasOwnProperty(index)) {
        style = this._cellStyleCache[index];
      } else {
        this._cellStyleCache[index] = style = {
          position: 'absolute',
          left:
            direction === 'horizontal'
              ? getCellOffset(this.props, index, this._instanceProps)
              : 0,
          top:
            direction === 'vertical'
              ? getCellOffset(this.props, index, this._instanceProps)
              : 0,
          height:
            direction === 'vertical'
              ? getCellSize(this.props, index, this._instanceProps)
              : '100%',
          width:
            direction === 'horizontal'
              ? getCellSize(this.props, index, this._instanceProps)
              : '100%',
        };
      }

      return style;
    };

    _getRangeToRender(): [number, number, number, number] {
      const { count, overscanCount } = this.props;
      const { scrollDirection, scrollOffset } = this.state;

      const startIndex = getStartIndexForOffset(
        this.props,
        scrollOffset,
        this._instanceProps
      );
      const stopIndex = getStopIndexForStartIndex(
        this.props,
        startIndex,
        scrollOffset,
        this._instanceProps
      );

      // Overscan by one cell in each direction so that tab/focus works.
      // If there isn't at least one extra cell, tab loops back around.
      const overscanBackward =
        scrollDirection === 'backward' ? Math.max(1, overscanCount) : 1;
      const overscanForward =
        scrollDirection === 'forward' ? Math.max(1, overscanCount) : 1;

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.max(0, Math.min(count - 1, stopIndex + overscanForward)),
        startIndex,
        stopIndex,
      ];
    }

    _onScrollHorizontal = (event: ScrollEvent): void => {
      const { scrollLeft } = event.currentTarget;
      this.setState(
        prevState => ({
          isScrolling: true,
          scrollDirection:
            prevState.scrollOffset < scrollLeft ? 'forward' : 'backward',
          scrollOffset: scrollLeft,
        }),
        this._resetIsScrollingDebounced
      );
    };

    _onScrollVertical = (event: ScrollEvent): void => {
      const { scrollTop } = event.currentTarget;
      this.setState(
        prevState => ({
          isScrolling: true,
          scrollDirection:
            prevState.scrollOffset < scrollTop ? 'forward' : 'backward',
          scrollOffset: scrollTop,
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

type ListItemsProps = {
  getCellStyle: (index: number) => Object,
  isScrolling?: boolean,
  renderFunction: RenderFunction,
  startIndex: number,
  stopIndex: number,
};

class ListItems extends PureComponent<ListItemsProps, void> {
  render() {
    const {
      getCellStyle,
      isScrolling,
      renderFunction,
      startIndex,
      stopIndex,
    } = this.props;

    const cells = [];

    for (let index = startIndex; index <= stopIndex; index++) {
      const key = '' + index;
      const style = getCellStyle(index);

      cells.push(
        renderFunction({
          key,
          index,
          isScrolling,
          style,
        })
      );
    }

    return cells;
  }
}

// NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.

const validateSharedProps = ({
  children,
  direction,
  height,
  width,
}: Props): void => {
  if (process.env.NODE_ENV !== 'production') {
    if (direction !== 'horizontal' && direction !== 'vertical') {
      throw Error(
        'An invalid "direction" prop has been specified. ' +
          'Value should be either "horizontal" or "vertical". ' +
          `"${direction}" was specified.`
      );
    }

    if (typeof children !== 'function') {
      throw Error(
        'An invalid "children" prop has been specified. ' +
          'Value should be a function that creates a React element. ' +
          `"${children === null ? 'null' : typeof children}" was specified.`
      );
    }

    if (direction === 'horizontal' && typeof width !== 'number') {
      throw Error(
        'An invalid "width" prop has been specified. ' +
          'Horizontal lists must specify a number for width. ' +
          `"${width === null ? 'null' : typeof width}" was specified.`
      );
    } else if (direction === 'vertical' && typeof height !== 'number') {
      throw Error(
        'An invalid "height" prop has been specified. ' +
          'Vertical lists must specify a number for height. ' +
          `"${height === null ? 'null' : typeof height}" was specified.`
      );
    }
  }
};
