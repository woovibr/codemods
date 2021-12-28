import fs from 'fs';

import { join, dirname } from 'path';

import jscodeshift, { API, FileInfo, Options } from 'jscodeshift';

import { getConfig } from '../getConfig';

import { addNamedImport } from '../addNamedImport';
import { getRelativePathname } from '../getRelativePathname';

import { getExportMapDeclaration } from './getExportMapDeclaration';

const cwd = process.cwd();

const parser = 'tsx';
const jj = jscodeshift.withParser(parser);

// eslint-disable-next-line
const empty = () => {};

const stats = (name, quantity) => {
  // eslint-disable-next-line
  quantity = typeof quantity !== 'number' ? 1 : quantity;
  // eslint-disable-next-line
  console.log('update: ', {
    name,
    quantity,
  });
};

type ModuleToRelativeConfig = {
  packageName: string; // '@repo/modules',
  indexPath: string; // 'packages/modules/src/index.ts',
};
function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig<ModuleToRelativeConfig>(options, {});

  const indexFile = join(cwd, config.indexPath);

  const content = fs.readFileSync(indexFile);
  const source = content.toString();

  const exportsMap = getExportMapDeclaration(
    {
      path: indexFile,
      source,
    },
    {
      jj,
      jscodeshift: jj,
      stats: options.dry ? stats : empty,
      report: () => {},
    },
    {},
  );

  // console.log('exportsMap: ', exportsMap);

  // find hot() call
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      if (path.node.source.value === config.packageName) {
        return true;
      }

      return false;
    })
    .forEach((path) => {
      for (const specifier of path.node.specifiers) {
        const imported = specifier.imported.name;
        const local = specifier.local.name;

        const newImportMap = exportsMap[imported];
        const source = join(dirname(config.indexPath), newImportMap.source);

        if (!newImportMap) {
          // eslint-disable-next-line
          console.log('export not found: ', {
            local,
            imported,
          });
          return;
        }

        const relative = getRelativePathname(file.path, source, false);

        if (newImportMap.local === 'default') {
          addNamedImport({
            root,
            j,
            importName: relative,
            // localName: imported,
            // specifier: 'default',
            defaultName: imported,
          });
        } else {
          addNamedImport({
            root,
            j,
            importName: relative,
            localName: local,
            specifier: imported,
          });
        }
      }

      j(path).remove();
    });

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
