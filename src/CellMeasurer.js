// @flow

import { Component } from 'react';
import { findDOMNode } from 'react-dom';

import type { Direction } from './createListComponent';
import type { HandleNewMeasurements } from './DynamicSizeList';

declare class ResizeObserver {
  constructor(callback: Function): void;
  observe(target: HTMLElement): void;
  disconnect(): void;
}

type CellMeasurerProps = {|
  direction: Direction,
  handleNewMeasurements: HandleNewMeasurements,
  index: number,
  item: React$Element<any>,
  size: number,
|};

export default class CellMeasurer extends Component<CellMeasurerProps, void> {
  _node: HTMLElement = (null: any);
  _resizeObserver: ResizeObserver = (null: any);

  componentDidMount() {
    this._node = ((findDOMNode(this): any): HTMLElement);

    // Force sync measure for the initial mount.
    // This is necessary to support the DynamicSizeList layout logic.
    this._measureItem(true);

    // Watch for resizes due to changed content,
    // Or changes in the size of the parent container.
    this._resizeObserver = new ResizeObserver(this._onResize);
    this._resizeObserver.observe(this._node);
  }

  componentWillUnmount() {
    this._resizeObserver.disconnect();
  }

  render() {
    return this.props.item;
  }

  _measureItem = (isCommitPhase: boolean) => {
    const {
      direction,
      handleNewMeasurements,
      index,
      size: oldSize,
    } = this.props;

    const node = this._node;

    if (
      node &&
      node.ownerDocument &&
      node.ownerDocument.defaultView &&
      node instanceof node.ownerDocument.defaultView.HTMLElement
    ) {
      const newSize =
        direction === 'horizontal'
          ? Math.ceil(node.offsetWidth)
          : Math.ceil(node.offsetHeight);

      if (oldSize !== newSize) {
        handleNewMeasurements(index, newSize, isCommitPhase);
      }
    }
  };

  _onResize = () => {
    this._measureItem(false);
  };
}
