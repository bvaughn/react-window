import { useCallback, useState, type ButtonHTMLAttributes } from "react";
import {
  List,
  useDynamicRowHeight,
  useListCallbackRef,
  type RowComponentProps
} from "react-window";

type Item = {
  children: Array<{ index: number }>;
  id: number;
  minHeight: number;
  name: string;
};

export default function ScratchpadRoute() {
  const [key, setKey] = useState(0);
  const [items, setItems] = useState(createItems);
  const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());

  const [list, setList] = useListCallbackRef();
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 24
  });

  const toggleExpand = useCallback(
    (id: number) => {
      const newSet = new Set(expandedSet);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setExpandedSet(newSet);
    },
    [expandedSet]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            setItems(createItems());
            setExpandedSet(new Set());
            setKey(key + 1);
          }}
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            list?.scrollToRow({
              align: "end",
              index: items.length - 1
            });
          }}
        >
          Scroll to Bottom
        </Button>
      </div>
      <List
        className="w-full h-100 border"
        key={key}
        listRef={setList}
        rowComponent={Row}
        rowCount={items.length}
        rowHeight={rowHeight}
        rowProps={{
          expandedSet,
          items,
          toggleExpand
        }}
      />
    </div>
  );
}

function Row({
  expandedSet,
  items,
  toggleExpand,
  index,
  style
}: RowComponentProps<{
  expandedSet: Set<number>;
  items: Item[];
  toggleExpand: (id: number) => void;
}>) {
  const { children, minHeight, name } = items[index];

  const isExpanded = expandedSet.has(index);

  return (
    <div
      className="py-1 px-2 flex items-center gap-2"
      style={{ ...style, minHeight }}
    >
      <Button disabled={!children.length} onClick={() => toggleExpand(index)}>
        {!children.length || isExpanded ? "–" : "+"}
      </Button>
      {name}
      {isExpanded && (
        <pre className="text-xs">{JSON.stringify(children, null, 2)}</pre>
      )}
    </div>
  );
}

function createItems() {
  const items: Item[] = [];

  for (let index = 0; index < 500; ++index) {
    items.push({
      children: new Array(index % 5).fill(true).map((_, index) => ({
        index
      })),
      id: index,
      minHeight: 24 + 5 * (index % 3),
      name: `item ${index}`
    });
  }

  return items;
}

function Button({
  className,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded bg-gray-700 px-2 ${disabled ? "opacity-35" : "cursor-pointer"} ${className}`}
      disabled={disabled}
      {...rest}
    />
  );
}
