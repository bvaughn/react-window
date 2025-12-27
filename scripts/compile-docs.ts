import { compileDocs } from "react-lib-tools/scripts/compile-docs.ts";

await compileDocs({
  componentNames: ["grid/Grid.tsx", "list/List.tsx"],
  imperativeHandleNames: ["GridImperativeAPI", "ListImperativeAPI"]
});
