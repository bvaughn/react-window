import { writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import { withCustomConfig } from "react-docgen-typescript";
import type { ComponentMetadata } from "../src/types.ts";
import { formatDescriptionText } from "./utils/formatDescriptionText.ts";
import { initialize } from "./utils/initialize.ts";
import { syntaxHighlight } from "./utils/syntax-highlight.ts";

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
      file.endsWith("/List.tsx") || file.endsWith("/Grid.tsx"),
    inputPath: ["lib", "components"],
    outputDirName: "js-docs"
  });

  for (const file of files) {
    console.debug("Parsing", file);

    const parsed = parser.parse(file);

    for (const component of parsed) {
      // Convert to local paths
      component.filePath = relative(cwd(), file);

      const componentMetadata: ComponentMetadata = {
        filePath: component.filePath,
        name: component.displayName,
        props: {}
      };

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

      // Syntax highlight prop types
      for (const name in component.props) {
        const prop = component.props[name];

        let textToFormat = prop.type.raw;
        if (!textToFormat && prop.type.name.includes(":")) {
          // Edge case where some prop types aren't registered as containing raw TS
          textToFormat = prop.type.name;
        }

        if (!textToFormat) {
          textToFormat = `${prop.type.name}`;

          const match = textToFormat.match(/ExcludeForbiddenKeys<([^>]+)>/);
          if (match) {
            textToFormat = match[1];
          }
        }

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
          let info = "";
          let warning = "";

          if (prop.description.includes("⚠️")) {
            const pieces = prop.description.split("⚠️");
            description = pieces[0];
            warning = pieces[1] ?? "";
          } else if (prop.description.includes("ℹ️")) {
            const pieces = prop.description.split("ℹ️");
            description = pieces[0];
            info = pieces[1] ?? "";
          } else {
            description = prop.description;
          }

          componentMetadata.props[name] = {
            description: formatDescriptionText(description.trim()),
            html,
            info: info ? formatDescriptionText(info.trim()) : undefined,
            name,
            required: prop.required,
            warning: warning ? formatDescriptionText(warning.trim()) : undefined
          };
        } catch (error) {
          console.error(error);
        }
      }

      const outputFile = join(outputDir, `${component.displayName}.json`);

      console.debug("Writing to", outputFile);

      await writeFile(outputFile, JSON.stringify(componentMetadata, null, 2));
    }
  }
}

run();
