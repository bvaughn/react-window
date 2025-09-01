import type { Path } from "../routes";
import { Link } from "./Link";

export function ContinueLink({ title, to }: { title: string; to: Path }) {
  return (
    <div>
      Continue to <Link to={to}>{title}</Link>…
    </div>
  );
}
