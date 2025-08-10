import { useState } from "react";
import {
  SimpleList,
  useSimpleListRef,
  type Align,
  type RowProps,
} from "react-window";
import { Block } from "../../components/Block";
import { Button } from "../../components/Button";
import Code from "../../components/code/Code";
import { ExampleLayout } from "../../components/ExampleLayout";
import { Input } from "../../components/Input";
import { Select, type Option } from "../../components/Select";

const ALIGNMENTS: Option<Align>[] = (
  ["auto", "center", "end", "smart", "start"] satisfies Align[]
).map((value) => ({
  label: `align: ${value}`,
  value,
}));
const BEHAVIORS: Option<ScrollBehavior>[] = (
  ["auto", "instant", "smooth"] satisfies ScrollBehavior[]
).map((value) => ({
  label: `behavior: ${value}`,
  value,
}));

export function SimpleListImperativeApiRoute() {
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);
  const [align, setAlign] = useState<Option<Align> | undefined>();
  const [behavior, setBehavior] = useState<
    Option<ScrollBehavior> | undefined
  >();
  const listRef = useSimpleListRef(null);

  const scrollToRow = () => {
    listRef.current?.scrollToRow({
      align: align?.value,
      behavior: behavior?.value,
      index: rowIndex ?? 0,
    });
  };

  return (
    <ExampleLayout
      code={<Code code={CODE} />}
      demo={
        <div className="flex flex-col gap-4">
          <Block className="flex flex-col gap-2">
            <div className="flex gap-2 text-sm gap-2">
              <Select
                className="flex-1"
                onChange={setAlign}
                options={ALIGNMENTS}
                placeholder="Align"
                value={align}
              />
              <Select
                className="flex-1"
                onChange={setBehavior}
                options={BEHAVIORS}
                placeholder="Scroll behavior"
                value={behavior}
              />
            </div>
            <div className="flex gap-2 text-sm gap-2">
              <Input
                className="w-full"
                onChange={(text) => {
                  const parsed = parseInt(text);
                  setRowIndex(
                    isNaN(parsed)
                      ? undefined
                      : Math.max(0, Math.min(99, parsed)),
                  );
                }}
                onKeyDown={(event) => {
                  switch (event.key) {
                    case "Enter": {
                      scrollToRow();
                    }
                  }
                }}
                placeholder="Row index"
                value={rowIndex === undefined ? "" : "" + rowIndex}
              />
              <Button className="shrink-0" onClick={scrollToRow}>
                Scroll
              </Button>
            </div>
          </Block>
          <Block className="h-35">
            <SimpleList
              length={100}
              listRef={listRef}
              rowComponent={Row}
              rowHeight={20}
            />
          </Block>
        </div>
      }
    ></ExampleLayout>
  );
}

function Row({ index, style }: RowProps<null>) {
  return (
    <div className="flex items-center gap-2" style={style}>
      Row index {index}
    </div>
  );
}

const CODE = `
// Attaching it using the "listRef" prop

import { useSimpleListRef } from "react-window";

const listRef = useSimpleListRef(null);

return <SimpleList listRef={listRef} {...props} />}

// Then use it to interact with the list
// e.g. Scroll to the 50th row

listRef.current.scrollToRow({ index: 49 });
`;
