import { API, FileInfo, Options } from 'jscodeshift';

export function useFragment(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  // TODO - implement transform

  return root.toSource(printOptions);
}

export const parser = 'tsx';
export default useFragment;
