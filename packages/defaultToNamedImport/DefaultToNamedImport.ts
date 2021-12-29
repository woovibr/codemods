import { API, FileInfo, Options } from 'jscodeshift';

import { getConfig } from '@codemods/utils';

const defaultConfig = {
  defaultExportName: 'EVENTS',
};

export function defaultToNamedImport(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig(options, defaultConfig);

  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      const importDefault = path.node.specifiers.find(
        (s) => s.type === 'ImportDefaultSpecifier',
      );

      if (!importDefault) {
        return false;
      }

      return importDefault.local.name === config.defaultExportName;
    })
    .forEach((path) => {
      j(path).replaceWith(
        j.importDeclaration(
          [j.importSpecifier(j.identifier(config.defaultExportName))],
          j.literal(path.node.source.value),
        ),
      );
    });

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default defaultToNamedImport;
