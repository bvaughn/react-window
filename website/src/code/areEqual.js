import React, { memo } from "react";

// Step 1: Import areEqual from react-window
import { areEqual } from "react-window";

const Row = memo(
  props => {
    const { index, style } = props;

    return <div style={style}>Row {index}</div>;
  },

  // Step 2: Pass it as the second argument to React.memo()
  areEqual
);
