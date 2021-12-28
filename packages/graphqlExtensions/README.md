# GraphQL Extensions codemod

Transforms this:

```jsx
export default {
  ...mutation,
  authenticatedOnly: true,
};
```
    
 to
 
 ```jsx
export default {
  ...mutation,
   extensions: {
       authenticatedOnly: true,
    },
}; 
```

## Usage

find packages/main/src -iname '*.spec.ts' -print | xargs jscodeshift -t packages/codemod/src/graphqlExtensions/GraphqlExtensions.ts
