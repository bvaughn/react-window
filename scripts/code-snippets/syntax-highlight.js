import {
  jsxLanguage,
  tsxLanguage,
  typescriptLanguage
} from "@codemirror/lang-javascript";
import { htmlLanguage } from "@codemirror/lang-html";
import { ensureSyntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { classHighlighter, highlightTree } from "@lezer/highlight";

export const DEFAULT_MAX_CHARACTERS = 500000;
export const DEFAULT_MAX_TIME = 5000;

export async function syntaxHighlight(code, language) {
  let extension;
  switch (language) {
    case "HTML": {
      extension = htmlLanguage.configure({ dialect: "selfClosing" });
      break;
    }
    case "JSX": {
      extension = jsxLanguage;
      break;
    }
    case "TS": {
      extension = typescriptLanguage;
      break;
    }
    case "TSX": {
      extension = tsxLanguage;
      break;
    }
  }
  if (!extension) {
    console.error("Unsupported language %o", language);
  }

  const tokens = await parser(code, extension);

  return tokens.map(parsedTokensToHtml).join("\n");
}

async function parser(code, languageExtension = jsxLanguage) {
  const parsedTokens = [];
  const currentLineState = {
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
  highlightTree(tree, classHighlighter, (from, to, className) => {
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
  });

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

function processSection(currentLineState, parsedTokens, section, className) {
  var _a;
  const tokenType =
    (_a =
      className === null || className === void 0
        ? void 0
        : className.substring(4)) !== null && _a !== void 0
      ? _a
      : null; // Remove "tok-" prefix;
  let index = 0;
  let nextIndex = section.indexOf("\n");
  while (true) {
    const substring =
      nextIndex >= 0
        ? section.substring(index, nextIndex)
        : section.substring(index);
    const token = {
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

function parsedTokensToHtml(tokens) {
  let indent = 0;

  tokens = tokens.map((token, index) => {
    const className = token.type ? `tok-${token.type}` : "";

    // Trim leading space and use CSS to indent instead;
    // this allows for better line wrapping behavior on narrow screens
    if (index === 0 && !token.type) {
      const index = token.value.search(/[^\s]/);
      if (index < 0) {
        indent = token.value.length;
        token.value = "";
      } else {
        indent = index;
        token.value = token.value.substring(index);
      }
    }

    const escapedValue = escapeHtmlEntities(token.value);
    return `<span class="${className}">${escapedValue}</span>`;
  });

  return `<div style="min-height: 1rem; padding-left: ${indent + 2}ch; text-indent: -2ch;">${tokens.join("")}</div>`;
}

function escapeHtmlEntities(rawString) {
  return rawString.replace(
    /[\u00A0-\u9999<>&]/g,
    (substring) => "&#" + substring.charCodeAt(0) + ";"
  );
}
