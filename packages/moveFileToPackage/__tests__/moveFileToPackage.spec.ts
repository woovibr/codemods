import path from 'path';

// TODO: fix `tempy` parsing, jest can't parse modules from dependency, even with babel
// import tempy from 'tempy';
import fs from 'fs-extra';

declare const tempy: any;

const initFixture = (startDir: string) => async (fixturePath: string) => {
  const cwd = tempy.directory();

  process.chdir(startDir);

  await fs.copy(cwd, fixturePath);

  return cwd;
};

it.skip('should move simpleFn', async () => {
  // eslint-disable-next-line
  const config = {
    from: 'packages/main/src/simpleFn.ts',
    fromPackage: 'packages/main',
    to: 'packages/modules/src/simpleFn.ts',
    toPackage: 'packages/modules',
    toPackageName: '@test/modules',
  };

  const fixturePath = path.join(__dirname, '../__fixtures__/simpleNamed');

  const cwd = await initFixture(__dirname)(fixturePath);

  // eslint-disable-next-line
  console.log('cwd: ', cwd);

  expect(1).toBe(1);
});
