import { defineTest } from '../../../test/testUtils';

describe('NodeInterface', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'NodeInterface',
    testFilePrefix: 'simple',
  });
});
