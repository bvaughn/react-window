// <begin>

import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { useState, type Dispatch, type SetStateAction } from "react";
import { List, type RowComponentProps } from "react-window";
import { cn } from "../../../utils/cn";

function Example({ lorem }: { lorem: string[] }) {
  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set());

  return (
    <List
      rowComponent={RowComponent}
      rowCount={lorem.length}
      rowProps={{ collapsedRows, lorem, setCollapsedRows }}
    />
  );
}

function RowComponent({
  collapsedRows,
  index,
  lorem,
  setCollapsedRows,
  style
}: RowComponentProps<{
  collapsedRows: Set<number>;
  lorem: string[];
  setCollapsedRows: Dispatch<SetStateAction<Set<number>>>;
}>) {
  const isCollapsed = collapsedRows.has(index);
  return (
    <div
      className={cn("p-2 cursor-pointer", {
        "bg-white/10": index % 2 === 0,
        truncate: isCollapsed
      })}
      onClick={() => {
        const cloned = new Set(collapsedRows);
        if (isCollapsed) {
          cloned.delete(index);
        } else {
          cloned.add(index);
        }
        setCollapsedRows(cloned);
      }}
      style={style}
    >
      <ToggleIcon isCollapsed={isCollapsed} /> {lorem[index]}
    </div>
  );
}

// <end>

export { Example, RowComponent };

function ToggleIcon({ isCollapsed }: { isCollapsed: boolean }) {
  const Icon = isCollapsed ? PlusIcon : MinusIcon;
  return <Icon className="size-4 inline-block" />;
}
