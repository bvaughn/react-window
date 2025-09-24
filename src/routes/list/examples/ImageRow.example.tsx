import { Box } from "../../../components/Box";
import type { Cache } from "./useImageSizeCache.example";

// <begin>

import { type RowComponentProps } from "react-window";

type RowProps = {
  cache: Cache;
  images: string[];
};

function RowComponent({
  cache,
  index,
  images,
  style
}: RowComponentProps<RowProps>) {
  const url = images[index];

  const isCached = !!cache.getImageSize(index);

  return (
    <div style={style}>
      {isCached || <LoadingSpinner />}
      <img
        className={isCached ? undefined : "opacity-0"}
        onLoad={(event) => {
          // Update the cache with image dimensions once it's loaded
          cache.setImageSize(index, {
            height: event.currentTarget.naturalHeight,
            width: event.currentTarget.naturalWidth
          });
        }}
        src={url}
      />
    </div>
  );
}

// <end>

function LoadingSpinner() {
  return (
    <Box
      align="center"
      className="h-full color-slate-700"
      direction="column"
      justify="center"
    >
      Loading...
    </Box>
  );
}

export { RowComponent };
export type { RowProps };
