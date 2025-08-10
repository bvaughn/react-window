import { ComingSoon } from "./routes/ComingSoon";
import { PageNotFound } from "./routes/PageNotFound";
import { SimpleListExampleRoute } from "./routes/simple-list/SimpleListExample";
import { SimpleListImperativeApiRoute } from "./routes/simple-list/SimpleListImperativeApi";
import { SimpleListPropsRoute } from "./routes/simple-list/SimpleListProps";

export const routeMap = {
  "*": PageNotFound,

  // Home page
  "/": SimpleListExampleRoute,

  // SimpleList
  "/simple-list/example": SimpleListExampleRoute,
  "/simple-list/props": SimpleListPropsRoute,
  "/simple-list/api": SimpleListImperativeApiRoute,

  // DynamicList
  "/dynamic-list/example": ComingSoon,
  "/dynamic-list/props": ComingSoon,
  "/dynamic-list/api": ComingSoon,

  // SimpleGrid
  "/simple-grid/example": ComingSoon,
  "/simple-grid/props": ComingSoon,
  "/simple-grid/api": ComingSoon,

  // Other
  "/other/memoization": ComingSoon,
} as const;
