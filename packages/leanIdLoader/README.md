# Error Field codemod

Transforms this:

```jsx
this.id = data.id;
```
    
 to
 
 ```jsx
this.id = data.id || data._id; 
```

## Usage

find packages/main/src -iname '*.spec.ts' -print | xargs jscodeshift -t packages/codemod/src/leanIdLoader/LeanIdLoader.ts
