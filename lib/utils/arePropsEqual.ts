import type { CSSProperties } from "react";
import { shallowCompare } from "./shallowCompare";

// Custom comparison function for React.memo()
// It knows to compare individual style props and ignore the wrapper object.
// See https://react.dev/reference/react/memo#memo
export function arePropsEqual(
  prevProps: { ariaAttributes: object; style: CSSProperties },
  nextProps: { ariaAttributes: object; style: CSSProperties }
): boolean {
  const {
    ariaAttributes: prevAriaAttributes,
    style: prevStyle,
    ...prevRest
  } = prevProps;
  const {
    ariaAttributes: nextAriaAttributes,
    style: nextStyle,
    ...nextRest
  } = nextProps;

  return (
    shallowCompare(prevAriaAttributes, nextAriaAttributes) &&
    shallowCompare(prevStyle, nextStyle) &&
    shallowCompare(prevRest, nextRest)
  );
}
