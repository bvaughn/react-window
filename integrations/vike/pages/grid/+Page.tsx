import { Grid } from "react-window";
import {
  AnimationFrameRowCellCounter,
  EnvironmentMarker,
  LayoutShiftDetecter
} from "../../../tests";
import { CellComponent } from "./CellComponent";

export default function Page() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <EnvironmentMarker>Vike (server rendering)</EnvironmentMarker>
      <AnimationFrameRowCellCounter />
      <LayoutShiftDetecter />
      <Grid
        cellComponent={CellComponent}
        cellProps={{}}
        className="h-[250px] w-[250px]"
        columnCount={10}
        columnWidth={100}
        defaultHeight={250}
        defaultWidth={250}
        overscanCount={0}
        rowCount={100}
        rowHeight={25}
      />
    </div>
  );
}
