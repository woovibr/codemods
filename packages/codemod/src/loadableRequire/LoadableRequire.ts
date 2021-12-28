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
    .find(j.CallExpression)
    .filter((path) => {
      if (path.node.type === 'CallExpression') {
        if (
          path.node.callee.type === 'Identifier' &&
          path.node.callee.name === 'loadable'
        ) {
          return true;
        }
      }
    })
    .forEach((path) => {
      const file = path.node.arguments[0].body.arguments[0].value;

      j(path).replaceWith(
        j.callExpression(j.identifier('require'), [j.stringLiteral(file)]),
      );
    });

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
