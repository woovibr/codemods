# Move File to Package

This "codemod" move a given file to another package
It fixes all imports references to the new package
It adds the named export on the new package entrypoint (index.ts)

## How it works
- get all named exports from `from` file
- add these named exports to `toPackage`
- copy `from` file `to` file
- run `namedImport` codemod on `fromPackage` to fix imports

## Usage

```bash
yarn w packages/codemod/src/moveFileToPackage/moveFileToPackage.ts --config move.config.js
```

move.config.js example

```jsx
module.exports = {
  from: 'packages/main/src/graphql/type/LocationType.ts',
  fromPackage: 'packages/main',
  to: 'packages/modules/src/address/LocationType.ts',
  toPackage: 'packages/modules',
  toPackageName: '@repo/modules',
  defaultName: 'LocationType',
  namespaceName: null,
  // softNamedImportFromSource: true,
};
```

move a loader config example
```jsx
module.exports = {
  from: 'packages/main/src/modules/adminUser/AdminUserLoader.ts',
  fromPackage: 'packages/main',
  to: 'packages/modules/src/adminUser/AdminUserLoader.ts',
  toPackage: 'packages/modules',
  toPackageName: '@repo/modules',
  defaultName: 'AdminUser',
  namespaceName: 'AdminUserLoader',
  // softNamedImportFromSource: true,
};
```