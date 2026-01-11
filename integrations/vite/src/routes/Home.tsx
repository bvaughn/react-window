import { List, type RowComponentProps } from "react-window";
import {
  AnimationFrameRowCounter,
  EnvironmentMarker,
  LayoutShiftDetecter
} from "../../../tests";

export function HomeRoute() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <EnvironmentMarker>Vite (client rendering)</EnvironmentMarker>
      <AnimationFrameRowCounter />
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

function RowComponent({ index, style }: RowComponentProps<object>) {
  return (
    <div className="flex items-center gap-2" style={style}>
      Row {index}
    </div>
  );
}
