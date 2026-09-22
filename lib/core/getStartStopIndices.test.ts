import { describe, expect, test } from "vitest";
import { createCachedBounds } from "./createCachedBounds";
import { getStartStopIndices } from "./getStartStopIndices";

describe("getStartStopIndices", () => {
  function getIndices({
    containerScrollOffset,
    containerSize,
    itemCount,
    itemSize,
    overscanCount = 0
  }: {
    containerScrollOffset: number;
    containerSize: number;
    itemCount: number;
    itemSize: number;
    overscanCount?: number;
  }) {
    const cachedBounds = createCachedBounds({
      itemCount: itemCount,
      itemProps: {},
      itemSize
    });

    return getStartStopIndices({
      cachedBounds,
      containerScrollOffset,
      containerSize,
      itemCount,
      overscanCount
    });
  }

  test("empty list", () => {
    expect(
      getIndices({
        containerScrollOffset: 0,
        containerSize: 100,
        itemCount: 0,
        itemSize: 25
      })
    ).toEqual({
      startIndexVisible: 0,
      startIndexOverscan: 0,
      stopIndexVisible: -1,
      stopIndexOverscan: -1
    });
  });

  test("edge case: not enough rows to fill available height", () => {
    expect(
      getIndices({
        containerScrollOffset: 0,
        containerSize: 100,
        itemCount: 2,
        itemSize: 25
      })
    ).toEqual({
      startIndexVisible: 0,
      startIndexOverscan: 0,
      stopIndexVisible: 1,
      stopIndexOverscan: 1
    });
  });

  test("initial set of rows", () => {
    expect(
      getIndices({
        containerScrollOffset: 0,
        containerSize: 100,
        itemCount: 10,
        itemSize: 25
      })
    ).toEqual({
      startIndexVisible: 0,
      startIndexOverscan: 0,
      stopIndexVisible: 3,
      stopIndexOverscan: 3
    });
  });

  test("middle set of list", () => {
    expect(
      getIndices({
        containerScrollOffset: 100,
        containerSize: 100,
        itemCount: 10,
        itemSize: 25
      })
    ).toEqual({
      startIndexVisible: 4,
      startIndexOverscan: 4,
      stopIndexVisible: 7,
      stopIndexOverscan: 7
    });
  });

  test("final set of rows", () => {
    expect(
      getIndices({
        containerScrollOffset: 150,
        containerSize: 100,
        itemCount: 10,
        itemSize: 25
      })
    ).toEqual({
      startIndexVisible: 6,
      startIndexOverscan: 6,
      stopIndexVisible: 9,
      stopIndexOverscan: 9
    });
  });

  test("should not under-scroll", () => {
    expect(
      getIndices({
        containerScrollOffset: -50,
        containerSize: 100,
        itemCount: 10,
        itemSize: 25
      })
    ).toEqual({
      startIndexVisible: 0,
      startIndexOverscan: 0,
      stopIndexVisible: 1,
      stopIndexOverscan: 1
    });
  });

  test("should not over-scroll", () => {
    expect(
      getIndices({
        containerScrollOffset: 200,
        containerSize: 100,
        itemCount: 10,
        itemSize: 25
      })
    ).toEqual({
      startIndexVisible: 8,
      startIndexOverscan: 8,
      stopIndexVisible: 9,
      stopIndexOverscan: 9
    });
  });

  describe("with overscan", () => {
    test("edge case: not enough rows to fill available height", () => {
      expect(
        getIndices({
          containerScrollOffset: 0,
          containerSize: 100,
          itemCount: 2,
          itemSize: 25,
          overscanCount: 2
        })
      ).toEqual({
        startIndexVisible: 0,
        startIndexOverscan: 0,
        stopIndexVisible: 1,
        stopIndexOverscan: 1
      });
    });

    test("edge case: no rows before", () => {
      expect(
        getIndices({
          containerScrollOffset: 0,
          containerSize: 100,
          itemCount: 100,
          itemSize: 25,
          overscanCount: 2
        })
      ).toEqual({
        startIndexVisible: 0,
        startIndexOverscan: 0,
        stopIndexVisible: 3,
        stopIndexOverscan: 5
      });
    });

    test("edge case: no rows after", () => {
      expect(
        getIndices({
          containerScrollOffset: 2400,
          containerSize: 100,
          itemCount: 100,
          itemSize: 25,
          overscanCount: 2
        })
      ).toEqual({
        startIndexVisible: 96,
        startIndexOverscan: 94,
        stopIndexVisible: 99,
        stopIndexOverscan: 99
      });
    });

    test("rows before and after", () => {
      expect(
        getIndices({
          containerScrollOffset: 100,
          containerSize: 100,
          itemCount: 100,
          itemSize: 25,
          overscanCount: 2
        })
      ).toEqual({
        startIndexVisible: 4,
        startIndexOverscan: 2,
        stopIndexVisible: 7,
        stopIndexOverscan: 9
      });
    });
  });
});

