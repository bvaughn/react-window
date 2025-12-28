import { cn } from "react-lib-tools";

// <begin>

import { type CellComponentProps } from "react-window";

function CellComponent({
  columnIndex,
  emails,
  style
}: CellComponentProps<{ emails: string[] }>) {
  return (
    <div
      className={cn("px-2 truncate text-center leading-[2.5]", {
        "bg-white/10 rounded": columnIndex % 2 === 0
      })}
      style={style}
    >
      {emails[columnIndex]}
    </div>
  );
}

// <end>

export { CellComponent };
