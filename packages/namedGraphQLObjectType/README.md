# NamedGraphQLObjectType

transform this 

```jsx
export default new GraphQLObjectType({
  name: 'Awesome',
});
```

to

```jsx
const AwesomeType = new GraphQLObjectType({
  name: 'Awesome',
});

export default AwesomeType;
```
    
## Usage

find packages/main/src/modules -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/namedGraphQLObjectType/NamedGraphQLObjectType.ts
