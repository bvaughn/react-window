import { Grid, useGridRef, type GridProps } from "react-window";

type Props = GridProps<object>;

// <begin>

function Example(props: Props) {
  const gridRef = useGridRef(null);

  return <Grid gridRef={gridRef} {...props} />;
}

// <end>

export { Example };
