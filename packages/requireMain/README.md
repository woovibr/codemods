# ActionButton codemod

Transforms this:

```js
  if(!module.parent) {
  // some code
  }
```

 to

 ```js
 if(require.main === module) {
   // some code
 }
```

## Usage

find packages/ -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/requireMain/RequireMain.ts
