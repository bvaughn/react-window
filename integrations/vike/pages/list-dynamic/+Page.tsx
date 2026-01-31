import { List, useDynamicRowHeight } from "react-window";
import {
  AnimationFrameRowCellCounter,
  EnvironmentMarker,
  LayoutShiftDetecter
} from "../../../tests";
import { RowComponent } from "./RowComponent";

export default function Page() {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 30
  });

  return (
    <div className="p-2 flex flex-col gap-2">
      <EnvironmentMarker>Vike (server rendering)</EnvironmentMarker>
      <AnimationFrameRowCellCounter />
      <LayoutShiftDetecter />
      <List
        className="h-[250px]"
        defaultHeight={250}
        overscanCount={0}
        rowComponent={RowComponent}
        rowCount={100}
        rowHeight={rowHeight}
        rowProps={{}}
      />
    </div>
  );
}
