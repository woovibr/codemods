import { defineTest } from '../../../test/testUtils';

describe('LoadableRequire', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'LoadableRequire',
    testFilePrefix: 'simple',
  });
});
