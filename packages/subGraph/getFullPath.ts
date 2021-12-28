import path from 'path';

const cwd = process.cwd();

export const getFullPath = (filename: string) => {
  if (path.isAbsolute(filename)) {
    return filename;
  }

  return path.join(cwd, filename);
};
