# GetObjectId codemod

Transforms this:

```jsx
fromGlobalId(id).id
```
    
 to
 
 ```jsx
getObjectId(id) 
```

## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/getObjectid/GetObjectId.ts
