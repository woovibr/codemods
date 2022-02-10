import { API, FileInfo, Options } from 'jscodeshift';

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const allTypesOfSystem : Array<string> = [];

  // should get all export type from the system
  root.find(j.ExportNamedDeclaration,
    {
      exportKind: 'type'
    }
  )
  .forEach((path) => {
    // get your name
    const typeName = path?.value?.declaration?.id?.name;

    if(!typeName) return;

    if(allTypesOfSystem[typeName]) return;

    // populate the array to "cache" the types that already has been used
    allTypesOfSystem[typeName] = __filename;

    // go to places where the import of this type is used
    root
    .find(j.ImportDeclaration)
    .filter((path) => {
      /*
        I has a problem here, only return a one import, that contains the unique import
        Ex: import { x, y } from './a'; the script don't see this import type
        import { x } from './a'; only this
        it's wrong
      */

      // check if is equal to export name
      const importDefault = path.node.specifiers.find(
        (s) =>
          s.type === 'ImportSpecifier' &&
          s.imported.name === typeName
      );

      // TODO: change to import type

    })

  })

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
