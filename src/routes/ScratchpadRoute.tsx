import { useState } from "react";
import {
  List,
  useListCallbackRef,
  type Align,
  type RowComponentProps
} from "react-window";
import { cn } from "../utils/cn";
import { Block } from "../components/Block";
import { Select, type Option } from "../components/Select";

const rowHeight = () => 10;

const ALIGNMENTS: Option<Align>[] = (
  ["auto", "center", "end", "smart", "start"] satisfies Align[]
).map((value) => ({
  label: `align: ${value}`,
  value
}));

export function ScratchpadRoute() {
  const [focusIndex, setFocusIndex] = useState(0);
  const [listRefA, setListRefA] = useListCallbackRef(null);
  const [listRefB, setListRefB] = useListCallbackRef(null);
  const [align, setAlign] = useState(ALIGNMENTS[0]);

  return (
    <div>
      <Select
        className="flex-1"
        onChange={setAlign}
        options={ALIGNMENTS}
        placeholder="Align"
        value={align}
      />
      <input
        autoFocus
        className="w-full"
        min={0}
        max={9}
        step={1}
        type="number"
        onKeyDown={(event) => {
          switch (event.key) {
            case "Enter": {
              const index = parseInt(event.currentTarget.value);
              setFocusIndex(index);

              listRefA?.scrollToRow({ align: align.value, index });
              listRefB?.scrollToRow({ align: align.value, index });
            }
          }
        }}
        defaultValue="0"
      />
      <Block data-focus-within="bold">
        <List
          listRef={setListRefA}
          rowComponent={RowComponent}
          rowCount={10}
          rowHeight={rowHeight}
          rowProps={{ focusIndex }}
          style={{ height: "50px" }}
        />
      </Block>
      <Block data-focus-within="bold">
        <List
          listRef={setListRefB}
          rowComponent={RowComponent}
          rowCount={10}
          rowHeight={rowHeight}
          rowProps={{ focusIndex }}
          style={{ height: "40px" }}
        />
      </Block>
    </div>
  );
}

function RowComponent({
  index,
  focusIndex,
  style
}: RowComponentProps<{ focusIndex: number }>) {
  return (
    <div
      className={cn("text-xs", {
        "bg-slate-800 font-bold": focusIndex === index
      })}
      style={style}
    >
      Row {index}
    </div>
  );
}
