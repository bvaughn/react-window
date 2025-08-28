import type { PropsWithChildren } from "react";
import { NavLink as NavLinkExternal } from "react-router-dom";
import type { routeMap } from "../routes";
import { cn } from "../utils/cn";
import { NavButton } from "./NavButton";
import { Box } from "../components/Box";

export function NavLink({
  children,
  className,
  to
}: PropsWithChildren<{ className?: string; to: keyof typeof routeMap }>) {
  return (
    <NavLinkExternal to={to}>
      {({ isActive }) => (
        <NavButton
          className={cn(
            "px-4 cursor-pointer",
            {
              "font-bold text-emerald-200 hover:text-white": isActive
            },
            className
          )}
        >
          <Box align="center" direction="row" gap={2}>
            {children}
          </Box>
        </NavButton>
      )}
    </NavLinkExternal>
  );
}
