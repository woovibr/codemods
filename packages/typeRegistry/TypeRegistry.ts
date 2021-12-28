import fs from 'fs';
import { dirname, join } from 'path';
import { API, FileInfo, Options } from 'jscodeshift';

import { getConfig } from '@codemods/utils';
import { addImportToBody } from '@codemods/add-import-to-body';

const cwd = process.cwd();

const defaultConfig = {
  skipLoaderCheck: false,
};

export const loaderExists = (loaderName: string, file) => {
  const loaderImportName = `./${loaderName}`;

  // check if file exists
  const loaderPath = join(
    dirname(join(cwd, file.path)),
    `${loaderImportName}.ts`,
  );

  if (!fs.existsSync(loaderPath)) {
    // eslint-disable-next-line
    console.log('loader not found', {
      path: file.path,
      loaderPath,
    });
    return false;
  }

  return true;
};

export function typeRegistry(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const config = getConfig(options, defaultConfig);

  let typename = null;
  // add imports and call expression
  // eslint-disable-next-line
  const graphqlObjectTypeNode = root
    .find(j.VariableDeclarator)
    .filter((path) => {
      if (path.node.init?.type !== 'NewExpression') {
        return false;
      }

      if (path.node.init.callee?.type !== 'Identifier') {
        return false;
      }

      return path.node.init.callee?.name === 'GraphQLObjectType';
    })
    .forEach((path) => {
      typename = path.node.id.name;
    });

  if (!typename) {
    return root.toSource(printOptions);
  }

  const loaderName = typename.replace('Type', 'Loader');

  if (!config.skipLoaderCheck && !loaderExists(loaderName, file)) {
    return root.toSource(printOptions);
  }

  // import { registerTypeLoader } from '@repo/modules';
  const registerTypeLoaderDeclaration = j.importDeclaration(
    [j.importSpecifier(j.identifier('registerTypeLoader'))],
    j.literal('@repo/modules'),
  );

  addImportToBody({
    root,
    j,
    newImport: registerTypeLoaderDeclaration,
  });

  const hasLoaderImport = root
    .find(j.ImportNamespaceSpecifier)
    .filter((path) => path.node.local.name === loaderName);

  if (hasLoaderImport.length === 0) {
    const loaderImportDeclaration = j.importDeclaration(
      [j.importNamespaceSpecifier(j.identifier(`${loaderName}`))],
      j.literal(`./${loaderName}`),
    );

    addImportToBody({
      root,
      j,
      newImport: loaderImportDeclaration,
    });
  }

  // registerTypeLoader(EngagementType, EngagementLoader.load);
  // eslint-disable-next-line
  const registerExpression = j.expressionStatement(
    j.callExpression(j.identifier('registerTypeLoader'), [
      j.identifier(typename),
      j.memberExpression(j.identifier(loaderName), j.identifier('load')),
    ]),
  );

  root.get().node.program.body.push(registerExpression);

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default transform;
