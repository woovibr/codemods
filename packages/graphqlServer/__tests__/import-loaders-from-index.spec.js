import { defineTest } from 'jscodeshift/dist/testUtils';

defineTest(__dirname, 'import-loaders-from-index');
defineTest(__dirname, 'import-loaders-from-index', {}, 'import-loaders-from-index-2');
