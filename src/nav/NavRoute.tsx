import type { ReactNode } from "react";
import { Route } from "react-router-dom";

export function NavRoute({
  route
}: {
  route: {
    component: ReactNode;
    path: string;
  };
}) {
  return <Route path={route.path} element={route.component} />;
}
