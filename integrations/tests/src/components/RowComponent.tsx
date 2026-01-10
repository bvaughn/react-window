import { type RowComponentProps } from "react-window";

export type RowComponentData = {
  data: string[];
};

export function RowComponent({
  index,
  data,
  style
}: RowComponentProps<RowComponentData>) {
  return (
    <div className="flex items-center px-1" style={style}>
      {data[index]}
    </div>
  );
}
