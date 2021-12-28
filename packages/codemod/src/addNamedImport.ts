import { unique } from '@repo/shared';

import { findImportFilter } from './findImport';
import { membersMatchingPred } from './membersMatchingPred';
import { makeImport } from './utils';
import { sameImport } from './namedImport/sameImport';

// import { User as UserModel } from '@repo/modules'
// specifier - User
// localName - UserModel
type AddNamedImport = {
  root: any;
  j: any;
  importName: string;
  specifier: string;
  localName: string;
};
export const addNamedImport = ({
  root,
  j,
  importName,
  specifier,
  localName,
  defaultName,
}: AddNamedImport) => {
  const importNameDeclaration = findImportFilter(root, j, importName);

  if (importNameDeclaration.length > 0) {
    // check if there is import specifier of importName
    const importSpecifiers = importNameDeclaration
      .find(j.ImportSpecifier)
      .filter((path) => path.node.imported.name === specifier);

    if (importSpecifiers.length === 0) {
      // add importName to import
      const existingMembers = membersMatchingPred(
        j,
        importNameDeclaration,
        () => true,
      );

      const newImports =
        specifier || localName
          ? [
              ...existingMembers,
              {
                imported: specifier,
                local: localName,
              },
            ]
          : existingMembers;

      const targetMembers = unique(newImports, sameImport);

      let oldDefaultImport = null;

      root
        .find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === importName)
        .forEach((path) => {
          path.node.specifiers.forEach((s) => {
            if (s.type === 'ImportDefaultSpecifier') {
              oldDefaultImport = s.local.name;
            }
          });
        });

      // do not create another import
      const newImport = makeImport(j, {
        members: targetMembers,
        module: importName,
        defaultName: defaultName || oldDefaultImport,
      });

      importNameDeclaration.replaceWith(newImport);
    }
  } else {
    // this will add only one import to @repo/test
    const imports = root.find(j.ImportDeclaration);

    const specifiers = defaultName
      ? [j.importDefaultSpecifier(j.identifier(defaultName))]
      : [
          j.importSpecifier(
            j.identifier(specifier),
            j.identifier(localName || specifier),
          ),
        ];

    const newNamedImport = j.importDeclaration(
      specifiers,
      j.literal(importName),
    );

    if (imports.length > 0) {
      j(imports.at(imports.length - 1).get()).insertAfter(newNamedImport); // after the imports
    } else {
      root.get().node.program.body.unshift(newNamedImport); // beginning of file
    }
  }
};
