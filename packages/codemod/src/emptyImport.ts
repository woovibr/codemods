import { JSCodeshift } from 'jscodeshift/src/core';

import { exists } from './utils';

export const emptyImport = (j: JSCodeshift, theImport) =>
  theImport &&
  !exists(theImport.find(j.ImportSpecifier)) &&
  !exists(theImport.find(j.ImportDefaultSpecifier)) &&
  !exists(theImport.find(j.ImportNamespaceSpecifier));
