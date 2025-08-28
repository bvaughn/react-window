import type { routeMap } from "../routes";
import { Link } from "./Link";

export function ContinueLink({
  title,
  to
}: {
  title: string;
  to: keyof typeof routeMap;
}) {
  return (
    <div>
      Continue to <Link to={to}>{title}</Link>…
    </div>
  );
}
