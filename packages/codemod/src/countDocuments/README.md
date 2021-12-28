# Default Export to Named Import codemod

Transforms this:

```jsx
(async () => {
  const userCount = await User.count(conditions);
})();
```
    
 to
 
 ```jsx
(async () => {
  const userCount = await User.countDocuments(conditions);
})(); 
```

## Usage

find packages/**/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/countDocuments/CountDocuments.ts
