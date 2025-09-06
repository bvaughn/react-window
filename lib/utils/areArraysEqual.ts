export function areArraysEqual(a: unknown[], b: unknown[]) {
  if (a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index++) {
    if (!Object.is(a[index], b[index])) {
      return false;
    }
  }

  return true;
}
