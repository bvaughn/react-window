// <begin>

import { useEffect, useRef, type UIEvent } from "react";
import { List, useDynamicRowHeight, useListRef } from "react-window";
import { RowComponent, type ChatMessage } from "./ListRowPinnedToBottom";

function Example({
  messages,
  typing
}: {
  messages: ChatMessage[];
  typing: string[];
}) {
  const listRef = useListRef(null);
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 50
  });

  // Stop following new messages if the user scrolls up to read older ones,
  // and start following them again once they scroll back to the bottom
  const isPinnedRef = useRef(true);
  const prevScrollTopRef = useRef(0);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;

    // Scrolling to the bottom only ever moves down, so moving up means the user scrolled
    if (scrollTop < prevScrollTopRef.current) {
      isPinnedRef.current = false;
    }
    if (scrollHeight - scrollTop - clientHeight <= 1) {
      isPinnedRef.current = true;
    }

    prevScrollTopRef.current = scrollTop;
  };

  // New rows are rendered with an estimated height and then measured;
  // rowHeight changes after each measurement, so scroll again once the real height is known
  useEffect(() => {
    const element = listRef.current?.element;
    if (element && isPinnedRef.current) {
      element.scrollTo({ behavior: "smooth", top: element.scrollHeight });
    }
  }, [listRef, messages, rowHeight, typing]);

  return (
    <List
      listRef={listRef}
      onScroll={onScroll}
      rowComponent={RowComponent}
      // Render an extra row for each person who is currently typing
      rowCount={messages.length + typing.length}
      rowHeight={rowHeight}
      rowProps={{ messages, typing }}
    />
  );
}

// <end>

export { Example };
