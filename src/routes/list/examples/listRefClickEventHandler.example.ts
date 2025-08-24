import { createRef } from "react";
import type { ListImperativeAPI } from "react-window";

const listRef = createRef<ListImperativeAPI>();

// <begin>

const onClick = () => {
  const list = listRef.current;
  list?.scrollToRow({
    align: "auto", // optional
    behavior: "auto", // optional
    index: 250
  });
};

// <end>

export { onClick };
