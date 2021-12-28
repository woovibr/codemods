import fs from 'fs';
import path from 'path';

import getExportNamedDeclaration from '../getExportNamedDeclaration';

const defineTest = ({ fixtureName, dirName, excepted, only = false }) => {
  const testName = fixtureName
    ? `transforms correctly using "${fixtureName}" data`
    : 'transforms correctly';

  // eslint-disable-next-line
  const myIt = only ? it.only : it;

  myIt(testName, () => {
    let jscodeshift = require('jscodeshift');
    jscodeshift = jscodeshift.withParser('tsx');

    const extension = '.tsx';
    const fixtureWithExtension = `${fixtureName}${extension}`;
    const fixtureDir = path.join(dirName, '..', '__testfixtures__');
    const fixturePath = path.join(fixtureDir, fixtureWithExtension);
    const source = fs.readFileSync(fixturePath, 'utf8');

    const output = getExportNamedDeclaration(
      {
        path: fixturePath,
        source,
      },
      {
        jscodeshift,
        stats: () => {},
      },
      {},
    );

    expect(output).toEqual(excepted);
  });
};

describe('getExportNamedDeclaration', () => {
  defineTest({
    fixtureName: 'functionDeclaration',
    dirName: __dirname,
    excepted: ['ok'],
  });
  defineTest({
    fixtureName: 'typeAlias',
    dirName: __dirname,
    excepted: ['MyType'],
  });
  defineTest({
    fixtureName: 'variableDeclaration',
    dirName: __dirname,
    excepted: ['myFn'],
  });
  defineTest({
    fixtureName: 'enum',
    dirName: __dirname,
    excepted: ['SOURCE'],
  });
  defineTest({
    fixtureName: 'interface',
    dirName: __dirname,
    excepted: ['IUserNotification'],
  });
});
