import { getRelativePathname, isSameImport } from '@codemods/utils';
import { API, FileInfo, Options } from 'jscodeshift';

// TODO: merge this codemod with addExportDeclaration
// TODO: add support for exporting default too
export const addNamespaceExportDeclaration = (file: FileInfo, { j }: API, options: Options) => {
  const root = j(file.source);
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const { config } = options;

  const { name, relativePathname } = config;

  root.get().node.program.body.push(j.exportAllDeclaration(j.stringLiteral(relativePathname), j.identifier(name)));

  return root.toSource(printOptions);
};
