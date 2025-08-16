import { ComingSoon } from "./routes/ComingSoon";
import { GettingStartedRoute } from "./routes/GettingStarted";
import { PageNotFound } from "./routes/PageNotFound";
import { SupportRoute } from "./routes/Support";
import { ListImperativeApiRoute } from "./routes/list/ImperativeApiRoute";
import { ListPropsRoute } from "./routes/list/PropsRoute";
import { ListOverviewRoute } from "./routes/list/overview/OverviewRoute";
import { VariableListImperativeApiRoute } from "./routes/variable-list/ImperativeApiRoute";
import { VariableListPropsRoute } from "./routes/variable-list/PropsRoute";
import { VariableListRoute } from "./routes/variable-list/overview/OverviewRoute";

export const routeMap = {
  "*": PageNotFound,

  // Home page
  "/": GettingStartedRoute,

  // List
  "/list/fixed-row-height": ListOverviewRoute,
  "/list/fixed-row-height-imperative-api": ListImperativeApiRoute,
  "/list/fixed-row-height-props": ListPropsRoute,
  "/list/variable-row-height": VariableListRoute,
  "/list/variable-row-height-imperative-api": VariableListImperativeApiRoute,
  "/list/variable-row-height-props": VariableListPropsRoute,

  // SimpleGrid
  "/grid/grid": ComingSoon,
  "/grid/grid-props": ComingSoon,
  "/grid/grid-imperative-api": ComingSoon,

  // Other
  "/support": SupportRoute,
  "/tips/memoization": ComingSoon,
} as const;
