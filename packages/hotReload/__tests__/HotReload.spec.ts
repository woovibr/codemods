import { defineTest } from '../../../test/testUtils';

describe('HotReload', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'HotReload',
    testFilePrefix: 'simple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'HotReload',
    testFilePrefix: 'complex',
  });
});
