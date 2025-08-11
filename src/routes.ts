import { ComingSoon } from "./routes/ComingSoon";
import { PageNotFound } from "./routes/PageNotFound";
import { ListFixedRowHeightRoute } from "./routes/list/ListFixedRowHeight";
import { ListImperativeApiRoute } from "./routes/list/ListImperativeApi";
import { ListPropsRoute } from "./routes/list/ListProps";

export const routeMap = {
  "*": PageNotFound,

  // Home page
  "/": ComingSoon,

  // List
  "/list/getting-started": ComingSoon,
  "/list/fixed-row-heights": ListFixedRowHeightRoute,
  "/list/variable-row-heights": ComingSoon,
  "/list/dynamic-row-heights": ComingSoon,
  "/list/props": ListPropsRoute,
  "/list/api": ListImperativeApiRoute,

  // SimpleGrid
  "/grid/example": ComingSoon,
  "/grid/props": ComingSoon,
  "/grid/api": ComingSoon,

  // Other
  "/other/memoization": ComingSoon,
} as const;
