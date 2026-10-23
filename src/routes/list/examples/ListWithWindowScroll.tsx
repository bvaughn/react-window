import type { Contact } from "../../grid/examples/Grid";
import { RowComponent } from "./FeedRowComponent";

// <begin>

import { List } from "react-window";

function Example({ contacts }: { contacts: Contact[] }) {
  return (
    <List
      rowComponent={RowComponent}
      rowCount={contacts.length}
      rowHeight={50}
      rowProps={{ contacts }}
      scrollElement="window"
    />
  );
}

// <end>

export { Example };
