import { writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import { type FileParser, type PropItem } from "react-docgen-typescript";
import { assert } from "../../../lib/utils/assert.ts";
import type { ComponentMetadata } from "../../../src/types.ts";
import { getPropTypeText } from "./getPropTypeText.ts";
import { parseDescription } from "./parseDescription.ts";
import { syntaxHighlight } from "../syntax-highlight.ts";
import { propsToTable } from "./propsToTable.ts";

const TOKEN_TO_REPLACE = "TOKEN_TO_REPLACE";

export async function compileComponent({
  filePath,
  outputDir,
  parser
}: {
  filePath: string;
  outputDir: string;
  parser: FileParser;
}) {
  const parsed = parser.parse(filePath);
  assert(
    parsed.length === 1,
    `Expected 1 parsed component but found ${parsed.length}`
  );

  const component = parsed[0];

  // Convert to local paths
  component.filePath = relative(cwd(), filePath);

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
      description: await parseDescription(component.description),
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

        componentMetadata.props[name] = {
          description: await parseDescription(prop.description),
          html,
          name,
          required: prop.required
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

  return {
    componentName: component.displayName,
    optionalPropsTable: await propsToTable(optionalProps),
    requiredPropsTable: await propsToTable(requiredProps)
  };
}
