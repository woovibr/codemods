import { API, FileInfo, Options } from 'jscodeshift';

export function namedGraphQLObjectType(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  let typename = null;

  root
    .find(j.ExportDefaultDeclaration)
    .filter((path) => {
      if (path.node.declaration.callee?.name === 'GraphQLObjectType') {
        return true;
      }
      return false;
    })
    .forEach((path) => {
      const { declaration } = path.node;

      const nameProperty = declaration.arguments[0]?.properties?.find(
        (p) => p.key.name === 'name',
      );

      if (!nameProperty) {
        // eslint-disable-next-line
        console.log('failed: ', {
          path: file.path,
          declaration,
        });
        return;
      }

      const name = nameProperty.value.value;

      typename = name.endsWith('Type') ? `${name}` : `${name}Type`;

      const variableDec = j.variableDeclaration('const', [
        j.variableDeclarator(j.identifier(typename), declaration),
      ]);

      j(path).replaceWith(variableDec);
    });

  if (typename) {
    const defaultDeclaration = j.exportDefaultDeclaration(
      j.identifier(typename),
    );

    root.get().node.program.body.push(defaultDeclaration);
  }

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default namedGraphQLObjectType;
