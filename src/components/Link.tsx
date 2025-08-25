import type { HTMLAttributes } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import type { routeMap } from "../routes";

export function Link({
  to,
  ...rest
}: HTMLAttributes<HTMLAnchorElement> & {
  to: keyof typeof routeMap;
}) {
  return <ReactRouterLink to={to} {...rest} />;
}
