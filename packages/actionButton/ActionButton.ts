import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '@codemods/add-named-import';

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  let hasFlatButton = false;

  // fromGlobalId(<>).id
  root
    .find(j.JSXElement)
    .filter((path) => {
      if (path.node.openingElement.name.name === 'FlatButton') {
        if (!path.node.closingElement) {
          return false;
        }

        if (!hasFlatButton) {
          hasFlatButton = true;
        }

        return true;
      }

      return false;
    })
    .forEach((path) => {
      const attributes = path.node.openingElement.attributes;
      const children = path.node.children;

      const newAttributes = [
        j.jsxAttribute(j.jsxIdentifier('variant'), j.literal('text')),
        ...attributes,
      ];

      j(path).replaceWith(
        j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier('ActionButton'), newAttributes),
          j.jsxClosingElement(j.jsxIdentifier('ActionButton')),
          children,
        ),
      );

      return path.node;
    });

  if (hasFlatButton) {
    addNamedImport({
      root,
      j,
      importName: '@repo/ui',
      specifier: 'ActionButton',
    });
  }

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
