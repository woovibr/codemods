import { FileInfo } from 'jscodeshift';

import { getRelativePathname, isSameImport } from '../getRelativePathname';

import { NamedImportConfig } from './NamedImport';

type RemoveImportWithoutSpecifiers = {
  root: any;
  j: any;
  config: NamedImportConfig;
  source?: string | undefined;
  file: FileInfo;
};
export const removeImportWithoutSpecifiers = ({
  root,
  j,
  config,
  source,
  file,
}: RemoveImportWithoutSpecifiers) => {
  const importWithSpecifiers = root.find(j.ImportDeclaration).filter((path) => {
    if (source) {
      const relative = getRelativePathname(file.path, source);

      if (!isSameImport(path.node.source.value, relative)) {
        return false;
      }
    }

    if (path.node.source.value !== config.newImportName) {
      // import 'isomorphic-fetch';
      if (path.node.importKind !== 'value') {
        return false;
      }

      if (path.node.specifiers.length === 0) {
        return path.node.source.value.includes('/');
      }

      const otherImportSpecifiers = path.node.specifiers.filter((s) => {
        if (s.type === 'ImportNamespaceSpecifier') {
          return true;
        }

        if (s.type === 'ImportDefaultSpecifier') {
          return true;
        }

        return !config.importMapper.includes(s.imported.name);
      });

      if (otherImportSpecifiers.length > 0) {
        return false;
      }

      return true;
    }

    return false;
  });

  importWithSpecifiers.forEach((path) => {
    j(path).remove();
  });
};
