import { useState } from "react";
import { shallowCompare } from "../../../utils/shallowCompare";

export function useRowProps<RowProps extends object>(
  unstableRowProps: RowProps,
): RowProps {
  const [stableRowProps, setStableRowProps] =
    useState<RowProps>(unstableRowProps);

  if (!shallowCompare(unstableRowProps, stableRowProps)) {
    setStableRowProps(unstableRowProps);
  }

  return stableRowProps;
}
