import { List, type RowComponentProps } from "react-window";
import { LayoutShiftDetecter } from "../../../tests";

export function HomeRoute() {
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

function RowComponent({ index, style }: RowComponentProps<object>) {
  return (
    <div className="flex items-center" style={style}>
      Row {index}
    </div>
  );
}
