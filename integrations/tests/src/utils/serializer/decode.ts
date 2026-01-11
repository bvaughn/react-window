import { createElement, type ReactElement } from "react";
import { List, type ListProps, type RowComponentProps } from "react-window";
import {
  RowComponent,
  type RowComponentData
} from "../../../src/components/RowComponent";
import type {
  EncodedElement,
  EncodedListElement,
  EncodedRowComponentElement,
  EncodedTextElement,
  TextProps
} from "./types";

let key = 0;

export function decode(stringified: string) {
  const json = JSON.parse(stringified) as EncodedElement[];

  return decodeChildren(json);
}

function decodeChildren(children: EncodedElement[]): ReactElement<unknown>[] {
  const elements: ReactElement<unknown>[] = [];

  children.forEach((current) => {
    if (!current) {
      return;
    }

    switch (current.type) {
      case "List": {
        elements.push(decodeList(current));
        break;
      }
      case "RowComponent": {
        elements.push(decodeRowComponent(current));
        break;
      }
      case "Text": {
        elements.push(decodeText(current));
        break;
      }
      default: {
        console.warn("Could not decode type:", current);
      }
    }
  });

  return elements;
}

function decodeList(
  json: EncodedListElement
): ReactElement<ListProps<RowComponentData>> {
  return createElement(List<RowComponentData>, {
    key: ++key,
    ...json.props
  });
}

function decodeRowComponent(
  json: EncodedRowComponentElement
): ReactElement<RowComponentProps<RowComponentData>> {
  return createElement(RowComponent, {
    key: ++key,
    ...json.props
  });
}

function decodeText(json: EncodedTextElement): ReactElement<TextProps> {
  return createElement("div", {
    key: ++key,
    ...json.props
  });
}
