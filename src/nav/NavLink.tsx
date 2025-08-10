import type { PropsWithChildren } from "react";
import { NavLink as NavLinkExternal } from "react-router-dom";
import type { routeMap } from "../routes";

export function NavLink({
  to,
  children,
}: PropsWithChildren<{ to: keyof typeof routeMap }>) {
  return (
    <NavLinkExternal to={to}>
      {({ isActive }) => (
        <li
          className={`cursor-pointer text-sm text-neutral-300 hover:text-white pl-4 border-l ${isActive ? "text-white border-l-neutral-300" : "border-l-neutral-800"}`}
        >
          {children}
        </li>
      )}
    </NavLinkExternal>
  );
}
