export const addImportToBody = ({ root, j, newImport }) => {
  const imports = root.find(j.ImportDeclaration);

  if (imports.length > 0) {
    j(imports.at(imports.length - 1).get()).insertAfter(newImport); // after the imports
  } else {
    root.get().node.program.body.unshift(newImport); // beginning of file
  }
};
