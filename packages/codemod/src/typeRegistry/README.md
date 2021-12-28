# TypeRegistry

Add this to a GraphQLObjectType 

```jsx
import { registerTypeLoader } from '@repo/modules';
import * as EngagementLoader from './EngagmentLoader';

registerTypeLoader(EngagementType, EngagementLoader.load);
```
    
## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/typeRegistry/TypeRegistry.ts
