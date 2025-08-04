import { Component } from 'react';
import areEqual from './areEqual';
import shallowDiffers from './shallowDiffers';

// Custom shouldComponentUpdate for class components.
// It knows to compare individual style props and ignore the wrapper object.
// See https://reactjs.org/docs/react-component.html#shouldcomponentupdate
export default function shouldComponentUpdate(
  instance: Component,
  nextProps: Object,
  nextState: Object
): boolean {
  return (
    !areEqual(instance.props, nextProps) ||
    shallowDiffers(instance.state, nextState)
  );
}
