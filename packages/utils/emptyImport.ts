import { JSCodeshift } from 'jscodeshift';

import { exists } from './exists';

export const emptyImport = (j: JSCodeshift, theImport) =>
  theImport &&
  !exists(theImport.find(j.ImportSpecifier)) &&
  !exists(theImport.find(j.ImportDefaultSpecifier)) &&
  !exists(theImport.find(j.ImportNamespaceSpecifier));
