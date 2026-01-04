import { useEffect, useState } from "react";
import { List, type ListProps } from "react-window";

declare const rest: Omit<ListProps<{ isScrolling: boolean }>, "rowProps">;

// <begin>

// eslint-disable-next-line react-hooks/rules-of-hooks
const [isScrolling, setIsScrolling] = useState(false);

// eslint-disable-next-line react-hooks/rules-of-hooks
useEffect(() => {
  if (isScrolling) {
    const timeout = setTimeout(() => setIsScrolling(false), 500);

    return () => clearTimeout(timeout);
  }
}, [isScrolling]);

<List
  onScroll={() => {
    setIsScrolling(true);
  }}
  rowProps={{ isScrolling }}
  {...rest}
/>;

// <end>
