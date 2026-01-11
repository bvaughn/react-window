import { List, type RowComponentProps } from "react-window";
import {
  AnimationFrameRowCellCounter,
  EnvironmentMarker,
  LayoutShiftDetecter
} from "../../../tests";

export function ListRoute() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <EnvironmentMarker>Vite (client rendering)</EnvironmentMarker>
      <AnimationFrameRowCellCounter />
      <LayoutShiftDetecter />
      <List
        className="h-[250px]"
        defaultHeight={250}
        overscanCount={0}
        rowComponent={RowComponent}
        rowCount={100}
        rowHeight={25}
        rowProps={{}}
      />
    </div>
  );
}

function RowComponent({
  ariaAttributes,
  index,
  style
}: RowComponentProps<object>) {
  return (
    <div className="flex items-center gap-2" style={style} {...ariaAttributes}>
      Row {index}
    </div>
  );
}
