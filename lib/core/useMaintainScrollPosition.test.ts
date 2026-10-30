import { describe, expect, test, vi } from "vitest";
import { createCachedBounds } from "./createCachedBounds";
import {
  findAnchor,
  findIndexByKey,
  shiftCachedBounds
} from "./useMaintainScrollPosition";

describe("shiftCachedBounds", () => {
  test("should return the same bounds when not shifted", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });

    expect(shiftCachedBounds(cachedBounds, 0)).toBe(cachedBounds);
  });

  test("should shift each item's offset (but not its size)", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });
    const shiftedBounds = shiftCachedBounds(cachedBounds, 25);

    expect(shiftedBounds.get(0)).toEqual({ scrollOffset: -25, size: 10 });
    expect(shiftedBounds.get(2)).toEqual({ scrollOffset: -4, size: 12 });

    // The original bounds are unchanged
    expect(cachedBounds.get(2)).toEqual({ scrollOffset: 21, size: 12 });
  });

  test("should reflect the size of the original bounds", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });
    const shiftedBounds = shiftCachedBounds(cachedBounds, 25);

    expect(shiftedBounds.size).toBe(0);
    shiftedBounds.get(3);
    expect(shiftedBounds.size).toBe(4);
    expect(cachedBounds.size).toBe(4);
  });

  test("should store unshifted offsets", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });
    const shiftedBounds = shiftCachedBounds(cachedBounds, 25);

    shiftedBounds.set(0, { scrollOffset: -25, size: 10 });
    expect(cachedBounds.get(0)).toEqual({ scrollOffset: 0, size: 10 });
    expect(shiftedBounds.get(0)).toEqual({ scrollOffset: -25, size: 10 });
  });

  test("should preserve a fixed item size", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: 20
    });

    expect(shiftCachedBounds(cachedBounds, 25).itemSize).toBe(
      cachedBounds.itemSize
    );
  });
});

describe("findIndexByKey", () => {
  function getItemKey(keys: string[]) {
    return (index: number) => keys[index];
  }

  test("should find an item that hasn't moved", () => {
    expect(
      findIndexByKey({
        getItemKey: getItemKey(["a", "b", "c"]),
        itemCount: 3,
        key: "b",
        prevIndex: 1,
        prevItemCount: 3
      })
    ).toBe(1);
  });

  test("should find an item after items are inserted before it", () => {
    expect(
      findIndexByKey({
        getItemKey: getItemKey(["x", "y", "a", "b", "c"]),
        itemCount: 5,
        key: "b",
        prevIndex: 1,
        prevItemCount: 3
      })
    ).toBe(3);
  });

  test("should find an item after items are removed before it", () => {
    expect(
      findIndexByKey({
        getItemKey: getItemKey(["c"]),
        itemCount: 1,
        key: "c",
        prevIndex: 2,
        prevItemCount: 3
      })
    ).toBe(0);
  });

  test("should find an item after items are inserted before it and removed after it", () => {
    // e.g. older items loaded (and newer items dropped) without changing the item count
    expect(
      findIndexByKey({
        getItemKey: getItemKey(["x", "y", "a", "b"]),
        itemCount: 4,
        key: "b",
        prevIndex: 1,
        prevItemCount: 4
      })
    ).toBe(3);
  });

  test("should return undefined for an item that was removed", () => {
    expect(
      findIndexByKey({
        getItemKey: getItemKey(["a", "c"]),
        itemCount: 2,
        key: "b",
        prevIndex: 1,
        prevItemCount: 3
      })
    ).toBeUndefined();
  });
});

