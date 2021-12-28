import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '@codemods/add-named-import';

export function newRelayMockEnvironment(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST
  let canAddNamedImport = false;

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  let alreadyCodemoded = false;
  root.find(j.ImportDeclaration).forEach((path) => {
    const { node } = path;
    for (const specifier of node.specifiers) {
      if (
        specifier?.imported?.name === 'createMockEnvironment' &&
        specifier.local?.name === 'createMockEnvironment'
      ) {
        alreadyCodemoded = true;
      }
    }
  });

  if (alreadyCodemoded) {
    return root.toSource(printOptions);
  }

  root
    .find(j.VariableDeclaration)
    .filter((path) => {
      const { node } = path;
      if (!node?.declarations[0]?.init?.callee?.name) {
        return false;
      }
      return node?.declarations[0]?.init?.callee?.name === 'withProviders';
    })
    .forEach((path) => {
      canAddNamedImport = true;
      j(path.get()).insertBefore(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier('environment'),
            j.callExpression(j.identifier('createMockEnvironment'), []),
          ),
        ]),
      );
    });

  root
    .find(j.CallExpression)
    .filter((path) => {
      const { node } = path;

      if (!canAddNamedImport) {
        return false;
      }
      return node.callee.name === 'withProviders';
    })
    .forEach((path) => {
      const { node } = path;

      const newEnvironmentProperty = j.objectProperty(
        j.identifier('environment'),
        j.identifier('environment'),
      );
      newEnvironmentProperty.shorthand = true;
      const newProperties = [
        ...node.arguments[0].properties,
        newEnvironmentProperty,
      ];

      node.arguments = [j.objectExpression(newProperties)];
    });

  root
    .find(j.CallExpression)
    .filter((path) => {
      const { node } = path;

      if (!canAddNamedImport) {
        return false;
      }

      const isEnvironmentCall =
        node?.callee?.object?.object?.name === 'Environment';
      const hasMockCall = node?.callee?.object?.property?.name === 'mock';
      return isEnvironmentCall && hasMockCall;
    })
    .forEach((path) => {
      const { node } = path;

      if (node.callee.object) {
        node.callee.object = j.memberExpression(
          j.identifier('environment'),
          j.identifier('mock'),
        );
      }
    });

  if (canAddNamedImport) {
    addNamedImport({
      root,
      j,
      importName: 'relay-test-utils',
      specifier: 'createMockEnvironment',
    });
  }

  // remove Environment import
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      if (path.node.specifiers.length !== 1) {
        return false;
      }

      return path.node.specifiers[0].local.name === 'Environment';
    })
    .forEach((path) => {
      j(path).remove();
    });

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default newRelayMockEnvironment;
