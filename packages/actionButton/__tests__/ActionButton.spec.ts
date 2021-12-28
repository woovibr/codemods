import { defineTest } from '../../../test/testUtils';

describe('GetObjectId', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'ActionButton',
    testFilePrefix: 'simple',
  });
});
