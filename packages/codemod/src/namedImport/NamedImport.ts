import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '../addNamedImport';
import { getConfig } from '../getConfig';

import { getRelativePathname, isSameImport } from '../getRelativePathname';

import { removeImportWithoutSpecifiers } from './removeImportWithoutSpecifiers';

export type NamedImportConfig = {
  importMapper: string[];
  newImportName: string;
  fromSource?: string;
};
export const defaultConfigNamedImport = {
  importMapper: [
    'clearDbAndRestartCounters',
    'connectMongoose',
    'disconnectMongoose',
    'sanitizeTestObject',
    'defaultFrozenKeys',
  ],
  newImportName: '@repo/test',
  fromSource: null,
};

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig<NamedImportConfig>(
    options,
    defaultConfigNamedImport,
  );

  // eslint-disable-next-line
  console.log('Running with config: ', config);

  const importDeclaration = root.find(j.ImportDeclaration).filter((path) => {
    // validate fromSource
    if (config.fromSource) {
      const relative = getRelativePathname(file.path, config.fromSource);

      if (!isSameImport(path.node.source.value, relative)) {
        return false;
      }

      return true;
    }
    return path.node.source.value !== config.newImportName;
  });

  const importSpecifiers = importDeclaration
    .find(j.ImportSpecifier)
    .filter((path) => config.importMapper.includes(path.node.imported.name));

  let codemodApplied = false;

  importSpecifiers.forEach((node) => {
    const { name: moduleName } = node.value.imported;
    const { name: localName } = node.value.local;

    if (!config.importMapper.includes(moduleName)) {
      return node;
    }

    codemodApplied = true;

    addNamedImport({
      root,
      j,
      importName: config.newImportName,
      specifier: moduleName,
      localName,
    });

    j(node).remove();

    return node;
  });

  if (codemodApplied) {
    removeImportWithoutSpecifiers({
      root,
      j,
      config,
      file,
      source: config.fromSource,
    });
  }

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
