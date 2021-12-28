import path from 'path';

export const getRelativePath = (from: string, to: string) => {
  const dir = path.dirname(from);

  return path.join(dir, to);
};
