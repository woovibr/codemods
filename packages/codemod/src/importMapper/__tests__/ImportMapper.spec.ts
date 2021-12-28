// eslint-disable-next-line
import { defineTest } from '../../../test/testUtils';

const defaultImportToNamedOptions = {
  testConfig: {
    mappings: [
      {
        source: {
          from:
            'packages/main/src/modules/userNotification/UserNotificationModel.ts',
          to: '@repo/modules',
        },
        specifierFrom: {
          type: 'ImportDefaultSpecifier',
          name: '*', // transform imported and local to new name
        },
        specifierTo: {
          type: 'ImportSpecifier',
          name: 'UserNotification',
        },
      },
    ],
  },
};

const inputPath = 'packages/main/src/modules/group/group/jobs/__tests__/groupAddManagers.spec.ts';
const defaultNamedPath = 'packages/main/src/modules/userNotification/mutation/UserNotificationMarkAllAsOpenedMutation.ts';

describe('ImportMapper', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'ImportMapper',
    testFilePrefix: 'simple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'ImportMapper',
    options: defaultImportToNamedOptions,
    testFilePrefix: 'defaultImportToNamed',
    inputPath,
  });
  defineTest({
    dirName: __dirname,
    transformName: 'ImportMapper',
    options: defaultImportToNamedOptions,
    testFilePrefix: 'defaultImportToDifferentNamed',
    inputPath,
  });
  defineTest({
    dirName: __dirname,
    transformName: 'ImportMapper',
    options: defaultImportToNamedOptions,
    testFilePrefix: 'defaultAndNamed',
    inputPath: defaultNamedPath,
  });

  defineTest({
    dirName: __dirname,
    transformName: 'ImportMapper',
    options: defaultImportToNamedOptions,
    testFilePrefix: 'validateSourceSameFolder',
    inputPath:
      'packages/main/src/modules/userNotification/UserNotificationLoader.ts',
  });

  const namespaceOptions = {
    testConfig: {
      mappings: [
        {
          source: {
            from: 'packages/main/src/loader/IndustryLoader.ts',
            to: '@repo/modules',
          },
          specifierFrom: {
            type: 'ImportNamespaceSpecifier',
          },
          specifierTo: {
            type: 'ImportSpecifier',
            name: 'IndustryLoader',
          },
        },
      ],
    },
  };

  defineTest({
    dirName: __dirname,
    transformName: 'ImportMapper',
    options: namespaceOptions,
    testFilePrefix: 'namespace',
    inputPath:
      'packages/main/src/graphql-console/mutation/IndustryAddMutation.ts',
  });
});
