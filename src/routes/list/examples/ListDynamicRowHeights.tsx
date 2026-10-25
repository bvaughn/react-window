// <begin>

import { List, useDynamicRowHeight } from "react-window";
import { RowComponent, type ChatMessage } from "./ListRowDynamicRowHeights";

function Example({ messages }: { messages: ChatMessage[] }) {
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
