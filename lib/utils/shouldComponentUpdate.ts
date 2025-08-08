import { Component } from "react";
import { areEqual } from "./areEqual";
import { shallowDiffers } from "./shallowDiffers";
import { Props } from "./types";

// Custom shouldComponentUpdate for class components.
// It knows to compare individual style props and ignore the wrapper object.
// See https://reactjs.org/docs/react-component.html#shouldcomponentupdate
export function shouldComponentUpdate(
  instance: Component,
  nextProps: Props,
  nextState: Props,
): boolean {
  return (
    !areEqual(instance.props, nextProps) ||
    shallowDiffers(instance.state, nextState)
  );
}
