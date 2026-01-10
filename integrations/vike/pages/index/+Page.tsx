import { List } from "react-window";
import { AnimationFrameRowCounter, LayoutShiftDetecter } from "../../../tests";
import { RowComponent } from "./RowComponent";

export default function Page() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <AnimationFrameRowCounter />
      <LayoutShiftDetecter />
      <List
        className="h-[250px]"
        defaultHeight={250}
        onRowsRendered={(visibleRows) => {
          console.log("onRowsRendered:", visibleRows);
        }}
        overscanCount={0}
        rowComponent={RowComponent}
        rowCount={100}
        rowHeight={25}
        rowProps={{}}
      />
    </div>
  );
}
