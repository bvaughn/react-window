import {
  AnimationFrameRowCellCounter,
  EnvironmentMarker,
  LayoutShiftDetecter
} from "../../../tests";
import { List } from "./components/List";

export default async function Home() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <EnvironmentMarker>NextJS (server components)</EnvironmentMarker>
      <AnimationFrameRowCellCounter />
      <LayoutShiftDetecter />
      <List />
    </div>
  );
}
