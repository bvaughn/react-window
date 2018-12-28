import React, { Component } from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { shouldComponentUpdate } from '..';

describe('shouldComponentUpdate', () => {
  let ClassComponent, render;

  beforeEach(() => {
    render = jest.fn(() => null);

    ClassComponent = class extends Component {
      shouldComponentUpdate = shouldComponentUpdate.bind(this);
      render = render;
    };
  });

  it('should not re-render when the style prop changes', () => {
    const renderer = ReactTestRenderer.create(
      <ClassComponent style={{}} foo="abc" bar={123} />
    );
    expect(render).toHaveBeenCalledTimes(1);

    renderer.update(<ClassComponent style={{}} foo="abc" bar={123} />);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it('should re-render when other props change', () => {
    const renderer = ReactTestRenderer.create(
      <ClassComponent style={{}} foo="abc" bar={123} />
    );
    expect(render).toHaveBeenCalledTimes(1);

    renderer.update(<ClassComponent style={{}} foo="abc" bar={234} />);
    expect(render).toHaveBeenCalledTimes(2);
  });
});
