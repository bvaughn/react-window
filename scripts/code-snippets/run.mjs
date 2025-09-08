import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { cwd } from "node:process";
import { getFilesWithExtensions, rmFilesWithExtensions } from "../utils.mjs";
import { syntaxHighlight } from "./syntax-highlight.mjs";
import { tsToJs } from "./ts-to-js.mjs";

async function run() {
  const inputDir = join(cwd(), "src", "routes");
  const outputDir = join(cwd(), "public", "generated", "code-snippets");

  await mkdir(outputDir, { recursive: true });

  await rmFilesWithExtensions(outputDir, [".json"]);

  const tsFiles = await getFilesWithExtensions(inputDir, [
    ".html",
    ".ts",
    ".tsx"
  ]);
  const exampleFiles = tsFiles.filter((file) => file.includes(".example."));

  for (let file of exampleFiles) {
    console.debug("Extracting", file);

    const buffer = await readFile(file);

    let rawText = buffer.toString();
    let json;

    {
      {
        const pieces = rawText.split("// <begin>");
        rawText = pieces[pieces.length - 1].trim();
      }
      {
        const pieces = rawText.split("// <end>");
        rawText = pieces[0].trim();
      }

      rawText = rawText
        .split("\n")
        .filter(
          (line) =>
            !line.includes("prettier-ignore") &&
            !line.includes("eslint-disable-next-line") &&
            !line.includes("@ts-expect-error")
        )
        .join("\n");
    }

    if (file.endsWith(".html")) {
      json = {
        html: await syntaxHighlight(rawText, "HTML")
      };
    } else {
      const typeScript = rawText;
      const javaScript = (await tsToJs(typeScript)).trim();

      json = {
        javaScript: await syntaxHighlight(javaScript, "JSX"),
        typeScript: await syntaxHighlight(
          typeScript,
          file.endsWith("tsx") ? "TSX" : "TS"
        )
      };
    }

    const fileName = basename(file);

    const outputFile = join(
      outputDir,
      fileName.replace(/\.example\..+$/, ".json")
    );

    console.debug("Writing to", outputFile);

    await writeFile(outputFile, JSON.stringify(json, null, 2));
  }
}

run();
