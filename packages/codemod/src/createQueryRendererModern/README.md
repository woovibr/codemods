# createQueryRendererModern codemod

Transforms this:

```jsx
export default createQueryRendererModern(TableSelectionActionModalFragmentContainer, TableSelectionActionModal, config)
```
    
 to
 
 ```jsx
export default createQueryRendererModern(TableSelectionActionModalFragmentContainer, config)
```

## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/createQueryRendererModern/CreateQueryRendererModern.ts
