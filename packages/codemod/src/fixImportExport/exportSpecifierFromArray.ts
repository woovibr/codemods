export const exportSpecifierFromArray = (j, specifiers: string[]) =>
  specifiers.map((namedExport) =>
    j.exportSpecifier(j.identifier(namedExport), j.identifier(namedExport)),
  );
