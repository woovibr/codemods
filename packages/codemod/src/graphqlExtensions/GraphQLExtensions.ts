import { API, FileInfo, Options } from 'jscodeshift';

const middlewares = [
  'myself',
  'authenticatedOnly',
  'requiredRoles',
  'requiredFeatures',
  'validationSchema',
];

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  root
    .find(j.ExportDefaultDeclaration)
    .filter((path) => {
      if (path.node.declaration.type === 'ObjectExpression') {
        if (path.node.declaration.properties.length > 1) {
          const [spread, ...middleware] = path.node.declaration.properties;

          if (middlewares.includes(middleware[0].key.name)) {
            return true;
          }
        }
      }
      return false;
    })
    .forEach((path) => {
      const { declaration } = path.node;

      const [spread, ...middleware] = declaration.properties;

      const expressionObject = j.objectProperty(
        j.identifier('extensions'),
        j.objectExpression(middleware),
      );

      j(path).replaceWith(
        j.exportDefaultDeclaration(
          j.objectExpression([spread, expressionObject]),
        ),
      );

      return path.node;
    });

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
