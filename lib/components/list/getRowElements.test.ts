import { describe, expect, test } from "vitest";
import { getRowElements } from "./getRowElements";

function createElement(attributes: Record<string, string> = {}) {
  const element = document.createElement("div");
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}

function createRow(index: number, rowCount: number = 10) {
  return createElement({
    "aria-posinset": `${index + 1}`,
    "aria-setsize": `${rowCount}`
  });
}

describe("getRowElements", () => {
  test("returns no rows if none are rendered", () => {
    const elements = [createElement()];
    expect(
      getRowElements({
        elements,
        isFlowLayout: false,
        rowCount: 0,
        startIndex: -1,
        stopIndex: -1
      })
    ).toEqual([]);
  });

  test("identifies rows by aria-posinset regardless of their position", () => {
    const overlay = createElement();
    const row2 = createRow(2);
    const row4 = createRow(4);
    expect(
      getRowElements({
        elements: [overlay, row2, row4],
        isFlowLayout: false,
        rowCount: 10,
        startIndex: 2,
        stopIndex: 4
      })
    ).toEqual([
      { element: row2, index: 2 },
      { element: row4, index: 4 }
    ]);
  });

  test.each([
    ["is not an integer", { "aria-posinset": "1.5", "aria-setsize": "10" }],
    [
      "is outside of the rendered range",
      { "aria-posinset": "9", "aria-setsize": "10" }
    ],
    ["is a duplicate", { "aria-posinset": "1", "aria-setsize": "10" }],
    ["has a different set size", { "aria-posinset": "2", "aria-setsize": "2" }]
  ])(
    "matches rows by position if an aria-posinset value %s",
    (_, attributes) => {
      const row0 = createRow(0);
      const row1 = createElement(attributes);
      const overlay = createElement();
      expect(
        getRowElements({
          elements: [row0, row1, overlay],
          isFlowLayout: false,
          rowCount: 10,
          startIndex: 0,
          stopIndex: 1
        })
      ).toEqual([
        { element: row0, index: 0 },
        { element: row1, index: 1 }
      ]);
    }
  );

  test("matches rows by position after additional children in flow layout", () => {
    const overlay = createElement();
    const row0 = createElement();
    const row1 = createElement();
    expect(
      getRowElements({
        elements: [overlay, row0, row1],
        isFlowLayout: true,
        rowCount: 10,
        startIndex: 0,
        stopIndex: 1
      })
    ).toEqual([
      { element: row0, index: 0 },
      { element: row1, index: 1 }
    ]);
  });

  test("does not match more rows by position than there are elements", () => {
    const row0 = createElement();
    expect(
      getRowElements({
        elements: [row0],
        isFlowLayout: true,
        rowCount: 10,
        startIndex: 0,
        stopIndex: 3
      })
    ).toEqual([{ element: row0, index: 0 }]);
  });
});
