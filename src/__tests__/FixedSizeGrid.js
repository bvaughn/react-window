import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { FixedSizeGrid } from '..';

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('FixedSizeGrid', () => {
  let cellRenderer, defaultProps, onItemsRendered;

  beforeEach(() => {
    jest.useFakeTimers();

    onItemsRendered = jest.fn();

    cellRenderer = jest.fn(({ key, style, ...rest }) => (
      <div key={key} style={style}>
        {JSON.stringify(rest, null, 2)}
      </div>
    ));
    defaultProps = {
      children: cellRenderer,
      columnCount: 100,
      columnWidth: 100,
      height: 100,
      onItemsRendered,
      rowCount: 100,
      rowHeight: 25,
      width: 200,
    };
  });

  it('should render an empty grid', () => {
    ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} columnCount={0} rowCount={0} />
    );
    ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} columnCount={0} />
    );
    ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} rowCount={0} />);
    expect(cellRenderer.mock.calls.length).toMatchSnapshot();
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('should render a grid of items', () => {
    ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} />);
    expect(cellRenderer.mock.calls.length).toMatchSnapshot();
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  describe('style caching', () => {
    it('should cache styles while scrolling to avoid breaking pure sCU for items', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
      );
      // Scroll, then capture the rendered style for item 1,
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'start' });
      const cellOneA = cellRenderer.mock.calls.find(
        ([params]) => params.columnIndex === 1 && params.rowIndex === 1
      );
      cellRenderer.mockClear();
      // Scroll again, then capture the rendered style for item 1,
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 0, rowIndex: 0, align: 'start' });
      const cellOneB = cellRenderer.mock.calls.find(
        ([params]) => params.columnIndex === 1 && params.rowIndex === 1
      );
      // Both styles should be the same,
      // Since the scroll debounce timer never cleared the style cache.
      expect(cellOneA).toEqual(cellOneB);
    });

    it('should reset cached styles when scrolling stops', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} useIsScrolling />
      );
      // Scroll, then capture the rendered style for item 1,
      // Then let the debounce timer clear the cached styles.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'start' });
      const cellOneA = cellRenderer.mock.calls.find(
        ([params]) => params.columnIndex === 1 && params.rowIndex === 1
      );
      jest.runAllTimers();
      cellRenderer.mockClear();
      // Scroll again, then capture the rendered style for item 1,
      // And confirm that the style was recreated.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 0, rowIndex: 0, align: 'start' });
      const cellOneB = cellRenderer.mock.calls.find(
        ([params]) => params.columnIndex === 1 && params.rowIndex === 1
      );
      expect(cellOneA[0].style).not.toBe(cellOneB[0].style);
    });
  });

  it('changing cell size updates the rendered items', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} />
    );
    rendered.update(<FixedSizeGrid {...defaultProps} columnWidth={150} />);
    rendered.update(
      <FixedSizeGrid {...defaultProps} columnWidth={150} rowHeight={50} />
    );
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('should support momentum scrolling on iOS devices', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} style={{ backgroundColor: 'red' }} />
    );
    expect(
      rendered.toJSON().props.style.WebkitOverflowScrolling
    ).toMatchSnapshot();
  });

  it('should disable pointer events while scrolling', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} />
    );
    const scrollContainer = findScrollContainer(rendered);
    expect(scrollContainer.props.style).toMatchSnapshot();
    rendered.getInstance().scrollTo({ scrollLeft: 100, scrollTop: 100 });
    expect(scrollContainer.props.style).toMatchSnapshot();
    jest.runAllTimers();
    expect(scrollContainer.props.style).toMatchSnapshot();
  });

  describe('style overrides', () => {
    it('should support className prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} className="custom" />
      );
      expect(rendered.toJSON().props.className).toMatchSnapshot();
    });

    it('should support style prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} style={{ backgroundColor: 'red' }} />
      );
      expect(rendered.toJSON().props.style.backgroundColor).toMatchSnapshot();
    });
  });

  describe('overscanCount', () => {
    it('should require a minimum of 1 overscan to support tabbing', () => {
      ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          defaultScrollLeft={250}
          defaultScrollTop={250}
          overscanCount={0}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should accommodate a custom overscan', () => {
      ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          defaultScrollLeft={250}
          defaultScrollTop={250}
          overscanCount={2}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should overscan in the direction being scrolled', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          defaultScrollLeft={250}
          defaultScrollTop={250}
          overscanCount={2}
        />
      );
      rendered.getInstance().scrollTo({ scrollLeft: 1000, scrollTop: 1000 });
      rendered.getInstance().scrollTo({ scrollLeft: 500, scrollTop: 500 });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not scan past the beginning of the grid', () => {
      ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} />);
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not scan past the end of the grid', () => {
      ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          columnCount={10}
          defaultScrollLeft={900}
          defaultScrollTop={150}
          rowCount={10}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });
  });

  describe('useIsScrolling', () => {
    it('should not pass an isScrolling param to children unless requested', () => {
      ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} />);
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
    });

    it('should pass an isScrolling param to children if requested', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} useIsScrolling />
      );
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
      cellRenderer.mockClear();
      rendered.getInstance().scrollTo({ scrollLeft: 100, scrollTop: 100 });
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
      cellRenderer.mockClear();
      jest.runAllTimers();
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
    });

    it('should not re-render children unnecessarily if isScrolling param is not used', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
      );
      cellRenderer.mockClear();
      rendered.getInstance().scrollTo({ scrollLeft: 100, scrollTop: 100 });
      expect(cellRenderer).toHaveBeenCalledTimes(35);
      jest.runAllTimers();
      expect(cellRenderer).toHaveBeenCalledTimes(35);
    });
  });

  describe('scrollToItem method', () => {
    it('should scroll to the correct item for align = "auto"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
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
        <FixedSizeGrid {...defaultProps} />
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
        <FixedSizeGrid {...defaultProps} />
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
        <FixedSizeGrid {...defaultProps} />
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

  describe('callback props', () => {
    // onItemsRendered is pretty well covered by other snapshot tests

    it('should call onScroll when scroll position changes', () => {
      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} onScroll={onScroll} />
      );
      rendered.getInstance().scrollTo({
        scrollLeft: 100,
        scrollTop: 50,
      });
      rendered.getInstance().scrollTo({
        scrollLeft: 0,
        scrollTop: 150,
      });
      rendered.getInstance().scrollTo({
        scrollLeft: 150,
        scrollTop: 0,
      });
      expect(onScroll.mock.calls).toMatchSnapshot();
    });
  });

  describe('props validation', () => {
    beforeEach(() => spyOn(console, 'error'));

    it('should fail if non-numeric columnWidth is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} columnWidth="abc" />
        )
      ).toThrow(
        'An invalid "columnWidth" prop has been specified. ' +
          'Value should be a number. ' +
          '"string" was specified.'
      );
    });

    it('should fail if non-numeric rowHeight is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} rowHeight="abc" />
        )
      ).toThrow(
        'An invalid "rowHeight" prop has been specified. ' +
          'Value should be a number. ' +
          '"string" was specified.'
      );
    });

    it('should fail if no children function is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} children={undefined} />
        )
      ).toThrow(
        'An invalid "children" prop has been specified. ' +
          'Value should be a function that creates a React element. ' +
          '"undefined" was specified.'
      );
    });

    it('should fail if a string height is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} direction="vertical" height="100%" />
        )
      ).toThrow(
        'An invalid "height" prop has been specified. ' +
          'Grids must specify a number for height. ' +
          '"string" was specified.'
      );
    });

    it('should fail if a string width is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid
            {...defaultProps}
            direction="horizontal"
            width="100%"
          />
        )
      ).toThrow(
        'An invalid "width" prop has been specified. ' +
          'Grids must specify a number for width. ' +
          '"string" was specified.'
      );
    });
  });
});
