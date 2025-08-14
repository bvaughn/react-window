export function assert(
  expectedCondition: unknown,
  message: string = "Assertion error",
): asserts expectedCondition {
  if (!expectedCondition) {
    console.error(message);

    throw Error(message);
  }
}
