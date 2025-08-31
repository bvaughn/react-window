import { lazy } from "react";

export const routeMap = {
  "*": lazy(() => import("./routes/PageNotFound")),

  // Home page
  "/": lazy(() => import("./routes/GettingStartedRoute")),

  // List
  "/list/fixed-row-height": lazy(
    () => import("./routes/list/FixedRowHeightsRoute")
  ),
  "/list/variable-row-height": lazy(
    () => import("./routes/list/VariableRowHeightsRoute")
  ),
  "/list/imperative-api": lazy(
    () => import("./routes/list/ImperativeApiRoute")
  ),
  "/list/props": lazy(() => import("./routes/list/PropsRoute")),
  "/list/tabular-data": lazy(() => import("./routes/tables/TabularDataRoute")),

  // SimpleGrid
  "/grid/grid": lazy(() => import("./routes/grid/RenderingGridRoute")),
  "/grid/horizontal-lists": lazy(
    () => import("./routes/grid/HorizontalListsRoute")
  ),
  "/grid/rtl-grids": lazy(() => import("./routes/grid/RTLGridsRoute")),
  "/grid/props": lazy(() => import("./routes/grid/PropsRoute")),
  "/grid/imperative-api": lazy(
    () => import("./routes/grid/ImperativeApiRoute")
  ),

  // Other
  "/platform-requirements": lazy(
    () => import("./routes/PlatformRequirementsRoute")
  ),
  "/support": lazy(() => import("./routes/SupportRoute")),
  "/test": lazy(() => import("./routes/ScratchpadRoute"))
} as const;
