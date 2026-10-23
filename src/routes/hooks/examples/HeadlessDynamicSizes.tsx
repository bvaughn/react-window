import { cn } from "react-lib-tools";

// <begin>

import { useState } from "react";
import { useDynamicRowHeight, useVirtualizer } from "react-window";

function Example({ messages }: { messages: string[] }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const itemSize = useDynamicRowHeight({ defaultRowHeight: 50 });

  const { items, measureElement, totalSize } = useVirtualizer({
    count: messages.length,
    element,
    itemSize
  });

  return (
    <div className="h-full overflow-auto" ref={setElement}>
      <div className="relative" style={{ height: totalSize }}>
        {items.map(({ index, offset }) => {
          // Alternate messages between two participants
          const isOutgoing = index % 2 === 1;

          return (
            <div
              className={cn("absolute w-full flex flex-col px-2 py-1", {
                "items-end": isOutgoing,
                "items-start": !isOutgoing
              })}
              // Rows are measured after rendering, so they need their index
              data-index={index}
              key={index}
              ref={measureElement}
              style={{ transform: `translateY(${offset}px)` }}
            >
              <div className="text-xs opacity-50 px-1 pb-0.5">
                {isOutgoing ? "You" : "Friend"}
              </div>
              <div
                className={cn("max-w-3/4 px-3 py-2 rounded-2xl", {
                  "bg-sky-700 text-white rounded-br-sm": isOutgoing,
                  "bg-white/10 rounded-bl-sm": !isOutgoing
                })}
              >
                {messages[index]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// <end>

export { Example };
