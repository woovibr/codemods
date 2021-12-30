import fs from 'fs';
import path from 'path';

export const dirEqual = (expected: string, actual: string) => {
  const actualStat = fs.statSync(actual);
  const expectedStat = fs.statSync(expected);

  if (expectedStat.isDirectory()) {
    expect(actualStat.isDirectory()).toBe(true);

    const expectedContent = fs.readdirSync(expected);
    const actualContent = fs.readdirSync(actual);

    expect(actualContent).toStrictEqual(expectedContent);

    expectedContent.forEach((expectedChildren, i) =>
      dirEqual(path.join(expected, expectedChildren), path.join(actual, actualContent[i])),
    );
  } else if (expectedStat.isFile()) {
    expect(actualStat.isFile()).toBe(true);

    const expectedOutput = fs.readFileSync(expected, 'utf-8');
    const actualOutput = fs.readFileSync(actual, 'utf-8');

    expect((actualOutput || '').trim()).toEqual(expectedOutput.trim());
  } else {
    // eslint-disable-next-line no-console
    console.log(`Unexpected type of "${expected}", it's not directory or file.`);
  }
};
