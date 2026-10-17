import { RowComponent } from "../../list/examples/FixedHeightRowComponent";

// <begin>

import { List } from "react-window";

const ROW_HEIGHT = 25;

function Example({
  initialIndex,
  names
}: {
  initialIndex: number;
  names: string[];
}) {
  return (
    <List
      className="h-100"
      defaultHeight={400}
      defaultScrollOffset={initialIndex * ROW_HEIGHT}
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={ROW_HEIGHT}
      rowProps={{ names }}
    />
  );
}

// <end>

export { Example };
