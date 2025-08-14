import { ComingSoon } from "./routes/ComingSoon";
import { GettingStartedRoute } from "./routes/GettingStarted";
import { PageNotFound } from "./routes/PageNotFound";
import { ImperativeApiRoute } from "./routes/list/ImperativeApi";
import { ListRoute } from "./routes/list/List";
import { ListPropsRoute } from "./routes/list/ListProps";
import { VariableListRoute } from "./routes/list/VariableList";
import { VariableListPropsRoute } from "./routes/list/VariableListProps";

export const routeMap = {
  "*": PageNotFound,

  // Home page
  "/": GettingStartedRoute,

  // List
  "/list/fixed-row-height": ListRoute,
  "/list/fixed-row-height-props": ListPropsRoute,
  "/list/variable-row-height": VariableListRoute,
  "/list/variable-row-height-props": VariableListPropsRoute,
  "/list/imperative-api": ImperativeApiRoute,

  // SimpleGrid
  "/grid/grid": ComingSoon,
  "/grid/grid-props": ComingSoon,
  "/grid/imperative-api": ComingSoon,

  // Other
  "/other/memoization": ComingSoon,
} as const;
