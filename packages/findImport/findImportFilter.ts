import type { JSCodeshift, Collection } from 'jscodeshift';

export const findImportFilter = (
  root: Collection<any>,
  j: JSCodeshift,
  name: string,
) =>
  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === name);
