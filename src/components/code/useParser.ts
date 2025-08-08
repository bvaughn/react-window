import { jsxLanguage, typescriptLanguage } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";
import { useEffect, useState } from "react";
import { escapeHtmlEntities, parsedTokensToHtml, parser } from "./parser";
import type { Language } from "./types";

// TODO Generate parsed tokens during build time
export function useParser({
  code: codeRaw,
  language,
}: {
  code: string;
  language: Language;
}) {
  const code = codeRaw.trim();

  const [html, setHTML] = useState<string>(
    code.split("\n").map(escapeHtmlEntities).join("<br/>"),
  );

  useEffect(() => {
    (async () => {
      let extension: Extension;
      switch (language) {
        case "JSX": {
          extension = jsxLanguage;
          break;
        }
        case "TypeScript": {
          extension = typescriptLanguage;
          break;
        }
      }

      const tokens = await parser(code, extension);
      setHTML(tokens.map(parsedTokensToHtml).join("<br/>"));
    })();
  }, [code, language]);

  return html;
}
