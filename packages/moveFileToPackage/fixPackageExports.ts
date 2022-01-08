import { getRelativePathname, isSameImport } from '@codemods/utils';
import { API, FileInfo, Options } from 'jscodeshift';

// TODO: move this codemod to a separated package
const transform = (file: FileInfo, { j }: API, options: Options) => {
  const root = j(file.source);
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const { config } = options;

  let shouldAddNamespaceImport = false;

  /**
   * TODO: Add support for multiples named exports from the same file
   * export { someFunction } from './something';
   * export { anotherFunction } from './something';
   */
  /**
   * TODO: Add support for named export with types
   * export type { SomeType } from './something';
   *
   * Can be transformed to:
   * export type SomeType = Something.SomeType;
   */
  root
    .find(j.ExportNamedDeclaration, (node) => {
      if (!node.source?.value?.toString()) return false;

      const relative = getRelativePathname(file.path, config.from);

      return isSameImport(node.source.value.toString(), relative);
    })
    .replaceWith(({ node }) => {
      if (!config.namespaceName) {
        return j.exportNamedDeclaration(node.declaration, node.specifiers, j.stringLiteral(config.toPackageName));
      }

      shouldAddNamespaceImport = true;

      const hasNamespaceSpecifier = !!node.specifiers.find(
        (specifier) => specifier.type === 'ExportNamespaceSpecifier',
      );

      if (hasNamespaceSpecifier) {
        return j.exportNamedDeclaration(null, [
          j.exportSpecifier.from({
            exported: j.identifier(config.namespaceName),
            local: j.identifier(config.namespaceName),
          }),
        ]);
      }

      return j.exportNamedDeclaration(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.objectPattern(
              node.specifiers.map((specifier) =>
                j.objectProperty.from({
                  key: specifier.local || specifier.exported,
                  value: specifier.exported,
                  shorthand: true,
                }),
              ),
            ),
            j.identifier(config.namespaceName),
          ),
        ]),
      );
    });

  root
    .find(j.ExportAllDeclaration, (node) => {
      if (!node.source?.value?.toString()) return false;

      const relative = getRelativePathname(file.path, config.from);

      return isSameImport(node.source.value.toString(), relative);
    })
    .replaceWith(() =>
      j.exportNamedDeclaration(null, [
        j.exportSpecifier(j.identifier(config.namespaceName), j.identifier(config.namespaceName)),
      ]),
    );

  if (shouldAddNamespaceImport) {
    root
      .get()
      .node.program.body.unshift(
        j.importDeclaration(
          [j.importSpecifier(j.identifier(config.namespaceName))],
          j.stringLiteral(config.toPackageName),
        ),
      );
  }

  return root.toSource(printOptions);
};

export default transform;
export const parser = 'tsx';
