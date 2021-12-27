## @entria/js-codemods [![CircleCI](https://circleci.com/gh/entria/js-codemods.svg?style=svg&circle-token=b3e5c2c1c155d0e044b02bf79fb0236ca92a2feb)](https://circleci.com/gh/entria/js-codemods)

Collection of codemods for Node.js / Javascript used here at [@entria](https://github.com/entria).

### How to run

```bash
npm i -g jscodeshift
git clone https://github.com/entria/js-codemods.git && cd js-codemods
jscodeshift -t transforms/<codemod-script> <file-to-transform>
```

Use the `-d` option for a dry-run and use `-p` to print the output for
comparison.

### Included Transforms

#### GraphQL Server based on entria boilerplate

##### import-loaders-from-index

Changes from

```js
import MyLoaderA from './loader/MyLoaderA';
import MyLoaderB from './loader/MyLoaderB';
```

to

```js
import { MyLoaderA, MyLoaderB } from './loader';
```

```bash
jscodeshift -t transforms/graphql-server/import-loaders-from-index.js <file>
```

#### move-static-loader-methods-to-direct-export

Convert from old boilerplate format (where the loader functions were static methods of the Loader class) to the new format (where each loader function is exported individually).

```bash
jscodeshift -t transforms/graphql-server/move-static-loader-methods-to-direct-export.js <file>
```
