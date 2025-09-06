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
