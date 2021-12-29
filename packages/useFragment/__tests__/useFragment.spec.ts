import { defineTest } from '../../../test/testUtils';

describe('useFragment', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'useFragment',
    testFilePrefix: 'simple',
    skip: true,
  });
});
