// <begin>

import { type RowComponentProps } from "react-window";

type Image = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

type RowProps = {
  images: Image[];
};

function RowComponent({ index, images, style }: RowComponentProps<RowProps>) {
  const { alt, height, src, width } = images[index];

  return (
    <div className="p-2" style={style}>
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-lg">
        <div className="absolute inset-0 animate-pulse bg-ink/10" />
        <img
          alt={alt}
          className="relative block h-auto w-full"
          height={height}
          src={src}
          width={width}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-2 text-sm text-white"
        >
          {alt}
        </div>
      </div>
    </div>
  );
}

// <end>

export { RowComponent };
export type { Image, RowProps };
