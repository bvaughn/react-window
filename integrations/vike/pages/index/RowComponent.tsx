import { type RowComponentProps } from "react-window";

export function RowComponent({ index, style }: RowComponentProps<object>) {
  return (
    <div className="flex items-center gap-1" style={style}>
      Row {index}
    </div>
  );
}
