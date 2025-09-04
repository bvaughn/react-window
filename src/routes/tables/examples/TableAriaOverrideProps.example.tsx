const otherListProps = {
  rowComponent: RowComponent,
  rowCount: 123,
  rowHeight: 25,
  rowProps: {}
};

// <begin>

import { List, type RowComponentProps } from "react-window";

function Example() {
  return (
    <div role="table" aria-colcount={3} aria-rowcount={1000}>
      <div role="row" aria-rowindex={1}>
        <div role="columnheader" aria-colindex={1}>
          City
        </div>
        <div role="columnheader" aria-colindex={1}>
          State
        </div>
        <div role="columnheader" aria-colindex={1}>
          Zip
        </div>
      </div>

      <List role="rowgroup" {...otherListProps} />
    </div>
  );
}

function RowComponent({ index, style }: RowComponentProps<object>) {
  // Add 1 to the row index to account for the header row
  return (
    <div aria-rowindex={index + 1} role="row" style={style}>
      <div role="cell" aria-colindex={1}>
        ...
      </div>
      <div role="cell" aria-colindex={2}>
        ...
      </div>
      <div role="cell" aria-colindex={3}>
        ...
      </div>
    </div>
  );
}

// <end>

export { Example };
