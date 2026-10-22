import { RowComponent } from "./FixedHeightRowComponent";

// <begin>

import { useState } from "react";
import { List } from "react-window";

function Example({ names }: { names: string[] }) {
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null
  );

  return (
    <div className="h-full overflow-auto" ref={setScrollElement}>
      <div className="p-2 mb-2 rounded bg-slate-700">
        Content above the list
      </div>
      <List
        rowComponent={RowComponent}
        rowCount={names.length}
        rowHeight={25}
        rowProps={{ names }}
        scrollElement={scrollElement}
      />
      <div className="p-2 mt-2 rounded bg-slate-700">
        Content below the list
      </div>
    </div>
  );
}

// <end>

export { Example };
