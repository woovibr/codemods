import { API, FileInfo, Options } from 'jscodeshift';

import { relativeImportSourceRegex } from './relativeImportSourceRegex';

// a transform with another name
export const getInternalImports = (
  file: FileInfo,
  api: API,
  // eslint-disable-next-line
  options: Options,
) => {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  let relativeImports = [];

  root
    .find(j.ImportDeclaration)
    .filter((p) => relativeImportSourceRegex.test(p.node.source.value))
    .forEach((p) => {
      relativeImports = [...relativeImports, p.node];
    });

  return relativeImports;
};

// make it work directly with jscodeshit
export default getInternalImports;
export const parser = 'tsx';
