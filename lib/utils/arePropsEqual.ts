import type { CSSProperties } from "react";
import { shallowCompare } from "./shallowCompare";

// Custom comparison function for React.memo()
// It knows to compare individual style props and ignore the wrapper object.
// See https://react.dev/reference/react/memo#memo
export function arePropsEqual(
  prevProps: { style: CSSProperties },
  nextProps: { style: CSSProperties }
): boolean {
  const { style: prevStyle, ...prevRest } = prevProps;
  const { style: nextStyle, ...nextRest } = nextProps;

  return (
    shallowCompare(prevStyle, nextStyle) && shallowCompare(prevRest, nextRest)
  );
}
