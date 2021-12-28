import path from 'path';

export const regexRemoveExtension = /\.[^.]*$/;

export const getRelativePathnameFromConfig = (config) => {
  const toPackage = path.join(config.toPackage, './src');

  const relativePathname = path.relative(toPackage, config.to);
  const relative = `./${relativePathname}`;

  return relative.replace(regexRemoveExtension, '');
};

// from packages/main/src/modules/group/group/jobs/__tests__/groupAddManagers.spec.ts
// to packages/main/src/modules/userNotification/UserNotificationModel.ts
// result ../../../../userNotification/UserNotificationModel
export const getRelativePathname = (
  from: string,
  to: string,
  removeExtension = true,
) => {
  const fromDir = path.dirname(from);

  const relativePathname = path.relative(fromDir, to);

  const importSource = removeExtension
    ? relativePathname.replace(regexRemoveExtension, '')
    : relativePathname;

  // handle same folder
  if (!importSource.includes('./') || !importSource.includes('../')) {
    return `./${importSource}`;
  }

  return importSource;
};

const getValidImportPaths = (importPath: string): string[] => {
  const indexEndRegex = /\/index$/;

  if (!indexEndRegex.test(importPath)) {
    return [importPath];
  }

  return [importPath, path.dirname(importPath)];
};

// ../../models/index === ../../models
export const isSameImport = (from: string, to: string): boolean => {
  const fromPaths = getValidImportPaths(from);
  const toPaths = getValidImportPaths(to);

  // make it functional
  for (const f of fromPaths) {
    for (const t of toPaths) {
      if (f === t) {
        return true;
      }
    }
  }

  return false;
};
