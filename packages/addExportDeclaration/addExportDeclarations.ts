import { API, FileInfo, Options } from 'jscodeshift';

type NamedExport =
  | string
  | {
      exported: string;
      local: string;
    };

export type AddExportConfig = {
  namedExports: NamedExport[];
  relativePathname: string;
};

export const getLocalAndExported = (named: NamedExport) => {
  if (typeof named === 'string') {
    return {
      local: named,
      exported: named,
    };
  }

  return {
    local: named.local,
    exported: named.exported,
  };
};

export const addExportDeclarations = (
  file: FileInfo,
  api: API,
  // eslint-disable-next-line
  options: Options,
) => {
  const j = api.jscodeshift; // alias the jscodeshift API

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  const { config } = options;

  const { namedExports, relativePathname } = config;

  let specifiers = [];
  for (const namedExport of namedExports) {
    const { local, exported } = getLocalAndExported(namedExport);

    const specifier = j.exportSpecifier(
      j.identifier(local),
      j.identifier(exported),
    );

    specifiers = [...specifiers, specifier];
  }

  // TODO - avoid exportDeclaration duplication
  const exportDeclaration = j.exportNamedDeclaration(
    null,
    specifiers,
    j.literal(relativePathname),
  );

  root.get().node.program.body.push(exportDeclaration);

  return root.toSource(printOptions);
};

// make it work directly with jscodeshit
export default addExportDeclarations;
export const parser = 'tsx';
