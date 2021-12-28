import { API, FileInfo, Options } from 'jscodeshift';

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  root
    .find(j.IfStatement)
    .filter((path) => {
      if (path.node.test.type !== 'UnaryExpression') {
        return false;
      }

      return true;
    })
    .forEach((path) => {
      const id = path.node.test.argument.name;

      const newCond = j.ifStatement(
        j.binaryExpression('===', j.identifier(id), j.identifier('undefined')),
        path.node.consequent,
        path.node.alternate,
      );

      j(path).replaceWith(newCond);
    });

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
