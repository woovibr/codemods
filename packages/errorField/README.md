# Error Field codemod

Transforms this:

```jsx
const field = {
  error: {
    type: GraphQLString,
    resolve: ({ error }) => error,
  },
};
```
    
 to
 
 ```jsx
const field = {
  ...errorField
}; 
```

## Usage

find packages/main/src -iname '*.spec.ts' -print | xargs jscodeshift -t packages/codemod/src/errorField/ErrorField.ts
