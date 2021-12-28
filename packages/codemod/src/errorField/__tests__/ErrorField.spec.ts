import { defineTest } from '../../../test/testUtils';

describe('ErrorField', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'ErrorField',
    testFilePrefix: 'simple',
  });
});
