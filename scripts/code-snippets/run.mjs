import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { cwd } from "node:process";
import { getFilesWithExtensions, rmFilesWithExtensions } from "../utils.mjs";
import { syntaxHighlight } from "./syntax-highlight.mjs";
import { toToJs } from "./ts-to-js.mjs";

async function run() {
  const inputDir = join(cwd(), "src", "routes");
  const outputDir = join(cwd(), "public", "generated", "code-snippets");

  await mkdir(outputDir, { recursive: true });

  await rmFilesWithExtensions(outputDir, [".json"]);

  const tsFiles = await getFilesWithExtensions(inputDir, [".ts", ".tsx"]);
  const exampleFiles = tsFiles.filter((file) => file.includes("example.ts"));

  for (let file of exampleFiles) {
    console.debug("Extracting", file);

    const buffer = await readFile(file);

    let rawText = buffer.toString();

    {
      const pieces = rawText.split("// <begin>");
      rawText = pieces[pieces.length - 1].trim();
    }
    {
      const pieces = rawText.split("// <end>");
      rawText = pieces[0].trim();
    }

    const typeScript = rawText;
    const javaScript = (await toToJs(typeScript)).trim();

    const fileName = basename(file);

    const json = {
      javaScript: await syntaxHighlight(javaScript, "JSX"),
      typeScript:
        typeScript !== javaScript
          ? await syntaxHighlight(
              typeScript,
              file.endsWith("tsx") ? "TSX" : "TS"
            )
          : undefined
    };

    const outputFile = join(
      outputDir,
      fileName.replace(/\.example\.ts(x*)$/, ".json")
    );

    console.debug("Writing to", outputFile);

    await writeFile(outputFile, JSON.stringify(json, null, 2));
  }
}

run();
