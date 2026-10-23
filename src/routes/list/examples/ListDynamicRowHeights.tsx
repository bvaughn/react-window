// <begin>

import { List, useDynamicRowHeight } from "react-window";
import { RowComponent } from "./ListRowDynamicRowHeights";

function Example({ messages }: { messages: string[] }) {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 50
  });

  return (
    <List
      rowComponent={RowComponent}
      rowCount={messages.length}
      rowHeight={rowHeight}
      rowProps={{ messages }}
    />
  );
}

// <end>

export { Example };
