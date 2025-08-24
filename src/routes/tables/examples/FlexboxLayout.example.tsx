import type json from "../../../../public/data/addresses.json";

type Address = (typeof json)[0];

// <begin>

import { List, type RowComponentProps } from "react-window";

function Example({ addresses }: { addresses: Address[] }) {
  return (
    <div className="h-55 flex flex-col">
      <div className="flex flex-row items-center gap-2 font-bold bg-teal-600 p-1 px-2">
        <div className="flex-1">City</div>
        <div className="flex-1">State</div>
        <div className="w-10">Zip</div>
      </div>
      <div className="overflow-hidden">
        <List
          rowComponent={RowComponent}
          rowCount={addresses.length}
          rowHeight={25}
          rowProps={{ addresses }}
        />
      </div>
    </div>
  );
}

function RowComponent({
  index,
  addresses,
  style
}: RowComponentProps<{
  addresses: Address[];
}>) {
  const address = addresses[index];

  return (
    <div className="flex flex-row items-center gap-2 px-2" style={style}>
      <div className="flex-1">{address.city}</div>
      <div className="flex-1">{address.state}</div>
      <div className="w-10 text-xs">{address.zip}</div>
    </div>
  );
}

// <end>

export { Example };
