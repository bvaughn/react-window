import { CSSProperties } from "react";
import { shallowDiffers } from "./shallowDiffers";
import type { Props } from "./types";

// Custom comparison function for React.memo().
// It knows to compare individual style props and ignore the wrapper object.
// See https://reactjs.org/docs/react-api.html#reactmemo
export function areEqual(prevProps: Props, nextProps: Props): boolean {
  const { style: prevStyle = EMPTY_OBJECT, ...prevRest } = prevProps;
  const { style: nextStyle = EMPTY_OBJECT, ...nextRest } = nextProps;

  return (
    !shallowDiffers(prevStyle, nextStyle) && !shallowDiffers(prevRest, nextRest)
  );
}

const EMPTY_OBJECT: CSSProperties = {};
