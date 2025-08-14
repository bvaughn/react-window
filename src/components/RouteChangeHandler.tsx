import { useLocation } from "react-router-dom";
import { useIsomorphicLayoutEffect } from "../../lib/hooks/useIsomorphicLayoutEffect";
import { useNavStore } from "../hooks/useNavStore";

export function RouteChangeHandler() {
  const { hide } = useNavStore();

  const { pathname } = useLocation();

  useIsomorphicLayoutEffect(() => {
    hide();

    const main = document.body.querySelector("[data-main-scrollable]");
    if (main) {
      const timeout = setTimeout(() => {
        main.scrollTo(0, 0);
      }, 1);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [pathname]);

  return null;
}