describe("findAnchor", () => {
  // Items are identified by id; sizes are by id (10px unless specified)
  function createItems(ids: number[], sizes: Record<number, number> = {}) {
    return {
      cachedBounds: createCachedBounds({
        itemCount: ids.length,
        itemProps: {},
        itemSize: (index: number) => sizes[ids[index]] ?? 10
      }),
      getItemKey: (index: number) => ids[index],
      itemCount: ids.length
    };
  }

  function range(start: number, stop: number) {
    return Array.from(
      { length: stop - start + 1 },
      (_, index) => start + index
    );
  }

  function find({
    keys = true,
    next,
    prev,
    renderedKeys,
    requestedIndex,
    startIndexVisible,
    stopIndexVisible
  }: {
    keys?: boolean;
    next: ReturnType<typeof createItems>;
    prev: ReturnType<typeof createItems>;
    renderedKeys?: Map<number, number>;
    requestedIndex?: number;
    startIndexVisible: number;
    stopIndexVisible: number;
  }) {
    return findAnchorAndRequest({
      keys,
      next,
      prev,
      renderedKeys,
      requestedIndex,
      startIndexVisible,
      stopIndexVisible
    }).anchor;
  }

  function findAnchorAndRequest({
    getItemKey,
    keys = true,
    next,
    prev,
    renderedKeys,
    requestedIndex,
    startIndexVisible,
    stopIndexVisible
  }: {
    getItemKey?: (index: number) => number;
    keys?: boolean;
    next: ReturnType<typeof createItems>;
    prev: ReturnType<typeof createItems>;
    renderedKeys?: Map<number, number>;
    requestedIndex?: number;
    startIndexVisible: number;
    stopIndexVisible: number;
  }) {
    return findAnchor({
      cachedBounds: next.cachedBounds,
      getItemKey: keys ? (getItemKey ?? next.getItemKey) : undefined,
      itemCount: next.itemCount,
      prevCachedBounds: prev.cachedBounds,
      prevItemCount: prev.itemCount,
      renderedKeys:
        renderedKeys ??
        new Map(
          range(startIndexVisible, stopIndexVisible).map((index) => [
            index,
            prev.getItemKey(index)
          ])
        ),
      requestedIndex,
      startIndexVisible,
      stopIndexVisible
    });
  }

  test("should prefer the first visible item that didn't change size", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(0, 99), { 50: 30 });

    expect(
      find({
        keys: false,
        next,
        prev,
        startIndexVisible: 50,
        stopIndexVisible: 53
      })
    ).toEqual({ index: 51, isRequested: false, prevIndex: 51 });
  });

  test("should fall back to the first visible item if they all changed size", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(0, 99), { 50: 30, 51: 30 });

    expect(
      find({
        keys: false,
        next,
        prev,
        startIndexVisible: 50,
        stopIndexVisible: 51
      })
    ).toEqual({ index: 50, isRequested: false, prevIndex: 50 });
  });

  test("should prefer the requested item if it's visible", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(0, 99), { 51: 30 });

    expect(
      find({
        next,
        prev,
        requestedIndex: 51,
        startIndexVisible: 50,
        stopIndexVisible: 53
      })
    ).toEqual({ index: 51, isRequested: true, prevIndex: 51 });
    expect(
      find({
        next,
        prev,
        requestedIndex: 10,
        startIndexVisible: 50,
        stopIndexVisible: 53
      })
    ).toEqual({ index: 50, isRequested: false, prevIndex: 50 });
  });

  test("should find the requested item after items are inserted before it", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(-5, 99));

    expect(
      find({
        next,
        prev,
        requestedIndex: 51,
        startIndexVisible: 50,
        stopIndexVisible: 53
      })
    ).toEqual({ index: 56, isRequested: true, prevIndex: 51 });
  });

  test("should find visible items after items are inserted before them", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(-20, 99));

    expect(
      find({ next, prev, startIndexVisible: 50, stopIndexVisible: 53 })
    ).toEqual({ index: 70, isRequested: false, prevIndex: 50 });
  });

  test("should skip visible items that were removed", () => {
    const prev = createItems(range(0, 99));
    const next = createItems([...range(0, 49), ...range(52, 99)]);

    expect(
      find({ next, prev, startIndexVisible: 50, stopIndexVisible: 53 })
    ).toEqual({ index: 50, isRequested: false, prevIndex: 52 });
  });

  test("should return undefined if no visible items can be found", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(1000, 1099));

    expect(
      find({ next, prev, startIndexVisible: 50, stopIndexVisible: 53 })
    ).toBeUndefined();
  });

  test("should skip visible items whose keys weren't recorded", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(-20, 99));

    expect(
      find({
        next,
        prev,
        renderedKeys: new Map([[52, 52]]),
        startIndexVisible: 50,
        stopIndexVisible: 53
      })
    ).toEqual({ index: 72, isRequested: false, prevIndex: 52 });
  });

  test("should find items that moved farther than the search distance", () => {
    // A large batch of older items was loaded (and as many newer items dropped), so the item count didn't change
    const prev = createItems(range(0, 9999));
    const next = createItems(range(-5000, 4999));

    expect(
      find({ next, prev, startIndexVisible: 100, stopIndexVisible: 103 })
    ).toEqual({ index: 5100, isRequested: false, prevIndex: 100 });
  });

  test("should report the requested item's new index", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(-5, 99));

    expect(
      findAnchorAndRequest({
        next,
        prev,
        requestedIndex: 51,
        startIndexVisible: 50,
        stopIndexVisible: 53
      }).requested
    ).toEqual({ index: 56 });
  });

  test("should report a requested item that was removed", () => {
    const prev = createItems(range(0, 99));
    const next = createItems([...range(0, 50), ...range(52, 99)]);

    expect(
      findAnchorAndRequest({
        next,
        prev,
        requestedIndex: 51,
        startIndexVisible: 50,
        stopIndexVisible: 53
      })
    ).toEqual({
      anchor: { index: 50, isRequested: false, prevIndex: 50 },
      requested: { index: undefined }
    });
  });

  test("should not report a requested item that isn't visible", () => {
    const prev = createItems(range(0, 99));
    const next = createItems(range(0, 99));

    expect(
      findAnchorAndRequest({
        next,
        prev,
        requestedIndex: 10,
        startIndexVisible: 50,
        stopIndexVisible: 53
      }).requested
    ).toBeUndefined();
  });

  test("should not search every item if a visible item is found nearby", () => {
    // The first visible item was removed (e.g. a message in view was deleted)
    const prevIds = range(0, 99_999);
    const nextIds = [...range(0, 49_999), ...range(50_001, 99_999)];
    const prev = createItems(prevIds);
    const next = createItems(nextIds);
    const getItemKey = vi.fn((index: number) => nextIds[index]);

    expect(
      findAnchorAndRequest({
        getItemKey,
        next,
        prev,
        startIndexVisible: 50_000,
        stopIndexVisible: 50_003
      }).anchor
    ).toEqual({ index: 50_000, isRequested: false, prevIndex: 50_001 });
    expect(getItemKey.mock.calls.length).toBeLessThan(10_000);
  });
});
