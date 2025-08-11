import { useLocation } from "react-router-dom";
import { useIsomorphicLayoutEffect } from "../../lib/hooks/useIsomorphicLayoutEffect";
import { useNavStore } from "../hooks/useNavStore";

export function RouteChangeHandler() {
  const { hide } = useNavStore();

  const { pathname } = useLocation();

  useIsomorphicLayoutEffect(() => {
    const main = document.body.querySelector("main");
    if (main) {
      main.scrollTo(0, 0);
    }

    hide();
  }, [pathname]);

  return null;
}
