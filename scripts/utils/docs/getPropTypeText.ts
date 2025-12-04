import type { PropItem } from "react-docgen-typescript";

export function getPropTypeText(prop: PropItem) {
  let textToFormat = prop.type.raw;
  if (!textToFormat && prop.type.name.includes(":")) {
    // Edge case where some prop types aren't registered as containing raw TS
    textToFormat = prop.type.name;

    // List/Grid and rowComponent/cellComponent are annotated with a return type of ReactElement instead of ReactNode
    // As a result of this change the generated docs are significantly less readable, so tidy them up here
    // See github.com/bvaughn/react-resizable-panels/issues/875
    textToFormat = textToFormat.replace(
      "ReactElement<unknown, string | JSXElementConstructor<...>>",
      "ReactNode"
    );
  }

  if (!textToFormat) {
    textToFormat = `${prop.type.name}`;

    const match = textToFormat.match(/ExcludeForbiddenKeys<([^>]+)>/);
    if (match) {
      textToFormat = match[1];
    }
  }

  return textToFormat;
}
