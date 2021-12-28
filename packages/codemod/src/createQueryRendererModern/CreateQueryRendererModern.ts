import { API, FileInfo, Options } from 'jscodeshift';

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  // createQueryRendererModern
  root
    .find(j.CallExpression)
    .filter((path) => {
      if (
        path.node.callee.type === 'Identifier' &&
        path.node.callee.name === 'createQueryRendererModern'
      ) {
        if (path.node.arguments.length === 3) {
          return true;
        }

        return false;
      }
      return false;
    })
    .forEach((path) => {
      const newArgs = [path.node.arguments[0], path.node.arguments[2]];

      j(path).replaceWith(
        j.callExpression(j.identifier('createQueryRendererModern'), newArgs),
      );

      return path.node;
    });

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
