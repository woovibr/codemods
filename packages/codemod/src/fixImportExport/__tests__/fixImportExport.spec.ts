import { defineTest } from '../../../test/testUtils';

const options = {
  testConfig: {
    specifiers: ['BannedEmail', 'BannedEmailModel'],
    to: '@repo/modules',
  },
};

// eslint-disable-next-line
const periodOptions = {
  testConfig: {
    specifiers: ['Period', 'PERIOD'],
    to: '@repo/modules',
  },
};

describe('fixImportExport', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'fixImportExport',
    options,
    testFilePrefix: 'exportDefault',
    // skip: true,
  });
  defineTest({
    dirName: __dirname,
    transformName: 'fixImportExport',
    options,
    testFilePrefix: 'importDefault',
  });
});
