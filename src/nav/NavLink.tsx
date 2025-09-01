import { type PropsWithChildren } from "react";
import { NavLink as NavLinkExternal } from "react-router-dom";
import { Box } from "../components/Box";
import { type Path } from "../routes";
import { cn } from "../utils/cn";
import { NavButton } from "./NavButton";

export function NavLink({
  children,
  className,
  path
}: PropsWithChildren<{
  className?: string;
  path: Path;
}>) {
  return (
    <NavLinkExternal to={path}>
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
