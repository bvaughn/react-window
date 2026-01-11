import { Grid, type CellComponentProps } from "react-window";
import {
  AnimationFrameRowCellCounter,
  EnvironmentMarker,
  LayoutShiftDetecter
} from "../../../tests";

export function GridRoute() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <EnvironmentMarker>Vite (client rendering)</EnvironmentMarker>
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

function CellComponent({
  ariaAttributes,
  columnIndex,
  rowIndex,
  style
}: CellComponentProps<object>) {
  return (
    <div className="flex items-center gap-1" style={style} {...ariaAttributes}>
      Cell {rowIndex}, {columnIndex}
    </div>
  );
}
