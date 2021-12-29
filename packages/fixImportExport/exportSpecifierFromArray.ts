export const exportSpecifierFromArray = (j, specifiers: string[]) =>
  specifiers.map((namedExport) =>
    j.exportSpecifier.from({
      id: j.identifier(namedExport),
      exported: j.identifier(namedExport),
    }),
  );
