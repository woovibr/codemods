import { ImportLocalImported } from '@codemods/members-matching-pred';

export const sameImport = (a: ImportLocalImported, b: ImportLocalImported) => {
  if (a.local === b.local) {
    if (a.imported === b.imported) {
      return true;
    }
  }

  return false;
};
