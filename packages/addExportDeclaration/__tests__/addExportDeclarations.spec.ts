import { defineTest } from '../../../test/testUtils';

const options = {
  config: {
    namedExports: ['Sheets', 'buildXlsxFile'],
    relativePathname: './dataExport/buildXlsxFile',
  },
};

const optionsDefault = {
  config: {
    namedExports: [
      {
        local: 'default',
        exported: 'QrCodeBulkPrintType',
      },
      'QrCodeBulkPrintConnection',
    ],
    relativePathname: './logid/qrcodeBulkPrint/QrCodeBulkPrintType',
  },
};

describe('addExportDeclarations', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'addExportDeclarations',
    options,
    testFilePrefix: 'simple',
    // skip: true,
    only: true,
  });
  defineTest({
    dirName: __dirname,
    transformName: 'addExportDeclarations',
    options: optionsDefault,
    testFilePrefix: 'default',
    // skip: true,
  });
});
