import type json from "../../../../public/data/addresses.json";

type Address = (typeof json)[0];

// <begin>

import { useState } from "react";
import { useVirtualizer } from "react-window";

function Example({ addresses }: { addresses: Address[] }) {
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null
  );
  const [tbody, setTbody] = useState<HTMLTableSectionElement | null>(null);

  // Rows are positioned relative to the <tbody>, so the header doesn't offset them
  const { items, totalSize } = useVirtualizer({
    count: addresses.length,
    element: tbody,
    itemSize: 25,
    scrollElement
  });

  // Spacer rows take the place of rows that aren't rendered
  const first = items[0];
  const last = items[items.length - 1];
  const spaceBefore = first ? first.offset : 0;
  const spaceAfter = last ? totalSize - last.offset - last.size : 0;

  return (
    <div
      className="h-55 overflow-auto"
      ref={setScrollElement}
      // Rows scrolled to (e.g. with scrollToIndex) are aligned below the sticky header
      style={{ scrollPaddingTop: 25 }}
    >
      {/* Fixed layout keeps column widths from changing as different rows are rendered */}
      <table
        aria-rowcount={addresses.length + 1}
        className="w-full table-fixed"
      >
        <colgroup>
          <col className="w-1/2" />
          <col className="w-1/3" />
          <col />
        </colgroup>
        <thead className="sticky top-0 bg-teal-600">
          <tr aria-rowindex={1} className="h-[25px]">
            <th className="px-2 text-left">City</th>
            <th className="px-2 text-left">State</th>
            <th className="px-2 text-left">Zip</th>
          </tr>
        </thead>
        <tbody ref={setTbody}>
          {spaceBefore > 0 && (
            <tr aria-hidden style={{ height: spaceBefore }} />
          )}
          {items.map(({ index, size }) => {
            const address = addresses[index];

            // Add 2 to the index to account for the header row
            return (
              <tr
                aria-rowindex={index + 2}
                key={index}
                style={{ height: size }}
              >
                <td className="px-2 truncate">{address.city}</td>
                <td className="px-2 truncate">{address.state}</td>
                <td className="px-2 text-xs">{address.zip}</td>
              </tr>
            );
          })}
          {spaceAfter > 0 && <tr aria-hidden style={{ height: spaceAfter }} />}
        </tbody>
      </table>
    </div>
  );
}

// <end>

export { Example };