test("quantify warm-cache work near the end of a large fixed-size list", () => {
  const cachedBounds = createCachedBounds({
    itemCount: 100000,
    itemProps: {},
    itemSize: 20
  });
  cachedBounds.get(99999);
  let reads = 0;
  const counted = {
    ...cachedBounds,
    get: (index: number) => {
      reads++;
      return cachedBounds.get(index);
    }
  };
  const result = getStartStopIndices({
    cachedBounds: counted,
    containerScrollOffset: 1900000,
    containerSize: 500,
    itemCount: 100000,
    overscanCount: 3
  });
  expect(result.startIndexVisible).toBe(95000);
  expect(reads).toBe(0);
});

test("searches a populated variable-size cache without rescanning earlier rows", () => {
  const cachedBounds = createCachedBounds({
    itemCount: 100000,
    itemProps: {},
    itemSize: () => 20
  });
  cachedBounds.get(99999);
  let reads = 0;
  const counted = {
    ...cachedBounds,
    get: (index: number) => {
      reads++;
      return cachedBounds.get(index);
    }
  };
  const result = getStartStopIndices({
    cachedBounds: counted,
    containerScrollOffset: 1900000,
    containerSize: 500,
    itemCount: 100000,
    overscanCount: 3
  });
  expect(result).toEqual({
    startIndexVisible: 95000,
    stopIndexVisible: 95024,
    startIndexOverscan: 94997,
    stopIndexOverscan: 95027
  });
  expect(reads).toBeLessThan(50);
});

test("initial variable-size lookup only measures the viewport", () => {
  let measurements = 0;
  const cachedBounds = createCachedBounds({
    itemCount: 100000,
    itemProps: {},
    itemSize: () => {
      measurements++;
      return 20;
    }
  });
  getStartStopIndices({
    cachedBounds,
    containerScrollOffset: 0,
    containerSize: 500,
    itemCount: 100000,
    overscanCount: 3
  });
  expect(measurements).toBe(25);
});

test("matches a linear lookup across boundaries, zero sizes and scroll directions", () => {
  for (const sizes of [
    [],
    [0],
    [20],
    [0, 10, 0, 30, 5, 0, 15],
    Array.from({ length: 100 }, (_, i) => (i * 17) % 31)
  ]) {
    const cachedBounds = createCachedBounds({
      itemCount: sizes.length,
      itemProps: {},
      itemSize: (index) => sizes[index]
    });
    const ends = sizes.map((_, index) =>
      sizes.slice(0, index + 1).reduce((sum, size) => sum + size, 0)
    );
    for (const offset of [-10, 0, 1, 10, 40, 10000, 900, 100, 0]) {
      for (const containerSize of [0, 1, 20, 100]) {
        let start = 0;
        while (start < sizes.length - 1 && ends[start] <= offset) start++;
        let stop = start;
        while (stop < sizes.length - 1 && ends[stop] < offset + containerSize)
          stop++;
        stop = Math.min(sizes.length - 1, stop);
        expect(
          getStartStopIndices({
            cachedBounds,
            containerScrollOffset: offset,
            containerSize,
            itemCount: sizes.length,
            overscanCount: 2
          })
        ).toEqual({
          startIndexVisible: start,
          stopIndexVisible: stop,
          startIndexOverscan: Math.max(0, start - 2),
          stopIndexOverscan: Math.min(sizes.length - 1, stop + 2)
        });
      }
    }
  }
});
