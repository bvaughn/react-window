import { type RowComponentProps } from "react-window";

function RowComponent({
  ariaAttributes,
  names,
  index,
  style
}: RowComponentProps<{
  names: string[];
}>) {
  return (
    <div style={style} {...ariaAttributes}>
      {names[index]}
    </div>
  );
}

// <end>

export { RowComponent };
