# Named Import codemod

Transforms this:

```jsx
import {
  clearDbAndRestartCounters, 
} from '../../../../../test/helper';
```
    
 to
 
 ```jsx
import {
  clearDbAndRestartCounters, 
} from '@repo/test'; 
```

## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/namedImport/NamedImport.ts

## Passing a custom config

import.config.js
```jsx
module.exports = {
  importMapper: [
    'clearDbAndRestartCounters',
    'connectMongoose',
  ],
  newImportName: '@repo/test',
  fromSource: 'packages/main/src/models/index.ts',
}
```

```bash
find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/namedImport/NamedImport.ts --config import.config.js
```
