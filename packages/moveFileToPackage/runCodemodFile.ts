import util from 'util';
import fs from 'fs';

import jscodeshift from 'jscodeshift';

const readFile = util.promisify(fs.readFile);

// eslint-disable-next-line
const empty = () => {};

const stats = (name, quantity) => {
  // eslint-disable-next-line
  quantity = typeof quantity !== 'number' ? 1 : quantity;
  // eslint-disable-next-line
  console.log('update: ', {
    name,
    quantity,
  });
};

// eslint-disable-next-line
const report = () => {};

const parser = 'tsx';
const j = jscodeshift.withParser(parser);

export const runCodemodFile = async (codemodFn: Function, filename: string) => {
  const content = await readFile(filename);
  const source = content.toString();

  const options = {};

  return codemodFn(
    {
      path: filename,
      source,
    },
    {
      j,
      jscodeshift: j,
      stats: options.dry ? stats : empty,
      report: (msg) => report(file, msg),
    },
    options,
  );
};
