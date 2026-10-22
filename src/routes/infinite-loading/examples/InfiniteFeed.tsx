import { fetchPage } from "./fetchPage";

// <begin>

import { useState } from "react";
import { List, type RowComponentProps } from "react-window";

const PAGE_SIZE = 50;
const TOTAL_PAGES = 10;

// Start loading the next page when the user scrolls within this many rows of the end
const THRESHOLD = 10;

function Example() {
  const [items, setItems] = useState<string[]>([]);
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
      rowHeight={25}
      rowProps={{ items }}
    />
  );
}

function RowComponent({
  index,
  items,
  style
}: RowComponentProps<{ items: string[] }>) {
  return (
    <div className="flex items-center px-2" style={style}>
      {index < items.length ? (
        items[index]
      ) : (
        <span className="text-slate-500">Loading…</span>
      )}
    </div>
  );
}

// <end>

export { Example };
