import { JSCodeshift } from 'jscodeshift/src/core';

import { ImportLocalImported } from './membersMatchingPred';

export const onlyUnique = (value, index, self) => self.indexOf(value) === index;
export const uniq = (xs) => xs.filter(onlyUnique);
export const exists = (x: any[]) => x.length > 0;

type Options = {
  members: ImportLocalImported[];
  module: string;
  defaultName: string | null;
};
export const makeImport = (
  j: JSCodeshift,
  { members = [], module, defaultName = null }: Options,
) => {
  const importSpecifiers = members.map((x) => {
    if (x.local) {
      return j.importSpecifier(j.identifier(x.imported), j.identifier(x.local));
    }

    return j.importSpecifier(j.identifier(x.imported));
  });

  const specifiers =
    defaultName != null
      ? [
          j.importDefaultSpecifier(j.identifier(defaultName)),
          ...importSpecifiers,
        ]
      : importSpecifiers;

  return j.importDeclaration(specifiers, j.literal(module));
};
