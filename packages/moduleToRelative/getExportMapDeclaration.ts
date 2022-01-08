import { API, FileInfo, Options } from 'jscodeshift';

export type ExportInfo = {
  local: string;
  exported: string;
  source: string;
};

export type ExportMap = {
  [key: string]: ExportInfo;
};

// a transform with another name
export const getExportMapDeclaration = (
  file: FileInfo,
  api: API,
  // eslint-disable-next-line
  options: Options,
) => {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const exportToSource = {};

  root
    .find(j.ExportNamedDeclaration)
    .filter((path) => {
      if (!path.node.source) {
        return false;
      }

      return true;
    })
    .forEach((path) => {
      path.node.specifiers.map((s) => {
        exportToSource[s.exported.name] = {
          local: s.local?.name,
          exported: s.exported.name,
          source: path.node.source.value,
        };
      });
    });

  return exportToSource;
};

// make it work directly with jscodeshit
export default getExportMapDeclaration;
export const parser = 'tsx';
