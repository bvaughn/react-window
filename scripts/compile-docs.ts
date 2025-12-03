import { compileComponents } from "./utils/docs/compileComponents.ts";
import { compileImperativeHandles } from "./utils/docs/compileImperativeHandles.ts";

async function run() {
  await compileComponents({
    componentNames: ["grid/Grid.tsx", "list/List.tsx"],
    outputDirName: "js-docs"
  });

  await compileImperativeHandles({
    names: ["GridImperativeAPI", "ListImperativeAPI"],
    outputDirName: "js-docs"
  });
}

run();
