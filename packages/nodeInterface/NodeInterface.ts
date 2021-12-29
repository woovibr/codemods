import { API, FileInfo, Options } from 'jscodeshift';

import { addImportToBody } from '@codemods/add-import-to-body';

export function nodeInterface(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  let hasNodeInterface = false;

  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      if (path.node.specifiers.length !== 1) {
        return false;
      }

      if (path.node.specifiers[0].imported?.name !== 'NodeInterface') {
        return false;
      }

      return true;
    })
    .forEach((path) => {
      hasNodeInterface = true;

      j(path).remove();
    });

  if (!hasNodeInterface) {
    return root.toSource(printOptions);
  }

  // interfaces
  root
    .find(j.ObjectProperty)
    .filter((path) => {
      if (path.node.key?.name !== 'interfaces') {
        return false;
      }

      if (path.node.value.body?.elements?.length !== 1) {
        return false;
      }

      const el = path.node.value.body?.elements[0];

      if (el.name === 'NodeInterface') {
        return true;
      }

      return false;
    })
    .forEach((path) => {
      const newInterface = j.objectProperty(
        path.node.key,
        j.arrowFunctionExpression(
          [],
          j.arrayExpression([j.identifier('nodeInterface')]),
        ),
      );

      j(path).replaceWith(newInterface);
    });

  // import { nodeInterface } from '@repo/modules';
  const nodeInterfaceDeclaration = j.importDeclaration(
    [j.importSpecifier(j.identifier('nodeInterface'))],
    j.literal('@repo/modules'),
  );

  addImportToBody({
    root,
    j,
    newImport: nodeInterfaceDeclaration,
  });

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default nodeInterface;
