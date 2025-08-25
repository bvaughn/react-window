import { List, type ListImperativeAPI, type ListProps } from "react-window";

type Props = ListProps<object>;

function useCustomHook(ref: ListImperativeAPI | null) {
  return ref;
}

// <begin>

import { useListCallbackRef } from "react-window";

function Example(props: Props) {
  const [list, setList] = useListCallbackRef(null);

  useCustomHook(list);

  return <List listRef={setList} {...props} />;
}

// <end>

export { Example };
