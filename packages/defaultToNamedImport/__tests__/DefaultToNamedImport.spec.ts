import { defineTest } from '../../../test/testUtils';

describe('DefaultToNamedImport', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'DefaultToNamedImport',
    testFilePrefix: 'simple',
  });
});
