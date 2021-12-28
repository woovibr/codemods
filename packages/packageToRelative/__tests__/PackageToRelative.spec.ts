import { defineTest } from '../../../test/testUtils';

describe('PackageToRelative', () => {
  const simpleOptions = {
    testConfig: {
      packageName: '@repo/modules',
      indexPath: 'packages/main/test/createResource/createGoal.ts',
      importMapper: ['createGoal'],
    },
  };

  defineTest({
    dirName: __dirname,
    transformName: 'PackageToRelative',
    testFilePrefix: 'simple',
    options: simpleOptions,
    inputPath:
      'packages/main/src/modules/goals/goalGroup/mutation/edit/__tests__/GoalGroupEditMutation.spec.ts',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'PackageToRelative',
    testFilePrefix: 'moreThanOne',
    options: simpleOptions,
    inputPath:
      'packages/main/src/modules/goals/goalGroup/mutation/edit/__tests__/GoalGroupEditMutation.spec.ts',
  });
});
