import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { mockResizeObserver } from "./lib/utils/test/mockResizeObserver";

let unmockResizeObserver = null;

beforeEach(() => {
  unmockResizeObserver = mockResizeObserver();
});

afterEach(() => {
  cleanup();

  if (unmockResizeObserver) {
    unmockResizeObserver();
  }
});
