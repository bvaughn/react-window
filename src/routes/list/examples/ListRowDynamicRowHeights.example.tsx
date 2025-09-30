import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { cn } from "../../../utils/cn";
import type { ListState } from "./ListDynamicRowHeights.example";

// <begin>

import { type RowComponentProps } from "react-window";

function RowComponent({
  index,
  listState,
  style
}: RowComponentProps<{
  listState: ListState;
}>) {
  const isCollapsed = listState.isRowCollapsed(index);
  const text = listState.getText(index);

  return (
    <div
      className={cn("p-2 cursor-pointer", {
        "bg-white/10": index % 2 === 0,
        truncate: isCollapsed
      })}
      onClick={() => listState.toggleRow(index)}
      style={style}
    >
      <ToggleIcon isCollapsed={isCollapsed} /> {index}: {text}
    </div>
  );
}

// <end>

export { RowComponent };

function ToggleIcon({ isCollapsed }: { isCollapsed: boolean }) {
  const Icon = isCollapsed ? PlusIcon : MinusIcon;
  return <Icon className="size-4 inline-block" />;
}
