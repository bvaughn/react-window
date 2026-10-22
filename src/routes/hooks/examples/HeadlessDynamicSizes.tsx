import { cn } from "react-lib-tools";

// <begin>

import { useState } from "react";
import { useDynamicRowHeight, useVirtualizer } from "react-window";

function Example({ lorem }: { lorem: string[] }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const itemSize = useDynamicRowHeight({ defaultRowHeight: 50 });

  const { items, measureElement, totalSize } = useVirtualizer({
    count: lorem.length,
    element,
    itemSize
  });

  return (
    <div className="h-full overflow-auto" ref={setElement}>
      <div className="relative" style={{ height: totalSize }}>
        {items.map(({ index, offset }) => (
          <div
            className={cn("absolute w-full p-2", {
              "bg-white/10": index % 2 === 0
            })}
            // Rows are measured after rendering, so they need their index
            data-index={index}
            key={index}
            ref={measureElement}
            style={{ transform: `translateY(${offset}px)` }}
          >
            {index}: {lorem[index]}
          </div>
        ))}
      </div>
    </div>
  );
}

// <end>

export { Example };
