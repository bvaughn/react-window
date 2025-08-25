import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavStore } from "../hooks/useNavStore";
import { cn } from "../utils/cn";

export function Nav() {
  const { hide, visible } = useNavStore();

  const { pathname } = useLocation();
  useLayoutEffect(() => {
    hide();
  }, [hide, pathname]);

  return (
    <div
      className={cn(
        "absolute top-0 left-0 h-full z-400 md:relative w-full md:w-50 shrink-0 hidden md:flex",
        "flex-col gap-4 py-2 border-r border-r-slate-800 overflow-y-auto",
        {
          flex: visible
        }
      )}
    >
      MOBILE NAV
    </div>
  );
}
