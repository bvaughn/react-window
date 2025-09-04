import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type Route = LazyExoticComponent<ComponentType<unknown>>;

export const routes = {
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
  "/list/aria-roles": lazy(() => import("./routes/list/AriaRolesRoute")),
  "/list/tabular-data": lazy(() => import("./routes/tables/TabularDataRoute")),
  "/list/tabular-data-aria-roles": lazy(
    () => import("./routes/tables/AriaRolesRoute")
  ),

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
  "/grid/aria-roles": lazy(() => import("./routes/grid/AriaRolesRoute")),

  // Other
  "/platform-requirements": lazy(
    () => import("./routes/PlatformRequirementsRoute")
  ),
  "/support": lazy(() => import("./routes/SupportRoute")),
  "/test": lazy(() => import("./routes/ScratchpadRoute"))
} satisfies Record<string, Route>;

export type Routes = Record<keyof typeof routes, Route>;
export type Path = keyof Routes;
