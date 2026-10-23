import { Avatar } from "../../examples/Avatar";
import type { Contact } from "./Grid";

// <begin>

import { type CellComponentProps } from "react-window";

function CellComponent({
  columnIndex,
  contacts,
  style
}: CellComponentProps<{ contacts: Contact[] }>) {
  const contact = contacts[columnIndex];

  return (
    <div className="p-1" style={style}>
      <div className="h-full flex flex-col items-center gap-1 p-2 rounded bg-white/10 text-center">
        <Avatar
          className="size-12 text-base"
          firstName={contact.first_name}
          lastName={contact.last_name}
        />
        <div className="w-full truncate">
          {contact.first_name} {contact.last_name}
        </div>
        <div className="w-full truncate text-xs text-slate-400">
          {contact.job_title}
        </div>
        <button className="mt-auto px-3 py-0.5 rounded-full bg-sky-700 text-xs text-white">
          Connect
        </button>
      </div>
    </div>
  );
}

// <end>

export { CellComponent };
