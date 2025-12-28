import { createRef } from "react";
import type { GridImperativeAPI } from "react-window";

const gridRef = createRef<GridImperativeAPI>();

// <begin>

const onClick = () => {
  const grid = gridRef.current;
  grid?.scrollToCell({
    behavior: "auto", // optional
    columnAlign: "auto", // optional
    columnIndex: 10,
    rowAlign: "auto", // optional
    rowIndex: 250
  });
};

// <end>

export { onClick };
