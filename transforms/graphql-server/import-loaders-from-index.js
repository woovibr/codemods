import { lstatSync, readdirSync } from 'fs';
import { basename, dirname, join } from 'path';

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const getLoaderFolderForPath = (filepath, levels = 0) => {
  const currentDirectoryPath = dirname(filepath);
  const directories = getDirectories(currentDirectoryPath);

  // ugly, but works, we don't want to search all the way to the top
  if (levels > 6) {
    throw new Error('Cannot find loader folder');
  }

  const hasFoundLoaderPath = directories.some(path => basename(path) === 'loader');

  if (hasFoundLoaderPath) {
    return levels > 0 ? `${'../'.repeat(levels)}loader` : './loader';
  }
  return getLoaderFolderForPath(currentDirectoryPath, levels + 1);
};

export const parser = 'flow';
export default (fileInfo, api) => {
  const j = api.jscodeshift;

  const source = fileInfo.source;
  const ast = j(fileInfo.source);

  const program = ast.find(j.Program);
  const importDeclarations = program.find(j.ImportDeclaration);

  const loaderFolder = getLoaderFolderForPath(fileInfo.path);

  // there is no import on this file
  if (!importDeclarations.length) {
    return source;
  }

  // let's find the ./loader import
  let loaderIndexImport = importDeclarations.filter((item) => {
    const { node } = item;

    return node.source.value.match(/\.\/loader$/);
  });

  const loaderImports = importDeclarations.filter((item) => {
    const { node } = item;

    return node.source.value.match(/\.\/loader\//);
  });

  loaderImports.forEach((item) => {
    const importDefaultSpecifier = j(item).find(j.ImportDefaultSpecifier).nodes();

    if (!importDefaultSpecifier.length) {
      return;
    }

    const identifierName = importDefaultSpecifier[0].local.name;

    if (!loaderIndexImport.length) {
      loaderIndexImport = j.importDeclaration(
        [j.importSpecifier(j.identifier(identifierName))],
        j.literal(loaderFolder),
      );
      importDeclarations.at(-1).insertBefore(loaderIndexImport);
      loaderIndexImport = j(loaderIndexImport);
    } else {
      loaderIndexImport.get('specifiers').value.push(j.importSpecifier(j.identifier(identifierName)));
    }

    item.prune();
  });

  // sort imports on asc order
  loaderIndexImport.get('specifiers').value.sort((a, b) => {
    const objA = a.local || a.imported;
    const objB = b.local || b.imported;
    return objA.name > objB.name;
  });

  return ast.toSource({ quote: 'single', lineTerminator: '\n' });
};
