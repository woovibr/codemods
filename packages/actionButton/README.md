# ActionButton codemod

Transforms this:

```jsx
<FlatButton color="secondary" onClick={closeModal} primary={false}>
  Cancelar
</FlatButton>
```
    
 to
 
 ```jsx
<ActionButton variant='text' color="secondary" onClick={closeModal} primary={false}>
  Cancelar
</ActionButton>
```

## Usage

find packages/main/src -iname '*.tsx' -print | xargs jscodeshift -t packages/codemod/src/actionButton/ActionButton.ts
