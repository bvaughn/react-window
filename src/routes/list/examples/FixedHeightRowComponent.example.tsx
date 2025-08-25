import { type RowComponentProps } from "react-window";

function RowComponent({
  index,
  names,
  style
}: RowComponentProps<{
  names: string[];
}>) {
  return (
    <div className="flex items-center" style={style}>
      {names[index]}
    </div>
  );
}

// <end>

export { RowComponent };
