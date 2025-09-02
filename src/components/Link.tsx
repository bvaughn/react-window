import type { HTMLAttributes } from "react";
import type { Path } from "../routes";
import { TransitionLink } from "./TransitionLink";

export function Link({
  to,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  to: Path;
}) {
  return <TransitionLink to={to} {...rest} />;
}
