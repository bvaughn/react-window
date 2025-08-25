import { RowComponent } from "./FixedHeightRowComponent.example";

// <begin>

import { List } from "react-window";

function Example({ names }: { names: string[] }) {
  return (
    <List
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={25}
      rowProps={{ names }}
    />
  );
}

// <end>

export { Example };
