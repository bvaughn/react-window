import { assert } from "./assert";

export function shallowCompare<Type extends object>(
  a: Type | undefined,
  b: Type | undefined
) {
  if (a === b) {
    return true;
  }

  if (!!a !== !!b) {
    return false;
  }

  assert(a !== undefined);
  assert(b !== undefined);

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    if (!Object.is(b[key], a[key])) {
      return false;
    }
  }

  return true;
}
