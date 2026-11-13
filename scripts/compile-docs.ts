import { compileDocs } from "react-lib-tools/scripts/compile-docs.ts";

await compileDocs({
  componentNames: ["Grid", "List"],
  hookNames: [
    "useDynamicRowHeight",
    "useGridCallbackRef",
    "useGridRef",
    "useIsScrolling",
    "useListCallbackRef",
    "useListRef",
    "useVirtualizer"
  ],
  imperativeHandleNames: ["GridImperativeAPI", "ListImperativeAPI"]
});
