import { RowComponent } from "../../list/examples/FixedHeightRowComponent";

// <begin>

import { List } from "react-window";

function Example({ names }: { names: string[] }) {
  return (
    <List
      className="h-100"
      defaultHeight={400}
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={25}
      rowProps={{ names }}
    />
  );
}

// <end>

export { Example };
