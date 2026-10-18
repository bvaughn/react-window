import { compileDocs } from "react-lib-tools/scripts/compile-docs.ts";

await compileDocs({
  componentNames: ["Grid", "List"],
  imperativeHandleNames: ["GridImperativeAPI", "ListImperativeAPI"]
});
