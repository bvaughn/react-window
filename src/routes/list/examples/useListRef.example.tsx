import { List, useListRef, type ListProps } from "react-window";

type Props = ListProps<object>;

// <begin>

function Example(props: Props) {
  const listRef = useListRef(null);

  return <List listRef={listRef} {...props} />;
}

// <end>

export { Example };
