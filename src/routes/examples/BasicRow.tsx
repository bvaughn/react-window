import { type RowComponentProps } from "react-window";

/**
 * Example row.
 *
 * @param index Specifies which row you're rendering
 * @param style CSS properties like "position" and "top"
 */
function Row({ index, style }: RowComponentProps) {
  return <div style={style}>Row {index}</div>;
}

// <end>

export { Row };
