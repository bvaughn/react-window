import { compileDocs } from "react-lib-tools/scripts/compile-docs.ts";

await compileDocs({
  componentNames: ["grid/Grid", "list/List"],
  imperativeHandleNames: ["GridImperativeAPI", "ListImperativeAPI"]
});
