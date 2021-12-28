import type { JSCodeshift, Collection } from 'jscodeshift';

export const findImport = (
  root: Collection<any>,
  j: JSCodeshift,
  name: string,
) =>
  root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: name,
    },
  });
