import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { withCustomConfig } from "react-docgen-typescript";
import { initialize } from "../initialize.ts";
import { compileComponent } from "./compileComponent.ts";
import { insertPropsMarkdown } from "./insertPropsMarkdown.ts";

export async function compileComponents({
  componentNames,
  outputDirName
}: {
  componentNames: string[];
  outputDirName: string;
}) {
  const parser = withCustomConfig("./tsconfig.json", {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true,
    shouldRemoveUndefinedFromOptional: true
  });

  const { files, outputDir } = await initialize({
    fileExtensions: [".ts", ".tsx"],
    fileFilter: (file) =>
      componentNames.some((componentName) => file.endsWith(componentName)),
    inputPath: ["lib", "components"],
    outputDirName
  });

  const markdownPath = join(cwd(), "README.md");

  let markdown = await readFile(markdownPath, { encoding: "utf-8" });

  await Promise.all(
    files.map((filePath) =>
      compileComponent({
        filePath,
        outputDir,
        parser
      }).then(
        ({
          componentName,
          description,
          optionalPropsTable,
          requiredPropsTable
        }) => {
          markdown = insertPropsMarkdown({
            componentMarkdown: description,
            componentName,
            markdown,
            section: "description"
          });

          markdown = insertPropsMarkdown({
            componentMarkdown: requiredPropsTable,
            componentName,
            markdown,
            section: "required-props"
          });

          markdown = insertPropsMarkdown({
            componentMarkdown: optionalPropsTable,
            componentName,
            markdown,
            section: "optional-props"
          });
        }
      )
    )
  );

  await writeFile(markdownPath, markdown);
}
