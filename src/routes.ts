import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type Route = LazyExoticComponent<ComponentType<unknown>>;

export const routes = {
  "/how-does-it-work": lazy(() => import("./routes/HowDoesItWorkRoute")),
  "/list/fixed-row-height": lazy(
    () => import("./routes/list/FixedRowHeightsRoute")
  ),
  "/list/variable-row-height": lazy(
    () => import("./routes/list/VariableRowHeightsRoute")
  ),
  "/list/dynamic-row-height": lazy(
    () => import("./routes/list/DynamicRowHeightsRoute")
  ),
  "/list/scroll-to-row": lazy(() => import("./routes/list/ScrollToRowRoute")),
  "/list/props": lazy(() => import("./routes/list/PropsRoute")),
  "/list/imperative-handle": lazy(
    () => import("./routes/list/ImperativeApiRoute")
  ),
  "/list/aria-roles": lazy(() => import("./routes/list/AriaRolesRoute")),
  "/list/tabular-data": lazy(() => import("./routes/tables/TabularDataRoute")),
  "/list/tabular-data-aria-roles": lazy(
    () => import("./routes/tables/AriaRolesRoute")
  ),
  "/list/sticky-rows": lazy(() => import("./routes/list/StickyRowsRoute")),
  "/list/images": lazy(() => import("./routes/list/ImagesRoute")),
  "/list/pinned-to-bottom": lazy(
    () => import("./routes/list/PinnedToBottomRoute")
  ),
  "/list/scroll-element": lazy(
    () => import("./routes/list/ScrollElementRoute")
  ),
  "/infinite-loading": lazy(
    () => import("./routes/infinite-loading/InfiniteLoadingRoute")
  ),
  "/hooks/use-is-scrolling": lazy(
    () => import("./routes/hooks/UseIsScrollingRoute")
  ),
  "/hooks/use-is-scrolling/scrolling-a-list": lazy(
    () => import("./routes/hooks/UseIsScrollingListRoute")
  ),
  "/hooks/use-is-scrolling/scrolling-with-the-window": lazy(
    () => import("./routes/hooks/UseIsScrollingWindowRoute")
  ),
  "/hooks/use-virtualizer": lazy(
    () => import("./routes/hooks/UseVirtualizerRoute")
  ),
  "/hooks/use-virtualizer/lists": lazy(
    () => import("./routes/hooks/UseVirtualizerListsRoute")
  ),
  "/hooks/use-virtualizer/tables": lazy(
    () => import("./routes/hooks/UseVirtualizerTablesRoute")
  ),
  "/hooks/use-virtualizer/dynamic-heights": lazy(
    () => import("./routes/hooks/UseVirtualizerDynamicHeightsRoute")
  ),
  "/grid/grid": lazy(() => import("./routes/grid/RenderingGridRoute")),
  "/grid/horizontal-lists": lazy(
    () => import("./routes/grid/HorizontalListsRoute")
  ),
  "/grid/rtl-grids": lazy(() => import("./routes/grid/RTLGridsRoute")),
  "/grid/props": lazy(() => import("./routes/grid/PropsRoute")),
  "/grid/imperative-handle": lazy(
    () => import("./routes/grid/ImperativeHandleRoute")
  ),
  "/grid/scroll-to-cell": lazy(() => import("./routes/grid/ScrollToCellRoute")),
  "/grid/aria-roles": lazy(() => import("./routes/grid/AriaRolesRoute")),
  "/server-rendering": lazy(
    () => import("./routes/server-rendering/ServerRenderingRoute")
  ),
  "/server-rendering/server-components": lazy(
    () => import("./routes/server-rendering/ServerComponentsRoute")
  ),
  "/server-rendering/dynamic-row-heights": lazy(
    () => import("./routes/server-rendering/DynamicRowHeightsRoute")
  ),
  "/server-rendering/initial-scroll-position": lazy(
    () => import("./routes/server-rendering/InitialScrollPositionRoute")
  ),
  "/platform-requirements": lazy(
    () => import("./routes/PlatformRequirementsRoute")
  ),
  "/test": lazy(() => import("./routes/ScratchpadRoute"))
} satisfies Record<string, Route>;

export type Routes = Record<keyof typeof routes, Route>;
export type Path = keyof Routes;
