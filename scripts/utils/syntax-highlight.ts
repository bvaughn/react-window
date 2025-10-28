import { htmlLanguage } from "@codemirror/lang-html";
import {
  jsxLanguage,
  tsxLanguage,
  typescriptLanguage
} from "@codemirror/lang-javascript";
import { ensureSyntaxTree, LRLanguage } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { classHighlighter, highlightTree } from "@lezer/highlight";
import { type BuiltInParserName } from "prettier";

type TokenType = string;
type Token = {
  columnIndex: number;
  type: TokenType | null;
  value: string;
};

type Language = "HTML" | "JS" | "JSX" | "TS" | "TSX";

type State = {
  parsedTokens: Token[];
  rawString: string;
};

export const DEFAULT_MAX_CHARACTERS = 500000;
export const DEFAULT_MAX_TIME = 5000;

export async function syntaxHighlight(code: string, language: Language) {
  let extension: LRLanguage;
  let prettierParser: BuiltInParserName;
  switch (language) {
    case "HTML": {
      extension = htmlLanguage.configure({ dialect: "selfClosing" });
      prettierParser = "html";
      break;
    }
    case "JS":
    case "JSX": {
      extension = jsxLanguage;
      prettierParser = "babel";
      break;
    }
    case "TS": {
      extension = typescriptLanguage;
      prettierParser = "typescript";
      break;
    }
    case "TSX": {
      extension = tsxLanguage;
      prettierParser = "typescript";
      break;
    }
  }
  if (!extension) {
    console.error("Unsupported language %o", language);
  }

  const tokens = await parser(code, extension, prettierParser);

  return tokens.map(parsedTokensToHtml).join("\n");
}

async function parser(
  code: string,
  languageExtension: LRLanguage,

  // @ts-expect-error TS6133
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prettierParser: BuiltInParserName
) {
  const parsedTokens: Token[][] = [];
  const currentLineState: State = {
    parsedTokens: [],
    rawString: ""
  };

  // The logic below to trim code sections only works with "\n"
  code = code.replace(/\r\n?|\n|\u2028|\u2029/g, "\n");
  if (code.length > DEFAULT_MAX_CHARACTERS) {
    let index = DEFAULT_MAX_CHARACTERS - 1;
    while (index > 0 && code.charAt(index) !== "\n") {
      index--;
    }
    if (index === 0) {
      while (index < code.length && code.charAt(index) !== "\n") {
        index++;
      }
    }
    code = code.slice(0, index + 1);
  }

  // In the future I may want to (re)format code examples for different screen widths
  // code = await format(code, {
  //   parser: prettierParser,
  //   plugins: ["prettier-plugin-tailwindcss"],
  //   printWidth: 100,
  //   proseWrap: "always",
  //   semi: true
  // });

  const state = EditorState.create({
    doc: code,
    extensions: [languageExtension]
  });

  const tree = ensureSyntaxTree(
    state,
    DEFAULT_MAX_CHARACTERS,
    DEFAULT_MAX_TIME
  );

  if (tree === null) {
    return [];
  }

  let characterIndex = 0;
  let parsedCharacterIndex = 0;
  highlightTree(
    tree,
    classHighlighter,
    (from: number, to: number, className: string) => {
      if (from > characterIndex) {
        // No style applied to the token between position and from.
        // This typically indicates white space or newline characters.
        processSection(
          currentLineState,
          parsedTokens,
          code.slice(characterIndex, from),
          ""
        );
      }
      processSection(
        currentLineState,
        parsedTokens,
        code.slice(from, to),
        className
      );
      characterIndex = to;
    }
  );

  const maxPosition = code.length - 1;

  if (characterIndex < maxPosition) {
    // No style applied on the trailing text.
    // This typically indicates white space or newline characters.
    processSection(
      currentLineState,
      parsedTokens,
      code.slice(characterIndex, maxPosition),
      ""
    );
  }
  if (currentLineState.parsedTokens.length) {
    parsedTokens.push(currentLineState.parsedTokens);
  }

  parsedCharacterIndex += characterIndex + 1;

  // Anything that's left should de-opt to plain text.
  if (parsedCharacterIndex < code.length) {
    let nextIndex = code.indexOf("\n", parsedCharacterIndex);
    let parsedLineTokens = [];
    while (true) {
      const line =
        nextIndex >= 0
          ? code.substring(parsedCharacterIndex, nextIndex)
          : code.substring(parsedCharacterIndex);
      parsedLineTokens.push({
        columnIndex: 0,
        type: null,
        value: line
      });
      if (nextIndex >= 0) {
        parsedTokens.push(parsedLineTokens);
        parsedLineTokens = [];
      } else if (nextIndex === -1) {
        break;
      }
      parsedCharacterIndex = nextIndex + 1;
      nextIndex = code.indexOf("\n", parsedCharacterIndex);
    }
    if (parsedLineTokens.length) {
      parsedTokens.push(parsedLineTokens);
    }
  }

  return parsedTokens;
}

function processSection(
  currentLineState: State,
  parsedTokens: Token[][],
  section: string,
  className: string
) {
  // Remove "tok-" prefix;
  const tokenType =
    className === null || className === void 0
      ? null
      : className.substring(4) || null;

  let index = 0;
  let nextIndex = section.indexOf("\n");
  while (true) {
    const substring =
      nextIndex >= 0
        ? section.substring(index, nextIndex)
        : section.substring(index);
    const token: Token = {
      columnIndex: currentLineState.rawString.length,
      type: tokenType,
      value: substring
    };
    currentLineState.parsedTokens.push(token);
    currentLineState.rawString += substring;
    if (nextIndex === -1) {
      break;
    }
    if (nextIndex >= 0) {
      parsedTokens.push(currentLineState.parsedTokens);
      currentLineState.parsedTokens = [];
      currentLineState.rawString = "";
    }
    index = nextIndex + 1;
    nextIndex = section.indexOf("\n", index);
  }
}

function parsedTokensToHtml(tokens: Token[]) {
  const htmlStrings = tokens.map((token) => {
    const className = token.type ? `tok-${token.type}` : "";
    const escapedValue = escapeHtmlEntities(token.value);

    return `<span class="${className}">${escapedValue}</span>`;
  });

  // Edge case to avoid empty line
  let htmlString = htmlStrings.join("");
  if (tokens.length <= 1) {
    if (!tokens[0].value) {
      htmlString = "&nbsp;";
    }
  }

  return `<div style="min-height: 1rem;">${htmlString}</div>`;
}

function escapeHtmlEntities(rawString: string) {
  return rawString.replace(
    /[\u00A0-\u9999<>&]/g,
    (substring) => "&#" + substring.charCodeAt(0) + ";"
  );
}
