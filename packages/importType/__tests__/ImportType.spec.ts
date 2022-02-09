import { defineTest } from '../../../test/testUtils';

describe('ImportType', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'ImportType',
    testFilePrefix: 'importToImportType',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'ImportType',
    testFilePrefix: 'exportToExportType',
  });

  defineTest({
    dirName: __dirname,
    transformName: 'ImportType',
    testFilePrefix: 'oneOrMoreImports',
  });
});
