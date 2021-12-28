import { API, FileInfo, Options } from 'jscodeshift';

import { getConfig } from '@codemods/utils';
import { removeImportWithoutSpecifiers } from '@codemods/named-import/removeImportWithoutSpecifiers';

export type FixImportExportConfig = {
  specifiers: string[];
  to: string; // new export/import source value
};

export const fixImportExport = (
  file: FileInfo,
  api: API,
  // eslint-disable-next-line
  options: Options,
) => {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig<FixImportExportConfig>(options);
  const { specifiers, to } = config;

  let specifiersToCreate = [];
  // find imports with default specifier -> transform to named with new package
  // find default export -> transform to named with new package
  root
    .find(j.ExportNamedDeclaration)
    .forEach((path) => {
      const matchedSpecifiers = path.node.specifiers.filter((s) => {
        if (s.local.name === 'default') {
          if (specifiers.includes(s.exported.name)) {
            specifiersToCreate = [...specifiersToCreate, s.exported.name];
            return true;
          }
        }

        return false;
      });

      if (matchedSpecifiers.length > 0) {
        return true;
      }

      return false;
    })
    .forEach((path) => {
      const filteredSpecifiers = path.node.specifiers.filter((s) => {
        if (s.local.name === 'default') {
          if (specifiers.includes(s.exported.name)) {
            return false;
          }
        }

        return true;
      });

      const exportDeclaration = j.exportNamedDeclaration(
        null,
        filteredSpecifiers,
        j.literal(path.node.source.value),
      );

      j(path).replaceWith(exportDeclaration);
    });

  // remove empty exports
  root
    .find(j.ExportNamedDeclaration)
    .forEach((path) => {
      if (path.node.specifiers.length === 0) {
        return true;
      }

      return false;
    })
    .forEach((path) => {
      j(path).remove();
    });

  if (specifiersToCreate.length > 0) {
    const namedSpecifiers = specifiersToCreate.map((s) =>
      j.exportSpecifier(j.identifier(s), j.identifier(s)),
    );

    // create new export declaration
    const exportDeclaration = j.exportNamedDeclaration(
      null,
      namedSpecifiers,
      j.literal(to),
    );

    root.get().node.program.body.push(exportDeclaration);
  }

  // remove default imports from old import
  let importsToCreate = [];
  root
    .find(j.ImportDeclaration)
    .forEach((path) => {
      const filtered = path.node.specifiers.filter((s) => {
        if (s.type === 'ImportDefaultSpecifier') {
          if (specifiers.includes(s.local.name)) {
            importsToCreate = [...importsToCreate, s.local.name];
            return true;
          }
        }

        return false;
      });

      if (filtered.length > 0) {
        return true;
      }

      return false;
    })
    .forEach((path) => {
      const filtered = path.node.specifiers.filter((s) => {
        if (s.type === 'ImportDefaultSpecifier') {
          if (specifiers.includes(s.local.name)) {
            return false;
          }
        }

        return true;
      });

      const newImportDeclaration = j.importDeclaration(
        filtered,
        j.literal(path.node.source.value),
      );

      j(path).replaceWith(newImportDeclaration);
    });

  if (importsToCreate.length > 0) {
    const importSpecifiers = importsToCreate.map((i) =>
      j.importSpecifier(j.identifier(i)),
    );

    const newImportDeclaration = j.importDeclaration(
      importSpecifiers,
      j.literal(to),
    );

    const imports = root.find(j.ImportDeclaration);

    if (imports.length > 0) {
      j(imports.at(imports.length - 1).get()).insertAfter(newImportDeclaration); // after the imports
    } else {
      root.get().node.program.body.unshift(newImportDeclaration); // beginning of file
    }

    const removeConfig = {
      importMapper: config.specifiers,
      newImportName: config.to,
    };

    removeImportWithoutSpecifiers({
      root,
      j,
      config: removeConfig,
    });
  }

  return root.toSource(printOptions);
};

// make it work directly with jscodeshit
export default fixImportExport;
export const parser = 'tsx';
