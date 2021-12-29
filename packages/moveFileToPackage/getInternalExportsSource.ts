import { API, FileInfo, Options } from 'jscodeshift';

import { relativeImportSourceRegex } from '@codemods/get-internal-imports/relativeImportSourceRegex';

// a transform with another name
export const getInternalExportsSource = (
  file: FileInfo,
  api: API,
  // eslint-disable-next-line
  options: Options,
) => {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  let exports = [];

  // export type MyType = {}; TypeAlias
  // export const myFn = () => {}; VariableDeclaration
  // export function ok() {}; FunctionDeclaration
  root.find(j.ExportNamedDeclaration).forEach((p) => {
    if (p.node.source?.value) {
      if (relativeImportSourceRegex.test(p.node.source.value)) {
        if (p.node.specifiers.length > 0) {
          exports = [...exports, p.node.source.value];
        }
      }
    }
  });

  return exports;
};

// make it work directly with jscodeshit
export default getInternalExportsSource;
export const parser = 'tsx';
