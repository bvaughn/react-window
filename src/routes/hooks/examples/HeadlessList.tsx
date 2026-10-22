// <begin>

import { useState } from "react";
import { useVirtualizer } from "react-window";

function Example({ names }: { names: string[] }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const { items, totalSize } = useVirtualizer({
    count: names.length,
    element,
    itemSize: 25
  });

  return (
    <div className="h-full overflow-auto" ref={setElement}>
      <div className="relative" style={{ height: totalSize }}>
        {items.map(({ index, offset, size }) => (
          <div
            className="absolute w-full"
            key={index}
            style={{ height: size, transform: `translateY(${offset}px)` }}
          >
            {names[index]}
          </div>
        ))}
      </div>
    </div>
  );
}

// <end>

export { Example };
