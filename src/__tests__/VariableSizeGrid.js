import React, { createRef, PureComponent } from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import ReactTestRenderer from 'react-test-renderer';
import { VariableSizeGrid } from '..';
import * as domHelpers from '../domHelpers';

const simulateScroll = (instance, { scrollLeft, scrollTop }) => {
  instance._outerRef.scrollLeft = scrollLeft;
  instance._outerRef.scrollTop = scrollTop;
  Simulate.scroll(instance._outerRef);
};

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('VariableSizeGrid', () => {
  let columnWidth,
    defaultProps,
    getScrollbarSize,
    itemRenderer,
    onItemsRendered,
    rowHeight;

  // Use PureComponent to test memoization.
  // Pass through to itemRenderer mock for easier test assertions.
  class PureItemRenderer extends PureComponent {
    render() {
      return itemRenderer(this.props);
    }
  }

  const findItemRendererCall = (rowIndex: number, columnIndex: number) => {
    const found = itemRenderer.mock.calls.find(
      ([params]) =>
        params.rowIndex === rowIndex && params.columnIndex === columnIndex
    );
    return found.length === 1 ? found[0] : null;
  };

  beforeEach(() => {
    jest.useFakeTimers();

    // JSdom does not do actual layout and so doesn't return meaningful values here.
    // For the purposes of our tests though, we can mock out semi-meaningful values.
    // This mock is required for e.g. "onScroll" tests to work properly.
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {
        configurable: true,
        get: function() {
          return parseInt(this.style.width, 10) || 0;
        },
      },
      clientHeight: {
        configurable: true,
        get: function() {
          return parseInt(this.style.height, 10) || 0;
        },
      },
      scrollHeight: {
        configurable: true,
        get: () => Number.MAX_SAFE_INTEGER,
      },
      scrollWidth: {
        configurable: true,
        get: () => Number.MAX_SAFE_INTEGER,
      },
    });

    // Mock the DOM helper util for testing purposes.
    getScrollbarSize = domHelpers.getScrollbarSize = jest.fn(() => 0);

    itemRenderer = jest.fn(({ style, ...rest }) => (
      <div style={style}>{JSON.stringify(rest, null, 2)}</div>
    ));
    onItemsRendered = jest.fn();
    columnWidth = jest.fn(index => 50 + index);
    rowHeight = jest.fn(index => 25 + index);
    defaultProps = {
      children: PureItemRenderer,
      columnCount: 10,
      columnWidth,
      height: 100,
      onItemsRendered,
      rowCount: 20,
      rowHeight,
      width: 200,
    };
  });

  // Much of the shared Grid functionality is already tested by VariableSizeGrid tests.
  // This test covers functionality that is unique to VariableSizeGrid.

  it('should render an empty grid', () => {
    ReactTestRenderer.create(
      <VariableSizeGrid {...defaultProps} columnCount={0} rowCount={0} />
    );
    ReactTestRenderer.create(
      <VariableSizeGrid {...defaultProps} columnCount={0} />
    );
    ReactTestRenderer.create(
      <VariableSizeGrid {...defaultProps} rowCount={0} />
    );
    expect(itemRenderer).not.toHaveBeenCalled();
    expect(columnWidth).not.toHaveBeenCalled();
    expect(rowHeight).not.toHaveBeenCalled();
    expect(onItemsRendered).not.toHaveBeenCalled();
  });

  it('changing item size does not impact the rendered items', () => {
    const rendered = ReactTestRenderer.create(
      <VariableSizeGrid {...defaultProps} />
    );
    itemRenderer.mockClear();
    rendered.update(
      <VariableSizeGrid
        {...defaultProps}
        columnWidth={index => 100}
        rowHeight={index => 50}
      />
    );
    expect(itemRenderer).not.toHaveBeenCalled();
  });

  describe('estimatedColumnWidth and estimatedRowHeight', () => {
    it('should estimate an initial scrollable size based on this value', () => {
      const columnWidth = jest.fn(() => 50);
      const rowHeight = jest.fn(() => 25);
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          columnCount={50}
          columnWidth={columnWidth}
          estimatedColumnWidth={200}
          estimatedRowHeight={100}
          overscanColumnCount={0}
          overscanRowCount={0}
          rowCount={50}
          rowHeight={rowHeight}
        />
      );
      // We'll render 5 columns and 5 rows initially (250px wide by 125px tall).
      // The remaining 45 columns and 45 rows will be estimated (9,000px wide by 4,500px tall).
      expect(columnWidth).toHaveBeenCalledTimes(5);
      expect(rowHeight).toHaveBeenCalledTimes(5);
      const scrollContainer = findScrollContainer(rendered);
      expect(scrollContainer.props.style.width).toEqual(9250);
      expect(scrollContainer.props.style.height).toEqual(4625);
    });

    it('should udpate the scrollable size as more items are measured', () => {
      const columnWidth = jest.fn(() => 50);
      const rowHeight = jest.fn(() => 25);
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          columnCount={50}
          columnWidth={columnWidth}
          estimatedColumnWidth={200}
          estimatedRowHeight={100}
          overscanColumnCount={0}
          overscanRowCount={0}
          rowCount={50}
          rowHeight={rowHeight}
        />
      );
      rendered.getInstance().scrollToItem({ columnIndex: 13, rowIndex: 23 });
      // At this point we have measured 15 columns and 25 rows (750px wide by 625px tall).
      // The remaining 35 columns and 25 rows will be estimated (7,000px wide by 2,500px tall).
      expect(columnWidth).toHaveBeenCalledTimes(15);
      expect(rowHeight).toHaveBeenCalledTimes(25);
      const scrollContainer = findScrollContainer(rendered);
      expect(scrollContainer.props.style.width).toEqual(7750);
      expect(scrollContainer.props.style.height).toEqual(3125);
    });
  });

  describe('scrollToItem method', () => {
    it('should not set invalid offsets when the list contains few items', () => {
      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          columnCount={1}
          rowCount={2}
          onScroll={onScroll}
        />
      );
      expect(onItemsRendered).toMatchSnapshot();
      onItemsRendered.mockClear();
      rendered.getInstance().scrollToItem(0);
      expect(onItemsRendered).not.toHaveBeenCalled();
    });

    it('should scroll to the correct item for align = "auto"', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 5, align: 'auto' });
      // No need to scroll again; item 9 is already visible.
      // Overscan indices will change though, since direction changes.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 4, rowIndex: 4, align: 'auto' });
      // Scroll up enough to show item 2 at the top.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 2, rowIndex: 2, align: 'auto' });
      // Scroll down to row 10, without changing scrollLeft
      rendered.getInstance().scrollToItem({ rowIndex: 10, align: 'auto' });
      // Scroll left to column 0, without changing scrollTop
      rendered.getInstance().scrollToItem({ columnIndex: 0, align: 'auto' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('scroll with align = "auto" should work with partially-visible items', () => {
      const rendered = ReactTestRenderer.create(
        // Create list where items don't fit exactly into container.
        // The container has space for 3 1/3 items.
        <VariableSizeGrid
          {...defaultProps}
          columnCount={100}
          columnWidth={() => 70}
          rowCount={100}
          rowHeight={() => 30}
        />
      );
      // Scroll down enough to show row 10 at the bottom a nd column 10 at the right.
      // Should show 4 rows: 3 full and one partial at the beginning
      // Should show 3 columns: 2 full and one partial at the beginning
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'auto' });
      // No need to scroll again; row and column 9 are already visible.
      // Because there's no scrolling, it won't call onItemsRendered.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'auto' });
      // Scroll to near the end. row 96 and column 97 will be partly visible.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 99, rowIndex: 99, align: 'auto' });
      // Scroll back to row 91 and column 97.
      // This will cause row 99 and column 99 to be partly viisble
      // Even though a scroll happened,  none of the items rendered have changed.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 97, rowIndex: 96, align: 'auto' });
      // Scroll forward again. Because row and column #99 were already partly visible,
      // all props of the onItemsRendered will be the same.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 99, rowIndex: 99, align: 'auto' });
      // Scroll to the second row and column.
      // This should leave row 4 and column 3 partly visible.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'auto' });
      // Scroll to the first row and column.
      // This should leave row 3 and column 2 partly visible.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 0, rowIndex: 0, align: 'auto' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "auto" at the bottom of the grid', () => {
      getScrollbarSize.mockImplementation(() => 20);

      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );
      onItemsRendered.mockClear();

      // Scroll down to the last row in the list.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 19, align: 'auto' });

      expect(onItemsRendered).toHaveBeenCalledTimes(1);
      expect(onItemsRendered).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visibleRowStartIndex: 18,
          visibleRowStopIndex: 19,
        })
      );
      // Repeat the previous scrollToItem call.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 19, align: 'auto' });

      // Shouldn't have been called again
      expect(onItemsRendered).toHaveBeenCalledTimes(1);
      expect(onItemsRendered).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visibleRowStartIndex: 18,
          visibleRowStopIndex: 19,
        })
      );
    });

    it('should scroll to the correct item for align = "auto" at the right hand side of the grid', () => {
      getScrollbarSize.mockImplementation(() => 20);

      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} width={120} />
      );
      onItemsRendered.mockClear();

      // Scroll scross to the last row in the list.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 10, align: 'auto' });

      expect(onItemsRendered).toHaveBeenCalledTimes(1);
      expect(onItemsRendered).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visibleColumnStartIndex: 8,
          visibleColumnStopIndex: 9,
        })
      );
      // Repeat the previous scrollToItem call.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 10, align: 'auto' });

      // Shouldn't have been called again
      expect(onItemsRendered).toHaveBeenCalledTimes(1);
      expect(onItemsRendered).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visibleColumnStartIndex: 8,
          visibleColumnStopIndex: 9,
        })
      );
    });

    it('should scroll to the correct item for align = "start"', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the top.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 5, align: 'start' });
      // Scroll back up so that item 9 is at the top.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 4, rowIndex: 4, align: 'start' });
      // Item 99 can't align at the top because there aren't enough items.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 19, align: 'start' });
      // Scroll up to row 10, without changing scrollLeft
      rendered.getInstance().scrollToItem({ rowIndex: 10, align: 'start' });
      // Scroll left to column 0, without changing scrollTop
      rendered.getInstance().scrollToItem({ columnIndex: 0, align: 'start' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "end"', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 5, align: 'end' });
      // Scroll back up so that item 9 is at the bottom.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 4, rowIndex: 4, align: 'end' });
      // Item 1 can't align at the bottom because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'end' });
      // Scroll down to row 10, without changing scrollLeft
      rendered.getInstance().scrollToItem({ rowIndex: 10, align: 'end' });
      // Scroll right to column 9, without changing scrollTop
      rendered.getInstance().scrollToItem({ columnIndex: 9, align: 'end' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "center"', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 in the middle.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 5, align: 'center' });
      // Scroll back up so that item 9 is in the middle.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 4, rowIndex: 4, align: 'center' });
      // Item 1 can't align in the middle because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'center' });
      // Item 99 can't align in the middle because it's too close to the end.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 19, align: 'center' });
      // Scroll up to row 10, without changing scrollLeft
      rendered.getInstance().scrollToItem({ rowIndex: 10, align: 'center' });
      // Scroll left to column 3, without changing scrollTop
      rendered.getInstance().scrollToItem({ columnIndex: 3, align: 'center' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "smart"', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );

      // Scroll down enough to show item 10 at the center.
      // It was further than one screen away, so it gets centered.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'smart' });
      // No need to scroll again; item 9 is already visible.
      // Overscan indices will change though, since direction changes.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'smart' });
      // Scroll up enough to show item 2 as close to the center as we can.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 2, rowIndex: 2, align: 'smart' });
      // Scroll down to row 10, without changing scrollLeft
      rendered.getInstance().scrollToItem({ rowIndex: 10, align: 'smart' });
      // Scroll left to column 0, without changing scrollTop
      rendered.getInstance().scrollToItem({ columnIndex: 0, align: 'smart' });

      // Scrolling within a distance of a single screen from viewport
      // should have the 'auto' behavior of scrolling as little as possible.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 5, align: 'smart' });
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'smart' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should account for scrollbar size', () => {
      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} onScroll={onScroll} />
      );

      onScroll.mockClear();
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 10, align: 'end' });

      // With hidden scrollbars (size === 0) we would expect...
      expect(onScroll).toHaveBeenCalledWith({
        horizontalScrollDirection: 'forward',
        scrollLeft: 115,
        scrollTop: 230,
        scrollUpdateWasRequested: true,
        verticalScrollDirection: 'forward',
      });

      getScrollbarSize.mockImplementation(() => 20);

      onScroll.mockClear();
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 10, align: 'end' });

      // With scrollbars of size 20 we would expect those values ot increase by 20px
      expect(onScroll).toHaveBeenCalledWith({
        horizontalScrollDirection: 'forward',
        scrollLeft: 135,
        scrollTop: 250,
        scrollUpdateWasRequested: true,
        verticalScrollDirection: 'forward',
      });
    });

    it('should not account for scrollbar size when no scrollbar is visible for a particular direction', () => {
      getScrollbarSize.mockImplementation(() => 20);

      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          columnCount={1}
          onScroll={onScroll}
        />
      );

      onScroll.mockClear();
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 0, rowIndex: 10, align: 'end' });

      // Since there aren't enough columns to require horizontal scrolling,
      // the additional 20px for the scrollbar should not be taken into consideration.
      expect(onScroll).toHaveBeenCalledWith({
        horizontalScrollDirection: 'backward',
        scrollLeft: 0,
        scrollTop: 230,
        scrollUpdateWasRequested: true,
        verticalScrollDirection: 'forward',
      });

      rendered.update(
        <VariableSizeGrid {...defaultProps} rowCount={1} onScroll={onScroll} />
      );

      onScroll.mockClear();
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 5, rowIndex: 0, align: 'end' });

      // Since there aren't enough rows to require vertical scrolling,
      // the additional 20px for the scrollbar should not be taken into consideration.
      expect(onScroll).toHaveBeenCalledWith({
        horizontalScrollDirection: 'forward',
        scrollLeft: 115,
        scrollTop: 0,
        scrollUpdateWasRequested: true,
        verticalScrollDirection: 'backward',
      });
    });
  });

  describe('resetAfterIndex method', () => {
    it('should recalculate the estimated total size', () => {
      const columnWidth = jest.fn(() => 75);
      const rowHeight = jest.fn(() => 35);
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          columnWidth={index => 50}
          rowHeight={index => 25}
        />
      );
      rendered.getInstance().scrollToItem({ columnIndex: 9, rowIndex: 19 });
      // We've measured every item initially.
      const scrollContainer = findScrollContainer(rendered);
      expect(scrollContainer.props.style.height).toEqual(500);
      expect(scrollContainer.props.style.width).toEqual(500);
      // Supplying new item sizes alone should not impact anything.
      rendered.update(
        <VariableSizeGrid
          {...defaultProps}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
        />
      );
      expect(scrollContainer.props.style.height).toEqual(500);
      expect(scrollContainer.props.style.width).toEqual(500);
      // Reset styles after index 75,
      // And verify that the new estimated total takes this into account.
      // This means 5 columns at 50px each and 5 at 75px each (625),
      // And 15 rows at 25px each and 5 at 35px each (550px).
      rendered
        .getInstance()
        .resetAfterIndices({ columnIndex: 5, rowIndex: 15 });
      rendered.getInstance().scrollToItem({ columnIndex: 9, rowIndex: 19 });
      expect(columnWidth).toHaveBeenCalledTimes(5);
      expect(rowHeight).toHaveBeenCalledTimes(5);
      expect(scrollContainer.props.style.height).toEqual(550);
      expect(scrollContainer.props.style.width).toEqual(625);
    });

    it('should delay the recalculation of the estimated total size if shouldForceUpdate is false', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          estimatedColumnWidth={30}
          estimatedRowHeight={30}
          overscanColumnCount={1}
          overscanRowCount={1}
          columnWidth={index => 50}
          rowHeight={index => 25}
        />
      );
      const scrollContainer = findScrollContainer(rendered);
      // The estimated total height should be (100 + 25 * 1 + 30 * 15)px = 575px.
      // The estimated total width should be (200 + 50 * 1 + 30 * 5)px = 400px.
      expect(scrollContainer.props.style.height).toEqual(575);
      expect(scrollContainer.props.style.width).toEqual(400);
      // Supplying new item sizes alone should not impact anything.
      // Although the grid get re-rendered by passing inline functions,
      // but it still use the cached metrics to calculate the estimated size.
      rendered.update(
        <VariableSizeGrid
          {...defaultProps}
          estimatedColumnWidth={30}
          estimatedRowHeight={30}
          overscanColumnCount={1}
          overscanRowCount={1}
          columnWidth={index => 40}
          rowHeight={index => 20}
        />
      );
      expect(scrollContainer.props.style.height).toEqual(575);
      expect(scrollContainer.props.style.width).toEqual(400);
      // Reset calculation cache but don't re-render the grid,
      // the estimated total size should stay the same.
      rendered.getInstance().resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: false,
      });
      expect(scrollContainer.props.style.height).toEqual(575);
      expect(scrollContainer.props.style.width).toEqual(400);
      // Pass inline function to make the grid re-render.
      rendered.update(
        <VariableSizeGrid
          {...defaultProps}
          estimatedColumnWidth={30}
          estimatedRowHeight={30}
          overscanColumnCount={1}
          overscanRowCount={1}
          columnWidth={index => 40}
          rowHeight={index => 20}
        />
      );
      // The estimated total height should be (100 + 20 * 1 + 30 * 14)px = 540px.
      // The estimated total width should be (200 + 40 * 1 + 30 * 4)px = 360px.
      expect(scrollContainer.props.style.height).toEqual(540);
      expect(scrollContainer.props.style.width).toEqual(360);
    });

    it('should re-render items after the specified index with updated styles', () => {
      const columnWidth = jest.fn(() => 75);
      const rowHeight = jest.fn(() => 35);
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          columnWidth={index => 50}
          rowHeight={index => 25}
        />
      );
      // We've rendered 5 columns and 5 rows initially.
      expect(itemRenderer).toHaveBeenCalledTimes(25);
      expect(findItemRendererCall(3, 3).style.height).toBe(25);
      expect(findItemRendererCall(3, 3).style.width).toBe(50);
      // Supplying new item sizes alone should not impact anything.
      rendered.update(
        <VariableSizeGrid
          {...defaultProps}
          columnCount={5}
          columnWidth={columnWidth}
          rowCount={5}
          rowHeight={rowHeight}
        />
      );
      // Reset styles for columns and rows 4 and 5.
      // And verify that the affected rows are re-rendered with new styles.
      itemRenderer.mockClear();
      rendered.getInstance().resetAfterIndices({ columnIndex: 3, rowIndex: 3 });
      expect(itemRenderer).toHaveBeenCalledTimes(25);
      expect(findItemRendererCall(3, 3).style.height).toBe(35);
      expect(findItemRendererCall(3, 3).style.width).toBe(75);
    });
  });

  describe('props validation', () => {
    beforeEach(() => spyOn(console, 'error'));

    it('should fail if non-function columnWidth is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <VariableSizeGrid {...defaultProps} columnWidth={123} />
        )
      ).toThrow(
        'An invalid "columnWidth" prop has been specified. ' +
          'Value should be a function. "number" was specified.'
      );
    });

    it('should fail if non-function rowHeight is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <VariableSizeGrid {...defaultProps} rowHeight={123} />
        )
      ).toThrow(
        'An invalid "rowHeight" prop has been specified. ' +
          'Value should be a function. "number" was specified.'
      );
    });
  });

  describe('onScroll', () => {
    it('scrolling should report partial items correctly in onItemsRendered', () => {
      // Use ReactDOM renderer so the container ref works correctly.
      const instance = render(
        <VariableSizeGrid
          {...defaultProps}
          columnCount={100}
          columnWidth={() => 100}
          initialScrollLeft={20}
          initialScrollTop={10}
          rowCount={100}
          rowHeight={() => 25}
        />,
        document.createElement('div')
      );
      // grid 200w x 100h
      // columnWidth: 100, rowHeight: 25,
      // columnCount: 100, rowCount: 100
      // Scroll 2 items fwd, but thanks to the initialScrollOffset, we should
      // still be showing partials on both ends.
      instance.scrollTo({ scrollLeft: 150, scrollTop: 40 });
      // Scroll a little fwd to cause partials to be hidden
      instance.scrollTo({ scrollLeft: 200, scrollTop: 50 });
      // Scroll backwards to show partials again
      instance.scrollTo({ scrollLeft: 150, scrollTop: 40 });
      // Scroll near the end so that the last item is shown
      // as a partial.
      instance.scrollTo({
        scrollLeft: 98 * 100 - 5,
        scrollTop: 96 * 25 - 5,
      });
      // Scroll to the end. No partials.
      instance.scrollTo({
        scrollLeft: 98 * 100,
        scrollTop: 96 * 25,
      });
      // Verify that backwards scrolling near the end works OK.
      instance.scrollTo({
        scrollLeft: 98 * 100 - 5,
        scrollTop: 96 * 25 - 5,
      });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });
  });

  // https://github.com/bvaughn/react-window/pull/138
  it('should descrease scroll size when itemCount decreases', () => {
    const innerRef = createRef();
    const gridRef = createRef();

    class Wrapper extends PureComponent {
      state = { columnCount: 100, rowCount: 200 };
      render() {
        return (
          <VariableSizeGrid
            {...defaultProps}
            columnCount={this.state.columnCount}
            innerRef={innerRef}
            ref={gridRef}
            rowCount={this.state.rowCount}
          />
        );
      }
    }

    // Use ReactDOM renderer so "scroll" events work correctly.
    const instance = render(<Wrapper />, document.createElement('div'));

    // Simulate scrolling past several rows.
    simulateScroll(gridRef.current, { scrollLeft: 3000, scrollTop: 4000 });

    // Decrease itemCount a lot and verify the scroll height is descreased as well.
    instance.setState({ columnCount: 2, rowCount: 4 });
    expect(innerRef.current.style.height).toEqual('106px');
    expect(innerRef.current.style.width).toEqual('101px');
  });
});
