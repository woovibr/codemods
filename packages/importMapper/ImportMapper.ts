import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '@codemods/add-named-import';
import { getConfig, getRelativePathname } from '@codemods/utils';

type ImportMap = {
  source: {
    from: string;
    to: string;
  };
  specifierFrom: {
    type:
      | 'ImportNamespaceSpecifier'
      | 'ImportDefaultSpecifier'
      | 'ImportSpecifier';
    name: string;
  };
  specifierTo: {
    type:
      | 'ImportNamespaceSpecifier'
      | 'ImportDefaultSpecifier'
      | 'ImportSpecifier';
    name: string;
  };
};

type ImportMapperConfig = {
  mappings: ImportMap[];
};

const defaultConfig = {
  mappings: [],
};

export function importMapper(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig<ImportMapperConfig>(options, defaultConfig);

  // eslint-disable-next-line
  for (const mapping of config.mappings || []) {
    // transform imports
    const { source, specifierFrom, specifierTo } = mapping;

    if (specifierFrom.type === 'ImportSpecifier') {
      // TODO - implement this
      return;
    }

    let defaultSpecifierLocalName = null;

    root
      .find(j.ImportDeclaration)
      .filter((path) => {
        if (source.from !== '*') {
          // validate source
          const relative = getRelativePathname(file.path, source.from);

          if (path.node.source.value !== relative) {
            return false;
          }
        } else if (specifierFrom.type === 'ImportDefaultSpecifier') {
          // eslint-disable-next-line
          console.log('default specifier needs a source.from');
          return false;
        }

        const hasValidSpecifier = path.node.specifiers.filter((s) => {
          if (s.type !== specifierFrom.type) {
            return false;
          }

          return true;
        });

        if (hasValidSpecifier.length > 0) {
          defaultSpecifierLocalName = hasValidSpecifier[0].local.name;
        }

        return hasValidSpecifier.length > 0;
      })
      .forEach((path) => {
        // check specifiers
        const otherSpecifiers = path.node.specifiers.filter((s) => {
          if (s.type !== specifierFrom.type) {
            return true;
          }

          return false;
        });

        if (otherSpecifiers.length === 0) {
          j(path).remove();
        } else {
          const newImportDeclaration = j.importDeclaration(
            otherSpecifiers,
            path.node.source,
          );

          j(path).replaceWith(newImportDeclaration);
        }
      });

    if (defaultSpecifierLocalName) {
      addNamedImport({
        root,
        j,
        importName: source.to,
        specifier: specifierTo.name,
        localName: defaultSpecifierLocalName,
      });
    }
  }

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default importMapper;
