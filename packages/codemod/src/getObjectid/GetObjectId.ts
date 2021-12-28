import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '../addNamedImport';

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  let hasObjectId = false;

  // fromGlobalId(<>).id
  root
    .find(j.MemberExpression)
    .filter((path) => {
      if (path.node.object.type === 'CallExpression') {
        if (path.node.object.callee.name === 'fromGlobalId') {
          if (path.node.property.type === 'Identifier') {
            if (path.node.property.name === 'id') {
              return true;
            }
          }
        }
      }
      return false;
    })
    .forEach((path) => {
      const args = path.node.object.arguments;

      if (!hasObjectId) {
        hasObjectId = true;
      }

      j(path).replaceWith(j.callExpression(j.identifier('getObjectId'), args));

      return path.node;
    });

  if (hasObjectId) {
    addNamedImport({
      root,
      j,
      importName: '@repo/graphql',
      specifier: 'getObjectId',
    });
  }

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
