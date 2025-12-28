import { Grid, type GridImperativeAPI, type GridProps } from "react-window";

type Props = GridProps<object>;

function useCustomHook(ref: GridImperativeAPI | null) {
  return ref;
}

// <begin>

import { useGridCallbackRef } from "react-window";

function Example(props: Props) {
  const [grid, setGrid] = useGridCallbackRef(null);

  useCustomHook(grid);

  return <Grid gridRef={setGrid} {...props} />;
}

// <end>

export { Example };
