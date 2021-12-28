import { API, FileInfo, Options } from 'jscodeshift';

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  // find hot() call
  root
    .find(j.ExportDefaultDeclaration)
    .filter((path) => {
      if (path.node.declaration.type === 'CallExpression') {
        if (
          path.node.declaration.callee.type === 'Identifier' &&
          path.node.declaration.callee.name === 'hot'
        ) {
          return true;
        }
      }
    })
    .forEach((path) => {
      path.node.declaration = path.node.declaration.arguments[0];
    });

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
