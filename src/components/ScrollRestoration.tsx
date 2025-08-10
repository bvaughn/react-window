import { useLocation } from "react-router-dom";
import { useIsomorphicLayoutEffect } from "../../lib/hooks/useIsomorphicLayoutEffect";

export function ScrollRestoration() {
  const { pathname } = useLocation();

  useIsomorphicLayoutEffect(() => {
    const main = document.body.querySelector("main");
    if (main) {
      main.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
