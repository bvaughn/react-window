import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { VariableSizeList } from '..';

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('VariableSizeList', () => {
  let cellRenderer, defaultProps;

  beforeEach(() => {
    jest.useFakeTimers();

    cellRenderer = jest.fn(({ style, ...rest }) => (
      <div style={style}>{JSON.stringify(rest, null, 2)}</div>
    ));
    defaultProps = {
      cellSize: index => 25 + index,
      children: cellRenderer,
      count: 20,
      estimatedCellSize: 25,
      height: 100,
      width: 50,
    };
  });

  // Much of the shared List functionality is already tested by FixedSizeList tests.
  // This test covers functionality that is unique to VariableSizeList.

  it('changing cellSize does not impact the rendered items', () => {
    const onItemsRendered = jest.fn();
    const rendered = ReactTestRenderer.create(
      <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
    );
    rendered.update(
      <VariableSizeList
        {...defaultProps}
        cellSize={index => 50}
        onItemsRendered={onItemsRendered}
      />
    );
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  describe('estimatedCellSize', () => {
    it('should estimate an initial scrollable height based on this estimation', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} estimatedCellSize={50} />
      );
      const scrollContainer = findScrollContainer(rendered);
      expect(scrollContainer.props.style).toMatchSnapshot();
    });

    it('should udpate the scrollable height as more cells are measured', () => {
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} estimatedCellSize={50} />
      );
      rendered.getInstance().scrollToItem(19);
      const scrollContainer = findScrollContainer(rendered);
      expect(scrollContainer.props.style).toMatchSnapshot();
    });
  });

  describe('scrollToItem method', () => {
    it('should scroll to the correct item for align = "auto"', () => {
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered.getInstance().scrollToItem(10, 'auto');
      // No need to scroll again; item 9 is already visible.
      // Overscan indices will change though, since direction changes.
      rendered.getInstance().scrollToItem(9, 'auto');
      // Scroll up enough to show item 2 at the top.
      rendered.getInstance().scrollToItem(2, 'auto');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "start"', () => {
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
      );
      // Scroll down enough to show item 10 at the top.
      rendered.getInstance().scrollToItem(10, 'start');
      // Scroll back up so that item 9 is at the top.
      // Overscroll direction wil change too.
      rendered.getInstance().scrollToItem(9, 'start');
      // Item 19 can't align at the top because there aren't enough items.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(19, 'start');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "end"', () => {
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered.getInstance().scrollToItem(10, 'end');
      // Scroll back up so that item 9 is at the bottom.
      // Overscroll direction wil change too.
      rendered.getInstance().scrollToItem(9, 'end');
      // Item 1 can't align at the bottom because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(1, 'end');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "center"', () => {
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
      );
      // Scroll down enough to show item 10 in the middle.
      rendered.getInstance().scrollToItem(10, 'center');
      // Scroll back up so that item 9 is in the middle.
      // Overscroll direction wil change too.
      rendered.getInstance().scrollToItem(9, 'center');
      // Item 1 can't align in the middle because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(1, 'center');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
      // Item 19 can't align in the middle because it's too close to the end.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(19, 'center');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });
  });

  describe('resetAfterIndex method', () => {
    it('should reset cached sizes after the specified index', () => {
      // This impacts total height estimate.
      // Also impacts the size of cells rendered.
    });
  });

  describe('props validation', () => {
    beforeEach(() => spyOn(console, 'error'));

    it('should fail if non-function cellSize is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <VariableSizeList {...defaultProps} cellSize={123} />
        )
      ).toThrow(
        'An invalid "cellSize" prop has been specified. ' +
          'Value should be a function. "number" was specified.'
      );
    });
  });
});
