import type { PropItem } from "react-docgen-typescript";

export function getPropTypeText(prop: PropItem) {
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

  return textToFormat;
}
