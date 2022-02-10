# importType codemod

This codemod should turn explicit `import type` statements into `import` statements.

## Usage

jscodeshift -t packages/importType/ImportType.ts <file>

find packages/ -iname '*.ts' -print | xargs jscodeshift -t packages/importType/ImportType.ts
