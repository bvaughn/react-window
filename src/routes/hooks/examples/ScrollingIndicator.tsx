import type { Contact } from "../../grid/examples/Grid";
import { Avatar } from "../../examples/Avatar";

// <begin>

import {
  List,
  useIsScrolling,
  useListCallbackRef,
  type RowComponentProps
} from "react-window";

function Example({ contacts }: { contacts: Contact[] }) {
  const [list, setList] = useListCallbackRef(null);
  const isScrolling = useIsScrolling(list?.element);

  return (
    <div className="h-full flex flex-col gap-2">
      <List
        listRef={setList}
        rowComponent={RowComponent}
        rowCount={contacts.length}
        rowHeight={50}
        rowProps={{ contacts, isScrolling }}
      />
    </div>
  );
}

function RowComponent({
  contacts,
  index,
  isScrolling,
  style
}: RowComponentProps<{ contacts: Contact[]; isScrolling: boolean }>) {
  if (isScrolling) {
    return (
      <div className="flex items-center gap-2" style={style}>
        <div className="shrink-0 size-8 rounded-full bg-white/10" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-2 w-48 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  const contact = contacts[index];

  return (
    <div className="flex items-center gap-2" style={style}>
      <Avatar firstName={contact.first_name} lastName={contact.last_name} />
      <div className="flex flex-col min-w-0">
        <div className="truncate">
          {contact.first_name} {contact.last_name}
        </div>
        <div className="truncate text-xs text-slate-400">
          {contact.job_title} at {contact.company}
        </div>
      </div>
    </div>
  );
}

// <end>

export { Example };
