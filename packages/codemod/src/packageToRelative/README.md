# PackageToRelative

transform this 

```jsx
import {
  createGoal
} from '@repo/modules';
```

to

```jsx
import {
  createGoal,
} from '../../../../../../../test/helper';
```

### Config
```
module.exports = {
    packageName: '@repo/modules',
    indexPath: 'packages/main/test/createResource/createGoal.ts',     
};
```   
    
## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/packageToRelative/PackageToRelative.ts --config rollback.codemod.config.js
