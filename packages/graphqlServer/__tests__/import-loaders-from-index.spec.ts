import { defineTest } from '../../../test/testUtils';

describe('importLoadersFromIndex', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'import-loaders-from-index',
    testFilePrefix: 'import-loaders-from-index',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'import-loaders-from-index',
    testFilePrefix: 'import-loaders-from-index-2',
  });
});
