import { Box } from "react-lib-tools";

// <begin>

import { type RowComponentProps } from "react-window";

type RowProps = {
  images: string[];
};

function RowComponent({ index, images, style }: RowComponentProps<RowProps>) {
  const url = images[index];

  return (
    <div style={style}>
      <LoadingSpinner className="absolute z-[-1]" />
      <img className="w-full" src={url} />
    </div>
  );
}

// <end>

function LoadingSpinner({ className }: { className: string }) {
  return (
    <Box
      align="center"
      className={`color-slate-700 ${className}`}
      direction="column"
      justify="center"
    >
      Loading...
    </Box>
  );
}

export { RowComponent };
export type { RowProps };
