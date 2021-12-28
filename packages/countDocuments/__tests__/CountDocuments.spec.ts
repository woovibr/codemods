import { defineTest } from '../../../test/testUtils';

describe('CountDocuments', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'CountDocuments',
    testFilePrefix: 'simple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'CountDocuments',
    testFilePrefix: 'normalCount',
  });
});
