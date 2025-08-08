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
import { Radio } from "../../components/Radio";

export function SimpleListImperativeApiRoute() {
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);
  const [align, setAlign] = useState<Align>("auto");
  const [behavior, setBehavior] = useState<ScrollBehavior>("auto");
  const listRef = useSimpleListRef();

  const scrollToRow = () => {
    listRef.current?.scrollToRow(rowIndex ?? 0, align, behavior);
  };

  return (
    <ExampleLayout
      code={<Code code={CODE} transparent />}
      demo={
        <div className="flex flex-col gap-4">
          <Block className="flex flex-col gap-2">
            <div className="flex gap-2 text-sm">
              Align:
              <Radio
                checked={align === "auto"}
                name="align"
                onChange={setAlign}
                value="auto"
              >
                auto
              </Radio>
              <Radio
                checked={align === "center"}
                name="align"
                onChange={setAlign}
                value="center"
              >
                center
              </Radio>
              <Radio
                checked={align === "end"}
                name="align"
                onChange={setAlign}
                value="end"
              >
                end
              </Radio>
              <Radio
                checked={align === "smart"}
                name="align"
                onChange={setAlign}
                value="smart"
              >
                smart
              </Radio>
              <Radio
                checked={align === "start"}
                name="align"
                onChange={setAlign}
                value="start"
              >
                start
              </Radio>
            </div>
            <div className="flex gap-2 text-sm">
              Scroll behavior:
              <Radio
                checked={behavior === "auto"}
                name="behavior"
                onChange={setBehavior}
                value="auto"
              >
                auto
              </Radio>
              <Radio
                checked={behavior === "instant"}
                name="behavior"
                onChange={setBehavior}
                value="instant"
              >
                instant
              </Radio>
              <Radio
                checked={behavior === "smooth"}
                name="behavior"
                onChange={setBehavior}
                value="smooth"
              >
                smooth
              </Radio>
            </div>
            <div className="flex gap-2 text-sm">
              <Input
                className="w-full"
                max={99}
                min={0}
                onChange={(value) => setRowIndex(parseInt(value))}
                onKeyDown={(event) => {
                  switch (event.key) {
                    case "Enter": {
                      scrollToRow();
                    }
                  }
                }}
                placeholder="Row index"
                step={1}
                type="number"
                value={"" + rowIndex}
              />
              <Button className="shrink-0" onClick={scrollToRow}>
                Scroll to row
              </Button>
            </div>
          </Block>
          <Block className="h-50">
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
import { SimpleList, useSimpleListRef } from "react-window";

// Attaching a ref

const listRef = useSimpleListRef();

return <SimpleList ref={listRef} {...props} />}

// Scrolling to a row

listRef.current.scrollToRow(100, "auto", "smooth");
`;
