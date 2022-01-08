/**
 * 1. find all named and default export of the from file
 * 2. copy file to new path
 * cp <from> <to>
 * named and export default
 * 3. consume named and default export directly from new package
 * call namedImport transform on <fromPackage>/src/**.ts and **.tsx
 * 4. export named and export default on <toPackage>/src/index.ts
 */
import path from 'path';
import util from 'util';
import fs from 'fs';
import jscodeshift from 'jscodeshift';
import Runner from 'jscodeshift/src/Runner';
import writeFileAtomicCallback from 'write-file-atomic';

import { AddExportConfig, addExportDeclarations } from '@codemods/add-export-declaration';
import { getExportNamedDeclaration } from '@codemods/get-export-name-declaration';
import { getFullPath } from '@codemods/sub-graph/getFullPath';
import { debugConsole, getRelativePathnameFromConfig } from '@codemods/utils';

import { getFilepathsFromGlob } from './getFilepathsFromGlob';
import { createFoldersRecursive } from './createFoldersRecursive';
import { addNamespaceExportDeclaration } from './addNamespaceExport';

const cwd = process.cwd();

const readFile = util.promisify(fs.readFile);
const copyFile = util.promisify(fs.copyFile);
const unlink = util.promisify(fs.unlink);
const writeFileAtomic = util.promisify(writeFileAtomicCallback);

const parser = 'tsx';
const j = jscodeshift.withParser(parser);

type MoveFileConfig = {
  from: string;
  fromPackage: string;
  to: string;
  toPackage: string;
  toPackageName: string;
  defaultName?: string;
  namespaceName?: string;
  softNamedImportFromSource?: boolean;
};
const pathJoinKeys = ['from', 'fromPackage', 'to', 'toPackage'];

const getConfig = (config: MoveFileConfig): MoveFileConfig => {
  const configPath = Object.keys(config).reduce((acc, key) => {
    if (pathJoinKeys.includes(key)) {
      return {
        ...acc,
        [key]: getFullPath(config[key]),
      };
    }

    return {
      ...acc,
      [key]: config[key],
    };
  }, {});

  return configPath;
};

// eslint-disable-next-line
const empty = () => {};

const stats = (name, quantity) => {
  // eslint-disable-next-line
  quantity = typeof quantity !== 'number' ? 1 : quantity;
  // eslint-disable-next-line
  console.log('update: ', {
    name,
    quantity,
  });
};

// eslint-disable-next-line
const report = (file, msg) => {};

export const getNamedExportsFromFile = async (file: string) => {
  const content = await readFile(file);
  const source = content.toString();

  const options = {};

  // a "transform" that extract named exports
  const namedExports = getExportNamedDeclaration(
    {
      path: file,
      source,
    },
    {
      j,
      jscodeshift: j,
      stats: options.dry ? stats : empty,
      report: (msg) => report(file, msg),
    },
    options,
  );

  return namedExports;
};

export const addExports = async (file: string, exportConfig: AddExportConfig) => {
  const content = await readFile(file);
  const source = content.toString();

  const options = {
    config: exportConfig,
  };

  const out = addExportDeclarations(
    {
      path: file,
      source,
    },
    {
      j,
      jscodeshift: j,
      stats: options.dry ? stats : empty,
      report: (msg) => report(file, msg),
    },
    options,
  );

  return out;
};

export const fixNamedImports = async ({ filesToCodemod, config }) => {
  // named import codemod
  const addNamedImportPath = path.join(__dirname, '../namedImport/NamedImport.ts');

  const options = {
    transform: addNamedImportPath,
    verbose: 0,
    dry: false,
    print: false,
    babel: true,
    extensions: 'js',
    ignorePattern: [],
    ignoreConfig: [],
    runInBand: false,
    silent: false,
    parser: 'babel',
    stdin: false,
    testConfig: config,
  };

  const r = await Runner.run(addNamedImportPath, filesToCodemod, options);

  // eslint-disable-next-line
  console.log('runner namedImport finished: ', r);
};

export const fixDefaultNamespaceImports = async ({ filesToCodemod, config }) => {
  // default/namespace import codemod
  const importMapperPath = path.join(__dirname, '../importMapper/ImportMapper.ts');

  const options = {
    transform: importMapperPath,
    verbose: 0,
    dry: false,
    print: false,
    babel: true,
    extensions: 'js',
    ignorePattern: [],
    ignoreConfig: [],
    runInBand: false,
    silent: false,
    parser: 'babel',
    stdin: false,
    testConfig: config,
  };

  const r = await Runner.run(importMapperPath, filesToCodemod, options);

  // eslint-disable-next-line
  console.log('runner default/namespace import finished: ', r);
};

export const fixModuleRelativeImports = async (config: MoveFileConfig, configWithoutFullpath: MoveFileConfig) => {
  const toSrc = path.join(config.toPackage, './src');
  const toSrcGlob = `${toSrc}/**`;

  const filesToCodemod = getFilepathsFromGlob(cwd, {
    extensions: ['ts', 'tsx', 'spec.ts'],
    include: [toSrcGlob],
  });

  const indexPath = `${configWithoutFullpath.toPackage}/src/index.ts`;

  const testConfig = {
    packageName: config.toPackageName,
    indexPath,
  };

  // fix own module reference
  const moduleToRelativePath = path.join(__dirname, '../moduleToRelative/ModuleToRelative.ts');

  const options = {
    transform: moduleToRelativePath,
    verbose: 0,
    dry: false,
    print: false,
    babel: true,
    extensions: 'js',
    ignorePattern: [],
    ignoreConfig: [],
    runInBand: false,
    silent: false,
    parser: 'babel',
    stdin: false,
    testConfig,
  };

  const r = await Runner.run(moduleToRelativePath, filesToCodemod, options);

  // eslint-disable-next-line
  console.log('runner moduleToRelativePath finished: ', r);
};

