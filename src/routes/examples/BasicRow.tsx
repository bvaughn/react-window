import { type RowComponentProps } from "react-window";

/**
 * Example row.
 *
 * @param index Specifies which row you're rendering
 * @param style CSS properties like "position" and "top"
 */
function Row({ ariaAttributes, index, style }: RowComponentProps) {
  return (
    <div {...ariaAttributes} style={style}>
      Row {index}
    </div>
  );
}

// <end>

export { Row };
