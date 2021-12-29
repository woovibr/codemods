import { API, FileInfo, Options } from 'jscodeshift';

// a transform with another name
export const getExportNamedDeclaration = (
  file: FileInfo,
  api: API,
  // eslint-disable-next-line
  options: Options,
) => {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  let exports = [];

  const declarationTypes = [
    'TypeAlias',
    'TSTypeAliasDeclaration',
    'InterfaceDeclaration',
    'TSEnumDeclaration',
    'TSInterfaceDeclaration',
    'FunctionDeclaration',
  ];
  // export type MyType = {}; TypeAlias
  // export const myFn = () => {}; VariableDeclaration
  // export function ok() {}; FunctionDeclaration
  root.find(j.ExportNamedDeclaration).forEach((path) => {
    if (declarationTypes.includes(path.node.declaration.type)) {
      exports = [...exports, path.node.declaration.id.name];
    }

    if (path.node.declaration.type === 'VariableDeclaration') {
      for (const declaration of path.node.declaration.declarations) {
        if (declaration.type === 'VariableDeclarator') {
          exports = [...exports, declaration.id.name];
        }
      }
    }
  });

  return exports;
};

// make it work directly with jscodeshit
export default getExportNamedDeclaration;
export const parser = 'tsx';
