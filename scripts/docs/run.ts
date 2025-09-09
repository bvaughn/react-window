import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import { withCustomConfig } from "react-docgen-typescript";
import { getFilesWithExtensions, rmFilesWithExtensions } from "../utils.ts";

const parser = withCustomConfig("./tsconfig.json", {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true,
});

async function run() {
  const inputDir = join(cwd(), "lib", "components");

  const outputDir = join(cwd(), "public", "generated", "js-docs");

  await mkdir(outputDir, { recursive: true });

  await rmFilesWithExtensions(outputDir, [".json"]);

  const files = await getFilesWithExtensions(
    inputDir,
    [".ts", ".tsx"],
    (file) => file.endsWith("/List.tsx") || file.endsWith("/Grid.tsx")
  );

  for (const file of files) {
    console.debug("Parsing", file);

    const components = parser.parse(file);
    for (const component of components) {
      // Convert to local paths
      component.filePath = relative(cwd(), file);

      // Filter inherited HTML attributes
      for (const key in component.props) {
        const prop = component.props[key];
        if (
          prop.declarations?.filter(
            (declaration) => !declaration.fileName.includes("node_modules")
          ).length === 0
        ) {
          delete component.props[key];
        }
      }

      const outputFile = join(outputDir, `${component.displayName}.json`);

      console.debug("Writing to", outputFile);

      await writeFile(outputFile, JSON.stringify(component, null, 2));
    }
  }
}

run();
