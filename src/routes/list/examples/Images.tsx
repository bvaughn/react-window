import { RowComponent, type Image, type RowProps } from "./ImageRow";

type Size = {
  height: number;
  width: number;
};

// <begin>

import { List, useDynamicRowHeight } from "react-window";

function Example({ images }: { images: Image[] }) {
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

const IMAGES: Image[] = [
  {
    alt: "Watercolor painting of a fox",
    height: 720,
    src: "/images/animal-3546613_1280.jpg",
    width: 1280
  },
  {
    alt: "Ball bearings",
    height: 960,
    src: "/images/ball-bearings-1958083_1280.jpg",
    width: 1280
  },
  {
    alt: "Bourke's Luck Potholes",
    height: 851,
    src: "/images/bourke-luck-potholes-163065_1280.jpg",
    width: 1280
  },
  {
    alt: "Child covering their ears",
    height: 850,
    src: "/images/child-1439468_1280.jpg",
    width: 1280
  },
  {
    alt: "Chameleon on a branch",
    height: 796,
    src: "/images/digiart-3405596_1280.jpg",
    width: 1280
  },
  {
    alt: "Tangled electrical cables",
    height: 1280,
    src: "/images/electrical-cable-mess-2654084_1280.jpg",
    width: 949
  },
  {
    alt: "Elephant",
    height: 964,
    src: "/images/elephant-8608983_1280.jpg",
    width: 1280
  },
  {
    alt: "Person in a hazmat suit carrying toilet paper",
    height: 863,
    src: "/images/fema-4987740_1280.jpg",
    width: 813
  },
  {
    alt: "Fallen tree blocking a road",
    height: 857,
    src: "/images/log-3135150_1280.jpg",
    width: 1280
  },
  {
    alt: "Man falling through the air",
    height: 831,
    src: "/images/man-1838330_1280.jpg",
    width: 827
  },
  {
    alt: "Fantasy landscape with waterfalls",
    height: 723,
    src: "/images/manipulation-2735724_1280.jpg",
    width: 1280
  },
  {
    alt: "Newborn wearing glasses",
    height: 777,
    src: "/images/newborn-6467761_1280.jpg",
    width: 1280
  },
  {
    alt: "Old farm house",
    height: 853,
    src: "/images/old-farm-house-2096642_1280.jpg",
    width: 1280
  },
  {
    alt: "Yoga stretch",
    height: 854,
    src: "/images/people-2557534_1280.jpg",
    width: 1280
  },
  {
    alt: "Man making a silly face",
    height: 1181,
    src: "/images/photo-1516712109157-6a67f5d73fa1.jpg",
    width: 1616
  },
  {
    alt: "Wooden swing seat",
    height: 712,
    src: "/images/photo-1562123408-fbf8cbf92c03.jpg",
    width: 1200
  },
  {
    alt: "Rusted steel sculpture",
    height: 1280,
    src: "/images/sculpture-99484_1280.jpg",
    width: 837
  },
  {
    alt: "Older man lifting a dumbbell",
    height: 854,
    src: "/images/sport-4765008_1280.jpg",
    width: 774
  },
  {
    alt: "Styrofoam heads wearing glasses",
    height: 823,
    src: "/images/styrofoam-19493_1280.jpg",
    width: 1280
  },
  {
    alt: "Trabant",
    height: 713,
    src: "/images/trabi-328402_1280.jpg",
    width: 1280
  },
  {
    alt: "Water trailer in a field",
    height: 570,
    src: "/images/trailers-5073244_1280.jpg",
    width: 1175
  },
  {
    alt: "Paddling a wooden tub",
    height: 960,
    src: "/images/tub-114349_1280.jpg",
    width: 946
  },
  {
    alt: "Venus flytrap",
    height: 960,
    src: "/images/venus-fly-trap-3684935_1280.jpg",
    width: 1280
  },
  {
    alt: "Pier disappearing into fog",
    height: 676,
    src: "/images/web-5013633_1280.jpg",
    width: 1280
  },
  {
    alt: "Frost-covered tree",
    height: 960,
    src: "/images/winter-1675197_1280.jpg",
    width: 901
  },
  {
    alt: "Woman wearing a face mask",
    height: 853,
    src: "/images/woman-1838149_1280.jpg",
    width: 1280
  }
];

function ExampleWithImages() {
  return <Example images={IMAGES} />;
}

export { ExampleWithImages, RowComponent };
export type { Size };
