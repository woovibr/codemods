import { defineTest } from '../../../test/testUtils';

describe('FixtureUndefined', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'FixtureUndefined',
    testFilePrefix: 'simple',
  });
});
