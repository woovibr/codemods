import fs from 'fs';

const extensions = ['ts', 'js'];

export const getFilename = (filename: string) => {
  // check if filename already has the extension on it
  const ex = filename.split('.').pop();

  if (extensions.includes(ex)) {
    return filename;
  }

  for (const ext of extensions) {
    const fileWithExtension = `${filename}.${ext}`;

    if (fs.existsSync(fileWithExtension)) {
      return fileWithExtension;
    }
  }

  return null;
};
