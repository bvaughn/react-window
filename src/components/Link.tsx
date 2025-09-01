import type { HTMLAttributes } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import type { Path } from "../routes";

export function Link({
  to,
  ...rest
}: HTMLAttributes<HTMLAnchorElement> & {
  to: Path;
}) {
  return <ReactRouterLink to={to} {...rest} />;
}
