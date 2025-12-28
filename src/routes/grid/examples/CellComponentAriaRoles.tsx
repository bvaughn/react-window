import { type CellComponentProps } from "react-window";

function CellComponent({
  ariaAttributes,
  // @ts-expect-error Unused variable
  // eslint-disable-next-line
  columnIndex,
  // @ts-expect-error Unused variable
  // eslint-disable-next-line
  rowIndex,
  style
}: CellComponentProps<object>) {
  return (
    <div style={style} {...ariaAttributes}>
      {/* Data */}
    </div>
  );
}

// <end>

export { CellComponent };
