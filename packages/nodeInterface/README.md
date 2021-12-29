# NodeInterface

transform 

```jsx
import { NodeInterface } from '../../interface/NodeInterface';
const AdminUserType = new GraphQLObjectType({
  name: 'AdminUser',
  description: 'Represents AdminUser',
  fields: () => ({
  
  }),
  interfaces: () => [NodeInterface],
});
```

to

```jsx
import { nodeInterface } from '@repo/modules';
const AdminUserType = new GraphQLObjectType({
  name: 'AdminUser',
  description: 'Represents AdminUser',
  fields: () => ({
  
  }),
  interfaces: () => [nodeInterface],
});
```
    
## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/nodeInterface/NodeInterface.ts
