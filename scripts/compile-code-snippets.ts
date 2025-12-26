import { readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { initialize } from "./utils/initialize.ts";
import { syntaxHighlight } from "./utils/syntax-highlight.ts";
import { trimExcludedText } from "./utils/code-snippets/trimExcludedText.ts";

async function run() {
  const { files, outputDir } = await initialize({
    fileExtensions: [".html", ".ts", ".tsx"],
    inputPath: ["src", "routes"],
    outputDirName: "code-snippets"
  });

  const exampleFiles = files.filter((file) => file.includes(".example."));

  for (const file of exampleFiles) {
    const buffer = await readFile(file);

    let rawText = buffer.toString();

    {
      // Remove special comments and directives before syntax highlighting
      rawText = trimExcludedText(rawText);

      rawText = rawText
        .split("\n")
        .filter(
          (line) =>
            !line.includes("prettier-ignore") &&
            !line.includes("eslint-disable-next-line") &&
            !line.includes("@ts-expect-error") &&
            !line.includes("// hidden")
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
