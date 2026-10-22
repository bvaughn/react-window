import type { ReactElement } from "react";
import type { RowComponentProps } from "react-window";

declare function RowComponent(
  props: RowComponentProps<{ isScrolling: boolean }>
): ReactElement;

// <begin>

import { List, useIsScrolling } from "react-window";

function Example() {
  // The list itself doesn't scroll, so track the window instead
  const isScrolling = useIsScrolling("window");

  return (
    <List
      rowComponent={RowComponent}
      rowCount={1000}
      rowHeight={25}
      rowProps={{ isScrolling }}
      scrollElement="window"
    />
  );
}

// <end>

export { Example };
