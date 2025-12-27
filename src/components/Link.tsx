import type { HTMLAttributes } from "react";
import { Link as ExternalLink } from "react-lib-tools";
import type { Path } from "../routes";

export function Link({
  to,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  to: Path;
}) {
  return <ExternalLink to={to} {...rest} />;
}
