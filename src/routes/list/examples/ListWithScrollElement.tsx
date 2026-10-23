import type { Contact } from "../../grid/examples/Grid";
import { RowComponent } from "./FeedRowComponent";

// <begin>

import { useState } from "react";
import { List } from "react-window";

function Example({ contacts }: { contacts: Contact[] }) {
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null
  );

  return (
    <div className="h-full overflow-auto" ref={setScrollElement}>
      {/* Other page content that scrolls along with the list */}
      <div className="h-24 mb-2 flex items-center justify-center rounded border-2 border-dashed border-slate-600 text-slate-400">
        Arbitrary page content (not part of the list)
      </div>
      <List
        rowComponent={RowComponent}
        rowCount={contacts.length}
        rowHeight={50}
        rowProps={{ contacts }}
        scrollElement={scrollElement}
      />
      <div className="h-24 mt-2 flex items-center justify-center rounded border-2 border-dashed border-slate-600 text-slate-400">
        Arbitrary page content (not part of the list)
      </div>
    </div>
  );
}

// <end>

export { Example };
