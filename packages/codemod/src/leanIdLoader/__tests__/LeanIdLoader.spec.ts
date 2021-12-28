import { defineTest } from '../../../test/testUtils';

describe('LeanIdLoader', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'LeanIdLoader',
    testFilePrefix: 'simple',
  });
});
