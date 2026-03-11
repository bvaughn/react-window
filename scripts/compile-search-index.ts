import { compileSearchIndex } from "react-lib-tools/scripts/compile-search-index.ts";

await compileSearchIndex({
  chromeExecutablePath: process.env.CHROME_PATH,
  filterSelector: "[role=list]"
});
