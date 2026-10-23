import { type RowComponentProps } from "react-window";
import { Avatar } from "../../examples/Avatar";
import type { Contact } from "../../grid/examples/Grid";

function RowComponent({
  contacts,
  index,
  style
}: RowComponentProps<{
  contacts: Contact[];
}>) {
  const contact = contacts[index];

  return (
    <div className="flex items-center gap-2" style={style}>
      <Avatar firstName={contact.first_name} lastName={contact.last_name} />
      <div className="flex flex-col min-w-0">
        <div className="truncate">
          <strong>
            {contact.first_name} {contact.last_name}
          </strong>{" "}
          started a new role as {contact.job_title} at {contact.company}
        </div>
        <div className="truncate text-xs text-slate-400">
          {contact.city}, {contact.state}
        </div>
      </div>
    </div>
  );
}

export { RowComponent };
