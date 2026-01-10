import { List } from "react-window";
import { LayoutShiftDetecter } from "../../../tests";
import { RowComponent } from "./RowComponent";

export default function Page() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <LayoutShiftDetecter />
      <List
        defaultHeight={400}
        rowComponent={RowComponent}
        rowCount={100}
        rowHeight={25}
        rowProps={{}}
      />
    </div>
  );
}
