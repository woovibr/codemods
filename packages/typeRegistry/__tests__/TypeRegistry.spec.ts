import { defineTest } from '../../../test/testUtils';

const options = {
  testConfig: {
    skipLoaderCheck: true,
  },
};

describe('TypeRegistry', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'TypeRegistry',
    options,
    testFilePrefix: 'simple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'TypeRegistry',
    options,
    testFilePrefix: 'loaderImported',
  });
});
