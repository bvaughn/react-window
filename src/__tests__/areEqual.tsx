import React, { memo } from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { areEqual } from '..';

describe('areEqual', () => {
  let Component, MemoizedComponent;

  beforeEach(() => {
    Component = jest.fn(() => null);
    MemoizedComponent = memo(Component, areEqual);
  });

  it('should not re-render when the style prop changes', () => {
    const renderer = ReactTestRenderer.create(
      <MemoizedComponent style={{}} foo="abc" bar={123} />
    );
    expect(Component).toHaveBeenCalledTimes(1);

    renderer.update(<MemoizedComponent style={{}} foo="abc" bar={123} />);
    expect(Component).toHaveBeenCalledTimes(1);
  });

  it('should re-render when other props change', () => {
    const renderer = ReactTestRenderer.create(
      <MemoizedComponent style={{}} foo="abc" bar={123} />
    );
    expect(Component).toHaveBeenCalledTimes(1);

    renderer.update(<MemoizedComponent style={{}} foo="abc" bar={234} />);
    expect(Component).toHaveBeenCalledTimes(2);
  });
});
