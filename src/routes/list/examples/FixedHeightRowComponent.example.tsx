import { type RowComponentProps } from "react-window";

function RowComponent({
  index,
  names,
  style
}: RowComponentProps<{
  names: string[];
}>) {
  return (
    <li className="flex items-center justify-between" style={style}>
      {names[index]}
      <div className="text-slate-500 text-xs">{`${index + 1} of ${names.length}`}</div>
    </li>
  );
}

// <end>

export { RowComponent };
