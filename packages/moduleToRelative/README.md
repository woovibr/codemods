# ModuleToRelative

transform this 

```jsx
import {
  IUser,
  ICompany,
  getLanguage,
  getMissingInterpolationHandler,
} from '@repo/modules';
```

to

```jsx
import { IUser } from '../user/user/UserModel';
import { getLanguage } from './getLanguage';
import { getMissingInterpolationHandler } from './getMissingInterpolationHandler';
import { ICompany } from '../company/CompanyModel';
```

### Config
```
module.exports = {
    packageName: '@repo/modules',
    indexPath: 'packages/modules/src/index.ts',     
};
```   
    
## Usage

find packages/modules/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/moduleToRelative/ModuleToRelative.ts --config relative.codemod.config.js
