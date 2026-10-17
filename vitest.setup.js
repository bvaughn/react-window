import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

// Server rendering tests run in a Node environment (without DOM APIs to mock)
const isDOMEnvironment = typeof window !== "undefined";

const { mockResizeObserver } = isDOMEnvironment
  ? await import("./lib/utils/test/mockResizeObserver")
  : {};
const { mockScrollTo } = isDOMEnvironment
  ? await import("./lib/utils/test/mockScrollTo")
  : {};

let unmockResizeObserver = null;
let unmockScrollTo = null;

beforeEach(() => {
  if (isDOMEnvironment) {
    unmockResizeObserver = mockResizeObserver();
    unmockScrollTo = mockScrollTo();
  }
});

afterEach(() => {
  if (isDOMEnvironment) {
    cleanup();
  }

  if (unmockResizeObserver) {
    unmockResizeObserver();
  }

  if (unmockScrollTo) {
    unmockScrollTo();
  }
});
