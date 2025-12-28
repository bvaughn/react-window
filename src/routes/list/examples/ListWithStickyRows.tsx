import { EMPTY_OBJECT } from "../../../constants";

function RowComponent({ index, style }: RowComponentProps<object>) {
  if (index === 0) {
    return <div style={style}></div>;
  }

  return <div style={style}>Row {index}</div>;
}

// <begin>

import { List, type RowComponentProps } from "react-window";

function Example() {
  return (
    <List
      rowComponent={RowComponent}
      rowCount={101}
      rowHeight={20}
      rowProps={EMPTY_OBJECT}
    >
      <div className="w-full h-0 top-0 sticky">
        <div className="h-[20px] bg-teal-600 px-2 rounded">Sticky header</div>
      </div>
    </List>
  );
}

// <end>

export { Example };
