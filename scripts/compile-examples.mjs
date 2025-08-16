import { readFile, mkdir, stat, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { cwd } from "node:process";
import prettier from "prettier";
import tsBlankSpace from "ts-blank-space";
import {
  getFilesWithExtensions,
  rmFilesWithExtensions,
} from "./path-utils.mjs";

async function main() {
  const inputDir = join(cwd(), "src", "routes");
  const outputDir = join(cwd(), "examples");

  await rmFilesWithExtensions(outputDir, [".js", ".jsx", ".ts", ".tsx"]);

  const tsFiles = await getFilesWithExtensions(inputDir, [".ts", ".tsx"]);
  const exampleFiles = tsFiles.filter((file) => file.includes("example.ts"));

  for (let file of exampleFiles) {
    console.debug("Extracting %o", file);

    const buffer = await readFile(file);

    let rawText = buffer.toString();
    const index = rawText.indexOf("// <end>");
    if (index >= 0) {
      rawText = rawText.substring(0, index).trim();
    }

    const typeScript = rawText;
    const javaScript = await stripTypes(typeScript);

    const fileName = basename(file);

    await writeFile(join(outputDir, fileName), typeScript);
    await writeFile(
      join(outputDir, fileName.replace(/\.ts(x*)$/, ".js$1")),
      javaScript,
    );
  }
}

async function stripTypes(source) {
  source = tsBlankSpace(source);
  source = source.replace(/ satisfies [a-zA-Z]+/g, "");

  return await prettier.format(source, {
    parser: "babel",
  });
}

main();
