import { RowComponent, type RowProps } from "./ImageRow.example";

type Size = {
  height: number;
  width: number;
};

// <begin>

import { List, useDynamicRowHeight } from "react-window";

function Example({ images }: { images: string[] }) {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 250
  });

  return (
    <List<RowProps>
      rowComponent={RowComponent}
      rowCount={images.length}
      rowHeight={rowHeight}
      rowProps={{ images }}
    />
  );
}

// <end>

const IMAGES: string[] = [
  "/images/animal-3546613_1280.jpg",
  "/images/ball-bearings-1958083_1280.jpg",
  "/images/bourke-luck-potholes-163065_1280.jpg",
  "/images/child-1439468_1280.jpg",
  "/images/digiart-3405596_1280.jpg",
  "/images/electrical-cable-mess-2654084_1280.jpg",
  "/images/elephant-8608983_1280.jpg",
  "/images/fema-4987740_1280.jpg",
  "/images/log-3135150_1280.jpg",
  "/images/man-1838330_1280.jpg",
  "/images/manipulation-2735724_1280.jpg",
  "/images/newborn-6467761_1280.jpg",
  "/images/old-farm-house-2096642_1280.jpg",
  "/images/people-2557534_1280.jpg",
  "/images/photo-1516712109157-6a67f5d73fa1.jpg",
  "/images/photo-1562123408-fbf8cbf92c03.jpg",
  "/images/sculpture-99484_1280.jpg",
  "/images/sport-4765008_1280.jpg",
  "/images/styrofoam-19493_1280.jpg",
  "/images/trabi-328402_1280.jpg",
  "/images/trailers-5073244_1280.jpg",
  "/images/tub-114349_1280.jpg",
  "/images/venus-fly-trap-3684935_1280.jpg",
  "/images/web-5013633_1280.jpg",
  "/images/winter-1675197_1280.jpg",
  "/images/woman-1838149_1280.jpg"
];

function ExampleWithImages() {
  return <Example images={IMAGES} />;
}

export { ExampleWithImages, RowComponent };
export type { Size };
