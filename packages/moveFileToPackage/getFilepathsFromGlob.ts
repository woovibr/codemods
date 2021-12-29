import glob from 'glob';

export const getFilepathsFromGlob = (
  baseDir,
  config: {
    extensions: Array<string>;
    include: Array<string>;
    exclude: Array<string>;
  },
): Array<string> => {
  const { extensions, include, exclude } = config;

  const files = new Set();
  include.forEach((inc) =>
    glob
      .sync(`${inc}/*.+(${extensions.join('|')})`, {
        cwd: baseDir,
        ignore: exclude,
      })
      .forEach((file) => files.add(file)),
  );
  return Array.from(files);
};
