import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '@codemods/add-named-import';

export const errorField = (node) => {
  if (!node.key) {
    return false;
  }

  if (node.key.type !== 'Identifier') {
    return false;
  }

  if (node.key.name !== 'error') {
    return false;
  }

  if (!node.value) {
    return false;
  }

  if (node.value.type !== 'ObjectExpression') {
    return false;
  }

  const hasTypeProp = node.value.properties.filter(
    (p) => p.key.type === 'Identifier' && p.key.name === 'type',
  );
  const hasResolveProp = node.value.properties.filter(
    (p) =>
      p.key.type === 'Identifier' &&
      p.key.name === 'resolve' &&
      p.value.type === 'ArrowFunctionExpression' &&
      p.value.body === 'Identifier' &&
      p.value.name === 'error',
  );

  return hasTypeProp && hasResolveProp;
};

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  let hasErrorField = false;
  root
    .find(j.ObjectExpression)
    .filter((path) => {
      const { node } = path;

      return node.properties.filter((p) => hasErrorFieldProperty(p)).length > 0;
    })
    .forEach((path) => {
      const properties = path.node.properties.map((p) => {
        if (hasErrorFieldProperty(p)) {
          return j.spreadProperty(j.identifier('errorField'));
        }

        return p;
      });

      if (!hasErrorField) {
        hasErrorField = true;
      }

      j(path).replaceWith(j.objectExpression(properties));
    });

  if (hasErrorField) {
    addNamedImport({
      root,
      j,
      importName: '@repo/graphql',
      specifier: 'errorField',
    });
  }

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default errorField;
