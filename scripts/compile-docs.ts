import { readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import { withCustomConfig, type PropItem } from "react-docgen-typescript";
import type { ComponentMetadata } from "../src/types.ts";
import { formatDescriptionText } from "./utils/formatDescriptionText.ts";
import { getPropTypeText } from "./utils/getPropTypeText.ts";
import { initialize } from "./utils/initialize.ts";
import { propsToTable } from "./utils/propsToTable.ts";
import { syntaxHighlight } from "./utils/syntax-highlight.ts";
import { insertPropsMarkdown } from "./utils/insertPropsMarkdown.ts";

const parser = withCustomConfig("./tsconfig.json", {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true
});

const TOKEN_TO_REPLACE = "TOKEN_TO_REPLACE";

async function run() {
  const { files, outputDir } = await initialize({
    fileExtensions: [".ts", ".tsx"],
    fileFilter: (file) =>
      file.endsWith("/Grid.tsx") || file.endsWith("/List.tsx"),
    inputPath: ["lib", "components"],
    outputDirName: "js-docs"
  });

  const markdownPath = join(cwd(), "README.md");

  let markdown = await readFile(markdownPath, { encoding: "utf-8" });

  for (const file of files) {
    console.debug("Parsing", file);

    const parsed = parser.parse(file);

    for (const component of parsed) {
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

      // Generate syntax highlighted HTML for prop types
      {
        const componentMetadata: ComponentMetadata = {
          filePath: component.filePath,
          name: component.displayName,
          props: {}
        };

        for (const name in component.props) {
          const prop = component.props[name];

          let textToFormat = getPropTypeText(prop);

          if (prop.defaultValue?.value) {
            textToFormat = `${textToFormat} = ${prop.defaultValue.value}`;
          }

          // Format with a placeholder token so we can replace it with a formatted string
          textToFormat = `${TOKEN_TO_REPLACE}${prop.required ? "" : "?"}: ${textToFormat}`;

          try {
            let html = await syntaxHighlight(textToFormat, "TS");
            html = html.replace(
              TOKEN_TO_REPLACE,
              `<span class="tok-propertyName">${name}</span>`
            );

            let description = "";
            const infos: string[] = [];
            const warnings: string[] = [];

            if (prop.description.includes("⚠️")) {
              const pieces = prop.description.split("⚠️");
              description = pieces[0];
              for (let index = 1; index < pieces.length; index++) {
                warnings.push(pieces[index]);
              }
            } else if (prop.description.includes("ℹ️")) {
              const pieces = prop.description.split("ℹ️");
              description = pieces[0];
              for (let index = 1; index < pieces.length; index++) {
                infos.push(pieces[index]);
              }
            } else {
              description = prop.description;
            }

            componentMetadata.props[name] = {
              description: formatDescriptionText(description.trim()),
              html,
              infos: infos.map((info) => formatDescriptionText(info.trim())),
              name,
              required: prop.required,
              warnings: warnings.map((warning) =>
                formatDescriptionText(warning.trim())
              )
            };
          } catch (error) {
            console.error(error);
          }
        }

        const outputFile = join(outputDir, `${component.displayName}.json`);

        console.debug("Writing to", outputFile);

        await writeFile(outputFile, JSON.stringify(componentMetadata, null, 2));
      }

      // Generate markdown for prop types
      {
        const requiredProps: PropItem[] = [];
        const optionalProps: PropItem[] = [];

        for (const propName in component.props) {
          const prop = component.props[propName];
          if (prop.required) {
            requiredProps.push(prop);
          } else {
            optionalProps.push(prop);
          }
        }

        markdown = insertPropsMarkdown({
          componentMarkdown: await propsToTable(requiredProps),
          componentName: component.displayName,
          markdown,
          required: true
        });

        markdown = insertPropsMarkdown({
          componentMarkdown: await propsToTable(optionalProps),
          componentName: component.displayName,
          markdown,
          required: false
        });
      }
    }
  }

  await writeFile(markdownPath, markdown);
}

run();
