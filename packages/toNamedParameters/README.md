# ToNamedParameter

transform 

```jsx
export const defineTest = (
  dirName,
  transformName,
  options,
  testFilePrefix,
  only = false,
) => {
  console.log('ok')
}
```

to

```jsx
export const defineTest = ({
  dirName,
  transformName,
  options,
  testFilePrefix,
  only = false,
}) => {
  console.log('ok')
}
```
    
## Usage

find packages/main/src -type f \( -iname \*.ts -o -iname \*.tsx \) -print | xargs jscodeshift -t packages/codemod/src/toNamedParameters/ToNamedParameters.ts --config toNamed.codemod.config.js
