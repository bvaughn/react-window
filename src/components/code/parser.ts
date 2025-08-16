import { jsxLanguage } from "@codemirror/lang-javascript";
import { ensureSyntaxTree } from "@codemirror/language";
import { EditorState, type Extension } from "@codemirror/state";
import { classHighlighter, highlightTree } from "@lezer/highlight";

export type ParsedToken = {
  columnIndex: number;
  type: string | null;
  value: string;
};

export type ParsedTokens = ParsedToken[];

export type ParserData = {
  parsedTokensByLine: ParsedTokens[];
  parsedTokensPercentage: number;
  rawTextByLine: string[];
  rawTextPercentage: number;
};

export const DEFAULT_MAX_CHARACTERS = 500_000;
export const DEFAULT_MAX_TIME = 5_000;

export async function parser(
  code: string,
  languageExtension: Extension = jsxLanguage,
) {
  const parsedTokens: ParsedTokens[] = [];

  const currentLineState = {
    parsedTokens: [] as ParsedTokens,
    rawString: "",
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

  const state = EditorState.create({
    doc: code,
    extensions: [languageExtension],
  });

  const tree = ensureSyntaxTree(
    state!,
    DEFAULT_MAX_CHARACTERS,
    DEFAULT_MAX_TIME,
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
          "",
        );
      }

      processSection(
        currentLineState,
        parsedTokens,
        code.slice(from, to),
        className,
      );

      characterIndex = to;
    },
  );

  const maxPosition = code.length - 1;
  if (characterIndex < maxPosition) {
    // No style applied on the trailing text.
    // This typically indicates white space or newline characters.
    processSection(
      currentLineState,
      parsedTokens,
      code.slice(characterIndex, maxPosition),
      "",
    );
  }

  if (currentLineState.parsedTokens.length) {
    parsedTokens.push(currentLineState.parsedTokens);
  }

  parsedCharacterIndex += characterIndex + 1;

  // Anything that's left should de-opt to plain text.
  if (parsedCharacterIndex < code.length) {
    let nextIndex = code.indexOf("\n", parsedCharacterIndex);

    let parsedLineTokens: ParsedToken[] = [];

    while (true) {
      const line =
        nextIndex >= 0
          ? code.substring(parsedCharacterIndex, nextIndex)
          : code.substring(parsedCharacterIndex);

      parsedLineTokens.push({
        columnIndex: 0,
        type: null,
        value: line,
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
  currentLineState: {
    parsedTokens: ParsedTokens;
    rawString: string;
  },
  parsedTokens: ParsedTokens[],
  section: string,
  className: string,
) {
  const tokenType = className?.substring(4) ?? null; // Remove "tok-" prefix;

  let index = 0;
  let nextIndex = section.indexOf("\n");

  while (true) {
    const substring =
      nextIndex >= 0
        ? section.substring(index, nextIndex)
        : section.substring(index);

    const token: ParsedToken = {
      columnIndex: currentLineState.rawString.length,
      type: tokenType,
      value: substring,
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

export function parsedTokensToHtml(tokens: ParsedToken[]): string {
  return tokens
    .map((token) => {
      const className = token.type ? `tok-${token.type}` : "";
      const escapedValue = escapeHtmlEntities(token.value);
      return `<span class="${className}">${escapedValue}</span>`;
    })
    .join("");
}

export function escapeHtmlEntities(rawString: string): string {
  return rawString.replace(
    /[\u00A0-\u9999<>&]/g,
    (substring) => "&#" + substring.charCodeAt(0) + ";",
  );
}
