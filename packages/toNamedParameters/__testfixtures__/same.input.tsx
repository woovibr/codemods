import { defineTest } from '../../../test/testUtils';

const options = {
  testConfig: {
    callee: 'defineTest',
    parameters: [
      'dirName',
      'transformName',
      'options',
      'testFilePrefix',
      'only',
    ],
  },
};

describe('ToNamedParameters', () => {
  defineTest(__dirname, 'ToNamedParameters', options, 'call');
});
