// based on jscodeshift code base
import fs from 'fs';
import path from 'path';
// import prettier from 'prettier';
//
// const prettierConfig = {
//   trailingComma: 'all',
//   singleQuote: true,
//   parser: 'babel-ts',
// };

type RunInlineTest = {
  module: string;
  options: Record<string, unknown>;
  input: string;
  expectedOutput: string;
};
export const runInlineTest = ({
  module,
  options,
  input,
  expectedOutput,
}: RunInlineTest) => {
  // Handle ES6 modules using default export for the transform
  const transform = module.default ? module.default : module;

  // Jest resets the module registry after each test, so we need to always get
  // a fresh copy of jscodeshift on every test run.
  let jscodeshift = require('jscodeshift');
  if (module.parser) {
    jscodeshift = jscodeshift.withParser(module.parser);
  }

  const output = transform(
    input,
    {
      jscodeshift,
      stats: () => {},
    },
    options || {},
  );

  expect((output || '').trim()).toEqual(expectedOutput.trim());

  // TODO - enable prettier on codemod tests
  // if (output) {
  //   console.log('output: ', output);
  //   const outputPrettier = prettier.format(output, prettierConfig);
  //
  //   expect((outputPrettier || '').trim()).toEqual(expectedOutput.trim());
  // } else {
  //   expect(true).toBe(false);
  // }
};

/**
 * Utility function to run a jscodeshift script within a unit test. This makes
 * several assumptions about the environment:
 *
 * - `dirName` contains the name of the directory the test is located in. This
 *   should normally be passed via __dirname.
 * - The test should be located in a subdirectory next to the transform itself.
 *   Commonly tests are located in a directory called __tests__.
 * - `transformName` contains the filename of the transform being tested,
 *   excluding the .js extension.
 * - `testFilePrefix` optionally contains the name of the file with the test
 *   data. If not specified, it defaults to the same value as `transformName`.
 *   This will be suffixed with ".input.js" for the input file and ".output.js"
 *   for the expected output. For example, if set to "foo", we will read the
 *   "foo.input.js" file, pass this to the transform, and expect its output to
 *   be equal to the contents of "foo.output.js".
 * - Test data should be located in a directory called __testfixtures__
 *   alongside the transform and __tests__ directory.
 */
type RunTest = {
  dirName: string;
  transformName: string;
  options: Record<string, unknown>;
  testFilePrefix: string;
  inputPath?: string;
};
export const runTest = ({
  dirName,
  transformName,
  options,
  testFilePrefix,
  inputPath,
}: RunTest) => {
  if (!testFilePrefix) {
    testFilePrefix = transformName;
  }

  const fixtureDir = path.join(dirName, '..', '__testfixtures__');
  const fixtureInputPath = path.join(fixtureDir, `${testFilePrefix}.input.tsx`);
  const source = fs.readFileSync(fixtureInputPath, 'utf8');
  const expectedOutput = fs.readFileSync(
    path.join(fixtureDir, `${testFilePrefix}.output.tsx`),
    'utf8',
  );
  // Assumes transform is one level up from __tests__ directory
  const module = require(path.join(dirName, '..', transformName));

  runInlineTest({
    module,
    options,
    input: {
      path: inputPath || fixtureInputPath,
      source,
    },
    expectedOutput,
  });
};

/**
 * Handles some boilerplate around defining a simple jest/Jasmine test for a
 * jscodeshift transform.
 */
type DefineTest = {
  dirName: string;
  transformName: string;
  options?: Record<string, unknown>;
  testFilePrefix: string;
  only?: boolean;
  skip?: boolean;
  inputPath?: string;
};
export const defineTest = ({
  dirName,
  transformName,
  options = null,
  testFilePrefix,
  only = false,
  skip = false,
  inputPath,
}: DefineTest) => {
  const testName = testFilePrefix
    ? `transforms correctly using "${testFilePrefix}" data`
    : 'transforms correctly';
  describe(transformName, () => {
    const getIt = () => {
      if (only) {
        return it.only;
      }

      if (skip) {
        return it.skip;
      }

      return it;
    };

    const myIt = getIt();

    myIt(testName, () => {
      runTest({ dirName, transformName, options, testFilePrefix, inputPath });
    });
  });
};
