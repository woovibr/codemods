import { defineTest } from '../../../test/testUtils';

describe('CreateQueryRendererModern', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'CreateQueryRendererModern',
    testFilePrefix: 'simple',
  });
});
