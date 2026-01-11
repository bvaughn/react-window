import type { ListProps, RowComponentProps } from "react-window";
import type { RowComponentData } from "../../components/RowComponent";

export interface EncodedListElement {
  props: ListProps<RowComponentData>;
  type: "List";
}

export interface EncodedRowComponentElement {
  props: RowComponentProps<RowComponentData>;
  type: "RowComponent";
}

export type TextProps = {
  children: string;
  className?: string | undefined;
};

export interface EncodedTextElement {
  props: TextProps;
  type: "Text";
}

export type EncodedElement =
  | EncodedListElement
  | EncodedRowComponentElement
  | EncodedTextElement;
