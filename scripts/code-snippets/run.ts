import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { cwd } from "node:process";
import { getFilesWithExtensions, rmFilesWithExtensions } from "../utils.ts";
import { syntaxHighlight } from "./syntax-highlight.ts";

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

  for (const file of exampleFiles) {
    console.debug("Extracting", file);

    const buffer = await readFile(file);

    let rawText = buffer.toString();

    {
      // Remove special comments and directives before syntax highlighting
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

    let html;
    if (file.endsWith(".html")) {
      html = await syntaxHighlight(rawText, "HTML");
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      html = await syntaxHighlight(
        rawText,
        file.endsWith("jsx") ? "JSX" : "JS"
      );
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      html = await syntaxHighlight(
        rawText,
        file.endsWith("tsx") ? "TSX" : "TS"
      );
    } else {
      throw Error(`Unsupported file type: ${file}`);
    }

    const fileName = basename(file);

    const outputFile = join(
      outputDir,
      fileName.replace(/\.example\..+$/, ".json")
    );

    console.debug("Writing to", outputFile);

    await writeFile(outputFile, JSON.stringify({ html }, null, 2));
  }
}

run();
