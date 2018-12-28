import React, { PureComponent } from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { VariableSizeGrid } from '..';

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('VariableSizeGrid', () => {
  let columnWidth, defaultProps, itemRenderer, onItemsRendered, rowHeight;

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
          overscanColumnsCount={0}
          overscanRowsCount={0}
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
          overscanColumnsCount={0}
          overscanRowsCount={0}
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
      onScroll.mockClear();
      // Offset should not be negative.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 0, rowIndex: 0, align: 'auto' });
      expect(onScroll).toHaveBeenCalledWith({
        horizontalScrollDirection: 'backward',
        scrollLeft: 0,
        scrollTop: 0,
        scrollUpdateWasRequested: true,
        verticalScrollDirection: 'backward',
      });
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
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
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
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
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
          overscanColumnsCount={1}
          overscanRowsCount={1}
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
          overscanColumnsCount={1}
          overscanRowsCount={1}
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
          overscanColumnsCount={1}
          overscanRowsCount={1}
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
});
