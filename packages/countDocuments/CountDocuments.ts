import { API, FileInfo, Options } from 'jscodeshift';

export function countDocuments(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  root
    .find(j.CallExpression)
    .filter((path) => {
      if (path.node.callee.type !== 'MemberExpression') {
        return false;
      }

      if (path.node.callee.property.name !== 'count') {
        return false;
      }

      return true;
    })
    .forEach((path) => {
      const args = path.node.arguments;

      const callExpression = j.callExpression(
        j.memberExpression(
          path.node.callee.object,
          j.identifier('countDocuments'),
        ),
        args,
      );

      j(path).replaceWith(callExpression);
    });

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default countDocuments;
