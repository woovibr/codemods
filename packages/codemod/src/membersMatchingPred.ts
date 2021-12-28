import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export type ImportLocalImported = {
  local?: string;
  imported: string;
};

// collection members that match a predicate
export const membersMatchingPred = (
  j: JSCodeshift,
  collection: Collection<any>,
  pred: () => boolean,
  removeMatches = false,
): ImportLocalImported[] => {
  const results = [];

  const matches = collection
    .find(j.ImportSpecifier)
    .filter(pred)
    .forEach((x) => {
      if (x.node.local || x.node.imported) {
        results.push({
          local: x.node.local?.name,
          imported: x.node.imported.name,
        });
      }
    });

  if (removeMatches) {
    matches.remove();
  }

  return results;
};
