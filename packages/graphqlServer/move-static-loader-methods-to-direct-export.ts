// http://astexplorer.net/

import { API, FileInfo, Options } from 'jscodeshift';

// https://github.com/benjamn/ast-types
export const parser = 'tsx';
export default (fileInfo: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift;

  const { source } = fileInfo;
  const ast = j(fileInfo.source);

  const program = ast.find(j.Program);
  const defaultExport = program.find(j.ExportDefaultDeclaration);
  const defaultExportClassBody = defaultExport.find(j.ClassBody);

  // there is no default exported class
  if (!defaultExportClassBody.length) {
    return source;
  }

  const className = defaultExport.nodes()[0].declaration.id.name;
  const membersRemovedFromClass = ['viewerCanSee'];

  // copied from
  // https://github.com/cpojer/js-codemod/blob/90a0081cabfcf371486d126d17fe8f0e8333ce7b/transforms/arrow-function.js#L7
  const getBodyStatement = (fn) => {
    if (fn.body.type === 'BlockStatement' && fn.body.body.length === 1) {
      const inner = fn.body.body[0];
      const comments = (fn.body.comments || []).concat(inner.comments || []);

      if (options['inline-single-expressions'] && inner.type === 'ExpressionStatement') {
        inner.expression.comments = (inner.expression.comments || []).concat(comments);
        return inner.expression;
      }
      if (inner.type === 'ReturnStatement') {
        inner.argument.comments = (inner.argument.comments || []).concat(comments);
        return inner.argument;
      }
    }
    return fn.body;
  };

  const createArrowFunctionExpression = (fn) => {
    const arrowFunction = j.arrowFunctionExpression(fn.params, getBodyStatement(fn), false);
    arrowFunction.async = fn.async;
    arrowFunction.comments = fn.comments;
    return arrowFunction;
  };

  const createNamedExportForItem = (item) => {
    const { node } = item;

    if (node.static) {
      const currentExportNamedDeclarations = program.find(j.ExportNamedDeclaration);
      const nodeToInsertAfter = currentExportNamedDeclarations.length
        ? currentExportNamedDeclarations.at(-1)
        : defaultExport;

      nodeToInsertAfter.insertAfter(
        j.exportNamedDeclaration(
          j.variableDeclaration('const', [
            j.variableDeclarator(
              j.identifier(node.key.name),
              createArrowFunctionExpression(node.type === 'ClassProperty' ? node.value : node),
            ),
          ]),
        ),
      );

      membersRemovedFromClass.push(node.key.name);

      item.prune();
    }
  };

  const classProperties = defaultExportClassBody.find(j.ClassProperty);
  const classMethods = defaultExportClassBody.find(j.ClassMethod);
  const hasGetLoader = !!classProperties.filter(({ node }) => node.key.name === 'getLoader').length;

  // there is no getLoader, this probably is not a loader file.
  if (!hasGetLoader) {
    return source;
  }

  classProperties.forEach(createNamedExportForItem);
  classMethods.forEach((item) => {
    const { node } = item;

    if (node.kind === 'constructor') {
      return;
    }

    if (node.key.name === 'viewerCanSee') {
      defaultExport.insertAfter(
        j.variableDeclaration('const', [
          j.variableDeclarator(j.identifier('viewerCanSee'), createArrowFunctionExpression(node)),
        ]),
      );
      item.prune();
      return;
    }

    createNamedExportForItem(item);
  });

  // fix member expressions
  program.find(j.MemberExpression).forEach((item) => {
    const { node } = item;

    if (node.object.name === className && membersRemovedFromClass.indexOf(node.property.name) !== -1) {
      j(item).replaceWith(j.identifier(node.property.name));
    }
  });

  return ast.toSource({ quote: 'single', lineTerminator: '\n' });
};
