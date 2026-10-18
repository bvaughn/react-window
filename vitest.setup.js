import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { format } from "node:util";
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

// Fail tests that log warnings or errors; tests that expect them should mock the console method.
// These are plain functions (rather than spies) so that restoreMocks doesn't remove them.
// Originals are captured once because restoreMocks can put back a previous test's function (if a spy wrapped it).
const CONSOLE_METHODS = ["error", "warn"];
const originalConsoleMethods = Object.fromEntries(
  CONSOLE_METHODS.map((method) => [method, console[method]])
);
let unexpectedConsoleCalls = [];

beforeEach(() => {
  unexpectedConsoleCalls = [];
  CONSOLE_METHODS.forEach((method) => {
    console[method] = (...args) => {
      unexpectedConsoleCalls.push({ args, method });
      originalConsoleMethods[method](...args);
    };
  });

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

  CONSOLE_METHODS.forEach((method) => {
    console[method] = originalConsoleMethods[method];
  });

  if (unexpectedConsoleCalls.length > 0) {
    const messages = unexpectedConsoleCalls.map(
      ({ args, method }) => `console.${method}: ${format(...args)}`
    );
    throw Error(`Unexpected console output:\n\n${messages.join("\n\n")}`);
  }
});
