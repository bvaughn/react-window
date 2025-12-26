import type { Intent, Section } from "../../../src/types.ts";
import { formatDescriptionText } from "./formatDescriptionText.ts";
import { syntaxHighlight, type Language } from "../syntax-highlight.ts";

export async function parseDescription(rawText: string) {
  const sections: Section[] = [];

  // Paper over differences between "@ts-ast-parser/core" and "react-docgen-typescript"
  let text = rawText;
  Object.keys(INTENT_FLAGS).forEach((flag) => {
    text = text
      .split(`\n${flag}`)
      .join(`\n\n${flag}`)
      .replaceAll("\n\n\n", "\n\n");
  });

  for (const chunk of text.split("\n\n")) {
    let content = "";
    let intent: Intent | undefined = undefined;

    if (chunk.startsWith("```")) {
      const match = chunk.match(/^```([a-z]+)/)!;
      const language = match[1].toUpperCase() as Language;

      content = await syntaxHighlight(
        chunk.substring(language.length + 3, chunk.length - 3).trim(),
        language
      );
    } else {
      content = formatDescriptionText(chunk.trim());

      for (const char in INTENT_FLAGS) {
        if (content.startsWith(`<p>${char} `)) {
          intent = INTENT_FLAGS[char as keyof typeof INTENT_FLAGS] as Intent;
          content = content.replace(`<p>${char} `, "<p>");
        }
      }
    }

    // Strip TSDoc comments
    content = content.replace(/\n@param.+/, "");
    content = content.replace(/\n@return.+/, "");

    sections.push({
      content,
      intent
    });
  }

  return sections;
}

const INTENT_FLAGS = {
  "❌": "danger",
  "NOTE:": "none",
  ℹ️: "primary",
  "✅": "success",
  "⚠️": "warning"
};
