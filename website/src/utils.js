// Create a new array with the length and fill it with the fillFunction
export const fillArray = (length, fillFunction) => {
  return Array.from({ length }, (_, i) => fillFunction(i));
};
