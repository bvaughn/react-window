import { type ReactElement } from "react";
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

export function encode(element: ReactElement<unknown>) {
  const json = encodeChildren([element]);
  const stringified = JSON.stringify(json);

  return encodeURIComponent(stringified);
}

function encodeChildren(children: ReactElement<unknown>[]): EncodedElement[] {
  const elements: EncodedElement[] = [];

  children.forEach((current) => {
    if (!current) {
      return;
    }

    switch (current.type) {
      case List: {
        elements.push(
          encodeList(current as ReactElement<ListProps<RowComponentData>>)
        );
        break;
      }
      case RowComponent: {
        elements.push(
          encodeRowComponent(
            current as ReactElement<RowComponentProps<RowComponentData>>
          )
        );
        break;
      }
      default: {
        if (typeof current === "object") {
          const { children } = current.props as TextProps;
          if (typeof children === "string") {
            elements.push(encodeTextChild(current as ReactElement<TextProps>));
          } else {
            console.warn("Could not encode type:", current);
          }
        }
      }
    }
  });

  return elements;
}

function encodeList(
  element: ReactElement<ListProps<RowComponentData>>
): EncodedListElement {
  return {
    props: element.props,
    type: "List"
  };
}

function encodeRowComponent(
  element: ReactElement<RowComponentProps<RowComponentData>>
): EncodedRowComponentElement {
  return {
    props: element.props,
    type: "RowComponent"
  };
}

function encodeTextChild(element: ReactElement<TextProps>): EncodedTextElement {
  return {
    props: {
      children: element.props.children,
      className: element.props.className
    },
    type: "Text"
  };
}
