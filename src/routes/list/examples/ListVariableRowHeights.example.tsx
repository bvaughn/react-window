import { type Ref } from "react";
import { cn } from "../../../utils/cn";

// <begin>

import {
  List,
  type ListImperativeAPI,
  type RowComponentProps
} from "react-window";

type Item =
  | { type: "state"; state: string }
  | { type: "zip"; city: string; zip: string };

type RowProps = {
  items: Item[];
};

function Example({ items }: { items: Item[] }) {
  return (
    <List<RowProps>
      rowComponent={RowComponent}
      rowCount={items.length}
      rowHeight={rowHeight}
      rowProps={{ items }}
    />
  );
}

function rowHeight(index: number, { items }: RowProps) {
  switch (items[index].type) {
    case "state": {
      return 30;
    }
    case "zip": {
      return 25;
    }
  }
}

function RowComponent({ index, items, style }: RowComponentProps<RowProps>) {
  const item = items[index];

  const className = getClassName(item);

  return (
    <div className={className} style={style}>
      {item.type === "state" ? (
        <span>{item.state}</span>
      ) : (
        <span>
          {item.city}, {item.zip}
        </span>
      )}
      <div className="text-slate-500 text-xs">{`${index + 1} of ${items.length}`}</div>
    </div>
  );
}

// <end>

function ExampleWithRef({
  items,
  listRef
}: {
  items: Item[];
  listRef: Ref<ListImperativeAPI>;
}) {
  return (
    <List
      listRef={listRef}
      rowComponent={RowComponent}
      rowCount={items.length}
      rowHeight={rowHeight}
      rowProps={{ items }}
    />
  );
}

function getClassName(item: Item) {
  return cn("flex items-center justify-between gap-2", {
    "text-3xl text-sky-300": item.type === "state"
  });
}

export { Example, ExampleWithRef, RowComponent };
export type { Item, RowProps };
