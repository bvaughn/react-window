import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { VariableSizeGrid } from '..';

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('VariableSizeGrid', () => {
  let cellRenderer, defaultProps, onItemsRendered;

  beforeEach(() => {
    jest.useFakeTimers();

    cellRenderer = jest.fn(({ style, ...rest }) => (
      <div style={style}>{JSON.stringify(rest, null, 2)}</div>
    ));
    onItemsRendered = jest.fn();
    defaultProps = {
      children: cellRenderer,
      columnCount: 10,
      columnWidth: index => 50 + index,
      height: 100,
      onItemsRendered,
      rowCount: 20,
      rowHeight: index => 25 + index,
      width: 200,
    };
  });

  // Much of the shared Grid functionality is already tested by VariableSizeGrid tests.
  // This test covers functionality that is unique to VariableSizeGrid.

  it('changing item size does not impact the rendered items', () => {
    const rendered = ReactTestRenderer.create(
      <VariableSizeGrid {...defaultProps} />
    );
    cellRenderer.mockClear();
    rendered.update(
      <VariableSizeGrid
        {...defaultProps}
        columnWidth={index => 100}
        rowHeight={index => 50}
      />
    );
    expect(cellRenderer).not.toHaveBeenCalled();
  });

  describe('estimatedItemSize', () => {
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
          overscanCount={0}
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

    it('should udpate the scrollable size as more cells are measured', () => {
      const columnWidth = jest.fn(() => 50);
      const rowHeight = jest.fn(() => 25);
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid
          {...defaultProps}
          columnCount={50}
          columnWidth={columnWidth}
          estimatedColumnWidth={200}
          estimatedRowHeight={100}
          overscanCount={0}
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

  // TODO Verify all scrollToItem() snapshots below (they all look funky)
  describe('scrollToItem method', () => {
    it('should scroll to the correct item for align = "auto"', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'auto' });
      // No need to scroll again; item 9 is already visible.
      // Overscan indices will change though, since direction changes.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'auto' });
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
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'start' });
      // Scroll back up so that item 9 is at the top.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'start' });
      // Item 99 can't align at the top because there aren't enough items.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 99, rowIndex: 99, align: 'start' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "end"', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'end' });
      // Scroll back up so that item 9 is at the bottom.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'end' });
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
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'center' });
      // Scroll back up so that item 9 is in the middle.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'center' });
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
        .scrollToItem({ columnIndex: 99, rowIndex: 99, align: 'center' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });
  });

  describe('resetAfterIndex method', () => {
    it('should recalculate the estimated total size', () => {
      // TODO Verify total size estimate is updated.
    });

    it('should re-render cells after the specified index with updated styles', () => {
      // TODO Verify rendered cell sizes are updated,
      // And that our sCU caching strategy doesn't block the update,
      // If it does we may have to revert to on-fiber style cache,
      // Or somehow use an incremented key value to reset all items in the current window.
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
