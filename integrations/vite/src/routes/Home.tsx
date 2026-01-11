import { Link } from "react-router";

export function HomeRoute() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <Link to="/list">List</Link>
      <Link to="/grid">Grid</Link>
    </div>
  );
}
