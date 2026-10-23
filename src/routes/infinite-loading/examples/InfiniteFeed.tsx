import { Avatar } from "../../examples/Avatar";
import { fetchPage, type Contact } from "./fetchPage";

// <begin>

import { useState } from "react";
import { List, type RowComponentProps } from "react-window";

const PAGE_SIZE = 30;
const TOTAL_PAGES = 10;

// Start loading the next page when the user scrolls within this many rows of the end
const THRESHOLD = 10;

function Example() {
  const [items, setItems] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = items.length < PAGE_SIZE * TOTAL_PAGES;

  // fetchPage loads a page of items (e.g. from a server)
  const loadNextPage = async () => {
    setIsLoading(true);
    try {
      const page = await fetchPage(items.length / PAGE_SIZE, PAGE_SIZE);
      setItems((prev) => [...prev, ...page]);
    } finally {
      // Reset even if loading fails, so the page can be requested again
      setIsLoading(false);
    }
  };

  return (
    <List
      onRowsRendered={({ stopIndex }) => {
        // Only load one page at a time
        if (hasMore && !isLoading && stopIndex >= items.length - THRESHOLD) {
          loadNextPage();
        }
      }}
      rowComponent={RowComponent}
      // Render an extra row to show that more items are loading
      rowCount={hasMore ? items.length + 1 : items.length}
      rowHeight={50}
      rowProps={{ items }}
    />
  );
}

function RowComponent({
  index,
  items,
  style
}: RowComponentProps<{ items: Contact[] }>) {
  // The extra row at the end renders a placeholder while the next page loads
  if (index >= items.length) {
    return (
      <div className="flex items-center gap-2 px-2" style={style}>
        <div className="shrink-0 size-8 rounded-full bg-white/10 animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-32 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-48 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  const contact = items[index];

  return (
    <div className="flex items-center gap-2 px-2" style={style}>
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

// <end>

export { Example };
