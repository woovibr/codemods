import path from 'path';

import tempy from 'tempy';
import fs from 'fs-extra';

import { dirEqual } from '../../../test/dirEqual';

// TODO: create utils for working with directory testing
// TODO: move initFixture to utils
const initFixture = async (fixturePath: string) => {
  const cwd = tempy.directory();

  process.chdir(cwd);

  await fs.copy(fixturePath, cwd);

  return cwd;
};

it('should move default simple', async () => {
  const config = {
    from: 'packages/main/src/simple.ts',
    fromPackage: 'packages/main',
    to: 'packages/modules/src/simple.ts',
    toPackage: 'packages/modules',
    toPackageName: '@test/modules',
    defaultName: 'simpleFn',
  };

  const fixturePath = path.join(__dirname, '../__fixtures__/simpleDefaultInput');
  const outputPath = path.join(__dirname, '../__fixtures__/simpleDefaultOutput');

  const cwd = await initFixture(fixturePath);

  try {
    await require('..').moveFileToPackage(config);

    dirEqual(outputPath, cwd);
  } finally {
    console.log(`Deleting ${cwd}`);

    await fs.rm(cwd, { recursive: true, force: true });
  }
});
