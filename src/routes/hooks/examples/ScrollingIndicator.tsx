// <begin>

import {
  List,
  useIsScrolling,
  useListCallbackRef,
  type RowComponentProps
} from "react-window";

function Example({ names }: { names: string[] }) {
  const [list, setList] = useListCallbackRef(null);
  const isScrolling = useIsScrolling(list?.element);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="text-xs text-slate-400">
        {isScrolling ? "Scrolling…" : "Not scrolling"}
      </div>
      <List
        listRef={setList}
        rowComponent={RowComponent}
        rowCount={names.length}
        rowHeight={25}
        rowProps={{ isScrolling, names }}
      />
    </div>
  );
}

function RowComponent({
  index,
  isScrolling,
  names,
  style
}: RowComponentProps<{ isScrolling: boolean; names: string[] }>) {
  return (
    <div className="flex items-center" style={style}>
      {isScrolling ? (
        <div className="h-3 w-24 rounded bg-white/10" />
      ) : (
        names[index]
      )}
    </div>
  );
}

// <end>

export { Example };
