export function fillArray(length, fillFunction): Array {
  const array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = fillFunction(i);
  }
  return array;
}
