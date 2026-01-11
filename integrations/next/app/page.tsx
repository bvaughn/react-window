import { List } from "react-window";
import {
  AnimationFrameRowCounter,
  EnvironmentMarker,
  LayoutShiftDetecter
} from "../../tests";
import { RowComponent } from "./components/RowComponent";

export default async function Home() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <EnvironmentMarker>NextJS (server components)</EnvironmentMarker>
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
