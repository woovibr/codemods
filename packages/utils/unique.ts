type CompareFn = <T>(a: T, b: T) => boolean;
const compareEqual = <T>(a: T, b: T) => a === b;
export const unique = <T>(items: T[], compare: CompareFn = compareEqual): T[] =>
  items.filter(
    (elem, pos, arr) => arr.findIndex((a) => compare(a, elem)) === pos,
  );
