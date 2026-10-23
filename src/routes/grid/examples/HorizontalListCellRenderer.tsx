import { Avatar } from "../../examples/Avatar";
import type { Contact } from "./Grid";

// <begin>

import { type CellComponentProps } from "react-window";

const BANNERS = [
  "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-rose-600",
  "from-fuchsia-500 to-purple-700"
];

function CellComponent({
  columnIndex,
  contacts,
  style
}: CellComponentProps<{ contacts: Contact[] }>) {
  const contact = contacts[columnIndex];

  return (
    <div className="p-1" style={style}>
      <div className="h-full flex flex-col items-center overflow-hidden rounded-lg bg-white/10 text-center">
        <div
          className={`h-10 w-full shrink-0 bg-linear-to-br ${BANNERS[columnIndex % BANNERS.length]}`}
        />
        <Avatar
          className="size-12 -mt-6 text-base bg-slate-700 ring-2 ring-white/80"
          firstName={contact.first_name}
          lastName={contact.last_name}
        />
        <div className="w-full flex flex-col gap-0.5 px-2 pt-1">
          <div className="truncate font-bold">
            {contact.first_name} {contact.last_name}
          </div>
          <div className="truncate text-xs">{contact.job_title}</div>
          <div className="truncate text-xs text-slate-400">
            {contact.company}
          </div>
        </div>
        <button className="mt-auto mb-2 px-3 py-0.5 rounded-full border border-sky-500 text-xs text-sky-400 hover:bg-sky-500 hover:text-white">
          + Connect
        </button>
      </div>
    </div>
  );
}

// <end>

export { CellComponent };
