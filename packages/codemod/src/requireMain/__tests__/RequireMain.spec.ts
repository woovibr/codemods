import { defineTest } from '../../../test/testUtils';

describe('RequireMainCodemod', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'RequireMain',
    testFilePrefix: 'simple',
  });
});
