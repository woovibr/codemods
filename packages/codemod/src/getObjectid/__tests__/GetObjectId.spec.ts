import { defineTest } from '../../../test/testUtils';

describe('GetObjectId', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'GetObjectId',
    testFilePrefix: 'simple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'GetObjectId',
    testFilePrefix: 'args',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'GetObjectId',
    testFilePrefix: 'alreadyImported',
  });
});
