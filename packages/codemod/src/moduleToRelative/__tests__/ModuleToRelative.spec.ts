import { defineTest } from '../../../test/testUtils';

describe('ModuleToRelative', () => {
  const simpleOptions = {
    testConfig: {
      packageName: '@repo/modules',
      indexPath: 'packages/modules/src/index.ts',
    },
  };

  defineTest({
    dirName: __dirname,
    transformName: 'ModuleToRelative',
    testFilePrefix: 'simple',
    options: simpleOptions,
    inputPath: 'packages/modules/src/i18n/useTranslation.ts',
    skip: true,
  });

  defineTest({
    dirName: __dirname,
    transformName: 'ModuleToRelative',
    testFilePrefix: 'default',
    options: simpleOptions,
    inputPath: 'packages/modules/src/middleware/amIMyself.ts',
    skip: true,
  });

  defineTest({
    dirName: __dirname,
    transformName: 'ModuleToRelative',
    testFilePrefix: 'alreadyImported',
    options: simpleOptions,
    inputPath:
      'packages/modules/src/logid/answer/jobs/sendAnswerWithSymptomsJob.ts',
    skip: true,
  });
});
