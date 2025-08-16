import type { RowComponentProps } from "../components/list/types";
import { shallowCompare } from "./shallowCompare";

// Custom comparison function for React.memo()
// It knows to compare individual style props and ignore the wrapper object.
// See https://react.dev/reference/react/memo#memo
export function arePropsEqual(
  prevProps: RowComponentProps<object>,
  nextProps: RowComponentProps<object>,
): boolean {
  const { style: prevStyle, ...prevRest } = prevProps;
  const { style: nextStyle, ...nextRest } = nextProps;

  return (
    shallowCompare(prevStyle, nextStyle) && shallowCompare(prevRest, nextRest)
  );
}
