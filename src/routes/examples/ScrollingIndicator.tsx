import { useEffect, useState, type ReactElement } from "react";
import { List, type ListProps, type RowComponentProps } from "react-window";

declare const rest: Omit<
  ListProps<{ isScrolling: boolean }>,
  "rowComponent" | "rowProps"
>;

declare function RowComponent(
  props: RowComponentProps<{ isScrolling: boolean }>
): ReactElement;

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
  rowComponent={RowComponent}
  rowProps={{ isScrolling }}
  {...rest}
/>;

// <end>
