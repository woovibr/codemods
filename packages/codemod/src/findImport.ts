import { Collection } from 'jscodeshift/src/Collection';
import { JSCodeshift } from 'jscodeshift';

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

export const findImportFilter = (
  root: Collection<any>,
  j: JSCodeshift,
  name: string,
) =>
  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === name);
