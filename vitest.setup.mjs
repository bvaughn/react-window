import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { mockResizeObserver } from "./lib/utils/test/mockResizeObserver";
import { mockScrollTo } from "./lib/utils/test/mockScrollTo";

let unmockResizeObserver = null;
let unmockScrollTo = null;

beforeEach(() => {
  unmockResizeObserver = mockResizeObserver();
  unmockScrollTo = mockScrollTo();
});

afterEach(() => {
  cleanup();

  if (unmockResizeObserver) {
    unmockResizeObserver();
  }

  if (unmockScrollTo) {
    unmockScrollTo();
  }
});
