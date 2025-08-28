import { GettingStartedRoute } from "./routes/GettingStartedRoute";
import { HorizontalListsRoute } from "./routes/grid/HorizontalListsRoute";
import { GridImperativeApiRoute } from "./routes/grid/ImperativeApiRoute";
import { GridPropsRoute } from "./routes/grid/PropsRoute";
import { RenderingGridRoute } from "./routes/grid/RenderingGridRoute";
import { RTLGridsRoute } from "./routes/grid/RTLGridsRoute";
import { FixedRowHeightsRoute } from "./routes/list/FixedRowHeightsRoute";
import { ListImperativeApiRoute } from "./routes/list/ImperativeApiRoute";
import { ListPropsRoute } from "./routes/list/PropsRoute";
import { VariableRowHeightsRoute } from "./routes/list/VariableRowHeightsRoute";
import { PageNotFound } from "./routes/PageNotFound";
import { PlatformRequirementsRoute } from "./routes/PlatformRequirementsRoute";
import { ScratchpadRoute } from "./routes/ScratchpadRoute";
import { SupportRoute } from "./routes/SupportRoute";
import { TabularDataRoute } from "./routes/tables/TabularDataRoute";

export const routeMap = {
  "*": PageNotFound,

  // Home page
  "/": GettingStartedRoute,

  // List
  "/list/fixed-row-height": FixedRowHeightsRoute,
  "/list/variable-row-height": VariableRowHeightsRoute,
  "/list/imperative-api": ListImperativeApiRoute,
  "/list/props": ListPropsRoute,
  "/list/tabular-data": TabularDataRoute,

  // SimpleGrid
  "/grid/grid": RenderingGridRoute,
  "/grid/horizontal-lists": HorizontalListsRoute,
  "/grid/rtl-grids": RTLGridsRoute,
  "/grid/props": GridPropsRoute,
  "/grid/imperative-api": GridImperativeApiRoute,

  // Other
  "/platform-requirements": PlatformRequirementsRoute,
  "/support": SupportRoute,
  "/test": ScratchpadRoute
} as const;
