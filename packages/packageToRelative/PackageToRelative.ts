import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '@codemods/add-named-import';
import { getConfig, getRelativePathname, regexRemoveExtension, makeImport } from '@codemods/utils';

type ModuleToRelativeConfig = {
  packageName: string; // '@repo/modules',
  indexPath: string; // 'packages/main/test/createResource/createGoal.ts',
  importMapper: [];
};
export function packageToRelative(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig<ModuleToRelativeConfig>(options, {});

  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      if (path.node.source.value === config.packageName) {
        return true;
      }

      return false;
    })
    .forEach((path) => {
      const notRelatedSpecifiers = path.node.specifiers.filter((specifier) => {
        const imported = specifier.imported.name;

        return !config.importMapper.includes(imported);
      });

      for (const specifier of path.node.specifiers) {
        const imported = specifier.imported.name;
        const local = specifier.local.name;

        if (!config.importMapper.includes(imported)) {
          continue;
        }

        const source = config.indexPath;

        const relative = getRelativePathname(file.path, source, false);

        addNamedImport({
          root,
          j,
          importName: relative.replace(regexRemoveExtension, ''),
          localName: local,
          specifier: imported,
        });
      }

      if (notRelatedSpecifiers.length === 0) {
        j(path).remove();
      } else {
        const newImport = makeImport(j, {
          members: notRelatedSpecifiers.map((specifier) => {
            const imported = specifier.imported.name;
            const local = specifier.local.name;

            return {
              local,
              imported,
            };
          }),
          module: path.node.source.value,
        });

        j(path).replaceWith(newImport);
      }
    });

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default packageToRelative;
