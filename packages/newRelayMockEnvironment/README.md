# Error Field codemod

Transforms this:

```jsx
const root = withProviders({
  test: 'test',
});
```
    
 to
 
 ```jsx
const environment = createMockEnvironment();
const root = withProviders({
  test: 'test',
  environment
});
```

## Usage

find ../feedback-admin/packages/**/src -iname '*.spec.tsx' -print | xargs jscodeshift -t packages/codemod/src/newRelayMockEnvironment/NewRelayMockEnvironment.ts
