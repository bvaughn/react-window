import { ComingSoon } from "./routes/ComingSoon";
import { GettingStartedRoute } from "./routes/GettingStarted";
import { PageNotFound } from "./routes/PageNotFound";
import { SupportRoute } from "./routes/Support";
import { ListRoute } from "./routes/list/List";
import { ListImperativeApiRoute } from "./routes/list/ListImperativeApi";
import { ListPropsRoute } from "./routes/list/ListProps";
import { VariableListRoute } from "./routes/list/VariableList";
import { VariableListImperativeApiRoute } from "./routes/list/VariableListImperativeApi";
import { VariableListPropsRoute } from "./routes/list/VariableListProps";

export const routeMap = {
  "*": PageNotFound,

  // Home page
  "/": GettingStartedRoute,

  // List
  "/list/fixed-row-height": ListRoute,
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
