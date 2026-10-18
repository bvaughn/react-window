declare function loadNames(): Promise<string[]>;

// <begin>

// app/names/page.tsx (a Server Component)
import { List } from "react-window";
import { RowComponent } from "./RowComponent";

export default async function Page() {
  const names = await loadNames();

  return (
    <List
      className="h-100"
      defaultHeight={400}
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={25}
      rowProps={{ names }}
    />
  );
}

// <end>
