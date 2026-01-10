import { List, type RowComponentProps } from "react-window";
import { AnimationFrameRowCounter, LayoutShiftDetecter } from "../../../tests";

export function HomeRoute() {
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

function RowComponent({ index, style }: RowComponentProps<object>) {
  return (
    <div className="flex items-center" style={style}>
      Row {index}
    </div>
  );
}
