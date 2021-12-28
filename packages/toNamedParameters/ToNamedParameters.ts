import { API, FileInfo, Options } from 'jscodeshift';

import { getConfig } from '@codemods/utils';

const defaultConfig = {
  callee: null,
  parameters: [],
};

export function toNamedParameters(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig(options, defaultConfig);

  if (!config.callee) {
    // eslint-disable-next-line
    console.log('wrong config: ', config);
    return;
  }

  const isValidCallExpression = (node) => {
    if (node.callee.name !== config.callee) {
      return false;
    }

    if (node.arguments.length === 1) {
      return false;
    }

    return true;
  };

  const getCallExpressionFromExpressionStatement = (node) => {
    if (node.expression.type === 'CallExpression') {
      return node.expression;
    }

    if (node.expression.type === 'AwaitExpression') {
      return node.expression.argument;
    }

    return null;
  };

  root
    .find(j.ExpressionStatement)
    .filter((path) => {
      const callExpressionNode = getCallExpressionFromExpressionStatement(
        path.node,
      );

      if (callExpressionNode) {
        return isValidCallExpression(callExpressionNode);
      }

      return false;
    })
    .forEach((path) => {
      const callExpressionNode = getCallExpressionFromExpressionStatement(
        path.node,
      );

      const properties = callExpressionNode.arguments
        .map((arg, i) => {
          if (arg.type === 'NullLiteral') {
            return null;
          }

          // StringLiteral
          return j.objectProperty(j.identifier(config.parameters[i]), arg);
        })
        .filter((arg) => !!arg);

      const obj = j.objectExpression(properties);

      const newExpr = j.expressionStatement(
        j.callExpression(callExpressionNode.callee, [obj]),
      );

      if (path.node.expression.type === 'CallExpression') {
        j(path).replaceWith(newExpr);
      } else if (path.node.expression.type === 'AwaitExpression') {
        const awaitExpression = j.expressionStatement(
          j.awaitExpression(j.callExpression(callExpressionNode.callee, [obj])),
        );

        j(path).replaceWith(awaitExpression);
      }
    });

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default toNamedParameters;
