import { defineTest } from '../../../test/testUtils';

describe('NewRelayMockEnvironment', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'NewRelayMockEnvironment',
    testFilePrefix: 'simpleDefault',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'NewRelayMockEnvironment',
    testFilePrefix: 'testDefault',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'NewRelayMockEnvironment',
    testFilePrefix: 'relayUtilsImportDefault',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'NewRelayMockEnvironment',
    testFilePrefix: 'checkParentWithProviders',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'NewRelayMockEnvironment',
    testFilePrefix: 'changeEnvironmentWaitFor',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'NewRelayMockEnvironment',
    testFilePrefix: 'idempotencyDefault',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'NewRelayMockEnvironment',
    testFilePrefix: 'environmentImport',
  });
});