export const fixPackageExports = async (filesToCodemod: string[], config: MoveFileConfig) => {
  const fixPackageExportsPath = path.join(__dirname, './fixPackageExports.ts');

  const options = {
    transform: fixPackageExportsPath,
    verbose: 0,
    dry: false,
    print: false,
    babel: true,
    extensions: 'js',
    ignorePattern: [],
    ignoreConfig: [],
    runInBand: false,
    silent: false,
    parser: 'babel',
    stdin: false,
    testConfig: config,
    config,
  };

  const r = await Runner.run(fixPackageExportsPath, filesToCodemod, options);

  // eslint-disable-next-line
  console.log('runner fixPackageExports finished: ', r);
};

export const addNamespaceExport = async (file: string, exportConfig) => {
  const content = await readFile(file);
  const source = content.toString();

  const options = {
    config: exportConfig,
  };

  const out = addNamespaceExportDeclaration(
    {
      path: file,
      source,
    },
    {
      j,
      jscodeshift: j,
      stats: options.dry ? stats : empty,
      report: (msg) => report(file, msg),
    },
    options,
  );

  return out;
};

export const moveFileToPackage = async (configWithoutFullpath: MoveFileConfig) => {
  const config = getConfig(configWithoutFullpath);

  // eslint-disable-next-line
  console.log('running with config', {
    config,
  });

  // get named export
  const fromNamedExport = await getNamedExportsFromFile(config.from);

  const toPackageIndex = path.join(config.toPackage, './src/index.ts');

  const namedExports = config.defaultName
    ? [
        {
          local: 'default',
          exported: config.defaultName,
        },
        ...fromNamedExport,
      ]
    : fromNamedExport;

  // eslint-disable-next-line
  console.log({
    namedExports,
  });

  let out;

  if (!config.namespaceName) {
    const addExportConfig = {
      namedExports,
      relativePathname: getRelativePathnameFromConfig(config),
    };

    // add named export
    out = await addExports(toPackageIndex, addExportConfig);

    // check if the source is the same
    // out === source
  } else {
    const addNamespaceExportConfig = {
      name: config.namespaceName,
      relativePathname: getRelativePathnameFromConfig(config),
    };

    out = await addNamespaceExport(toPackageIndex, addNamespaceExportConfig);
  }

  // save new named exports on new module index file
  fs.writeFileSync(toPackageIndex, out);
  // await writeFileAtomic(toPackageIndex, out);

  // eslint-disable-next-line
  console.log(`${toPackageIndex} updated with new exports`);

  // copy from -> to
  // create all folders recursive if needed
  createFoldersRecursive(config.to);
  await copyFile(config.from, config.to);

  // eslint-disable-next-line
  console.log(`${config.from} copied to ${config.to}`);

  const fromSrc = path.join(config.fromPackage, './src');
  // const fromSrc = path.join(config.fromPackage, './src/graphql/schema');
  const fromSrcGlob = `${fromSrc}/**`;

  const fromTest = path.join(config.fromPackage, './test');
  const fromTestGlob = `${fromTest}/**`;

  const filesToCodemod = getFilepathsFromGlob(cwd, {
    extensions: ['ts', 'tsx', 'spec.ts'],
    include: [fromSrcGlob, fromTestGlob],
  });

  if (config.defaultName) {
    const defaultImportConfig = {
      mappings: [
        {
          source: {
            from: config.from, // 'packages/main/src/modules/userNotification/UserNotificationModel.ts',
            to: config.toPackageName, // '@repo/modules',
          },
          specifierFrom: {
            type: 'ImportDefaultSpecifier',
            name: '*', // transform imported and local to new name
          },
          specifierTo: {
            type: 'ImportSpecifier',
            name: config.defaultName, // 'UserNotification',
          },
        },
      ],
    };
    debugConsole({
      defaultImportConfig,
    });
    await fixDefaultNamespaceImports({
      filesToCodemod,
      config: defaultImportConfig,
    });
  }

  if (config.namespaceName) {
    const namespaceImportConfig = {
      mappings: [
        {
          source: {
            from: config.from, // 'packages/main/src/modules/userNotification/UserNotificationLoader.ts',
            to: config.toPackageName, // '@repo/modules',
          },
          specifierFrom: {
            type: 'ImportNamespaceSpecifier',
          },
          specifierTo: {
            type: 'ImportSpecifier',
            name: config.namespaceName, // 'UserNotificationLoader',
          },
        },
      ],
    };
    debugConsole({
      namespaceImportConfig,
    });
    await fixDefaultNamespaceImports({
      filesToCodemod,
      config: namespaceImportConfig,
    });
  } else {
    // named import codemod
    const namedImportConfig = {
      importMapper: fromNamedExport,
      newImportName: config.toPackageName,
      fromSource: config.softNamedImportFromSource ? null : config.from,
    };
    await fixNamedImports({
      filesToCodemod,
      config: namedImportConfig,
    });
  }

  // fix internal imports
  await fixModuleRelativeImports(config, configWithoutFullpath);

  await fixPackageExports(filesToCodemod, config);

  await unlink(config.from);
};
