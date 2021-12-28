import { API, FileInfo, Options } from 'jscodeshift';

import { addNamedImport } from '../addNamedImport';
import path from 'ast-types/lib/path';
// import path from 'ast-types/lib/path';

const hasIdLoaderExpression = (node) => {
  if (node.left.type !== 'MemberExpression') {
    return false;
  }

  if (node.left.object.type !== 'ThisExpression') {
    return false;
  }

  if (node.left.property.type !== 'Identifier') {
    return false;
  }

  if (node.left.property.name !== 'id') {
    return false;
  }

  if (node.right.type !== 'MemberExpression') {
    return false;
  }

  if (node.right.object.type !== 'Identifier') {
    return false;
  }

  if (node.right.object.name !== 'data') {
    return false;
  }

  if (node.right.property.type !== 'Identifier') {
    return false;
  }

  if (node.right.property.name !== 'id') {
    return false;
  }

  return true;
};

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  root
    .find(j.AssignmentExpression)
    .filter((path) => {
      const { node } = path;

      return hasIdLoaderExpression(node);
    })
    .forEach((path) => {
      const { node } = path;

      if (!hasIdLoaderExpression(node)) {
        return;
      }

      const { left } = node;

      const newLeft = j.memberExpression(
        j.thisExpression(),
        j.identifier(left.property.name),
      );

      const newRight = j.logicalExpression(
        '||',
        j.memberExpression(j.identifier('data'), j.identifier('id')),
        j.memberExpression(j.identifier('data'), j.identifier('_id')),
      );

      const newAssigment = j.assignmentExpression('=', newLeft, newRight);

      j(path).replaceWith(newAssigment);
    });

  return root.toSource(printOptions);
}

module.exports = transform;
module.exports.parser = 'tsx';
