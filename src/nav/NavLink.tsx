import { type PropsWithChildren } from "react";
import { Box } from "../components/Box";
import { TransitionLink } from "../components/TransitionLink";
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
    <TransitionLink to={path}>
      {({ isActive, isPending }) => (
        <NavButton
          className={cn(
            "px-4 cursor-pointer",
            {
              "font-bold text-emerald-200 hover:text-white": isActive,
              "opacity-50 pointer-events-none": isPending
            },
            className
          )}
        >
          <Box align="center" direction="row" gap={2}>
            {children}
          </Box>
        </NavButton>
      )}
    </TransitionLink>
  );
}
