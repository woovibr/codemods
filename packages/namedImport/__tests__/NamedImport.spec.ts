import { defineTest } from '../../../test/testUtils';

// eslint-disable-next-line
const userLoaderTestOptions = {
  testConfig: {
    importMapper: ['GRAPHQL_TYPE'],
    newImportName: '@repo/modules',
  },
};

const manyImportOptions = {
  testConfig: {
    importMapper: ['buildXlsxFile'],
    newImportName: '@repo/modules',
  },
};

describe('NamedImport', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    testFilePrefix: 'simple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    testFilePrefix: 'multiple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    testFilePrefix: 'alreadyImported',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    testFilePrefix: 'unrelatedImports',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    testFilePrefix: 'localName',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    options: userLoaderTestOptions,
    testFilePrefix: 'userLoader',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    testFilePrefix: 'singleUnrelatedImports',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    testFilePrefix: 'singleNamedImport',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    options: manyImportOptions,
    testFilePrefix: 'manyImports',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    options: manyImportOptions,
    testFilePrefix: 'validImport',
  });

  const validateSourceOptions = {
    testConfig: {
      importMapper: ['IUserNotification', 'SOURCE'],
      newImportName: '@repo/modules',
      fromSource:
        'packages/main/src/modules/userNotification/UserNotificationModel.ts',
    },
  };

  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    options: validateSourceOptions,
    testFilePrefix: 'validImport',
    inputPath: 'packages/main/test/createRows.ts',
  });

  const sourceRelativeMismatchOptions = {
    testConfig: {
      importMapper: ['IAdminUser'],
      newImportName: '@repo/modules',
      fromSource: 'packages/main/src/modules/adminUser/AdminUserModel.ts',
    },
  };

  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    options: sourceRelativeMismatchOptions,
    testFilePrefix: 'sourceRelativeMismatch',
    inputPath: 'packages/main/src/types.ts',
  });

  const sourceIndex = {
    testConfig: {
      importMapper: ['User', 'Company'],
      newImportName: '@repo/modules',
      fromSource: 'packages/main/src/models/index.ts',
    },
  };

  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    options: sourceIndex,
    testFilePrefix: 'sourceIndex',
    inputPath: 'packages/main/src/modules/middleware/amIMyself.ts',
  });

  const differentLocalName = {
    testConfig: {
      importMapper: ['RoleGroup'],
      newImportName: '@repo/modules',
      fromSource: 'packages/main/src/models/index.ts',
    },
  };

  defineTest({
    dirName: __dirname,
    transformName: 'NamedImport',
    options: differentLocalName,
    testFilePrefix: 'differentLocalName',
    inputPath:
      'packages/main/src/modules/permissions/roleGroup/RoleGroupLoader.ts',
  });
});
