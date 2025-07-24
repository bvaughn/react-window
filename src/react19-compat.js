// React 19 compatibility layer
import React from 'react';

// In React 19, PureComponent is removed, this is a functional component
// that mimics PureComponent behavior
export class PureComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !this.shallowEqual(this.props, nextProps) ||
      !this.shallowEqual(this.state, nextState)
    );
  }

  shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }

    if (
      typeof objA !== 'object' ||
      objA === null ||
      typeof objB !== 'object' ||
      objB === null
    ) {
      return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (let i = 0; i < keysA.length; i++) {
      if (!objB.hasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }

    return true;
  }
}

export const { createElement } = React;
