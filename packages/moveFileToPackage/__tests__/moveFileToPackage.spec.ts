import path from 'path';

import tempy from 'tempy';
import fs from 'fs-extra';

import { dirEqual } from '../../../test/dirEqual';

const initFixture = async (fixturePath: string) => {
  const cwd = tempy.directory();

  process.chdir(cwd);

  await fs.copy(fixturePath, cwd);

  return cwd;
};

it('should move simpleFn', async () => {
  const config = {
    from: 'packages/main/src/simpleFn.ts',
    fromPackage: 'packages/main',
    to: 'packages/modules/src/simpleFn.ts',
    toPackage: 'packages/modules',
    toPackageName: '@test/modules',
  };

  const fixturePath = path.join(__dirname, '../__fixtures__/simpleNamedInput');
  const outputPath = path.join(__dirname, '../__fixtures__/simpleNamedOutput');

  const cwd = await initFixture(fixturePath);

  // eslint-disable-next-line
  console.log('cwd: ', cwd);
  console.log('process.cwd: ', process.cwd());

  await require('..').moveFileToPackage(config);

  console.log('dirEqual');

  dirEqual(outputPath, cwd);

  await fs.rm(cwd);
});
