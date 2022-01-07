import { getRelativePathname, isSameImport } from '@codemods/utils';
import { API, FileInfo, Options } from 'jscodeshift';
import path from 'path';

// TODO: move this codemod to a separated package
const transform = (file: FileInfo, { j }: API, options: Options) => {
  const root = j(file.source);
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  root
    .find(j.ExportNamedDeclaration, (node) => {
      if (!node.source?.value?.toString()) return false;

      const relative = getRelativePathname(file.path, options.from);

      console.log(
        'FIX_PACKAGE_EXPORTS',
        node.source.value.toString(),
        isSameImport(node.source.value.toString(), relative),
      );

      return isSameImport(node.source.value.toString(), relative);
    })
    .replaceWith(({ node }) =>
      j.exportNamedDeclaration(node.declaration, node.specifiers, j.stringLiteral(options.toPackageName)),
    );

  return root.toSource(printOptions);
};

export default transform;
export const parser = 'tsx';
