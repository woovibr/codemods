# Fixture Undefined codemod

Transforms this:

```jsx
if (!company) {
  company = await getOrCreate(Company, createCompany); 
}
```
    
 to
 
 ```jsx
if (company === undefined) {
  company = await getOrCreate(Company, createCompany);
} 
```

## Usage

find packages/**/src/**/fixture/** -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/fixtureUndefined/FixtureUndefined.ts
